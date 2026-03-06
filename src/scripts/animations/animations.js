document.addEventListener("DOMContentLoaded", () => {
  const animationClass = "animate";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const allWowElements = document.querySelectorAll(".lava");

  // If user prefers reduced motion, show all elements immediately
  if (prefersReducedMotion) {
    allWowElements.forEach((el) => el.classList.add(animationClass));
    return;
  }

  const wowContainers = document.querySelectorAll(".lavaCont");
  const containerWows = new Set();
  document
    .querySelectorAll(".lavaCont .lava")
    .forEach((el) => containerWows.add(el));
  const standaloneWows = Array.from(allWowElements).filter(
    (el) => !containerWows.has(el)
  );

  if (!wowContainers.length && !standaloneWows.length) return;

  const runWowContainers = () => {
    const viewportHeight = window.innerHeight;

    wowContainers.forEach((container) => {
      const wowElements = container.querySelectorAll(".lava");
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;
      const containerHeight = containerRect.height;
      const containerBottom = containerTop + containerHeight;
      const scrollTop = window.scrollY;
      const viewportBottom = scrollTop + viewportHeight;

      const isFullyInView =
        containerTop < viewportBottom && containerBottom > scrollTop;
      const isFullyOutOfView =
        containerBottom <= scrollTop || containerTop >= viewportBottom;

      if (isFullyInView) {
        wowElements.forEach((el, index) => {
          const delay = index * 300;
          setTimeout(() => el.classList.add(animationClass), delay);
        });
      } else if (isFullyOutOfView) {
        wowElements.forEach((el) => {
          el.classList.remove(animationClass);
        });
      }
    });
  };

  const runStandaloneWows = () => {
    const viewportHeight = window.innerHeight;

    standaloneWows.forEach((el) => {
      const elRect = el.getBoundingClientRect();
      const elTop = elRect.top + window.scrollY;
      const elMiddle = elRect.height / 2;
      const scrollTop = window.scrollY;

      const isElementVisible =
        elTop + elMiddle <= scrollTop + viewportHeight &&
        elTop + elMiddle >= scrollTop;

      if (isElementVisible) {
        el.classList.add(animationClass);
      } else {
        el.classList.remove(animationClass);
      }
    });
  };

  const handleScrollResize = () => {
    if (wowContainers.length) runWowContainers();
    if (standaloneWows.length) runStandaloneWows();
  };

  if (window.lenis) {
    lenis.on("scroll", handleScrollResize);
  } else {
    window.addEventListener("scroll", handleScrollResize);
  }

  window.addEventListener("resize", handleScrollResize);
  handleScrollResize(); // initial check
});
