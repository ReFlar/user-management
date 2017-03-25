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

namespace Reflar\UserManagement\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StrikeSerializer extends AbstractSerializer
{

    protected $type = 'strikes';

    protected function getDefaultAttributes($strikes)
    {
        return [
            'post_id' => (int) $strikes->post_id,
            'reason'  => $strikes->reason
        ];
    }
}