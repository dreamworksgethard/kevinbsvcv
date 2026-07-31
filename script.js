const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

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

const revealTargets = document.querySelectorAll(
  ".about-block, .video-block, .stat, .token-visual, .token-note, .token-links, .ca-row-token, .dex-embed"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => observer.observe(el));
