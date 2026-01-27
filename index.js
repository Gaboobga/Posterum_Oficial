// ======= CONFIG =======
// Cambia el número y el mensaje a lo que uses con tu bot
const WHATSAPP_PHONE = "529932855942"; // EJ: 5212221234567 (52 + lada + número)
const WHATSAPP_MESSAGE =
  "Hola! Quiero probar la demo ¿Me guías para empezar?";

// Construye URL wa.me
const WA_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// ======= Helpers =======
function setYear() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function bindWhatsAppLinks() {
  const links = document.querySelectorAll("[data-wa]");
  links.forEach((a) => {
    a.setAttribute("href", WA_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
}

// ======= Testimonials carousel (simple) =======
const testimonials = [
  {
    quote:
      "“Desde que implementamos Posterum, nuestro tiempo de respuesta pasó de horas a segundos. Los clientes están más satisfechos y las conversiones aumentaron un 40%.”",
    initials: "MG",
    name: "María García",
    role: "CEO, TechStart",
  },
  {
    quote:
      "“La automatización de WhatsApp nos permite atender a cientos de clientes simultáneamente. Es como tener un equipo de ventas que nunca duerme.”",
    initials: "CR",
    name: "Carlos Rodríguez",
    role: "Director de Ventas, InnovaShop",
  },
  {
    quote:
      "“Ahora el equipo se enfoca en cerrar ventas, no en contestar lo mismo 100 veces. El historial queda ordenado y el seguimiento es automático.”",
    initials: "LP",
    name: "Laura Pérez",
    role: "Operaciones, RealEstate Hub",
  },
  {
    quote:
      "“Lo mejor es que el lead llega ‘caliente’: ya filtrado, con datos y con intención real. Es un cambio total en el embudo.”",
    initials: "JM",
    name: "Javier Martínez",
    role: "Founder, AutoDeals",
  },
];

let cursor = 0;

function renderTestimonial(cardEl, data) {
  cardEl.innerHTML = `
    <div class="testimonial-card__quote">${data.quote}</div>
    <div class="testimonial-card__person">
      <div class="avatar" aria-hidden="true">${data.initials}</div>
      <div>
        <p class="person__name">${data.name}</p>
        <p class="person__role">${data.role}</p>
      </div>
    </div>
  `;
}

function mountTestimonials() {
  const viewport = document.querySelector(".testimonials__viewport");
  const track = document.querySelector(".testimonials__track");
  if (!viewport || !track) return;

  // Obtener las tarjetas existentes
  let cards = Array.from(track.querySelectorAll("[data-testimonial]"));
  
  // Crear tarjetas duplicadas para carrusel infinito
  // Necesitamos al menos 2 veces el número de testimonios para que funcione suavemente
  const totalCardsNeeded = testimonials.length * 2;
  while (cards.length < totalCardsNeeded) {
    const newCard = document.createElement("article");
    newCard.className = "testimonial-card";
    newCard.setAttribute("data-testimonial", "");
    track.appendChild(newCard);
    cards.push(newCard);
  }
  
  // Obtener el gap actual según el breakpoint
  const getGap = () => {
    if (window.innerWidth <= 544) return 14;
    if (window.innerWidth <= 768) return 16;
    return 18;
  };

  // Calcular el ancho de cada tarjeta incluyendo gap
  const getCardWidth = () => {
    if (cards.length === 0) return 0;
    const viewportWidth = viewport.offsetWidth;
    const gap = getGap();
    const cardsPerView = window.innerWidth <= 768 ? 1 : 2;
    const cardWidth = (viewportWidth - gap * (cardsPerView - 1)) / cardsPerView;
    return cardWidth + gap;
  };

  // Actualizar contenido de todas las tarjetas
  const updateContent = () => {
    cards.forEach((card, idx) => {
      const item = testimonials[idx % testimonials.length];
      renderTestimonial(card, item);
    });
  };

  const updatePosition = () => {
    const cardWidth = getCardWidth();
    // Usar módulo para crear bucle infinito
    const normalizedCursor = cursor % testimonials.length;
    const translateX = -(normalizedCursor * cardWidth);
    track.style.transform = `translateX(${translateX}px)`;
  };

  // Inicializar
  updateContent();
  updatePosition();

  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      cursor = (cursor - 1 + testimonials.length) % testimonials.length;
      updatePosition();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      cursor = (cursor + 1) % testimonials.length;
      updatePosition();
    });
  }

  // Actualizar posición en resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updatePosition();
    }, 150);
  });
}

// ======= Mobile menu =======
function mobileMenu() {
  const burger = document.querySelector(".header__burger");
  const mobile = document.querySelector("[data-mobile]");
  if (!burger || !mobile) return;

  const closeEls = mobile.querySelectorAll("[data-close]");

  const open = () => {
    mobile.hidden = false;
    burger.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    mobile.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    if (expanded) close();
    else open();
  });

  closeEls.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// ======= Init =======
setYear();
bindWhatsAppLinks();
mountTestimonials();
mobileMenu();
