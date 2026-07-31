const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const nav = document.querySelector(".nav");
const heroBgImg = document.querySelector(".hero-bg img");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".btn-copy").forEach((copyBtn) => {
  copyBtn.addEventListener("click", async () => {
    const row = copyBtn.closest(".ca-row");
    const contract = row?.querySelector(".contract-address");
    if (!contract) return;

    const address = contract.textContent.trim();
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(contract);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
});

if (navToggle && mobileMenu) {
  const setOpen = (open) => {
    mobileMenu.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  navToggle.addEventListener("click", () => {
    setOpen(mobileMenu.hidden);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

/* Scroll direction + nav state + hero parallax */
let lastScrollY = window.scrollY;
let ticking = false;

const onScrollFrame = () => {
  const y = window.scrollY;
  const goingDown = y > lastScrollY;
  document.body.classList.toggle("scroll-down", goingDown && y > 40);
  document.body.classList.toggle("scroll-up", !goingDown && y > 40);
  lastScrollY = y;

  if (nav) {
    nav.classList.toggle("scrolled", y > 40);
  }

  if (heroBgImg && !prefersReducedMotion) {
    const parallax = Math.min(y * 0.28, 160);
    heroBgImg.style.translate = `0 ${parallax}px`;
  }

  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  },
  { passive: true }
);

onScrollFrame();

/* Bidirectional reveal effects */
const revealPlan = [
  { selector: ".section-inner > .eyebrow", variant: "reveal-up", delay: 0 },
  { selector: ".section-inner > h2", variant: "reveal-up", delay: 1 },
  { selector: ".section-inner > .lead", variant: "reveal-up", delay: 2 },
  { selector: ".about-block", variant: "reveal-up", stagger: true },
  { selector: ".video-block", variant: "reveal-scale", delay: 1 },
  { selector: ".stat", variant: "reveal-up", stagger: true },
  { selector: ".ca-row-token", variant: "reveal-up", delay: 1 },
  { selector: ".dex-embed", variant: "reveal-scale", delay: 1 },
  { selector: ".token-visual", variant: "reveal-scale", delay: 1 },
  { selector: ".token-note", variant: "reveal-up", delay: 2 },
  { selector: ".token-links", variant: "reveal-up", delay: 3 },
  { selector: ".footer img", variant: "reveal-scale", delay: 0 },
  { selector: ".footer p", variant: "reveal-up", stagger: true },
];

const revealEls = [];

revealPlan.forEach(({ selector, variant, delay = 0, stagger = false }) => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.classList.add("reveal", variant);
    const d = stagger ? Math.min(index + 1, 5) : delay;
    if (d > 0) el.classList.add(`reveal-delay-${d}`);
    revealEls.push(el);
  });
});

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

/* 3D tilt cards in About */
if (!prefersReducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach((cardWrap) => {
    const card = cardWrap.querySelector(".about-card");
    if (!card) return;

    const maxTilt = 12;

    cardWrap.addEventListener("pointermove", (event) => {
      const rect = cardWrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltY = (x - 0.5) * maxTilt * 2;
      const tiltX = (0.5 - y) * maxTilt * 2;

      cardWrap.classList.add("is-tilting");
      card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      card.style.transform = `
        rotateX(calc(var(--base-rotate-x) + ${tiltX.toFixed(2)}deg))
        rotateY(calc(var(--base-rotate-y) + ${tiltY.toFixed(2)}deg))
        translateZ(18px)
      `;
    });

    cardWrap.addEventListener("pointerleave", () => {
      cardWrap.classList.remove("is-tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.transform = "";
    });
  });
}
