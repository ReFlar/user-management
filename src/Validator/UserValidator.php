<?php
/*
 * This file is part of Flarum/Validator/UserValidator.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Reflar\UserManagement\Validator;

use Flarum\Core\User;

class UserValidator extends AbstractValidator
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    /**
     * @var User
     */
    protected $user;
    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }
    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }
    /**
     * {@inheritdoc}
     */
    protected function getRules(SettingsRepositoryInterface $settings))
    {
        $idSuffix = $this->user ? ','.$this->user->id : '';
        if ($settings->get('email_enabled') == 1)
        {
          return [
              'username' => [
                  'required',
                  'regex:/^[a-z0-9_-]+$/i',
                  'unique:users,username'.$idSuffix,
                  'min:3',
                  'max:30'
              ],
              'password' => [
                  'required',
                  'min:8'
              ]
          ];
      
       } else {
          return [
              'username' => [
                  'required',
                  'regex:/^[a-z0-9_-]+$/i',
                  'unique:users,username'.$idSuffix,
                  'min:3',
                  'max:30'
              ],
              'email' => [
                  'required',
                  'email',
                  'unique:users,email'.$idSuffix
              ],
              'password' => [
                  'required',
                  'min:8'
              ]
          ];
       }
    }
    /**
     * {@inheritdoc}
     */
    protected function getMessages()
    {
        return [
            'username.regex' => $this->translator->trans('core.api.invalid_username_message')
        ];
    }
}