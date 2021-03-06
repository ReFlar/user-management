<?php

/*
 * This file is based on Flarum\Core\Command\RegisterUserHandler.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Exception;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\AuthToken;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Core\User;
use Flarum\Event\UserWillBeSaved;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Contracts\Validation\ValidationException;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemInterface;
use League\Flysystem\MountManager;
use Reflar\UserManagement\Validators\UserValidator;

class RegisterUserHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var UserValidator
     */
    protected $validator;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var FilesystemInterface
     */
    protected $uploadDir;

    /**
     * @var Factory
     */
    private $validatorFactory;

    /**
     * @param Dispatcher                  $events
     * @param SettingsRepositoryInterface $settings
     * @param UserValidator               $validator
     * @param Application                 $app
     * @param FilesystemInterface         $uploadDir
     * @param Factory                     $validatorFactory
     */
    public function __construct(Dispatcher $events, SettingsRepositoryInterface $settings, UserValidator $validator, Application $app, FilesystemInterface $uploadDir, Factory $validatorFactory)
    {
        $this->events = $events;
        $this->settings = $settings;
        $this->validator = $validator;
        $this->app = $app;
        $this->uploadDir = $uploadDir;
        $this->validatorFactory = $validatorFactory;
    }

    /**
     * @param RegisterUser $command
     *
     * @throws PermissionDeniedException                                if signup is closed and the actor is
     *                                                                  not an administrator.
     * @throws \Flarum\Core\Exception\InvalidConfirmationTokenException if an
     *                                                                  email confirmation token is provided but is invalid.
     *
     * @return User
     */
    public function handle(RegisterUser $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        if (!$this->settings->get('allow_sign_up')) {
            $this->assertAdmin($actor);
        }

        $username = array_get($data, 'attributes.username');
        $email = array_get($data, 'attributes.email');
        $password = array_get($data, 'attributes.password');
        $age = array_get($data, 'attributes.age');
        $gender = ucfirst(strtolower(array_get($data, 'attributes.gender')));

        if ($this->settings->get('Reflar-emailRegEnabled') == true) {
            $email = $username.'@'.$username.'.com';
        }
        // If a valid authentication token was provided as an attribute,
        // then we won't require the user to choose a password.
        if (isset($data['attributes']['token'])) {
            $token = AuthToken::validOrFail($data['attributes']['token']);

            $password = $password ?: str_random(20);
        }

        if ($this->settings->get('Reflar-sfs') == true) {
            if (isset($command->ip) && $this->isValidIpAddress($command->ip)) {
                $ipAddress = $command->ip;
            }

            $client = new Guzzle([
                'query' => ['ip' => $ipAddress, 'email' => $email],
            ]);
            $response = $client->request('GET', 'http://api.stopforumspam.org/api');
            $body = $response->getBody()->getContents();

            if (strpos($body, 'yes') !== false) {
                die('Access Denied');
            }
        }

        $user = User::register($username, $email, $password);
        $user->age = $age;
        $user->gender = $gender;

        // If a valid authentication token was provided, then we will assign
        // the attributes associated with it to the user's account. If this
        // includes an email address, then we will activate the user's account
        // from the get-go.
        if (isset($token)) {
            foreach ($token->payload as $k => $v) {
                if (in_array($user->$k, ['', null], true)) {
                    $user->$k = $v;
                }
            }
            if (isset($token->payload['email'])) {
                $user->activate();
            }
        }

        if ($this->settings->get('Reflar-emailRegEnabled') == true) {
            $user->activate();
        }

        if ($actor->isAdmin() && array_get($data, 'attributes.isActivated')) {
            $user->activate();
        }

        $this->events->fire(
            new UserWillBeSaved($user, $actor, $data)
        );
        $this->validator->assertValid(array_merge($user->getAttributes(), compact('password')));

        if ($avatarUrl = array_get($data, 'attributes.avatarUrl')) {
            $validation = $this->validatorFactory->make(compact('avatarUrl'), ['avatarUrl' => 'url']);

            if ($validation->fails()) {
                throw new ValidationException($validation);
            }

            try {
                $this->saveAvatarFromUrl($user, $avatarUrl);
            } catch (Exception $e) {
                //
            }
        }
        $user->save();

        if (isset($token)) {
            $token->delete();
        }

        $this->dispatchEventsFor($user, $actor);

        return $user;
    }

    private function saveAvatarFromUrl(User $user, $url)
    {
        $tmpFile = tempnam($this->app->storagePath().'/tmp', 'avatar');

        $manager = new ImageManager();
        $manager->make($url)->fit(100, 100)->save($tmpFile);

        $mount = new MountManager([
            'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
            'target' => $this->uploadDir,
        ]);

        $uploadName = Str::lower(Str::quickRandom()).'.jpg';

        $user->changeAvatarPath($uploadName);

        $mount->move('source://'.pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");
    }

    /**
     * Check that a given string is a valid IP address.
     *
     * @param string $ip
     *
     * @return bool
     */
    protected function isValidIpAddress($ip)
    {
        $flags = FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6;
        if (filter_var($ip, FILTER_VALIDATE_IP, $flags) === false) {
            return false;
        }

        return true;
    }
}
