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

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Discussion;
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Core\User;
use Flarum\Core\Post\CommentPost;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\UserManagement\Events\UserGivenStrike;
use Reflar\UserManagement\Events\UserWillBeGivenStrike;
use Reflar\UserManagement\Validators\StrikeValidator;
use Reflar\UserManagement\Repository\StrikeRepository;

class ServeStrikeHandler
{

    use DispatchEventsTrait;
    use AssertPermissionTrait;

    protected $events;
    protected $users;
    protected $posts;
    protected $discussions;
    protected $settings;
    protected $validator;
    protected $strike;

    /**
     * @param Dispatcher                  $events
     * @param UserRepository              $users
     * @param PostRepository              $posts
     * @param DiscussionRepository        $discussions
     * @param SettingsRepositoryInterface $settings
     * @param StrikeValidator             $validator
     * @param StrikeRepository            $strike
     */
    public function __construct(
        Dispatcher $events,
        UserRepository $users,
        PostRepository $posts,
        DiscussionRepository $discussions,
        SettingsRepositoryInterface $settings,
        StrikeValidator $validator,
        StrikeRepository $strike
    ) {
        $this->events         = $events;
        $this->users          = $users;
        $this->posts          = $posts;
        $this->discussions    = $discussions;
        $this->settings       = $settings;
        $this->validator      = $validator;
        $this->strike         = $strike;
    }

    /**
     * @param ServeStrike $command
     * @return \Flarum\Core\Discussion
     */
    public function handle(ServeStrike $command)
    {
        $this->assertCan($command->actor, 'discussion.strike');

        $this->validator->assertValid([
            'post_id' => $command->post_id
        ]);
      
        $post = $this->posts->findOrFail($command->post_id, $command->actor);
      
        $user = $this->users->findOrFail($post->user_id, $command->actor);
      
        $content = $post->content;
      
        $this->events->fire(
            new UserWillBeGivenStrike($post, $user, $command->actor, $command->reason)
        );
        $strike = $this->strike->serveStrike($post, $user, $command->actor->id, $command->reason);
        
        if ($post instanceof CommentPost)
        {
            if ($post->number == 1)
            {
              $discussion = $this->discussions->findOrFail($post->discussion_id, $comamnd->actor);
              $discussion->hide_time = date( 'Y-m-d H:i:s');
              $discussion->save();
            }

            $post->hide();
            $post->save();
        }
        $this->events->fire(
            new UserGivenStrike($post, $user, $command->actor, $command->reason)
        );

        return $strike;
    }
}