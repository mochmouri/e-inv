'use strict';

/* ═══════════════════════════════════════
   CONFIG
═══════════════════════════════════════ */
const EVENT_DATE = new Date('2026-08-02T20:00:00');

/* ═══════════════════════════════════════
   LANGUAGE TOGGLE
═══════════════════════════════════════ */
const langToggle   = document.getElementById('langToggle');
const langEnSpan   = langToggle.querySelector('.lang-en');
const langArSpan   = langToggle.querySelector('.lang-ar');
let   currentLang  = 'en';

function setLang(lang) {
  currentLang = lang;
  const isAr  = lang === 'ar';

  // Flip document direction and lang attribute
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.body.lang             = lang;

  // Swap all translatable text
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = isAr ? el.dataset.ar : el.dataset.en;
    if (el.tagName === 'BUTTON' || el.classList.contains('venue-time__hour')) {
      // Allow HTML (for <small> tags inside)
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Update toggle indicator
  langEnSpan.classList.toggle('active-lang', !isAr);
  langArSpan.classList.toggle('active-lang', isAr);

  // Store preference
  try { localStorage.setItem('lang', lang); } catch (_) {}
}

langToggle.addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'ar' : 'en');
});

// Restore saved preference
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'ar') setLang('ar');
} catch (_) {}

/* ═══════════════════════════════════════
   OPEN INVITATION BUTTON
═══════════════════════════════════════ */
document.getElementById('openInviteBtn').addEventListener('click', () => {
  document.getElementById('greeting').scrollIntoView({ behavior: 'smooth' });
});

/* ═══════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  // Immediately show all
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ═══════════════════════════════════════
   COUNTDOWN
═══════════════════════════════════════ */
const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function updateCountdown() {
  const diff = EVENT_DATE - Date.now();

  if (diff <= 0) {
    cdDays.textContent  = '00';
    cdHours.textContent = '00';
    cdMins.textContent  = '00';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  cdDays.textContent  = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent  = pad(minutes);
}

updateCountdown();
setInterval(updateCountdown, 30000);