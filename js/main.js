// Carrega lista de aulas e gera sidebar/cards
async function loadAulas() {
  try {
    const res = await fetch("aulas/aulas.json");
    const aulas = await res.json();

    const sidebar = document.getElementById("sidebar-links");
    const cards = document.getElementById("cards-container");

    aulas.forEach((aula) => {
      // Sidebar
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" class="block font-bold ${
        aula.ativo ? "hover:text-indigo-400" : "nav-link-disabled"
      } transition-colors" ${
        aula.ativo ? `onclick="loadAula('aulas/${aula.arquivo}')"` : ""
      }>${aula.titulo}</a>`;
      sidebar.appendChild(li);

      // Cards
      const card = document.createElement("a");
      card.className = `block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all ${
        !aula.ativo ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`;
      if (aula.ativo)
        card.setAttribute("onclick", `loadAula('aulas/${aula.arquivo}')`);
      card.innerHTML = `<h3 class="font-bold text-xl text-indigo-600 mb-2">${
        aula.titulo.split(":")[0]
      }</h3><p>${aula.descricao}</p>`;
      cards.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar aulas.json:", err);
  }
}

// Carrega o HTML de uma aula
function loadAula(file) {
  fetch(file)
    .then((r) => r.text())
    .then((html) => {
      const conteudo = document.getElementById("conteudo");
      conteudo.innerHTML = html;
      initAccordions();
      initCopyButtons();
      initTimeline();
      initMarketShareChart();
      window.scrollTo({ top: conteudo.offsetTop - 20, behavior: "smooth" });
    })
    .catch((err) => console.error("Erro ao carregar aula:", err));
}

// Inicializa acordeões
function initAccordions() {
  const accordions = document.querySelectorAll(".accordion-toggle");
  accordions.forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", !isExpanded);
      button.querySelector("span:last-child").style.transform = isExpanded
        ? "rotate(180deg)"
        : "rotate(0deg)";
      content.style.maxHeight = isExpanded
        ? "0px"
        : content.scrollHeight + "px";
    });
  });
}

// Inicializa a timeline da Aula 1
function initTimeline() {
  const timelineContainer = document.getElementById("timeline-container");
  if (!timelineContainer) return; // Só executa se o elemento existir

  const timelineData = [
    {
      year: "2003-2005",
      title: "A Fundação",
      content:
        "<strong>2003:</strong> Android Inc. é fundada por Andy Rubin, Rich Miner, Nick Sears e Chris White, com foco inicial em sistemas para câmaras digitais.<br><br><strong>2005:</strong> Google adquire a Android Inc. por cerca de $50 milhões, mudando o foco para um sistema operativo móvel baseado no kernel Linux para competir com Symbian e Windows Mobile.",
    },
    {
      year: "2007-2008",
      title: "OHA e o Primeiro Smartphone",
      content:
        "<strong>2007:</strong> Google forma a Open Handset Alliance (OHA), um consórcio de empresas para desenvolver padrões abertos para dispositivos móveis.<br><br><strong>2008:</strong> Lançamento do <strong>HTC Dream (T-Mobile G1)</strong>, o primeiro smartphone Android comercial, com teclado QWERTY e integração com serviços Google. Nasce o Android Market.",
    },
    {
      year: "2009-2010",
      title: "A Era da Fundação",
      content:
        "<strong>1.5 Cupcake (2009):</strong> Teclado virtual e widgets.<br><strong>1.6 Donut (2009):</strong> Suporte a múltiplas resoluções de tela.<br><strong>2.0 Eclair (2009):</strong> Google Maps Navigation.<br><strong>2.2 Froyo (2010):</strong> Hotspot Wi-Fi e melhorias de performance (JIT).<br><strong>2.3 Gingerbread (2010):</strong> Suporte a NFC e redesenho da UI.",
    },
    {
      year: "2011-2013",
      title: "A Era da Consolidação",
      content:
        '<strong>3.0 Honeycomb (2011):</strong> Interface otimizada para tablets.<br><strong>4.0 Ice Cream Sandwich (2011):</strong> Unificação da UI para celulares e tablets (Holo UI).<br><strong>4.1 Jelly Bean (2012):</strong> Project Butter (UI fluida) e Google Now.<br><strong>4.4 KitKat (2013):</strong> Otimização para dispositivos com pouca RAM e comando "Ok Google".',
    },
    {
      year: "2014-2017",
      title: "Material Design e Maturidade",
      content:
        "<strong>5.0 Lollipop (2014):</strong> Introdução do <strong>Material Design</strong> e Android Runtime (ART).<br><strong>6.0 Marshmallow (2015):</strong> Permissões granulares em tempo de execução e modo Doze.<br><strong>7.0 Nougat (2016):</strong> Modo multi-janela e Google Assistant.<br><strong>8.0 Oreo (2017):</strong> Project Treble (atualizações mais rápidas) e modo Picture-in-Picture (PiP).",
    },
    {
      year: "2018-Hoje",
      title: "A Era da IA e Privacidade",
      content:
        "<strong>9 Pie (2018):</strong> Navegação por gestos e Bem-estar Digital.<br><strong>10 (2019):</strong> Tema escuro e controlos de privacidade aprimorados.<br><strong>11 (2020):</strong> Bolhas de conversa e permissões de uso único.<br><strong>12 (2021):</strong> <strong>Material You</strong>, a maior mudança de design desde o Lollipop.<br><strong>13+ :</strong> Foco contínuo em IA, segurança e suporte a novos formatos de dispositivos.",
    },
  ];

  const detailsTitle = document.getElementById("details-title");
  const detailsYear = document.getElementById("details-year");
  const detailsContent = document.getElementById("details-content");
  let timelineItems = [];

  timelineContainer.innerHTML = ""; // Limpa o container antes de adicionar

  timelineData.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "timeline-item relative cursor-pointer";
    div.dataset.index = index;
    const h4 = document.createElement("h4");
    h4.className = "font-bold text-lg";
    h4.textContent = item.title;
    const p = document.createElement("p");
    p.className = "text-sm text-slate-500";
    p.textContent = item.year;
    div.appendChild(h4);
    div.appendChild(p);
    timelineContainer.appendChild(div);
    timelineItems.push(div);
  });

  function updateDetails(index) {
    const item = timelineData[index];
    detailsTitle.textContent = item.title;
    detailsYear.textContent = item.year;
    detailsContent.innerHTML = item.content;
    timelineItems.forEach((el, i) => {
      el.classList.toggle("active", i == index);
      el.querySelector("h4").classList.toggle("text-amber-600", i == index);
    });
  }

  timelineContainer.addEventListener("click", (e) => {
    const item = e.target.closest(".timeline-item");
    if (item) {
      updateDetails(item.dataset.index);
    }
  });

  if (timelineItems.length > 0) {
    updateDetails(0);
  }
}

// Inicializa o gráfico de pizza da Aula 1
function initMarketShareChart() {
  const ctx = document.getElementById("marketShareChart");
  if (!ctx) return; // Só executa se o elemento existir

  new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Android", "iOS", "Outros"],
      datasets: [
        {
          label: "Market Share Global (%)",
          data: [70, 29, 1],
          backgroundColor: [
            "rgba(34, 197, 94, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(203, 213, 225, 0.7)",
          ],
          borderColor: [
            "rgb(22, 163, 74)",
            "rgb(37, 99, 235)",
            "rgb(156, 163, 175)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (value) => value + "%" },
        },
      },
    },
  });
}

// Quando o DOM estiver pronto, carrega as aulas
document.addEventListener("DOMContentLoaded", () => {
  loadAulas();
});
