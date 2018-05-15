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

use DirectoryIterator;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureWebApp;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'ConfigureWebApp']);
        $events->listen(ConfigureLocales::class, [$this, 'configLocales']);
    }

    public function ConfigureWebApp(ConfigureWebApp $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
              __DIR__.'/../../js/admin/dist/extension.js',
              __DIR__.'/../../less/admin/extension.less',
              ]);
            $event->addBootstrapper('Reflar/UserManagement/main');
        }
        if ($event->isForum()) {
            $event->addAssets([
                  __DIR__.'/../../js/forum/dist/extension.js',
                  __DIR__.'/../../less/forum/extension.less',
              ]);
            $event->addBootstrapper('Reflar/UserManagement/main');
        }
    }

    public function configLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'], false)) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}
