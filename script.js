document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.querySelector(".navbar");
  const hero = document.querySelector("#hero");
  const sections = [...document.querySelectorAll("main section")];
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const toggleBtn = document.getElementById("theme-toggle");
  const scrollBtn = document.getElementById("scrollTopBtn");
  const counters = [...document.querySelectorAll(".counter")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------ NAVBAR SCROLLED ------------------ */
  const handleNavbarScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 50);
  };

  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  /* ------------------ ENLLAÇ ACTIU ------------------ */
  const setActiveLink = (id) => {
    if (!id || !navLinks.length) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observableSections = [hero, ...sections].filter(
    (section, index, arr) => section && arr.indexOf(section) === index
  );

  if (observableSections.length && navLinks.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    observableSections.forEach((section) => activeObserver.observe(section));
  }

  /* ------------------ FADE IN ------------------ */
  const fadeElements = [
    ...document.querySelectorAll("section"),
    ...document.querySelectorAll("section .card"),
    ...document.querySelectorAll(".project-card")
  ].filter((el, index, arr) => arr.indexOf(el) === index);

  if (fadeElements.length) {
    if (reducedMotion) {
      fadeElements.forEach((el) => el.classList.add("visible"));
    } else {
      const fadeObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 }
      );

      fadeElements.forEach((el) => {
        el.classList.add("fade-in");
        fadeObserver.observe(el);
      });
    }
  }

  /* ------------------ DARK / LIGHT MODE ------------------ */
  if (toggleBtn) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

    const applyTheme = (theme) => {
      const isLight = theme === "light";
      body.classList.toggle("light", isLight);
      toggleBtn.textContent = isLight ? "☀️" : "🌙";
      toggleBtn.setAttribute("aria-pressed", String(isLight));
      toggleBtn.setAttribute(
        "aria-label",
        isLight ? "Canviar a tema fosc" : "Canviar a tema clar"
      );
    };

    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || (mediaQuery.matches ? "light" : "dark");
    applyTheme(initialTheme);

    toggleBtn.addEventListener("click", () => {
      const nextTheme = body.classList.contains("light") ? "dark" : "light";
      applyTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
    });

    mediaQuery.addEventListener("change", (event) => {
      const saved = localStorage.getItem("theme");
      if (!saved) {
        applyTheme(event.matches ? "light" : "dark");
      }
    });
  }

  /* ------------------ COMPTADORS ------------------ */
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target) || 0;
    const formatter = new Intl.NumberFormat("ca-ES");

    if (reducedMotion || target === 0) {
      counter.textContent = formatter.format(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const updateCounter = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      counter.textContent = formatter.format(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = formatter.format(target);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.65 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ------------------ SCROLL TO TOP ------------------ */
  if (scrollBtn) {
    const handleScrollButton = () => {
      scrollBtn.classList.toggle("show", window.scrollY > 300);
    };

    handleScrollButton();
    window.addEventListener("scroll", handleScrollButton, { passive: true });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }
});
