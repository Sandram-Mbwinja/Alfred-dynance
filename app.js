/* ============================================================
   DYNANCE STEM CELL — MAIN JAVASCRIPT (main.js)
   Author: Amateur Dev (your friend)
   ============================================================

   ⚙️ OWNER CONFIGURATION — Edit the values in the CONFIG
      block below. This is the ONLY section you need to touch!
   ============================================================ */

const CONFIG = {
  /* ── REPLACE WITH YOUR DETAILS ──────────────────────────── */

  // Your WhatsApp number in international format (no spaces, no '+')
  whatsappNumber: "265899768728",

  // Your Facebook profile or page URL
  facebookURL: "https://www.facebook.com/alfred.zeka.94",

  // Your email address (shown on contact page)
  email: "Alfredzeka867@gmail.com",

  // Formspree endpoint — sign up free at formspree.io, create a form, paste URL here
  formspreeURL: "https://formspree.io/f/YOUR_FORM_ID",

  // Google Sheets CSV URL for the Manifesto page
  // Steps: Publish your Google Sheet to web → CSV format → paste URL here
  sheetCSVURL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv",

  // Owner's name
  ownerName: "Alfred Zeka",

  // Your physical address
  address: "UNIMA campus,Zomba, Malawi",

  // Google Maps embed src URL (get from maps.google.com → Share → Embed)
  mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d491879.01659695833!2d34.92733869763943!3d-15.602073804154118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d904e65366a83f%3A0xf1f319d6a0c14cf9!2sUniversity%20of%20Malawi!5e0!3m2!1sen!2smw!4v1775030777301!5m2!1sen!2smw",

  // ── PRODUCT CMS ──────────────────────────────────────────────
  // Paste your Google Apps Script Web App URL here.
  // Products will be loaded live from Google Sheets.
  // Leave as-is to use the hardcoded products array below as fallback.
  appsScriptURL: "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",

  /* ── PRODUCT CATALOGUE ───────────────────────────────────── */
  // To add/remove products, edit this array.
  // 'img' can be a path like 'images/products/product1.jpg' or any image URL.
  // 'emoji' shows if no image is found.
  products: [
    {
      id: 1,
      name: "TRIPLE ROOT COFFEE (special for men)",
      description: "(NOT TO BE TAKEN TOGETHER WITH ROCENTA) Increases libido,improves the quality of erection,enhance sexual perfomance,erectile dysfunction (also for diabetics who have effects due to diabetes on their sexuality),against premature ejaculation,energy boosting,", 
      price: "MWK130,000",
      img: "product 1.jpg",
      emoji: "💧"
    },
    {
      id: 2,
      name: "URBANISM",
      description: "For weight loss, Fat burning, strengthening appetite,helps in digestion, fast metabolism, strengthening body curves, reduces hunger, works as a detox agent, prevents from becoming fat again. If you want to have a slim, strong and balanced body in a short period, let urbanism be your favourite candy of all time.",
       price: "MWK150,000",
      img: "product 2.jpg",
      emoji: "💊"
    },
    {
      id: 3,
      name: "ROCENTA",
      description: "For boosting the immune system, cardiovascular disorders,improve blood flow, skin infection, eye problems, liver problems, anti-stressing agent, haemorrhoid, hypertension, kidney disease, joint problems, anti aging, burns, diabetes, heart diseases, stroke, spinal cord injuries, all types of cancer etc. ",
      price:"MWK150,000",
      img: "product 3.jpg",
      emoji: "🌿"
    },
    {
      id: 4,
      name: "ACE GUARD",
      description: "Balancing sugar levels, immunne booster,repairing cells, a strong antioxidant, reduces inflammation, anti-aging agent.",
      price: "MWK150,000",
      img: "product 4.jpg",
      emoji: "👁️"
    },
    {
      id: 5,
      name: "COLLAGENE",
      description: "For improving skin elasticity, hydration, reducing joint pain, improved joint health, strong hair and nails, improves gut lining.",
      price: "MWK150,000",
      img: "product 5.jpg",
      emoji: "✨"
    },
    {
      id: 6,
      name: "LYFTMAX (SPECIAL FOR LADIES)",
      description: "For reverse aging, boosting libido, reshaping and firming breasts, good for hormonal balance, reduces vaginal dryness, menopause issues. ",
      price: "MWK150,000",
      img: "product 6.png",
      emoji: "💆"
    },
  ]
};

