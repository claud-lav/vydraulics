<?php

namespace modules\linkresolver;

use Craft;
use yii\base\Module as BaseModule;
use yii\base\Event;
use craft\elements\Entry;
use craft\events\DefineUrlEvent;
use craft\events\SetElementRouteEvent;
use craft\web\Application;
use nystudio107\seomatic\events\ModifySitemapQueryEvent;
use nystudio107\seomatic\helpers\Sitemap;

class LinkResolver extends BaseModule
{
    private const REDIRECT_TYPES = ['external'];

    public function init(): void
    {
        Craft::setAlias('@modules/linkresolver', __DIR__);

        parent::init();

        // Override entry.url for external/anchor types
        Event::on(
            Entry::class,
            Entry::EVENT_DEFINE_URL,
            function (DefineUrlEvent $event) {
                /** @var Entry $entry */
                $entry = $event->sender;

                if (!$entry->type) {
                    return;
                }

                $targetUrl = $this->resolveTargetUrl($entry);
                if ($targetUrl) {
                    $event->url = $targetUrl;
                }
            }
        );

        // Redirect direct visits to external/anchor entries
        if (Craft::$app instanceof Application) {
            Event::on(
                Entry::class,
                Entry::EVENT_SET_ROUTE,
                function (SetElementRouteEvent $event) {
                    /** @var Entry $entry */
                    $entry = $event->sender;

                    $request = Craft::$app->getRequest();
                    if ($request->getIsCpRequest() || $request->getIsPreview() || $request->getIsLivePreview()) {
                        return;
                    }

                    if (!$entry->type) {
                        return;
                    }

                    $targetUrl = $this->resolveTargetUrl($entry);
                    if ($targetUrl) {
                        Craft::$app->getResponse()->redirect($targetUrl, 301)->send();
                        Craft::$app->end();
                    }
                }
            );
        }

        // Exclude external/anchor types from SEOmatic sitemaps
        if (class_exists(Sitemap::class)) {
            Event::on(
                Sitemap::class,
                Sitemap::EVENT_MODIFY_SITEMAP_QUERY,
                function (ModifySitemapQueryEvent $event) {
                    $event->query->type(['not', ...self::REDIRECT_TYPES]);
                }
            );
        }
    }

    private function resolveTargetUrl(Entry $entry): ?string
    {
        $typeHandle = $entry->type->handle;

        if ($typeHandle === 'external') {
            $linkValue = $entry->externalUrl ?? null;
            if ($linkValue && $linkValue->getUrl()) {
                return $linkValue->getUrl();
            }
        }

        return null;
    }
}
