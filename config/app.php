<?php

use craft\helpers\App;
use modules\slugrefresh\SlugRefresh;
use modules\languageredirect\LanguageRedirect;
use modules\linkresolver\LinkResolver;

return [
    'id' => App::env('CRAFT_APP_ID') ?: 'CraftCMS',
    'modules' => [
        'slugrefresh' => SlugRefresh::class,
        'languageredirect' => LanguageRedirect::class,
        'linkresolver' => LinkResolver::class,
    ],
    'bootstrap' => ['slugrefresh', 'languageredirect', 'linkresolver'],
];
