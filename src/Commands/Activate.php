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

use Flarum\Core\User;

class Activate
{  
    /**
     * @var string
     */
    public $username;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param string $username
     * @param User   $actor
     */
    public function __construct($username, User $actor)
    {
        $this->username  = $username;
        $this->actor     = $actor;
    }
}