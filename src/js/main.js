/* Your JS here. */
const navbar = document.getElementById('navbar');
const menu = document.querySelector('.menu');
const menuButton = document.querySelector('.menu-button');
const links = document.querySelectorAll('.menu a');
const navHeight = 72;

menuButton.addEventListener('click', function () {
  menu.classList.toggle('open');
});

function highlightSection() {
  const top = window.pageYOffset;

  if (top > 40) {
    navbar.classList.add('small');
  } else {
    navbar.classList.remove('small');
  }

  let active = 0;

  if (window.innerHeight + top >= document.body.scrollHeight - 2) {
    active = links.length - 1;
  } else {
    for (let i = 0; i < links.length; i++) {
      const section = document.querySelector(links[i].getAttribute('href'));
      if (section.getBoundingClientRect().top - navHeight <= 1) {
        active = i;
      }
    }
  }

  for (let i = 0; i < links.length; i++) {
    links[i].classList.toggle('current', i === active);
  }
}

window.addEventListener('scroll', highlightSection);
window.addEventListener('resize', highlightSection);
highlightSection();

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScroll(target) {
  const start = window.pageYOffset;
  const end = Math.min(
    target.getBoundingClientRect().top + start - navHeight,
    document.body.scrollHeight - window.innerHeight
  );
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / 600, 1);
    window.scrollTo(0, start + (end - start) * ease(progress));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    menu.classList.remove('open');
    smoothScroll(document.querySelector(link.getAttribute('href')));
  });
});

const track = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelector('.dots');
let current = 0;

function showSlide(index) {
  if (index < 0) {
    index = slides.length - 1;
  }
  if (index >= slides.length) {
    index = 0;
  }

  current = index;
  track.style.transform = 'translateX(-' + current * 100 + '%)';

  for (let i = 0; i < dots.children.length; i++) {
    dots.children[i].classList.toggle('current', i === current);
  }
}

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  dot.addEventListener('click', function () {
    showSlide(i);
  });
  dots.appendChild(dot);
}

document.querySelector('.arrow.prev').addEventListener('click', function () {
  showSlide(current - 1);
});

document.querySelector('.arrow.next').addEventListener('click', function () {
  showSlide(current + 1);
});

showSlide(0);

function closeModal(modal) {
  modal.hidden = true;
  document.body.classList.remove('locked');
}

document.querySelectorAll('[data-modal]').forEach(function (button) {
  button.addEventListener('click', function () {
    const modal = document.getElementById(button.dataset.modal);
    modal.hidden = false;
    document.body.classList.add('locked');
  });
});

document.querySelectorAll('.modal').forEach(function (modal) {
  modal.querySelector('.close').addEventListener('click', function () {
    closeModal(modal);
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const open = document.querySelector('.modal:not([hidden])');
    if (open) {
      closeModal(open);
    }
  }
});