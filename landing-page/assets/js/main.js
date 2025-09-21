const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.getElementById("mobile-nav");
const navList = document.querySelector(".nav-list");
const languageLink = document.querySelector(".language-switch .btn-language");
const yearEl = document.getElementById("year");

if (navToggle && mobileNav && navList) {
  const navClone = navList.cloneNode(true);
  mobileNav.appendChild(navClone);

  if (languageLink) {
    const mobileLang = document.createElement("div");
    mobileLang.className = "mobile-lang";
    mobileLang.appendChild(languageLink.cloneNode(true));
    mobileNav.appendChild(mobileLang);
  }

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobileNav.setAttribute("aria-expanded", String(!expanded));
    mobileNav.classList.toggle("mobile-nav-open", !expanded);
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
