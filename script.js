const people = ["Antón", "Rubas", "BuguiO", "Blete", "Marco", "Vilariño", "Iria"];
const personImages = {
  "Antón": "img/toni.jpeg",
  "Rubas": "img/rubas.jpeg",
  "BuguiO": "img/bugui.jpeg",
  "Blete": "img/blete.jpeg",
  "Marco": "img/marco.jpeg",
  "Vilariño": "img/vilarinho.jpeg",
  "Iria": "img/iria.jpeg"
};

const cardsContainer = document.getElementById("cards");
let data = JSON.parse(localStorage.getItem("drinkData")) || {};

function saveData() {
  localStorage.setItem("drinkData", JSON.stringify(data));
}

function renderCards() {
  cardsContainer.innerHTML = "";
  people.forEach(person => {
    const card = document.createElement("div");
    card.className = "card";
    const imageUrl = personImages[person] || `https://via.placeholder.com/300x200?text=${person}`;
    card.style.backgroundImage = `url('${imageUrl}')`;
    card.innerHTML = `<h2>${person}</h2>`;

    const drinks = data[person] || {};
    for (const [drink, count] of Object.entries(drinks)) {
      const entry = document.createElement("div");
      entry.className = "drink-entry";
      entry.innerHTML = `
        <button onclick="updateDrink('${person}', '${drink}', -1)">-</button>
        <span>${drink}: ${count}</span>
        <button onclick="updateDrink('${person}', '${drink}', 1)">+</button>
      `;
      card.appendChild(entry);
    }

    cardsContainer.appendChild(card);
  });
}

function updateDrink(person, drink, change) {
  if (!data[person]) data[person] = {};
  if (!data[person][drink]) data[person][drink] = 0;
  data[person][drink] += change;
  if (data[person][drink] <= 0) delete data[person][drink];
  saveData();
  renderCards();
}

document.getElementById("drink-form").addEventListener("submit", e => {
  e.preventDefault();
  const drink = document.getElementById("drink").value;
  const person = document.getElementById("person").value;
  updateDrink(person, drink, 1);
});

function resetData() {
  if (confirm("¿Estás seguro de que quieres borrar todo el progreso?")) {
    data = {};
    saveData();
    renderCards();
  }
}

renderCards();
