(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menu.innerHTML = open ? '<span aria-hidden="true">×</span>' : '<span aria-hidden="true">☰</span>';
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menu.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const root = document.querySelector("#scroll-scrub");
  const video = root?.querySelector(".scroll-scrub__video");
  const progress = root?.querySelector(".scroll-scrub__progress span");
  const chapter = root?.querySelector(".scroll-scrub__chapter");
  const poster = root?.querySelector(".scroll-scrub__poster");
  if (root && video && progress && chapter) {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = matchMedia("(hover: none) and (pointer: coarse), (max-width: 860px)");
    const desktopSrc = "https://hitech-media-solutions.higgsfield.app/assets/world/scene-01.mp4";
    const mobileSrc = "https://hitech-media-solutions.higgsfield.app/assets/world/scene-01-mobile.mp4";
    const desktopPoster = "https://hitech-media-solutions.higgsfield.app/assets/world/scene-01-poster.png";
    const mobilePoster = "https://hitech-media-solutions.higgsfield.app/assets/world/scene-01-mobile-poster.png";
    let frame = 0;
    let current = 0;
    let target = 0;
    let destroyed = false;

    const setVariant = () => {
      const source = mobileQuery.matches ? mobileSrc : desktopSrc;
      const image = mobileQuery.matches ? mobilePoster : desktopPoster;
      if (video.src !== source) {
        video.src = source;
        video.load();
      }
      video.poster = image;
      if (poster) poster.src = image;
    };
    setVariant();
    mobileQuery.addEventListener?.("change", setVariant);

    const readScroll = () => {
      const rect = root.getBoundingClientRect();
      const rootTop = window.scrollY + rect.top;
      const length = Math.max(window.innerHeight * 1.75, 1);
      const raw = Math.min(1, Math.max(0, (window.scrollY - rootTop) / length));
      const centered = 2 * raw - 1;
      target = 0.92 * raw + 0.08 * (4 * centered ** 3 + 0.5);
      target = Math.min(1, Math.max(0, target));
      root.style.setProperty("--ss-progress", String(raw));
      progress.style.transform = "scaleX(" + raw + ")";
    };
    const tick = () => {
      if (destroyed) return;
      readScroll();
      if (!reducedMotion.matches && video.readyState >= 2 && !video.seeking) {
        current += (target - current) * 0.2;
        const time = Math.min(0.999, Math.max(0, current)) * (video.duration || 1);
        if (Math.abs(video.currentTime - time) > 0.02) {
          try { video.currentTime = time; } catch {}
        }
      }
      frame = requestAnimationFrame(tick);
    };
    video.muted = true;
    video.playsInline = true;
    video.pause();
    frame = requestAnimationFrame(tick);
    document.getElementById("hero-jump")?.addEventListener("click", () => {
      const top = window.scrollY + root.getBoundingClientRect().top;
      window.scrollTo({ top: top + window.innerHeight * 0.5, behavior: "smooth" });
    });
    window.addEventListener("pagehide", () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      mobileQuery.removeEventListener?.("change", setVariant);
    }, { once: true });
  }

  const form = document.querySelector("#enquiry-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("Website enquiry: " + (data.get("service") || "General enquiry"));
    const body = encodeURIComponent(
      "Name: " + data.get("name") + "\nPhone: " + data.get("phone") +
      "\nEmail: " + data.get("email") + "\nService: " + data.get("service") +
      "\n\nMessage:\n" + data.get("message"),
    );
    window.location.href = "mailto:htmediablr@gmail.com?subject=" + subject + "&body=" + body;
  });
})();


