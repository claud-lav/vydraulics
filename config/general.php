<?php

/**
 * General Configuration
 *
 * @see \craft\config\GeneralConfig
 */

use craft\config\GeneralConfig;
use craft\helpers\App;

return GeneralConfig::create()
    ->devMode(App::env('CRAFT_DEV_MODE') ?? false)
    ->defaultWeekStartDay(1)
    ->omitScriptNameInUrls()
    ->preloadSingles()
    ->preventUserEnumeration()
    ->maxUploadFileSize(262144000)
    ->aliases([
        '@webroot' => App::env('CRAFT_WEB_ROOT') ?: dirname(__DIR__) . '/web',
        '@storage' => App::env('STORAGE_PATH') ?: dirname(__DIR__) . '/storage',
    ])
    ->maxRevisions(10)
    ->ipHeaders(['X-Forwarded-For', 'X-Real-IP', 'CF-Connecting-IP'])
    // Enable template caching for better performance
    ->enableTemplateCaching(true)
    // Cache duration: 0 = indefinite (until content changes invalidate it)
    ->cacheDuration(0)
;
