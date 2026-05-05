// ============================================================
// CONFIGURAÇÃO
// ============================================================
const CAL_CONFIG = {
  eventTypeSlug: "lukas-farias-z6ztlv/corte-barbearia",

  barbeiroIds: {
    0: null,
    1: 1,
    2: 2,
  },

  servicoIds: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  },

  clienteId: 1,
};

// ============================================================
// ESTADO
// ============================================================
let state = {
  barbeiroSelecionado: 0,
  servicoSelecionado: null,
};

// ============================================================
// CAL.COM INLINE EMBED
// CSS customizado injetado via cssVarsPerTheme + styles
// para deixar o widget dark/laranja igual ao design da tela
// ============================================================

// CSS injetado dentro do iframe do Cal.com
const CAL_CUSTOM_CSS = `
  /* Fundo geral */
  body, [data-testid="booking-page-wrapper"], .dark {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
  }

  /* Container principal */
  .cal-embed {
    background: #1a1a1a !important;
  }

  /* Cabeçalho do mês */
  [data-testid="calendar-title"],
  h2, h3 {
    color: #ffffff !important;
  }

  /* Dias da semana (Dom, Seg...) */
  [data-testid="day-of-week"] {
    color: #666666 !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
  }

  /* Dias do calendário */
  [data-testid="day"] button {
    background: transparent !important;
    color: #cccccc !important;
    border-radius: 50% !important;
    transition: background 0.15s !important;
  }

  /* Dia disponível hover */
  [data-testid="day"] button:not(:disabled):hover {
    background: #2a2a2a !important;
    color: #ffffff !important;
  }

  /* Dia selecionado */
  [data-testid="day"] button[data-selected="true"],
  [data-testid="day"] button.bg-brand-default,
  [data-testid="day"] button[aria-pressed="true"] {
    background: #f5a623 !important;
    color: #111111 !important;
    font-weight: bold !important;
  }

  /* Dia desabilitado / passado */
  [data-testid="day"] button:disabled {
    color: #3a3a3a !important;
    cursor: not-allowed !important;
  }

  /* Botões de navegar mês (‹ ›) */
  [data-testid="decrementMonth"], [data-testid="incrementMonth"],
  button[aria-label*="previous"], button[aria-label*="next"],
  button[aria-label*="anterior"], button[aria-label*="próximo"] {
    background: transparent !important;
    border: 1px solid #333333 !important;
    color: #cccccc !important;
    border-radius: 6px !important;
  }
  [data-testid="decrementMonth"]:hover, [data-testid="incrementMonth"]:hover {
    border-color: #555555 !important;
    color: #ffffff !important;
  }

  /* Horários disponíveis */
  [data-testid="time"] button,
  [data-testid="time-option"],
  button[data-testid*="time"] {
    background: #222222 !important;
    border: 1px solid #2e2e2e !important;
    color: #cccccc !important;
    border-radius: 6px !important;
    transition: all 0.15s !important;
  }
  [data-testid="time"] button:hover,
  [data-testid="time-option"]:hover {
    background: #2a2a2a !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  [data-testid="time"] button[data-selected="true"],
  [data-testid="time-option"][aria-pressed="true"] {
    background: #f5a623 !important;
    border-color: #f5a623 !important;
    color: #111111 !important;
    font-weight: bold !important;
  }

  /* Botão confirmar / "Book" do Cal.com */
  [data-testid="confirm-book-button"],
  button[type="submit"],
  .bg-brand-default {
    background: #f5a623 !important;
    color: #111111 !important;
    font-weight: bold !important;
    border: none !important;
    border-radius: 10px !important;
  }
  [data-testid="confirm-book-button"]:hover,
  button[type="submit"]:hover {
    background: #e09510 !important;
  }

  /* Inputs de texto do formulário de booking */
  input[type="text"], input[type="email"], input[type="tel"], textarea {
    background: #111111 !important;
    border: 1px solid #2a2a2a !important;
    color: #cccccc !important;
    border-radius: 8px !important;
  }
  input:focus, textarea:focus {
    border-color: #f5a623 !important;
    outline: none !important;
  }

  /* Labels */
  label {
    color: #aaaaaa !important;
    font-size: 13px !important;
  }

  /* Separadores e bordas */
  hr, [class*="border"] {
    border-color: #2a2a2a !important;
  }

  /* Links */
  a {
    color: #f5a623 !important;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1a1a1a; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
`;