/* ============================================================
   ⚡ APPLICATION CODE — No need to edit below this line
   ============================================================ */

/* ── 1. NAVBAR: Active link + hamburger menu ─────────────── */
function initNavbar() {
  const links  = document.querySelectorAll('.navbar__links a');
  const burger = document.querySelector('.navbar__hamburger');
  const menu   = document.querySelector('.navbar__links');
  const path   = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight current page link
  links.forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Hamburger toggle
  if (burger && menu) {
    burger.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    // Close menu when a link is clicked (mobile)
    links.forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
}

/* ── 2. SCROLL FADE-IN animations ───────────────────────── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
}

/* ── 3. PRODUCT PAGE: Render product cards ──────────────── */
// Fetches from Google Sheets via Apps Script URL when configured.
// Falls back to CONFIG.products array if not yet set up.

async function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Show skeleton loaders while fetching
  grid.innerHTML = Array(6).fill('').map(() => `
    <div class="product-card">
      <div class="product-card__img-placeholder skeleton" style="aspect-ratio:1/1;border-radius:0;font-size:0;min-height:180px;"></div>
      <div class="product-card__body">
        <div class="skeleton" style="height:1rem;width:70%;margin-bottom:0.6rem;border-radius:4px;"></div>
        <div class="skeleton" style="height:3rem;margin-bottom:0.8rem;border-radius:4px;"></div>
        <div class="skeleton" style="height:1rem;width:30%;margin-bottom:1rem;border-radius:4px;"></div>
        <div class="skeleton" style="height:2.4rem;border-radius:50px;"></div>
      </div>
    </div>`).join('');

  let products = [];

  // Try Google Sheets / Apps Script first
  if (CONFIG.appsScriptURL && CONFIG.appsScriptURL !== 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    try {
      const res  = await fetch(`${CONFIG.appsScriptURL}?action=get`);
      const data = await res.json();
      if (data.products && data.products.length) {
        products = data.products.map(p => ({
          id:          p.id,
          name:        p.name,
          description: p.description,
          price:       p.price,
          img:         p.imgURL || '',
          emoji:       p.emoji  || '📦',
          inStock:     p.inStock !== 'false' && p.inStock !== false,
        }));
      }
    } catch (e) {
      console.warn('Sheets fetch failed, using CONFIG fallback:', e);
    }
  }

  // Fall back to hardcoded CONFIG.products
  if (!products.length) {
    products = CONFIG.products.map(p => ({ ...p, inStock: true }));
  }

  if (!products.length) {
    grid.innerHTML = '<p style="text-align:center;opacity:0.6;grid-column:1/-1;">No products available right now.</p>';
    return;
  }

  grid.innerHTML = '';
  products.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.style.animationDelay = `${i * 0.08}s`;

    const imgHTML = p.img
      ? `<img class="product-card__img" src="${p.img}" alt="${p.name}" onerror="this.outerHTML='<div class=\\'product-card__img-placeholder\\'>${p.emoji}</div>'">`
      : `<div class="product-card__img-placeholder">${p.emoji}</div>`;

    const stockBadge  = !p.inStock
      ? `<div style="display:inline-block;padding:2px 10px;border-radius:50px;background:rgba(198,40,40,0.2);color:#EF9A9A;font-size:0.72rem;font-weight:700;margin-bottom:0.7rem;border:1px solid rgba(198,40,40,0.3);">Out of Stock</div><br/>`
      : '';
    const orderButton = p.inStock
      ? `<button class="btn btn--gold" onclick="openOrderModal('${p.id}')">Order Now</button>`
      : `<button class="btn btn--outline" disabled style="opacity:0.4;cursor:not-allowed;">Out of Stock</button>`;

    card.innerHTML = `
      ${imgHTML}
      <div class="product-card__body">
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__desc">${p.description}</div>
        <div class="product-card__price">${p.price}</div>
        ${stockBadge}${orderButton}
      </div>`;
    grid.appendChild(card);
  });

  // Store for modal lookup
  window._dynanceProducts = products;
  initFadeIn();
}

/* ── 4. ORDER MODAL ─────────────────────────────────────── */
let currentProduct = null;

