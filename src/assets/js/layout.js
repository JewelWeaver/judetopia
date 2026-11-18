function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.footer-menu');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Add event listener for the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
});
