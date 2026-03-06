<?php

namespace modules\slugrefresh;

use Craft;
use yii\base\Module as BaseModule;
use yii\base\Event;
use craft\web\View;
use modules\slugrefresh\assetbundles\slugrefresh\SlugRefreshAsset;

/**
 * SlugRefresh module
 *
 * Adds refresh buttons next to slug fields in the Craft CP
 * to regenerate slugs from the title without manually editing.
 *
 * @method static SlugRefresh getInstance()
 */
class SlugRefresh extends BaseModule
{
    public function init(): void
    {
        Craft::setAlias('@modules/slugrefresh', __DIR__);

        $this->controllerNamespace = 'modules\\slugrefresh\\controllers';

        parent::init();

        $this->attachEventHandlers();
    }

    private function attachEventHandlers(): void
    {
        // Register CP routes for the module
        Event::on(
            \craft\web\UrlManager::class,
            \craft\web\UrlManager::EVENT_REGISTER_CP_URL_RULES,
            function (\craft\events\RegisterUrlRulesEvent $event) {
                $event->rules['slugrefresh/regenerate'] = 'slugrefresh/slug/regenerate';
                $event->rules['slugrefresh/bulk-regenerate'] = 'slugrefresh/slug/bulk-regenerate';
            }
        );

        // Register asset bundle for CP requests
        if (Craft::$app->getRequest()->getIsCpRequest()) {
            Event::on(
                View::class,
                View::EVENT_BEFORE_RENDER_TEMPLATE,
                function () {
                    Craft::$app->getView()->registerAssetBundle(SlugRefreshAsset::class);
                }
            );
        }

        // Register bulk element action for entries
        Event::on(
            \craft\elements\Entry::class,
            \craft\base\Element::EVENT_REGISTER_ACTIONS,
            function (\craft\events\RegisterElementActionsEvent $event) {
                $event->actions[] = \modules\slugrefresh\elementactions\RegenerateSlug::class;
            }
        );
    }
}
