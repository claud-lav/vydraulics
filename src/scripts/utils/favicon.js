document.addEventListener("DOMContentLoaded", () => {
  const setFaviconAndManifest = () => {
    // Detect if user prefers dark mode
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Use inverse favicon for contrast: dark favicon on light background, light favicon on dark background
    const faviconFolder = isDarkMode ? "light" : "dark";

    // Update favicon links
    const favicon32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
    const favicon16 = document.querySelector('link[rel="icon"][sizes="16x16"]');
    const appleTouchIcon = document.querySelector(
      'link[rel="apple-touch-icon"]'
    );

    if (favicon32) {
      favicon32.href = `/assets/favicon/${faviconFolder}/favicon-32x32.png`;
    }
    if (favicon16) {
      favicon16.href = `/assets/favicon/${faviconFolder}/favicon-16x16.png`;
    }
    if (appleTouchIcon) {
      appleTouchIcon.href = `/assets/favicon/${faviconFolder}/apple-touch-icon.png`;
    }

    // Update manifest
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      document.head.appendChild(manifestLink);
    }

    const manifestPath = isDarkMode
      ? "/assets/favicon/Favicon_light/site.webmanifest"
      : "/assets/favicon/Favicon_dark/site.webmanifest";

    manifestLink.href = manifestPath;
  };

  setFaviconAndManifest(); // Initial call

  // Listen for changes to the prefers-color-scheme media query
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", setFaviconAndManifest);
});
