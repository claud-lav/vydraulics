/**
 * SlugRefresh plugin for Craft CMS
 *
 * Adds refresh buttons next to slug fields to regenerate them from the title
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Add refresh buttons to all slug fields in edit pages
        addRefreshButtons();

        // Add refresh buttons to slug columns in index pages
        addIndexPageButtons();

        // Add toolbar button for regenerating all slugs in current view
        addToolbarButton();

        // Use MutationObserver to handle dynamically added content
        // (e.g., when using Live Preview, element editor slideouts, or index page updates)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    addRefreshButtons();
                    addIndexPageButtons();
                    addToolbarButton();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addRefreshButtons() {
        // Find all slug fields that don't already have a refresh button
        const slugFields = document.querySelectorAll('#slug-field:not(.has-slug-refresh), [id^="slug-"]:not(.has-slug-refresh)');

        slugFields.forEach(function(field) {
            // Mark as processed
            field.classList.add('has-slug-refresh');

            // Find the input container
            const inputContainer = field.querySelector('.input');
            if (!inputContainer) return;

            // Create refresh button
            const refreshBtn = document.createElement('button');
            refreshBtn.type = 'button';
            refreshBtn.className = 'slug-refresh-btn';
            refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M13.65 2.35A7.95 7.95 0 0 0 8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 1.76 4.24l1.42-1.42a4 4 0 1 0 0-5.66l-1.42-1.42A6 6 0 0 1 8 2a5.95 5.95 0 0 1 4.24 1.76L10 6h6V0l-2.35 2.35z"/></svg>';
            refreshBtn.title = 'Regenerate slug from title';
            refreshBtn.setAttribute('aria-label', 'Regenerate slug from title');

            // Add click handler
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleRefreshClick(refreshBtn, field);
            });

            // Insert button after the input
            const input = inputContainer.querySelector('input[type="text"]');
            if (input) {
                input.parentNode.insertBefore(refreshBtn, input.nextSibling);
            }
        });
    }

    function handleRefreshClick(button, field) {
        // Get the current title from the form (use current value, not saved value)
        const titleInput = document.querySelector('#title-field input[type="text"], input[name="title"]');
        if (!titleInput) {
            Craft.cp.displayError('Cannot find title field');
            return;
        }

        const currentTitle = titleInput.value.trim();
        if (!currentTitle) {
            Craft.cp.displayError('Title is empty');
            return;
        }

        // Get the site handle for language context
        const siteInput = document.querySelector('input[name="siteId"]');
        const siteId = siteInput ? siteInput.value : null;

        // Disable button and show loading state
        button.disabled = true;
        button.classList.add('loading');

        // Make AJAX request to regenerate slug
        Craft.sendActionRequest('POST', 'slugrefresh/slug/regenerate', {
            data: {
                title: currentTitle,
                siteId: siteId
            }
        })
        .then(function(response) {
            if (response.data.success) {
                // Update the slug field with the new slug
                const input = field.querySelector('input[type="text"]');
                if (input) {
                    input.value = response.data.slug;

                    // Trigger change event so Craft knows the field has been updated
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }

                Craft.cp.displayNotice('Slug regenerated successfully');
            } else {
                Craft.cp.displayError(response.data.error || 'Failed to regenerate slug');
            }
        })
        .catch(function(error) {
            console.error('Slug refresh error:', error);
            Craft.cp.displayError('Failed to regenerate slug');
        })
        .finally(function() {
            // Re-enable button and remove loading state
            button.disabled = false;
            button.classList.remove('loading');
        });
    }

    function addIndexPageButtons() {
        // Find all slug cells in element index tables that don't have a refresh button
        const slugCells = document.querySelectorAll('td[data-attr="slug"]:not(.has-slug-refresh)');

        slugCells.forEach(function(cell) {
            // Mark as processed
            cell.classList.add('has-slug-refresh');

            // Get the element ID from the row
            const row = cell.closest('tr');
            if (!row) return;

            const elementId = row.getAttribute('data-id');
            if (!elementId) return;

            // Create a container for the slug text and button
            const container = document.createElement('div');
            container.className = 'slug-index-container';

            // Move existing content to container
            while (cell.firstChild) {
                container.appendChild(cell.firstChild);
            }

            // Create refresh button
            const refreshBtn = document.createElement('button');
            refreshBtn.type = 'button';
            refreshBtn.className = 'slug-refresh-btn slug-refresh-btn-inline';
            refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16"><path fill="currentColor" d="M13.65 2.35A7.95 7.95 0 0 0 8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 1.76 4.24l1.42-1.42a4 4 0 1 0 0-5.66l-1.42-1.42A6 6 0 0 1 8 2a5.95 5.95 0 0 1 4.24 1.76L10 6h6V0l-2.35 2.35z"/></svg>';
            refreshBtn.title = 'Regenerate slug from title';
            refreshBtn.setAttribute('aria-label', 'Regenerate slug from title');

            // Add click handler
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleIndexRefreshClick(refreshBtn, cell, elementId);
            });

            container.appendChild(refreshBtn);
            cell.appendChild(container);
        });
    }

    function handleIndexRefreshClick(button, cell, elementId) {
        // Disable button and show loading state
        button.disabled = true;
        button.classList.add('loading');

        // Get the current site ID from the element index
        const siteId = Craft.elementIndex && Craft.elementIndex.siteId ? Craft.elementIndex.siteId : null;

        // Make AJAX request to regenerate slug
        Craft.sendActionRequest('POST', 'slugrefresh/slug/regenerate', {
            data: {
                elementId: elementId,
                siteId: siteId
            }
        })
        .then(function(response) {
            if (response.data.success) {
                // Update the slug text in the cell
                const textNode = cell.querySelector('.slug-index-container').firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = response.data.slug;
                }

                Craft.cp.displayNotice('Slug regenerated successfully');
            } else {
                Craft.cp.displayError(response.data.error || 'Failed to regenerate slug');
            }
        })
        .catch(function(error) {
            console.error('Slug refresh error:', error);
            Craft.cp.displayError('Failed to regenerate slug');
        })
        .finally(function() {
            // Re-enable button and remove loading state
            button.disabled = false;
            button.classList.remove('loading');
        });
    }

    function addToolbarButton() {
        // Only add on entry index pages
        if (!Craft.elementIndex || Craft.elementIndex.elementType !== 'craft\\elements\\Entry') {
            return;
        }

        // Check if button already exists
        if (document.querySelector('.slug-refresh-toolbar-btn')) {
            return;
        }

        // Find the toolbar
        const toolbar = document.querySelector('#main-content .toolbar:not(.flex)');
        if (!toolbar) return;

        // Create button container
        const btnContainer = document.createElement('div');
        btnContainer.className = 'flex';

        // Create the button
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn slug-refresh-toolbar-btn';
        button.innerHTML = '<span class="icon">refresh</span> Regenerate All Slugs';
        button.title = 'Regenerate slugs for all entries in this view';

        // Add click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleToolbarButtonClick(button);
        });

        btnContainer.appendChild(button);
        toolbar.appendChild(btnContainer);
    }

    function handleToolbarButtonClick(button) {
        // Get all entry IDs from the current view
        const elementIds = [];
        const rows = document.querySelectorAll('.tableview tbody tr[data-id]');

        rows.forEach(function(row) {
            const id = row.getAttribute('data-id');
            if (id) {
                elementIds.push(id);
            }
        });

        if (elementIds.length === 0) {
            Craft.cp.displayNotice('No entries found in current view');
            return;
        }

        // Confirm action
        if (!confirm(`Regenerate slugs for ${elementIds.length} entries? This will overwrite all existing slugs with new ones based on the current titles.`)) {
            return;
        }

        // Get the current site ID from the element index
        const siteId = Craft.elementIndex && Craft.elementIndex.siteId ? Craft.elementIndex.siteId : null;

        // Disable button and show loading state
        button.disabled = true;
        button.innerHTML = '<span class="icon">refresh</span> Regenerating...';

        // Make AJAX request to bulk regenerate
        Craft.sendActionRequest('POST', 'slugrefresh/slug/bulk-regenerate', {
            data: {
                elementIds: elementIds,
                siteId: siteId
            }
        })
        .then(function(response) {
            if (response.data.success || response.data.successCount > 0) {
                Craft.cp.displayNotice(response.data.message);

                // Refresh the element index to show updated slugs
                if (Craft.elementIndex) {
                    Craft.elementIndex.updateElements();
                }
            } else {
                let errorMsg = response.data.message || 'Failed to regenerate slugs';
                if (response.data.errors && response.data.errors.length > 0) {
                    errorMsg += '\n\nErrors:\n' + response.data.errors.join('\n');
                }
                Craft.cp.displayError(errorMsg);
            }
        })
        .catch(function(error) {
            console.error('Bulk slug refresh error:', error);
            Craft.cp.displayError('Failed to regenerate slugs');
        })
        .finally(function() {
            // Re-enable button and restore text
            button.disabled = false;
            button.innerHTML = '<span class="icon">refresh</span> Regenerate All Slugs';
        });
    }
})();
