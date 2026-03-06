<?php

use craft\helpers\App;

return [
    'imagerSystemPath' => App::env('IMAGER_SYSTEM_PATH') ?: '@webroot/imager',
    'imagerUrl' => App::env('IMAGER_URL') ?: '@web/imager',
];