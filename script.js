// ═══════════════════════════════════
// Mobile Menu Toggle
// ═══════════════════════════════════
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ═══════════════════════════════════
// Dark Mode Toggle
// ═══════════════════════════════════
const themeToggle = document.querySelector(".theme-toggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function getPreferredTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

setTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "dark" : "light");
  }
});

// ═══════════════════════════════════
// Scroll-triggered reveal animations
// ═══════════════════════════════════
const revealElements = document.querySelectorAll(".reveal, .stagger");

if (revealElements.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Reduced motion: show everything immediately
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

// ═══════════════════════════════════
// Topbar background on scroll
// ═══════════════════════════════════
const topbar = document.querySelector(".topbar");

function updateTopbar() {
  if (!topbar) return;
  if (window.scrollY > 40) {
    topbar.classList.add("is-scrolled");
  } else {
    topbar.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", updateTopbar, { passive: true });
updateTopbar();

// ═══════════════════════════════════
// Section dot navigation
// ═══════════════════════════════════
const snapSections = document.querySelectorAll(".snap-section");
const dotsContainer = document.querySelector(".section-dots");

if (snapSections.length && dotsContainer) {
  const dots = dotsContainer.querySelectorAll(".dot");

  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const idx = Array.from(snapSections).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  snapSections.forEach((section) => dotObserver.observe(section));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      snapSections[index].scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ═══════════════════════════════════
// Slideshow / Process Steps
// ═══════════════════════════════════
const slideshows = document.querySelectorAll("[data-slideshow]");

slideshows.forEach((slideshow) => {
  const steps = Array.from(slideshow.querySelectorAll("[data-slide-target]"));
  const panels = Array.from(slideshow.querySelectorAll("[data-slide-panel]"));

  const setActiveSlide = (id) => {
    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.slideTarget === id);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.slidePanel === id);
    });
  };

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      setActiveSlide(step.dataset.slideTarget);
    });
  });

  const slideObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveSlide(visible.target.dataset.slideTarget);
      }
    },
    {
      threshold: [0.35, 0.6, 0.85],
      rootMargin: "-10% 0px -20% 0px",
    }
  );

  steps.forEach((step) => slideObserver.observe(step));
});

// ═══════════════════════════════════
// Intake Form Summary Generator
// ═══════════════════════════════════
const intakeForm = document.querySelector("#intake-form");
const summaryCard = document.querySelector("#summary-card");
const summaryOutput = document.querySelector("#summary-output");

if (intakeForm && summaryCard && summaryOutput) {
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(intakeForm);
    const fields = {
      name: formData.get("name")?.toString().trim() || "Not provided",
      company: formData.get("company")?.toString().trim() || "Not provided",
      email: formData.get("email")?.toString().trim() || "Not provided",
      problem: formData.get("problem")?.toString().trim() || "Not provided",
      area: formData.get("area")?.toString().trim() || "Not specified",
      outcome: formData.get("outcome")?.toString().trim() || "Not provided",
      urgency: formData.get("urgency")?.toString().trim() || "Not specified",
    };

    const areaLabels = {
      cfo: "Finance / CFO",
      cmo: "Growth / CMO",
      chro: "People / CHRO",
      cto: "Technology / CTO",
      unsure: "Not sure yet",
      "": "Not specified",
    };

    const summary = [
      "═══════════════════════════════════",
      "  FRACTIONALTY INTAKE SUMMARY",
      "═══════════════════════════════════",
      "",
      `Name: ${fields.name}`,
      `Company: ${fields.company}`,
      `Email: ${fields.email}`,
      "",
      `Leadership Area: ${areaLabels[fields.area] || fields.area}`,
      `Urgency: ${fields.urgency}`,
      "",
      "───────────────────────────────────",
      "BUSINESS PROBLEM:",
      "───────────────────────────────────",
      fields.problem,
      "",
      "───────────────────────────────────",
      "DESIRED OUTCOME:",
      "───────────────────────────────────",
      fields.outcome,
      "",
      "═══════════════════════════════════",
    ].join("\n");

    summaryOutput.textContent = summary;
    summaryCard.hidden = false;
    summaryCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// ═══════════════════════════════════
// Smooth scroll for anchor links
// ═══════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || href === "#home") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
