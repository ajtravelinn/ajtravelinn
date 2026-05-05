document.addEventListener("DOMContentLoaded", function() {
  const header = document.querySelector("header.site-header");
  if (!header) return;

  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});