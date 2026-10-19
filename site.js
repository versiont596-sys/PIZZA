(() => {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);
  document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  let frameRequested = false;
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, percentage))})`;
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(item => {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < window.innerHeight + 40 && bounds.bottom > -40) {
        item.classList.add("is-visible");
      }
    });
    frameRequested = false;
  };

  window.addEventListener("scroll", () => {
    if (!frameRequested) {
      window.requestAnimationFrame(updateProgress);
      frameRequested = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("is-visible"));
    updateProgress();
    return;
  }

  document.body.classList.add("has-reveal");
  updateProgress();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealItems.forEach(item => {
    const siblingIndex = [...item.parentElement.children].indexOf(item);
    item.style.transitionDelay = `${Math.min(siblingIndex * 75, 300)}ms`;
    observer.observe(item);
  });
})();
