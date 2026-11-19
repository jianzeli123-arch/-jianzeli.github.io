const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const progress = document.querySelector(".scroll-progress span");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const toast = document.querySelector(".toast");

function updateScrollUI() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", y > 16);
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  header.classList.toggle("nav-active", !open);
  document.body.classList.toggle("nav-open", !open);
});

siteNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("nav-active");
  document.body.classList.remove("nav-open");
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  { rootMargin: "-30% 0px -58% 0px", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

let toastTimer;
document.querySelector(".copy-wechat").addEventListener("click", async () => {
  const value = "469 780 461";
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement("input");
    input.value = value;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
});
