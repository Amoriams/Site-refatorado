/**
 * CUNHA SOLUÇÕES - INTERAÇÕES & REGRAS DE NEGÓCIO
 * Frontend JavaScript puro, sem dependências externas pesadas.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpyAndAnchors();
  initFaqAccordion();
  initEstimateForm();
  initScrollAnimations();
  initPhoneMask();
  initServicePreselect();
});

/**
 * 1. NAVBAR - Efeito ao rolar a página
 */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. MENU MOBILE - Acessível e responsivo
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    }
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    if (backdrop) {
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/**
 * 3. SCROLL SUAVE E ÂNCORAS
 */
function initScrollSpyAndAnchors() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElem = document.querySelector(targetId);

      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Foco acessível no destino
        targetElem.setAttribute('tabindex', '-1');
        targetElem.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * 4. FAQ ACCORDION
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.accordion-trigger');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Opcional: fechar outros accordions para manter a interface limpa
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.setAttribute('data-open', 'false');
          const otherBtn = otherItem.querySelector('.accordion-trigger');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado atual
      if (isExpanded) {
        item.setAttribute('data-open', 'false');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.setAttribute('data-open', 'true');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 5. MÁSCARA INTELIGENTE DE TELEFONE / WHATSAPP
 */
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.substring(0, 11);

      if (val.length > 10) {
        // (11) 98765-4321
        e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
      } else if (val.length > 6) {
        // (11) 8765-4321
        e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 6)}-${val.substring(6)}`;
      } else if (val.length > 2) {
        e.target.value = `(${val.substring(0, 2)}) ${val.substring(2)}`;
      } else if (val.length > 0) {
        e.target.value = `(${val}`;
      }
    });
  });
}

/**
 * 6. PRÉ-SELEÇÃO DE SERVIÇO A PARTIR DOS CARDS
 */
function initServicePreselect() {
  const serviceCards = document.querySelectorAll('[data-select-service]');
  const serviceSelect = document.getElementById('orcamento-servico');
  const formSection = document.getElementById('orcamento');

  serviceCards.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-select-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
        // Rolar até o formulário
        if (formSection) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = formSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

          // Destaque visual temporário no campo
          serviceSelect.focus();
          serviceSelect.classList.add('ring-2', 'ring-primary');
          setTimeout(() => {
            serviceSelect.classList.remove('ring-2', 'ring-primary');
          }, 1800);
        }
      }
    });
  });
}

/**
 * 7. FORMULÁRIO DE ORÇAMENTO & GERAÇÃO DE MENSAGEM WHATSAPP
 * Número oficial: 5511974330973 (extraído de refatorar-informacoes.txt)
 */
function initEstimateForm() {
  const form = document.getElementById('form-orcamento');
  if (!form) return;

  const WHATSAPP_NUMBER = '5511974330973';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    const nome = document.getElementById('orcamento-nome')?.value.trim();
    const telefone = document.getElementById('orcamento-telefone')?.value.trim();
    const email = document.getElementById('orcamento-email')?.value.trim() || 'Não informado';
    const local = document.getElementById('orcamento-local')?.value.trim();
    const tipoImovel = document.getElementById('orcamento-imovel')?.value || 'Não especificado';
    const servico = document.getElementById('orcamento-servico')?.value || 'Elétrica em Geral';
    const urgencia = document.getElementById('orcamento-urgencia')?.value || 'Normal';
    const descricao = document.getElementById('orcamento-descricao')?.value.trim();

    const errorContainer = document.getElementById('form-error-msg');
    const successContainer = document.getElementById('form-success-msg');

    if (errorContainer) errorContainer.classList.add('hidden');
    if (successContainer) successContainer.classList.add('hidden');

    // Validações
    if (!nome) {
      showError('Por favor, informe seu nome completo.');
      document.getElementById('orcamento-nome')?.focus();
      return;
    }

    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showError('Por favor, informe um número de WhatsApp ou telefone válido com DDD.');
      document.getElementById('orcamento-telefone')?.focus();
      return;
    }

    if (!local) {
      showError('Por favor, informe sua cidade e bairro (ex: São Paulo - Jardim Marquesa).');
      document.getElementById('orcamento-local')?.focus();
      return;
    }

    if (!descricao) {
      showError('Por favor, descreva brevemente o que você precisa ou o problema observado.');
      document.getElementById('orcamento-descricao')?.focus();
      return;
    }

    // Montagem da mensagem estruturada
    let mensagem = `*SOLICITAÇÃO DE ORÇAMENTO — CUNHA SOLUÇÕES*\n\n`;
    mensagem += `Olá! Gostaria de solicitar um orçamento para serviço elétrico.\n\n`;
    mensagem += `👤 *Dados do Cliente*\n`;
    mensagem += `• *Nome:* ${nome}\n`;
    mensagem += `• *WhatsApp/Telefone:* ${telefone}\n`;
    if (email !== 'Não informado') {
      mensagem += `• *E-mail:* ${email}\n`;
    }
    mensagem += `\n📍 *Localização*\n`;
    mensagem += `• *Região:* ${local}\n`;
    mensagem += `• *Tipo de Imóvel:* ${tipoImovel}\n`;
    mensagem += `\n⚡ *Detalhes do Serviço*\n`;
    mensagem += `• *Serviço:* ${servico}\n`;
    mensagem += `• *Nível de Urgência:* ${urgencia}\n`;
    mensagem += `\n📝 *Descrição da Necessidade:*\n`;
    mensagem += `${descricao}\n\n`;
    mensagem += `_(Mensagem gerada via site cunhasolucoes.com.br)_`;

    // Codificação URL segura
    const encodedMessage = encodeURIComponent(mensagem);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

    // Exibir feedback positivo
    if (successContainer) {
      successContainer.classList.remove('hidden');
    }

    // Abrir WhatsApp em nova aba
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  });

  function showError(msg) {
    const errorContainer = document.getElementById('form-error-msg');
    if (errorContainer) {
      errorContainer.textContent = msg;
      errorContainer.classList.remove('hidden');
    } else {
      alert(msg);
    }
  }
}

/**
 * 8. REVEAL ANIMATIONS AO ROLAR (INTERSECTION OBSERVER)
 */
function initScrollAnimations() {
  // Se o usuário preferir menos movimento, ignorar
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-init').forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-init').forEach(elem => {
    observer.observe(elem);
  });
}
