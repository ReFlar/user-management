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

use Reflar\UserManagement\Api\Serializers\StrikeSerializer;
use Reflar\UserManagement\Commands\ServeStrike;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Zend\Diactoros\UploadedFile;

class ServeStrikeController extends AbstractResourceController
{
    public $serializer = StrikeSerializer::class;
    protected $bus;
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }
 
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $post_id = array_get($request->getParsedBody(), 'post_id');
        $reason = array_get($request->getParsedBody(), 'reason');
        $actor = $request->getAttribute('actor');
        return $this->bus->dispatch(
            new Strike($post_id, $reason, $actor)
        );
    }
}