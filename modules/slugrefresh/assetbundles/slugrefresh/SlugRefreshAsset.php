<?php

namespace modules\slugrefresh\assetbundles\slugrefresh;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * SlugRefresh Asset Bundle
 */
class SlugRefreshAsset extends AssetBundle
{
    public function init()
    {
        $this->sourcePath = '@modules/slugrefresh/assetbundles/slugrefresh/dist';

        $this->depends = [
            CpAsset::class,
        ];

        $this->js = [
            'slugrefresh.js',
        ];

        $this->css = [
            'slugrefresh.css',
        ];

        parent::init();
    }
}
