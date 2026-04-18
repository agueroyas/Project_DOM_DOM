let allStartups = [];
let filteredData = [];
let visibleCount = 4;

const grid = document.querySelector(".ex-cards-grid");
const searchInput = document.querySelector(".ex-search-input");
const loadBtn = document.querySelector(".ex-btn-load");

function buildLogo(logo) {
  if (logo.type === "image") {
    const padClass = logo.padded ? " ex-card__logo--pad" : "";
    const blendStyle = logo.mixBlend
      ? ' style="mix-blend-mode: multiply;"'
      : "";

    return `
      <div class="ex-card__logo${padClass}">
        <img src="${logo.src}" alt="${logo.alt}"${blendStyle} />
      </div>`;
  }

  return `
    <div class="ex-card__logo">
      <span class="material-symbols-outlined"
        style="font-size:1.875rem; color:var(--color-primary);">
        ${logo.icon}
      </span>
    </div>`;
}

function buildCard(startup) {
  const highlightClass = startup.highlight ? " ex-card--highlight" : "";

  return `
    <article class="ex-card${highlightClass}">
      <div>
        <div class="ex-card__top">
          ${buildLogo(startup.logo)}
          <span class="ex-badge ex-badge--${startup.badge.variant}">
            ${startup.badge.text}
          </span>
        </div>

        <span class="ex-card__eyebrow">${startup.sector}</span>
        <h3 class="ex-card__title">${startup.name}</h3>
        <p class="ex-card__desc">${startup.description}</p>
      </div>

      <div class="ex-card__footer">
        <div>
          <span class="ex-card__meta-label">Target / Stage</span>
          <div class="ex-card__meta-values">
            <span class="ex-card__amount">${startup.target}</span>
            <span class="ex-card__dot"></span>
            <span class="ex-card__stage">${startup.stage}</span>
          </div>
        </div>

        <button class="ex-btn-review" data-id="${startup.id}">
          Review Deal
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </article>`;
}

function renderCards() {
  if (!grid) return;

  const visibleItems = filteredData.slice(0, visibleCount);
  grid.innerHTML = visibleItems.map(buildCard).join("");

  updateButton();
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    filteredData = allStartups.filter((item) =>
      item.name.toLowerCase().includes(value) ||
      item.sector.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value) ||
      item.stage.toLowerCase().includes(value)
    );

    visibleCount = 4;
    renderCards();
  });
}

if (loadBtn) {
  loadBtn.addEventListener("click", () => {
    if (visibleCount >= filteredData.length) {
      visibleCount -= 2; 
    } else {
      visibleCount += 2;
    }

    renderCards();
  });
}

function updateButton() {
  if (!loadBtn) return;

  if (filteredData.length <= 4) {
    loadBtn.style.display = "none";
    return;
  }

  loadBtn.style.display = "inline-block";

  if (visibleCount >= filteredData.length) {
    loadBtn.textContent = "Show Less";
  } else {
    loadBtn.textContent = "Load More Opportunities";
  }
}

function renderSkeleton(count = 4) {
  if (!grid) return;

  const skeleton = `
    <article class="ex-card ex-card--skeleton">
      <div>
        <div class="ex-card__top">
          <div class="ex-skeleton ex-skeleton--logo"></div>
          <div class="ex-skeleton ex-skeleton--badge"></div>
        </div>
        <div class="ex-skeleton ex-skeleton--title"></div>
        <div class="ex-skeleton ex-skeleton--desc"></div>
      </div>
    </article>`;

  grid.innerHTML = Array(count).fill(skeleton).join("");
}

function renderError(msg) {
  if (!grid) return;

  grid.innerHTML = `
    <div class="text-center w-100 py-5">
      <span class="material-symbols-outlined" style="font-size:40px;">error</span>
      <p>${msg}</p>
      <button onclick="loadStartups()" class="btn btn-primary">Retry</button>
    </div>`;
}
async function loadStartups() {
  renderSkeleton(4);

  try {
    const res = await fetch("../../data/startup.data.json");

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();

    allStartups = data;
    filteredData = [...data];

    renderCards();

  } catch (err) {
    console.error(err);
    renderError("Failed to load startups");
  }
}

document.addEventListener("DOMContentLoaded", loadStartups);