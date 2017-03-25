<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Reflar\UserManagement\Events\UserGivenStrike;
use Reflar\UserManagement\Events\UserWillBeGivenStrike;
use Davis\Split\Validators\SplitDiscussionValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Command\DeletePost;
use Flarum\Core\Discussion;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\UserManagement\Repository\StrikeRepository;

class StrikeHandler
{

    use DispatchEventsTrait;
    use AssertPermissionTrait;

    protected $users;
    protected $posts;
    protected $settings;
    protected $validator;
    protected $deletepost
    protected $strikes;

    /**
     * @param Dispatcher                  $events
     * @param UserRepository              $users
     * @param PostRepository              $posts
     * @param SettingsRepositoryInterface $settings
     * @param StrikeValidator             $validator
     * @param DeletePost                  $deletepost
     * @param StrikeRepository            $strikes
     */
    public function __construct(
        Dispatcher $events,
        UserRepository $users,
        PostRepository $posts,
        SettingsRepositoryInterface $settings,
        SplitDiscussionValidator $validator
        DeletePost $deletepost,
        StrikeRepository $strikes
    ) {
        $this->events     = $events;
        $this->users      = $users;
        $this->posts      = $posts;
        $this->settings   = $settings;
        $this->validator  = $validator;
        $this->deletepost = $deletepost;
        $this->strikes    = $strikes;
    }

    /**
     * @param strike $command
     * @return \Flarum\Core\Discussion
     */
    public function handle(SplitDiscussion $command)
    {
        $this->assertCan($command->actor, 'user.strike');

        $this->validator->assertValid([
            'post_id' => $command->post_id
        ]);
      
        $post = $this->posts->findOrFail($command->post_id, $command->actor);
      
        $user = $this->users->findOrFail($post->user_id, $command->actor)
      
        $this->events->fire(
            new UserWillBeGivenStrike($post, $user, $command->actor, $command->reason)
        );

        $strike = $this->strikes->serveStrike($command->post_id, $user, $command->actor->id, $command->reason);
      
        if ($post->number == 1)
        {
          $post->discussion->delete();
        }
        $post->delete();
      
        $this->events->fire(
            new UserGivenStrike($post, $user, $command->actor, $command->reason)
        );

        return $strike;
    }
}