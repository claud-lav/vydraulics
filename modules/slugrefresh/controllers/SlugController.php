<?php

namespace modules\slugrefresh\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Entry;
use craft\helpers\ElementHelper;
use yii\web\Response;

/**
 * Slug Controller
 *
 * Handles slug regeneration requests
 */
class SlugController extends Controller
{
    /**
     * Regenerate slug for an element
     *
     * @return Response
     */
    public function actionRegenerate(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $request = Craft::$app->getRequest();

        // Check if title is provided directly (from edit form)
        $title = $request->getBodyParam('title');
        $siteId = $request->getBodyParam('siteId');

        if ($title) {
            // Generate slug from provided title (for unsaved entries in edit form)
            try {
                $title = trim($title);

                if (empty($title)) {
                    return $this->asJson([
                        'success' => false,
                        'error' => 'Title is empty'
                    ]);
                }

                // Get the site language for proper slug generation
                $language = null;
                if ($siteId) {
                    $site = Craft::$app->getSites()->getSiteById($siteId);
                    if ($site) {
                        $language = $site->language;
                    }
                }

                // Generate slug from title using Craft's helper
                $slug = ElementHelper::generateSlug($title, null, $language);

                return $this->asJson([
                    'success' => true,
                    'slug' => $slug
                ]);
            } catch (\Exception $e) {
                return $this->asJson([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Otherwise, get element by ID (for index page refresh)
        $elementId = $request->getBodyParam('elementId');

        if (!$elementId) {
            return $this->asJson([
                'success' => false,
                'error' => 'Either title or elementId must be provided'
            ]);
        }

        // Get the site ID - prefer the one passed from the frontend (element index site)
        // Fall back to the CP session's current site if not provided
        $targetSiteId = $siteId ?? Craft::$app->getSites()->getCurrentSite()->id;

        // Load element for the target site, not the primary site
        $element = Craft::$app->getElements()->getElementById($elementId, null, $targetSiteId);

        if (!$element) {
            return $this->asJson([
                'success' => false,
                'error' => 'Element not found'
            ]);
        }

        // Check if user has permission to save this element
        if (!Craft::$app->getElements()->canSave($element)) {
            return $this->asJson([
                'success' => false,
                'error' => 'Not authorized to save this element'
            ]);
        }

        try {
            // Get the current title
            $title = $element->title ?? '';

            if (empty($title)) {
                return $this->asJson([
                    'success' => false,
                    'error' => 'Element has no title to generate slug from'
                ]);
            }

            // Get the site language for proper slug generation
            $site = $element->getSite();
            $language = $site->language ?? null;

            // Generate slug from title using Craft's helper
            $element->slug = ElementHelper::generateSlug($title, null, $language);

            // Save the element - set scenario to SCENARIO_ESSENTIALS to skip custom field validation
            $element->setScenario(\craft\base\Element::SCENARIO_ESSENTIALS);
            $success = Craft::$app->getElements()->saveElement($element, false, false);

            if ($success) {
                return $this->asJson([
                    'success' => true,
                    'slug' => $element->slug
                ]);
            } else {
                return $this->asJson([
                    'success' => false,
                    'error' => 'Failed to save element',
                    'errors' => $element->getErrors()
                ]);
            }
        } catch (\Exception $e) {
            return $this->asJson([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Regenerate slugs for multiple elements
     *
     * @return Response
     */
    public function actionBulkRegenerate(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $request = Craft::$app->getRequest();
        $elementIds = $request->getRequiredBodyParam('elementIds');
        $siteId = $request->getBodyParam('siteId');

        if (!is_array($elementIds) || empty($elementIds)) {
            return $this->asJson([
                'success' => false,
                'error' => 'No elements selected'
            ]);
        }

        $successCount = 0;
        $failedCount = 0;
        $errors = [];

        // Get the site ID - prefer the one passed from the frontend (element index site)
        // Fall back to the CP session's current site if not provided
        $targetSiteId = $siteId ?? Craft::$app->getSites()->getCurrentSite()->id;
        $targetSite = Craft::$app->getSites()->getSiteById($targetSiteId);

        // Log for debugging
        Craft::info("Bulk regenerate: Processing site '{$targetSite->handle}' (ID: {$targetSiteId})", __METHOD__);

        foreach ($elementIds as $elementId) {
            // Load element for the target site, not the primary site
            $element = Craft::$app->getElements()->getElementById($elementId, null, $targetSiteId);

            // Log the element details for debugging
            if ($element) {
                Craft::info("Element {$elementId}: title='{$element->title}', slug='{$element->slug}', siteId={$element->siteId}", __METHOD__);
            }

            if (!$element) {
                $failedCount++;
                $errors[] = "Element ID {$elementId} not found";
                continue;
            }

            // Check if user has permission to save this element
            if (!Craft::$app->getElements()->canSave($element)) {
                $failedCount++;
                $errors[] = "Not authorized to save element ID {$elementId}";
                continue;
            }

            try {
                // Get the current title
                $title = $element->title ?? '';

                if (empty($title)) {
                    $failedCount++;
                    $errors[] = "Element ID {$elementId} has no title";
                    continue;
                }

                // Get the site language for proper slug generation
                $site = $element->getSite();
                $language = $site->language ?? null;

                // Generate slug from title using Craft's helper
                $element->slug = ElementHelper::generateSlug($title, null, $language);

                // Save the element - set scenario to SCENARIO_ESSENTIALS to skip custom field validation
                $element->setScenario(\craft\base\Element::SCENARIO_ESSENTIALS);
                $success = Craft::$app->getElements()->saveElement($element, false, false);

                if ($success) {
                    $successCount++;
                } else {
                    $failedCount++;
                    // Get detailed validation errors
                    $validationErrors = $element->getErrors();
                    if (!empty($validationErrors)) {
                        $errorDetails = [];
                        foreach ($validationErrors as $attribute => $attributeErrors) {
                            foreach ($attributeErrors as $error) {
                                $errorDetails[] = "{$attribute}: {$error}";
                            }
                        }
                        $errors[] = "Element ID {$elementId}: " . implode(', ', $errorDetails);
                    } else {
                        $errors[] = "Failed to save element ID {$elementId} (no validation errors reported)";
                    }
                }
            } catch (\Exception $e) {
                $failedCount++;
                $errors[] = "Error on element ID {$elementId}: " . $e->getMessage();
            }
        }

        return $this->asJson([
            'success' => $failedCount === 0,
            'successCount' => $successCount,
            'failedCount' => $failedCount,
            'errors' => $errors,
            'message' => "Regenerated {$successCount} slug(s)" . ($failedCount > 0 ? ", {$failedCount} failed" : '')
        ]);
    }
}
