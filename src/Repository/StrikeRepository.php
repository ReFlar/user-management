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

namespace Reflar\UserManagement\Repository;

use DateTime;
use Flarum\Core\Post;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Reflar\UserManagement\Strike;

class StrikeRepository
{
    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param UserRepository              $users
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(UserRepository $users, SettingsRepositoryInterface $settings)
    {
        $this->users = $users;
        $this->settings = $settings;
    }

    public function query()
    {
        return Strike::query();
    }

    public function findStrikesById($userId)
    {
        $strikes = Strike::where('user_id', $userId)->get();
        $actor = $this->users->findOrFail($userId);
        foreach ($strikes as $strike) {
            $strike['actor_id'] = $actor->username;
            $date = new DateTime($strike['time']);
            $strike['time'] = $date->format(DateTime::RFC3339);
        }

        return $strikes;
    }

    public function findOrFail($id)
    {
        return Strike::where('id', $id)->firstOrFail();
    }

    public function serveStrike(Post $post, User $user, $actorId, $reason)
    {
        $strike = new Strike();
        $strike->user_id = $user->id;
        $strike->post = $post->discussion_id.'/'.$post->number;
        $strike->actor_id = $actorId;
        $strike->post_content = $post->content;
        $strike->reason = $reason;
        $strike->time = new DateTime();

        $strike->save();

        $user->strikes = ++$user->strikes;

        $user->save();

        return $strike;
    }

    public function deleteStrike($id, User $actor)
    {
        $strike = $this->findOrFail($id);
        $user = $this->users->findOrFail($strike->user_id, $actor);
        $user->strikes = --$user->strikes;
        $user->save();
        $strike->delete();

        return true;
    }
}
