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

use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Post;
use Flarum\Core\User;
use Reflar\UserManagement\Strike;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class StrikeRepository
{
    
    protected $users;
  
    /**
     * @param UserRepository $users
     */
    public function __construct(UserRepository $users)
    {
      $this->users = $users;
    }
  
    public function query()
    {
        return Strike::query();
    }
  
    public function findStrikesById($userId)
    {
        $strikes = Strike::where('user_id', $userId)->get();
        $actor = $this->users->findOrFail($userId);
        foreach ($strikes as $strike)
        {
            $strike['actor_id'] = $actor->username;
        }
        return $strikes;
    }
  
    public function findOrFail($id)
    {
        return Strikes::where('id', $id)->firstOrFail();
    }
  
    public function serveStrike(Post $post, User $user, $actorId, $reason) 
    {
        $postId = $post->id;
        $content = $post->content;
      
        $strike = new Strike;
        $strike->user_id = $user->id;
        $strike->post_id = $postId;
        $strike->actor_id = $actorId;
        $strike->post_content = $content;
        $strike->reason = $reason;
        $strike->time = date( 'Y-m-d H:i:s');

        $strike->save();
      
        $user->strikes = ++$user->strikes;
      
        $user->save();

        return $strike;
    }
    
    public function deleteStrike($strikeId, $userId, $actor)
    {
        $strike = $this->findOrFail($id);
        $user = $this->users->findOrFail($userId, $actor);
        $user->strikes = $user->strikes--;
        $user-save();
        $srike->delete();
    }
}