<?php 

namespace Reflar\UserManagement;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\RegistrationMailer::class);
    $events->subscribe(Listeners\AddApiAttributes::class);
    $events->subscribe(Listeners\AddClientAssets::class);
  
};