// ============================================================
// MONTA O EMBED DO CAL.COM
// ============================================================
function montarCalEmbed() {
  const barbeiroId = CAL_CONFIG.barbeiroIds[state.barbeiroSelecionado];
  const servicoId  = CAL_CONFIG.servicoIds[state.servicoSelecionado] ?? "";
  const clienteId  = CAL_CONFIG.clienteId;
  const obs        = document.querySelector(".obs-textarea")?.value ?? "";

  // Monta hidden fields que serão enviados no webhook
  const hiddenFields = {
    ...(clienteId  ? { clienteId: String(clienteId) }   : {}),
    ...(barbeiroId ? { barbeiroId: String(barbeiroId) } : {}),
    ...(servicoId  ? { servicoId: String(servicoId) }   : {}),
    ...(obs        ? { observacoes: obs }                : {}),
  };

  // Remove embed anterior se houver
  const container = document.getElementById("cal-embed-container");
  container.innerHTML = "";

  // Cria o elemento que o Cal.com vai usar como host do inline embed
  const embedDiv = document.createElement("div");
  embedDiv.id = "cal-inline";
  embedDiv.style.width = "100%";
  embedDiv.style.height = "100%";
  embedDiv.style.minHeight = "480px";
  container.appendChild(embedDiv);

  // Inicializa o embed inline via SDK
  Cal("inline", {
    elementOrSelector: "#cal-inline",
    calLink: CAL_CONFIG.eventTypeSlug,
    config: {
      theme: "dark",
      hideEventTypeDetails: true,
      layout: "month_view",
      ...hiddenFields,
    },
    // Injeta CSS customizado no iframe
    cssVarsPerTheme: {
      dark: {
        "cal-brand":         "#f5a623",
        "cal-brand-emphasis": "#e09510",
        "cal-brand-text":    "#111111",
        "cal-bg":            "#1a1a1a",
        "cal-bg-emphasis":   "#222222",
        "cal-bg-muted":      "#111111",
        "cal-border":        "#2a2a2a",
        "cal-border-emphasis": "#444444",
        "cal-border-default": "#333333",
        "cal-text":          "#ffffff",
        "cal-text-emphasis": "#ffffff",
        "cal-text-subtle":   "#888888",
        "cal-text-muted":    "#555555",
      }
    },
  });

  // Injeta CSS extra via evento de carregamento do iframe
  // (necessário para elementos que o Cal.com não expõe via CSS vars)
  Cal("on", {
    action: "linkReady",
    callback: () => {
      try {
        const iframe = document.querySelector("#cal-inline iframe");
        if (!iframe) return;

        // Tenta injetar estilo diretamente (funciona se same-origin)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const style = iframeDoc.createElement("style");
          style.textContent = CAL_CUSTOM_CSS;
          iframeDoc.head?.appendChild(style);
        }
      } catch (_) {
        // Cross-origin: o Cal.com bloqueia acesso direto ao iframe doc.
        // As cssVarsPerTheme já cobrem a maior parte do estilo.
      }
    }
  });
}

// ============================================================
// SELEÇÃO BARBEIRO
// ============================================================
document.querySelectorAll("input[name='barbeiro']").forEach(radio => {
  radio.addEventListener("change", () => {
    state.barbeiroSelecionado = parseInt(radio.value);
    montarCalEmbed();
  });
});

// ============================================================
// SELEÇÃO SERVIÇO
// ============================================================
document.querySelectorAll("input[name='servico']").forEach(radio => {
  radio.addEventListener("change", () => {
    state.servicoSelecionado = parseInt(radio.value);
    montarCalEmbed();
  });
});

// ============================================================
// INIT — monta o embed ao carregar a página
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Aguarda o SDK do Cal.com carregar antes de chamar inline
  const waitForCal = setInterval(() => {
    if (window.Cal && typeof Cal === "function") {
      clearInterval(waitForCal);
      montarCalEmbed();
    }
  }, 100);
});