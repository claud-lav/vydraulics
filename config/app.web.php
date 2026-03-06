<?php

use craft\helpers\App;

return [
    'components' => App::env('REDIS_IP') ? [
        'redis' => [
            'class' => yii\redis\Connection::class,
            'hostname' => App::env('REDIS_IP'),
            'port' => App::env('REDIS_PORT'),
            'password' => App::env('REDIS_PASS'),
            'database' => 0,
        ],
        'cache' => function () {
            return Craft::createObject([
                // Uncomment the line below when yii2-redis is installed via Composer
                // 'class' => yii\redis\Cache::class,
                'redis' => 'redis',
            ]);
        },
    ] : [],
];
