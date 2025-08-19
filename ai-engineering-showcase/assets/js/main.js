// Smooth scrolling
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(l => l.addEventListener('click', e => {
  if (l.hash) { e.preventDefault(); document.querySelector(l.hash)?.scrollIntoView({ behavior: 'smooth' }); }
}));

// Mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

// Navbar background on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 8) header?.classList.add('header--scrolled');
  else header?.classList.remove('header--scrolled');
});

// IntersectionObserver animations + progress bars
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      const bars = entry.target.querySelectorAll?.('.progress');
      bars?.forEach(bar => {
        const pct = bar.getAttribute('data-progress');
        const span = bar.querySelector('span');
        if (span && pct) span.style.width = pct + '%';
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .project, .card').forEach(el => io.observe(el));

// Contact form validation
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const message = data.get('message')?.toString().trim();
  if (!name || !email || !message) {
    statusEl.textContent = 'Please fill out all fields.';
    return;
  }
  statusEl.textContent = 'Thanks! Your message has been captured.';
  form.reset();
});

// Project filters
const filterButtons = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('.project');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  const cat = btn.getAttribute('data-filter');
  projects.forEach(p => {
    const ok = cat === 'all' || p.getAttribute('data-category') === cat;
    p.style.display = ok ? '' : 'none';
  });
}));

// Back to top + year
const toTop = document.getElementById('toTop');
document.getElementById('year').textContent = new Date().getFullYear();
toTop?.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
