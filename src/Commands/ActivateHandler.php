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
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;

class ActivateHandler
{ 
   use AssertPermissionTrait;
  
    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @param UserRepository $users
     */
    public function __construct(UserRepository $users)
    {
        $this->users = $users;
    }

    public function handle(Activate $command)
    {
        $this->assertCan($command->actor, 'user.activate');
        $user = $this->users->findByIdentification($command->username, $command->actor);
        $user->activate();
        $user->save();
        return true;
    }
}