// Runs immediately when module executes (after DOM parsed, before DOMContentLoaded)
// No DOMContentLoaded wrapper needed — Vite modules are deferred by spec.
const imgs = document.querySelectorAll(".dynamic-priority-img");
const viewportHeight =
  window.innerHeight || document.documentElement.clientHeight;

imgs.forEach((img) => {
  // Skip hidden elements (e.g. Alpine x-show → display:none)
  // They report rect.top = 0 which falsely looks "above fold"
  const isVisible = img.offsetParent !== null;
  const rect = img.getBoundingClientRect();
  const isAboveFold = isVisible && rect.top < viewportHeight;

  if (isAboveFold) {
    // Above the fold → high priority, eager load
    img.loading = "eager";
    img.decoding = "sync";
    img.setAttribute("fetchpriority", "high");
  } else {
    // Below the fold or hidden → keep lazy
    img.loading = "lazy";
    img.decoding = "async";
    img.setAttribute("fetchpriority", "low");
  }
});