function openOrderModal(productId) {
  // Look up in live Sheets data first, fall back to CONFIG array
  const pool = window._dynanceProducts || CONFIG.products;
  currentProduct = pool.find(p => String(p.id) === String(productId));
  if (!currentProduct) return;

  document.getElementById('modal-product-name').textContent = currentProduct.name;
  document.getElementById('modal-product-desc').textContent = currentProduct.description;
  document.getElementById('modal-qty').value = 1;

  document.getElementById('order-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}

function buildOrderMessage(qty) {
  /* Order message format as specified by the owner */
  const unit = qty > 1 ? 'products' : 'product';
  return `Hie, I would like to order a pack of ${qty} ${currentProduct.name} ${unit}`;
}

function orderViaWhatsApp() {
  const qty = parseInt(document.getElementById('modal-qty').value) || 1;
  if (qty < 1) return alert('Please enter a valid quantity.');
  const msg = encodeURIComponent(buildOrderMessage(qty));
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
}

function orderViaFacebook() {
  const qty = parseInt(document.getElementById('modal-qty').value) || 1;
  if (qty < 1) return alert('Please enter a valid quantity.');
  /* Facebook Messenger deeplink — opens chat with the owner */
  const link = `https://m.me/${CONFIG.facebookURL.split('/').pop()}?ref=order_${currentProduct.id}_qty${qty}`;
  window.open(link, '_blank');
}

/* Close modal on overlay click */
function initModal() {
  const overlay = document.getElementById('order-modal');
  if (!overlay) return;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOrderModal(); });
  // Also allow Escape key
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOrderModal(); });
}

/* ── 5. MANIFESTO PAGE: Fetch from Google Sheets CSV ────── */
async function loadTestimonials() {
  const grid = document.getElementById('testimonial-grid');
  if (!grid) return;

  // Show skeleton loaders while fetching
  grid.innerHTML = Array(6).fill('').map(() => `
    <div class="testimonial-card">
      <div class="skeleton" style="height:1.5rem;width:40%;margin-bottom:0.8rem;"></div>
      <div class="skeleton" style="height:4rem;margin-bottom:1rem;"></div>
      <div class="skeleton" style="height:1rem;width:60%;"></div>
    </div>`).join('');

  try {
    /* Fetch the published Google Sheet as CSV */
    const res = await fetch(CONFIG.sheetCSVURL);
    if (!res.ok) throw new Error('Failed to fetch');

    const csv  = await res.text();
    const rows = parseCSV(csv);

    /* Expected columns: Name, Date, Testimonial, Photo_URL */
    /* Skip header row (index 0) */
    const testimonials = rows.slice(1).filter(r => r[0] && r[2]);

    if (!testimonials.length) {
      grid.innerHTML = '<p style="text-align:center;opacity:0.6;grid-column:1/-1;">No testimonials yet. Check back soon!</p>';
      return;
    }

    grid.innerHTML = testimonials.map((r, i) => {
      const [name, date, text, photo] = r;
      const initial = name.trim().charAt(0).toUpperCase();
      const avatarHTML = photo && photo.startsWith('http')
        ? `<img class="testimonial-card__photo" src="${photo}" alt="${name}" onerror="this.outerHTML='<div class=\\'testimonial-card__avatar-placeholder\\'>${initial}</div>'">`
        : `<div class="testimonial-card__avatar-placeholder">${initial}</div>`;

      return `
        <div class="testimonial-card fade-in" style="animation-delay:${i*0.07}s">
          <div class="testimonial-card__quote">"</div>
          <div class="testimonial-card__text">${text.trim()}</div>
          <div class="testimonial-card__footer">
            ${avatarHTML}
            <div>
              <div class="testimonial-card__name">${name.trim()}</div>
              <div class="testimonial-card__date">${date ? date.trim() : ''}</div>
            </div>
          </div>
        </div>`;
    }).join('');

    initFadeIn();
  } catch (err) {
    /* Friendly error with demo cards so the page still looks good */
    console.warn('Could not load from Google Sheets:', err.message);
    renderDemoTestimonials(grid);
  }
}

