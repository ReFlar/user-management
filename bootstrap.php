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

namespace Reflar\UserManagement;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Foundation\Application;

return function (Dispatcher $events, Application $app) {
    $events->subscribe(Listeners\RegistrationMailer::class);
    $events->subscribe(Listeners\AddApiAttributes::class);
    $events->subscribe(Listeners\AddClientAssets::class);
  
    $app->register(Providers\StorageServiceProvider::class);
  
};