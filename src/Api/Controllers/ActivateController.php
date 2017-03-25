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

namespace Reflar\UserManagement\Api\Controllers;

use Reflar\UserManagement\Api\Serializers\ActivateSerializer;
use Reflar\UserManagement\Commands\Activate;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Zend\Diactoros\UploadedFile;

class ActivateController extends AbstractResourceController
{
    public $serializer = ActivateSerializer::class;
    protected $bus;
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }
  
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $username = array_get($request->getParsedBody(), 'username');
        $actor = $request->getAttribute('actor');
        return $this->bus->dispatch(
            new Activate($username, $actor)
        );
    }
}