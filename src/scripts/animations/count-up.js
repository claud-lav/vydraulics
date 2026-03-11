document.addEventListener("DOMContentLoaded", () => {
  const countUpContainers = document.querySelectorAll("[data-count-up]");
  if (!countUpContainers.length) return;

  const duration = 2000;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count-target"), 10);
    if (isNaN(target)) return;

    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll("[data-count-target]");
          numbers.forEach((el) => animateCount(el));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  countUpContainers.forEach((container) => observer.observe(container));
});
