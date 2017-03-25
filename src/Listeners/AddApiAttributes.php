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

namespace Reflar\UserManagement\Listeners;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\UserManagement\Api\Controllers\RegisterController;
use Reflar\UserManagement\Api\Controllers\StrikeController;

class AddApiAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }
     /**
      * @param Dispatcher $events
      */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'addAttributes']);
    }
    
    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/reflar/UserManagement/register', 'reflar.registration.register', RegisterController::class);
        $event->post('/reflar/UserManagement/strike', 'reflar.registration.strike', StrikeController::class); 
    }

     /**
      * @param PrepareApiAttributes $event
      */
     public function addAttributes(PrepareApiAttributes $event) 
     {  
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['ReFlar-emailRegEnabled'] = $this->settings->get('ReFlar-emailRegEnabled');
            $event->attributes['ReFlar-amountPerPage'] = $this->settings->get('ReFlar-amountPerPage');
        }
        if ($event->isSerializer(UserSerializer::class)) {
            $canActivate = $event->actor->can('activate', $event->model);
            $event->attributes['is_activated'] = $event->model->is_activated;
            $event->attributes['canActivate'] = $canActivate;
        }
     }
  
}