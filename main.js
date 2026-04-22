/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ============================================
   HERO CANVAS — FLOATING PARTICLES
   ============================================ */
const canvas  = document.getElementById('heroCanvas');
const ctx     = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.r  = Math.random() * 1.5 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life  = 0;
    this.maxLife = Math.random() * 400 + 200;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.y < -10 || this.life > this.maxLife) this.reset();
  }

  draw() {
    const t = this.life / this.maxLife;
    const a = this.alpha * (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 240, 96, ${a})`;
    ctx.fill();
  }
}

// Connection lines
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const a = (1 - dist / 140) * 0.06;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(200, 240, 96, ${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Mouse interaction
let mx = W / 2, my = H / 2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

// Init particles
for (let i = 0; i < 90; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);

  // Subtle radial glow around mouse
  const g = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
  g.addColorStop(0, 'rgba(200,240,96,0.04)');
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
const revealEls = document.querySelectorAll(
  '.reveal, .skill-card, .title-underline, .about-left, .about-right, .footer-content'
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// Skill cards need separate observer (different class logic)
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(c => cardObs.observe(c));

// Title underlines
const lineObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.5 });

document.querySelectorAll('.title-underline').forEach(l => lineObs.observe(l));

/* ============================================
   PARALLAX — subtle hero name shift on scroll
   ============================================ */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && sy < window.innerHeight) {
    heroContent.style.transform = `translateY(${sy * 0.35}px)`;
    heroContent.style.opacity   = `${1 - sy / (window.innerHeight * 0.7)}`;
  }
});
