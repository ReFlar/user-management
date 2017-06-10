<?php
/*
 * This file is based on Flarum\Api\Controller\CreateUserController.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Api\Controllers;

use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\UserManagement\Commands\RegisterUser;
use Tobscure\JsonApi\Document;

class CreateUserController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Flarum\Api\Serializer\CurrentUserSerializer';
    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $serverParams = $request->getServerParams();

        if(isset($serverParams['HTTP_CF_CONNECTING_IP'])) {
            $ipAddress = $serverParams['HTTP_CF_CONNECTING_IP'];
        } else {
            $ipAddress = $serverParams['REMOTE_ADDR'];
        }

        return $this->bus->dispatch(
            new RegisterUser($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data', []), $ipAddress)
        );
    }
}
