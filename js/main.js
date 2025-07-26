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
      initTimeline();
      requestAnimationFrame(() => {
        initMarketShareChart();
      });
      requestAnimationFrame(() => {
        conteudo.scrollIntoView({ behavior: "smooth", block: "start" });
      });
       requestAnimationFrame(() => {
         initCopyButtons();
      });
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

// O script é executado após o HTML ser completamente analisado,
// garantindo que todos os elementos (`#timeline-container`, etc.) já existem.
function initTimeline() {
  const timelineContainer = document.getElementById("timeline-container");
  if (!timelineContainer) return;

  const timelineData = [
    {
      year: "2003-2005",
      title: "A Fundação",
      content:
        "<strong>2003:</strong> Android Inc. é fundada por Andy Rubin e equipa, com a visão de criar sistemas operativos mais inteligentes para dispositivos móveis, inicialmente focados em câmaras digitais.<br><br><strong>2005:</strong> Google adquire a Android Inc. e a equipa continua o desenvolvimento sob a nova alçada, mudando o foco para smartphones.",
    },
    {
      year: "2007-2008",
      title: "Aliança e Lançamento",
      content:
        "<strong>2007:</strong> É anunciada a Open Handset Alliance (OHA), um consórcio de empresas de tecnologia dedicadas a desenvolver padrões abertos para mobilidade.<br><br><strong>2008:</strong> Lançamento do <strong>HTC Dream (T-Mobile G1)</strong>, o primeiro smartphone comercial a correr Android, marcando o início de uma nova era.",
    },
    {
      year: "2009-2010",
      title: 'Os Primeiros "Doces"',
      content:
        "<strong>1.5 Cupcake (2009):</strong> Revolucionou a interação com a introdução do teclado virtual na tela e suporte para widgets.<br><strong>2.2 Froyo (2010):</strong> Trouxe melhorias de performance significativas e funcionalidades como o hotspot Wi-Fi portátil.",
    },
    {
      year: "2011-2013",
      title: "Consolidação e Design",
      content:
        '<strong>4.0 Ice Cream Sandwich (2011):</strong> Unificou a experiência de UI entre telemóveis e tablets com a introdução do design "Holo".<br><strong>4.1 Jelly Bean (2012):</strong> Focou-se na fluidez e performance da interface com o "Project Butter" e introduziu o Google Now.',
    },
    {
      year: "2014-Hoje",
      title: "Maturidade e Inteligência",
      content:
        "<strong>5.0 Lollipop (2014):</strong> Introduziu o <strong>Material Design</strong>, uma linguagem visual que redefiniu a aparência do Android.<br><strong>9 Pie (2018):</strong> Incorporou inteligência artificial para otimizar a bateria e o brilho do ecrã, e introduziu a navegação por gestos.<br><strong>Hoje:</strong> O Android continua a evoluir com foco em IA, privacidade e suporte para novos formatos de dispositivos, como os dobráveis.",
    },
  ];

  const detailsTitle = document.getElementById("details-title");
  const detailsYear = document.getElementById("details-year");
  const detailsContent = document.getElementById("details-content");
  let timelineItems = [];

  timelineContainer.innerHTML = "";

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

function initMarketShareChart() {
  const ctx = document.getElementById("marketShareChart");
  if (!ctx) return;

  new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Android", "iOS", "Outros"],
      datasets: [
        {
          label: "Market Share Global (%)",
          data: [74, 25, 1],
          backgroundColor: ["#34d399", "#60a5fa", "#94a3b8"],
          borderColor: ["#059669", "#2563eb", "#475569"],
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

function initCopyButtons() {
  document.querySelectorAll(".code-block-wrapper").forEach((wrapper) => {
    if (wrapper.querySelector(".copy-button")) return; // evita duplicar

    const codeBlock = wrapper.querySelector("pre");
    if (codeBlock) {
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copiar";
      copyButton.className = "copy-button";

      copyButton.addEventListener("click", () => {
        const codeToCopy = codeBlock.innerText;
        navigator.clipboard
          .writeText(codeToCopy)
          .then(() => {
            copyButton.textContent = "Copiado!";
            setTimeout(() => (copyButton.textContent = "Copiar"), 2000);
          })
          .catch((err) => {
            console.error("Erro ao copiar código:", err);
            copyButton.textContent = "Erro!";
          });
      });

      wrapper.appendChild(copyButton);
    }
  });
}

// Quando o DOM estiver pronto, carrega as aulas
document.addEventListener("DOMContentLoaded", () => {
  loadAulas();
});
