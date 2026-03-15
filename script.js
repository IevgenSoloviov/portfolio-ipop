document.addEventListener("DOMContentLoaded", () => {
  // ---------- Navbar: canvi de fons quan hi ha scroll ----------
  const nav = document.querySelector(".navbar");

  if (nav) {
    let lastScroll = 0;

    window.addEventListener(
      "scroll",
      () => {
        if (Math.abs(window.scrollY - lastScroll) > 10) {
          nav.classList.toggle("scrolled", window.scrollY > 50);
          lastScroll = window.scrollY;
        }
      },
      { passive: true }
    );
  }

  // ---------- Enllaç actiu segons secció visible ----------
  const hero = document.querySelector("#hero");
  const sections = document.querySelectorAll("section");
  const allSections = [hero, ...sections].filter(Boolean);
  const links = document.querySelectorAll(".nav-links a");

  const setActive = (id) => {
    if (!id) return;

    links.forEach((a) => {
      const active = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", active);

      if (active) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  };

  if (allSections.length && links.length) {
    const ioActive = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.3 }
    );

    allSections.forEach((section) => ioActive.observe(section));
  }

  // ---------- Animació d’entrada (fade-in) ----------
  const toFade = [
    ...allSections,
    ...document.querySelectorAll("section article, section .card, section .projects-grid > *"),
  ];

  if (toFade.length) {
    const ioFade = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            ioFade.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    toFade.forEach((el) => {
      el.classList.add("fade-in");
      ioFade.observe(el);
    });
  }

  // ---------- Dark / Light Mode ----------
  const toggleBtn = document.getElementById("theme-toggle");

  if (toggleBtn) {
    const applyTheme = (light) => {
      document.body.classList.toggle("light", light);
      toggleBtn.textContent = light ? "☀️" : "🌙";
      toggleBtn.setAttribute("aria-pressed", String(light));
    };

    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const savedTheme = localStorage.getItem("theme");

    applyTheme(savedTheme === "light" || (!savedTheme && prefersLight));

    toggleBtn.addEventListener("click", () => {
      const willBeLight = !document.body.classList.contains("light");
      applyTheme(willBeLight);
      localStorage.setItem("theme", willBeLight ? "light" : "dark");
    });
  }

  // ---------- Comptadors ----------
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target) || 0;
    let count = 0;
    const step = Math.max(target / 60, 1);
    const formatter = new Intl.NumberFormat();

    const update = () => {
      count = Math.min(count + step, target);
      counter.textContent = formatter.format(Math.floor(count));

      if (count < target) {
        requestAnimationFrame(update);
      }
    };

    update();
  };

  if (counters.length) {
    const ioCounter = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            ioCounter.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => ioCounter.observe(counter));
  }

  // ---------- Botó Scroll To Top ----------
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {
    window.addEventListener(
      "scroll",
      () => {
        scrollBtn.classList.toggle("show", window.scrollY > 300);
      },
      { passive: true }
    );

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
