<?php

namespace modules\languageredirect;

use Craft;
use yii\base\Module as BaseModule;
use yii\base\Event;
use craft\web\Application;
use craft\elements\Entry;

/**
 * LanguageRedirect module
 *
 * Detects browser language via Accept-Language header and redirects
 * to the matching Craft site. A cookie prevents repeated redirects
 * and respects manual language switches.
 *
 * @method static LanguageRedirect getInstance()
 */
class LanguageRedirect extends BaseModule
{
    public const COOKIE_NAME = 'language_preference';
    public const COOKIE_DURATION = 60 * 60 * 24 * 30; // 30 days

    public function init(): void
    {
        Craft::setAlias('@modules/languageredirect', __DIR__);

        parent::init();

        if (Craft::$app instanceof Application) {
            Event::on(
                Application::class,
                Application::EVENT_BEFORE_REQUEST,
                [$this, 'handleRedirect']
            );
        }
    }

    public function handleRedirect(): void
    {
        $request = Craft::$app->getRequest();

        // Skip: console requests
        if ($request->getIsConsoleRequest()) {
            return;
        }

        // Skip: CP requests
        if ($request->getIsCpRequest()) {
            return;
        }

        // Skip: action requests
        if ($request->getIsActionRequest()) {
            return;
        }

        // Skip: AJAX / JSON requests
        if ($request->getIsAjax() || $request->getAcceptableContentTypes() === ['application/json']) {
            return;
        }

        // Skip: POST requests
        if ($request->getIsPost()) {
            return;
        }

        // Skip: static assets
        $path = $request->getPathInfo();
        if (preg_match('/\.(css|js|jpg|jpeg|png|gif|svg|webp|ico|woff2?|ttf|eot|map|json)$/i', $path)) {
            return;
        }

        // Skip: bot/crawler user agents
        $userAgent = $request->getUserAgent() ?? '';
        if ($this->isBot($userAgent)) {
            return;
        }

        // Manual language switch: ?lp=manual query param signals a cross-domain
        // language switcher click — set the cookie and redirect to the clean URL.
        if ($request->getQueryParam('lp') === 'manual') {
            $this->setCookie('manual');
            $params = $request->getQueryParams();
            unset($params['lp']);
            $cleanUrl = $request->getPathInfo() ?: '/';
            if (!empty($params)) {
                $cleanUrl .= '?' . http_build_query($params);
            }
            Craft::$app->getResponse()->redirect($cleanUrl, 302)->send();
            Craft::$app->end();
        }

        // Skip: user explicitly chose a language via the switcher
        if (isset($_COOKIE[self::COOKIE_NAME]) && $_COOKIE[self::COOKIE_NAME] === 'manual') {
            return;
        }

        // Get browser's preferred languages
        $browserLanguages = $request->getAcceptableLanguages();
        if (empty($browserLanguages)) {
            return;
        }

        // Build site lookup
        $sites = Craft::$app->getSites()->getAllSites();
        $currentSite = Craft::$app->getSites()->getCurrentSite();

        // Map: exact language → site, base language → site (first match wins)
        $exactMap = [];
        $baseMap = [];
        foreach ($sites as $site) {
            $lang = strtolower($site->language);
            $base = strtolower(explode('-', $site->language)[0]);

            if (!isset($exactMap[$lang])) {
                $exactMap[$lang] = $site;
            }
            if (!isset($baseMap[$base])) {
                $baseMap[$base] = $site;
            }
        }

        // Find best matching site from browser preferences (priority order)
        $matchedSite = null;
        foreach ($browserLanguages as $browserLang) {
            $browserLangLower = strtolower($browserLang);
            $browserBase = strtolower(explode('-', $browserLang)[0]);

            // Exact match first
            if (isset($exactMap[$browserLangLower])) {
                $matchedSite = $exactMap[$browserLangLower];
                break;
            }

            // Base language fallback
            if (isset($baseMap[$browserBase])) {
                $matchedSite = $baseMap[$browserBase];
                break;
            }
        }

        // No match or already on the right site → stay
        if ($matchedSite === null || $matchedSite->id === $currentSite->id) {
            return;
        }

        // Try to find the current entry and its localized version on the target site.
        // Returns null if the localized page doesn't exist or is offline — stay on current page.
        $targetUrl = $this->resolveLocalizedUrl($path, $currentSite, $matchedSite);
        if ($targetUrl === null) {
            return;
        }
        Craft::$app->getResponse()->redirect($targetUrl, 302)->send();
        Craft::$app->end();
    }

    private function resolveLocalizedUrl(string $path, $currentSite, $targetSite): ?string
    {
        // Homepage — check if the target site's homepage is live
        if ($path === '' || $path === '/') {
            $homepage = Entry::find()
                ->uri('__home__')
                ->site($targetSite)
                ->one();

            if ($homepage) {
                return rtrim($targetSite->baseUrl, '/') . '/';
            }
            return null;
        }

        // Look up the entry on the current site by its URI
        $entry = Entry::find()
            ->uri($path)
            ->site($currentSite)
            ->status(null)
            ->one();

        if (!$entry) {
            // Not a known entry (could be a custom route) → don't redirect
            return null;
        }

        // Find the same entry's live version on the target site
        $localizedEntry = Entry::find()
            ->id($entry->id)
            ->site($targetSite)
            ->one();

        if ($localizedEntry && $localizedEntry->getUrl()) {
            return $localizedEntry->getUrl();
        }

        // Localized page doesn't exist or is offline → stay on current page
        return null;
    }

    private function setCookie(string $value = '1'): void
    {
        setcookie(self::COOKIE_NAME, $value, [
            'expires' => time() + self::COOKIE_DURATION,
            'path' => '/',
            'httpOnly' => false,
            'samesite' => 'Lax',
        ]);
    }

    private function isBot(string $userAgent): bool
    {
        $bots = [
            'bot', 'crawl', 'spider', 'slurp', 'mediapartners',
            'googlebot', 'bingbot', 'yandex', 'baidu', 'duckduck',
            'facebookexternalhit', 'linkedinbot', 'twitterbot',
            'applebot', 'semrush', 'ahref', 'mj12bot', 'dotbot',
            'petalbot', 'bytespider', 'gptbot', 'claudebot',
        ];

        $userAgentLower = strtolower($userAgent);
        foreach ($bots as $bot) {
            if (str_contains($userAgentLower, $bot)) {
                return true;
            }
        }

        return false;
    }
}
