const screens = [...document.querySelectorAll(".screen")];
let currentScreen = "screen1";
const toast = document.getElementById("toast");
let toastTimer;

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;
  screens.forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.hidden = !active;
    screen.setAttribute("aria-hidden", String(!active));
  });
  currentScreen = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = target.querySelector("h1, h2");
  if (heading) heading.setAttribute("tabindex", "-1");
  if (heading) heading.focus({ preventScroll: true });
}

document.querySelectorAll(".next-button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});
document.querySelectorAll(".back-button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});
document.getElementById("restartButton").addEventListener("click", () => showScreen("screen1"));

const backgroundStars = document.getElementById("backgroundStars");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("span");
  star.className = "bg-star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  const size = Math.random() * 2.4 + 0.7;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
  star.style.animationDelay = `${Math.random() * 4}s`;
  backgroundStars.appendChild(star);
}

const secretMessages = [
  "Hay personas que dejan algo bonito en nuestra historia. A veces no es una sola gran cosa, sino muchos pequeños momentos que, con el tiempo, aprendemos a mirar con cariño.",
  "Espero que nunca te falten lugares donde puedas respirar tranquila, personas con quienes puedas ser tú misma y momentos en los que no tengas que fingir que todo está bien.",
  "Ojalá sigas encontrando magia en las cosas sencillas: el sonido del mar por la noche, una conversación que te haga bien o un pedacito de pastel de chocolate en un día largo.",
  "Admiro la posibilidad de que cada persona siga creciendo, aprendiendo y encontrando su propio camino. Deseo que este año te acerque a las metas que llevas dentro, incluso a esas que todavía no le cuentas a nadie.",
  "No todos los recuerdos necesitan convertirse en algo nuevo para seguir teniendo valor. Algunos pueden quedarse donde pertenecen: como parte de una historia que significó algo y que merece ser recordada con respeto.",
  "Si pudiera pedir algo por ti en tu cumpleaños, sería que encuentres una felicidad tranquila y sincera; de esa que no depende de impresionar a nadie, sino de sentirte bien con la persona en la que te estás convirtiendo."
];

const starMap = document.getElementById("starMap");
const secretNote = document.getElementById("secretNote");
const starProgress = document.getElementById("starProgress");
const positions = [
  { left: "12%", top: "20%" }, { left: "35%", top: "14%" },
  { left: "69%", top: "21%" }, { left: "83%", top: "56%" },
  { left: "52%", top: "70%" }, { left: "22%", top: "64%" }
];
const discovered = new Set();

secretMessages.forEach((message, index) => {
  const button = document.createElement("button");
  button.className = "secret-star";
  button.type = "button";
  button.textContent = "✦";
  button.style.left = positions[index].left;
  button.style.top = positions[index].top;
  button.style.animationDelay = `${index * .22}s`;
  button.setAttribute("aria-label", `Descubrir mensaje secreto ${index + 1}`);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    discovered.add(index);
    button.classList.add("found");
    button.textContent = "✧";
    button.setAttribute("aria-pressed", "true");
    secretNote.replaceChildren();
    const icon = document.createElement("span");
    icon.className = "note-symbol";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✧";
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    secretNote.append(icon, paragraph);
    starProgress.textContent = `Has descubierto ${discovered.size} de ${secretMessages.length} mensajes.`;
    if (discovered.size === secretMessages.length) showToast("Descubriste todos los mensajes. Gracias por leerlos ✨");
  });
  starMap.appendChild(button);
});

const candles = [...document.querySelectorAll(".candle")];
const cakeHint = document.getElementById("cakeHint");
const birthdayReveal = document.getElementById("birthdayReveal");
candles.forEach((candle, index) => {
  candle.addEventListener("click", () => {
    candle.classList.remove("lit");
    candle.setAttribute("aria-label", `Vela ${index + 1} apagada`);
    if (candles.every(item => !item.classList.contains("lit"))) {
      birthdayReveal.hidden = false;
      cakeHint.textContent = "Deseo pedido. Que tengas un cumpleaños lleno de cosas bonitas. 💙";
      showToast("¡Feliz cumpleaños, Danitza! 🎂");
    } else {
      const remaining = candles.filter(item => item.classList.contains("lit")).length;
      cakeHint.textContent = `¡Muy bien! Quedan ${remaining} velita(s).`;
    }
  });
});

document.querySelectorAll(".photo-frame img").forEach((img) => {
    const frame = img.closest(".photo-frame");

    if (!frame) return;

    function comprobarFoto() {
        if (img.naturalWidth > 0) {
            frame.classList.add("has-image");
        } else {
            frame.classList.remove("has-image");
        }
    }

    img.addEventListener("load", comprobarFoto);

    img.addEventListener("error", () => {
        frame.classList.remove("has-image");
        console.error("No se pudo cargar la imagen:", img.src);
    });

    if (img.complete) {
        comprobarFoto();
    }
});

const openLetter = document.getElementById("openLetter");
const letterMessage = document.getElementById("letterMessage");
openLetter.addEventListener("click", () => {
  const opening = letterMessage.hidden;
  letterMessage.hidden = !opening;
  openLetter.setAttribute("aria-expanded", String(opening));
  openLetter.innerHTML = opening ? "Cerrar la dedicatoria <span>↑</span>" : "Abrir la dedicatoria <span>♡</span>";
  if (opening) letterMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// Sonido ambiente sencillo generado en el navegador; comienza solo al tocar el botón.
let audioContext = null;
let oceanSound = null;
let soundOn = false;
const soundToggle = document.getElementById("soundToggle");
const soundIcon = document.getElementById("soundIcon");
const soundLabel = document.getElementById("soundLabel");

function startOceanSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    showToast("Tu navegador no permite reproducir este sonido.");
    return false;
  }
  audioContext = audioContext || new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
  const length = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = (last + 0.025 * (Math.random() * 2 - 1)) / 1.025;
    data[i] = last * 3.5;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = audioContext.createGain();
  gain.gain.value = 0.0001;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  source.start();
  gain.gain.setTargetAtTime(0.035, audioContext.currentTime, 1.2);
  oceanSound = { source, gain };
  return true;
}
function stopOceanSound() {
  if (!oceanSound || !audioContext) return;
  oceanSound.gain.gain.setTargetAtTime(0.0001, audioContext.currentTime, .25);
  const old = oceanSound;
  setTimeout(() => { try { old.source.stop(); } catch (_) {} }, 1200);
  oceanSound = null;
}
soundToggle.addEventListener("click", () => {
  if (!soundOn) soundOn = startOceanSound();
  else { stopOceanSound(); soundOn = false; }
  soundToggle.setAttribute("aria-pressed", String(soundOn));
  soundIcon.textContent = soundOn ? "♫" : "♪";
  soundLabel.textContent = soundOn ? "Sonido activado" : "Sonido apagado";
});
