// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCICMt3f3B-mqQ7kBBS6VmQHfp13L-hGaI",
  authDomain: "chuzas-aece8.firebaseapp.com",
  projectId: "chuzas-aece8",
  storageBucket: "chuzas-aece8.firebasestorage.app",
  messagingSenderId: "717958317946",
  appId: "1:717958317946:web:8678fc258cd672f9ec38c3",
  measurementId: "G-1S2BW5J8D8"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const recuentoRef = doc(db, "bebidas", "recuento");

// Datos
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
let data = {};

// 🔄 Escuchar en tiempo real los cambios en Firestore
onSnapshot(recuentoRef, (docSnap) => {
  if (docSnap.exists()) {
    data = docSnap.data();
    renderCards();
  } else {
    data = {};
    renderCards();
  }
});

// 💾 Guardar datos en Firestore
async function saveData() {
  await setDoc(recuentoRef, data);
}

// 🧱 Renderizar tarjetas
function renderCards() {
  cardsContainer.innerHTML = "";
  people.forEach(person => {
    const card = document.createElement("div");
    card.className = "card";
    const imageUrl = personImages[person] || `https://via.placeholder.com/300x200?text=${person}`;
    card.style.backgroundImage = `url('${imageUrl}')`;
    card.innerHTML = `<h2>${person}</h2>`;

    const drinks = data[person] || {};
    const hasDrinks = Object.keys(drinks).length > 0;

    if (hasDrinks) {
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
    } else {
      const entry = document.createElement("div");
      entry.className = "drink-entry";
      entry.innerHTML = `<span>No hay bebidas registradas 🍹</span>`;
      card.appendChild(entry);
    }

    cardsContainer.appendChild(card);
  });
}


// ➕➖ Modificar bebida
window.updateDrink = function (person, drink, change) {
  if (!data[person]) data[person] = {};
  if (!data[person][drink]) data[person][drink] = 0;
  data[person][drink] += change;
  if (data[person][drink] <= 0) delete data[person][drink];
  saveData();
};

// 📩 Formulario
document.getElementById("drink-form").addEventListener("submit", e => {
  e.preventDefault();
  const drink = document.getElementById("drink").value;
  const person = document.getElementById("person").value;
  updateDrink(person, drink, 1);
});

// 🔴 Borrar todo
window.resetData = async function () {
  if (confirm("¿Estás seguro de que quieres borrar todo el progreso?")) {
    data = {};
    await saveData();
  }
};