/* Demo testimonials shown if Sheets isn't configured yet */
function renderDemoTestimonials(grid) {
  const demos = [
    { name: "Favour M.", date: "August 2025", text: "Glory be to God for healing my 2 years daughter with dynance ROCENTA. The girl was suffering from piles and we have been to many hospitals and there was no improvement, today I am happy, she took 1 pack of ROCENTA and she is healed, no pain. "},
    { name: "Catherine I.", date: "February 2024", text: "In 2009,I was diagnosed with disbetes, I gained weight and felt tired most of the time. But after taking dynance ROCENTA once in the morning and at night for 1 week ,my blood sugar level started to improve,I felt a change, my headaches became less frequent and more tolerable." },
    { name: "Victo N.", date: "September 2025", text: "The relaxing effect on triple root coffee is amazing, I used to be tired weak in bed most of the times, but I started using dynance TRIPLE ROOT COFFEE after a friend of mine recommended it to me and I can testify of the results, it's wonderful." },
    { name: "Farai D.", date: "January 2026", text: "Dynance COLLAGENE transformed my skin. My skin texture is so smooth and always moist, I used to have a dry skin with wrinkles but now they are all gone. Worth every cent and I will never go back." },
    { name: "Rutendo P.", date: "January 2026", text: "Started sharing Dynance products with my family. My mother's blood sugar improved significantly after using the dynance ACE GUARD for 6 weeks." },
    { name: "Blessing T.", date: "December 2025", text: "Dynance COLLAGENE is now part of my daily routine. That instant freshness and glow is unmatched, a lot has changed and I am no longer shy of my skin like before. I've ordered three times already." },
  ];
  grid.innerHTML = demos.map((d, i) => `
    <div class="testimonial-card fade-in" style="animation-delay:${i*0.07}s">
      <div class="testimonial-card__quote">"</div>
      <div class="testimonial-card__text">${d.text}</div>
      <div class="testimonial-card__footer">
        <div class="testimonial-card__avatar-placeholder">${d.name.charAt(0)}</div>
        <div>
          <div class="testimonial-card__name">${d.name}</div>
          <div class="testimonial-card__date">${d.date}</div>
        </div>
      </div>
    </div>`).join('');
  initFadeIn();
}

/* Minimal CSV parser (handles quoted fields with commas) */
function parseCSV(str) {
  const rows = [];
  const lines = str.split('\n');
  lines.forEach(line => {
    const row = [];
    let inQ = false, cur = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { row.push(cur); cur = ''; continue; }
      cur += ch;
    }
    row.push(cur);
    if (row.some(c => c.trim())) rows.push(row);
  });
  return rows;
}

/* ── 6. CONTACT FORM via Formspree ───────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';

    try {
      const res = await fetch(CONFIG.formspreeURL, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.textContent = '✅ Message sent! We will get back to you shortly.';
        status.className = 'form-status ok';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.textContent = '❌ Could not send. Please contact us directly on WhatsApp.';
      status.className = 'form-status err';
    }

    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
}

/* ── 7. POPULATE dynamic content from CONFIG ─────────────── */
function populateConfig() {
  /* Replace placeholders on any page that has them */
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const key = el.dataset.cfg;
    if (CONFIG[key] !== undefined) el.textContent = CONFIG[key];
  });

  document.querySelectorAll('[data-cfg-href]').forEach(el => {
    const key = el.dataset.cfgHref;
    if (key === 'whatsapp') el.href = `https://wa.me/${CONFIG.whatsappNumber}`;
    else if (key === 'facebook') el.href = CONFIG.facebookURL;
    else if (key === 'email') el.href = `mailto:${CONFIG.email}`;
    else if (CONFIG[key]) el.href = CONFIG[key];
  });

  /* Inject map embed */
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame) mapFrame.src = CONFIG.mapEmbedSrc;
}

/* ── 8. LANDING PAGE orbit items with product images ─────── */
function populateOrbitImages() {
  const items = document.querySelectorAll('.orbit-item img');
  if (!items.length) return;
  items.forEach((img, i) => {
    const p = CONFIG.products[i % CONFIG.products.length];
    img.src = p.img;
    img.alt = p.name;
    img.onerror = function() { this.parentElement.innerHTML = `<span style="font-size:1.8rem;display:flex;align-items:center;justify-content:center;height:100%">${p.emoji}</span>`; };
  });
}

/* ── INIT on DOMContentLoaded ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFadeIn();
  populateConfig();
  renderProducts();      // only runs on products page (checks for #product-grid)
  initModal();           // only runs on products page
  loadTestimonials();    // only runs on manifesto page
  initContactForm();     // only runs on contact page
  populateOrbitImages(); // only runs on landing page
});
