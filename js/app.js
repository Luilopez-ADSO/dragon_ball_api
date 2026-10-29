// Esta versión no utiliza Node.js ni backend propio.
// El navegador consulta directamente la API pública de Dragon Ball.
const API_BASE = "https://dragonball-api.com/api";

const grid = document.querySelector("#characters-grid");
const message = document.querySelector("#message");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const showAllButton = document.querySelector("#show-all");
const resultsTitle = document.querySelector("#results-title");
const resultsDescription = document.querySelector("#results-description");
const resultCount = document.querySelector("#result-count");
const previousButton = document.querySelector("#previous-page");
const nextButton = document.querySelector("#next-page");
const pageIndicator = document.querySelector("#page-indicator");
const dialog = document.querySelector("#character-dialog");
const detailContainer = document.querySelector("#character-detail");
const closeDialogButton = document.querySelector("#close-dialog");

let currentPage = 1;
let totalPages = 1;
let currentSearch = "";

function safeText(value, fallback = "No disponible") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function getList(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.characters)) return payload.characters;
  if (Array.isArray(payload?.data)) return payload.data;
  return Array.isArray(payload) ? payload : [];
}

function updatePagination(meta = {}) {
  totalPages = Number(meta.totalPages || meta.total_pages || 1);
  currentPage = Number(meta.currentPage || meta.current_page || meta.page || currentPage);
  pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
  previousButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages || Boolean(currentSearch);
}

async function requestJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`La API respondió con estado ${response.status}`);
  return response.json();
}

function showMessage(text, isError = false) {
  message.hidden = false;
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function renderCharacters(characters) {
  grid.replaceChildren();

  if (!characters.length) {
    showMessage("No se encontraron personajes. Prueba con otro nombre.");
    resultCount.textContent = "0 resultados";
    return;
  }

  message.hidden = true;
  resultCount.textContent = `${characters.length} personaje(s)`;
  const fragment = document.createDocumentFragment();

  characters.forEach((character) => {
    const card = document.createElement("article");
    card.className = "character-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "card-image";
    const image = document.createElement("img");
    image.src = character.image || "";
    image.alt = `Imagen de ${safeText(character.name, "personaje")}`;
    image.loading = "lazy";
    image.onerror = () => { image.style.display = "none"; };
    imageWrap.append(image);

    const content = document.createElement("div");
    content.className = "card-content";
    const id = document.createElement("span");
    id.className = "character-id";
    id.textContent = `PERSONAJE #${safeText(character.id, "?")}`;

    const name = document.createElement("h3");
    name.textContent = safeText(character.name, "Personaje sin nombre");

    const tags = document.createElement("div");
    tags.className = "tags";
    const race = document.createElement("span");
    race.className = "tag";
    race.textContent = safeText(character.race, "Raza desconocida");
    const affiliation = document.createElement("span");
    affiliation.className = "tag neutral";
    affiliation.textContent = safeText(character.affiliation, "Sin afiliación");

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-button";
    detailsButton.type = "button";
    detailsButton.textContent = "Ver detalles";
    detailsButton.addEventListener("click", () => loadCharacterDetails(character.id));

    tags.append(race, affiliation);
    content.append(id, name, tags, detailsButton);
    card.append(imageWrap, content);
    fragment.append(card);
  });

  grid.append(fragment);
}

async function loadCharacters(page = 1, name = "") {
  currentPage = page;
  currentSearch = name;
  grid.replaceChildren();
  showMessage("Consultando la API de Dragon Ball...");
  resultsTitle.textContent = name ? `Resultados para "${name}"` : "Personajes";
  resultsDescription.textContent = name
    ? "Personajes relacionados con tu búsqueda."
    : "Datos consultados directamente desde Dragon Ball API.";

  const params = new URLSearchParams({ page: String(page), limit: "12" });
  if (name) params.set("name", name);

  try {
    const payload = await requestJson(`${API_BASE}/characters?${params.toString()}`);
    renderCharacters(getList(payload));
    updatePagination(payload.meta || payload.pagination || {});
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    showMessage("No se pudieron cargar los personajes. Comprueba tu conexión o revisa la documentación de la API.", true);
    resultCount.textContent = "";
  }
}

async function loadCharacterDetails(id) {
  if (!id) return;
  detailContainer.textContent = "Cargando información...";
  dialog.showModal();

  try {
    const payload = await requestJson(`${API_BASE}/characters/${encodeURIComponent(id)}`);
    const character = payload.item || payload.character || payload.data || payload;
    detailContainer.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = safeText(character.name, "Detalle del personaje");

    const imageWrap = document.createElement("div");
    imageWrap.className = "detail-image";
    const image = document.createElement("img");
    image.src = character.image || "";
    image.alt = `Imagen de ${safeText(character.name, "personaje")}`;
    image.onerror = () => { image.style.display = "none"; };
    imageWrap.append(image);

    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = safeText(character.description, "La API no ofrece una descripción para este personaje.");

    const list = document.createElement("div");
    list.className = "detail-list";
    const fields = [
      ["Raza", character.race],
      ["Género", character.gender],
      ["Afiliación", character.affiliation],
      ["Ki", character.ki],
      ["Ki máximo", character.maxKi],
      ["Planeta de origen", character.originPlanet?.name || character.originPlanet || character.origin_planet?.name]
    ];

    fields.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "detail-item";
      const small = document.createElement("small");
      small.textContent = label;
      const strong = document.createElement("strong");
      strong.textContent = safeText(value);
      item.append(small, strong);
      list.append(item);
    });

    detailContainer.append(title, imageWrap, description, list);
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
    detailContainer.textContent = "No se pudo cargar el detalle. Intenta nuevamente.";
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadCharacters(1, searchInput.value.trim());
});

showAllButton.addEventListener("click", () => {
  searchInput.value = "";
  loadCharacters(1, "");
});

previousButton.addEventListener("click", () => {
  if (currentPage > 1) loadCharacters(currentPage - 1, currentSearch);
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages && !currentSearch) loadCharacters(currentPage + 1, "");
});

closeDialogButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

loadCharacters();
