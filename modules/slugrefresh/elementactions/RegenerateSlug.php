<?php

namespace modules\slugrefresh\elementactions;

use Craft;
use craft\base\ElementAction;
use craft\elements\db\ElementQueryInterface;

/**
 * Regenerate Slug element action
 */
class RegenerateSlug extends ElementAction
{
    /**
     * @inheritdoc
     */
    public function getTriggerLabel(): string
    {
        return Craft::t('site', 'Regenerate slugs');
    }

    /**
     * @inheritdoc
     */
    public function getTriggerHtml(): ?string
    {
        Craft::$app->getView()->registerJsWithVars(fn($type) => <<<JS
(() => {
    new Craft.ElementActionTrigger({
        type: $type,
        batch: true,
        activate: function(\$selectedItems) {
            Craft.elementIndex.setIndexBusy();

            const elementIds = [];
            \$selectedItems.each(function() {
                elementIds.push($(this).data('id'));
            });

            // Get the current site ID from the element index
            const siteId = Craft.elementIndex && Craft.elementIndex.siteId ? Craft.elementIndex.siteId : null;

            Craft.sendActionRequest('POST', 'slugrefresh/slug/bulk-regenerate', {
                data: {
                    elementIds: elementIds,
                    siteId: siteId
                }
            })
            .then(function(response) {
                Craft.elementIndex.setIndexAvailable();

                if (response.data.success) {
                    Craft.cp.displayNotice(response.data.message);
                    Craft.elementIndex.updateElements();
                } else {
                    let errorMsg = response.data.message || 'Failed to regenerate slugs';
                    if (response.data.errors && response.data.errors.length > 0) {
                        errorMsg += ':\\n' + response.data.errors.join('\\n');
                    }
                    Craft.cp.displayError(errorMsg);
                    Craft.elementIndex.updateElements();
                }
            })
            .catch(function(error) {
                Craft.elementIndex.setIndexAvailable();
                Craft.cp.displayError('Failed to regenerate slugs');
                console.error('Slug regeneration error:', error);
            });
        }
    });
})();
JS, [static::class]);

        return null;
    }

    /**
     * @inheritdoc
     */
    public function performAction(ElementQueryInterface $query): bool
    {
        // We handle everything in JavaScript, so this method doesn't need to do anything
        return true;
    }
}
