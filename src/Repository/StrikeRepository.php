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
use Flarum\Core\User;
use Reflar\UserManagement\Strikes;
use Illuminate\Database\Eloquent\Builder;

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
        return Strikes::query();
    }
  
    public function findOrFailCollection($userId)
    {
        return Strikes::where('user_id', $userId)->get();
    }
  
    public function findOrFail($id)
    {
        return Strikes::where('id', $id)->firstOrFail();
    }
  
    public function serveStrike($postId, User $user, $actorId, $reason) 
    {
        $strike = new Strikes;
        $strike->user_id = $user->id;
        $strike->post_id = $postId
        $strike->actor_id = $actorId;
        $strike->reason = $reason;
        $strike->timestamp = time();

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