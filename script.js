// =====================================================
// 1. MODO OSCURO (recuerda tu elección)
// =====================================================
const botonModo = document.getElementById("boton-modo");
function aplicarModo(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  botonModo.textContent = oscuro ? "Modo claro" : "Modo oscuro";
}
aplicarModo(localStorage.getItem("modo") === "oscuro");
botonModo.addEventListener("click", function () {
  const oscuro = !document.body.classList.contains("oscuro");
  aplicarModo(oscuro);
  localStorage.setItem("modo", oscuro ? "oscuro" : "claro");
});

// =====================================================
// 2. EFECTOS DE MOUSE: reflejo del vidrio, parallax, luz y 3D
// =====================================================
document.querySelectorAll(".vidrio").forEach(function (el) {
  el.addEventListener("pointermove", function (e) {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  });
  el.addEventListener("pointerleave", function () {
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
  });
});

const luz = document.querySelector(".luz");
window.addEventListener("pointermove", function (e) {
  document.body.style.setProperty("--px", (e.clientX / innerWidth - 0.5) * 2);
  document.body.style.setProperty("--py", (e.clientY / innerHeight - 0.5) * 2);
  luz.style.opacity = 1;
  luz.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
});

// Las tarjetas se inclinan en 3D
document.querySelectorAll(".tarjeta").forEach(function (t) {
  t.addEventListener("pointermove", function (e) {
    const r = t.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = "perspective(700px) rotateX(" + (-y * 10) + "deg) rotateY(" + (x * 10) + "deg) translateY(-4px)";
  });
  t.addEventListener("pointerleave", function () { t.style.transform = ""; });
});

// =====================================================
// 3. APARECER AL HACER SCROLL + MENÚ ACTIVO
// =====================================================
const aparecer = new IntersectionObserver(function (items) {
  items.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add("visible"); aparecer.unobserve(i.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".aparece").forEach(function (el) { aparecer.observe(el); });

const enlaces = document.querySelectorAll("nav a");
const vigia = new IntersectionObserver(function (items) {
  items.forEach(function (i) {
    if (i.isIntersecting) enlaces.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + i.target.id); });
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section").forEach(function (s) { vigia.observe(s); });

// =====================================================
// 4. LEER MÁS
// =====================================================
const botonMas = document.getElementById("boton-mas");
const textoMas = document.getElementById("texto-mas");
botonMas.addEventListener("click", function () {
  const oculto = textoMas.classList.toggle("oculto");
  botonMas.textContent = oculto ? "Leer más sobre riesgos" : "Ocultar riesgos";
  botonMas.setAttribute("aria-expanded", String(!oculto));
});

// =====================================================
// 6. PESTAÑAS DE JUEGOS
// =====================================================
document.querySelectorAll(".pestana").forEach(function (p) {
  p.addEventListener("click", function () {
    document.querySelectorAll(".pestana").forEach(function (o) { o.classList.toggle("activa", o === p); });
    document.querySelectorAll(".juego").forEach(function (j) { j.classList.add("oculto"); });
    document.getElementById("juego-" + p.dataset.juego).classList.remove("oculto");
  });
});

// =====================================================
// 10. RED NEURONAL ANIMADA DE LA PORTADA
// =====================================================
const lienzo = document.getElementById("red");
const ctx = lienzo.getContext("2d");
let nodos = [];
function ajustarLienzo() {
  lienzo.width = lienzo.offsetWidth; lienzo.height = lienzo.offsetHeight;
  nodos = [];
  for (let i = 0; i < Math.min(70, Math.floor(lienzo.width / 18)); i++) {
    nodos.push({ x: Math.random() * lienzo.width, y: Math.random() * lienzo.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
  }
}
function dibujarRed() {
  const color = getComputedStyle(document.body).getPropertyValue("--linea-red");
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  nodos.forEach(function (p, i) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > lienzo.width) p.vx *= -1;
    if (p.y < 0 || p.y > lienzo.height) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + color + ", 0.8)"; ctx.fill();
    for (let j = i + 1; j < nodos.length; j++) {
      const d = Math.hypot(p.x - nodos[j].x, p.y - nodos[j].y);
      if (d < 130) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nodos[j].x, nodos[j].y);
        ctx.strokeStyle = "rgba(" + color + "," + (1 - d / 130) * 0.5 + ")"; ctx.stroke();
      }
    }
  });
  requestAnimationFrame(dibujarRed);
}
window.addEventListener("resize", ajustarLienzo);
ajustarLienzo(); dibujarRed();

// =====================================================
// 13. EFECTOS EXTRA: onda líquida, progreso, contadores, palabra animada
// =====================================================
// Onda al hacer clic en vidrio o botones
document.addEventListener("pointerdown", function (e) {
  const el = e.target.closest(".vidrio, .boton-vidrio");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const onda = document.createElement("span");
  onda.className = "onda";
  onda.style.left = e.clientX - r.left + "px";
  onda.style.top = e.clientY - r.top + "px";
  el.appendChild(onda);
  setTimeout(function () { onda.remove(); }, 800);
});

// Barra de progreso de lectura
const barraProgreso = document.querySelector(".progreso");
window.addEventListener("scroll", function () {
  const total = document.documentElement.scrollHeight - innerHeight;
  barraProgreso.style.width = (scrollY / total * 100) + "%";
});

// Contadores que suben al aparecer
const contar = new IntersectionObserver(function (items) {
  items.forEach(function (i) {
    if (!i.isIntersecting) return;
    const el = i.target, meta = Number(el.dataset.meta), inicio = performance.now();
    contar.unobserve(el);
    (function paso(ahora) {
      const t = Math.min((ahora - inicio) / 1600, 1);
      el.textContent = Math.round(meta * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(paso);
    })(inicio);
  });
}, { threshold: 0.6 });
document.querySelectorAll(".contador").forEach(function (el) { contar.observe(el); });

// Palabra que se escribe y se borra en la portada
const palabraEl = document.getElementById("palabra");
const lista = ["aprenden", "ven", "crean", "predicen", "traducen", "escuchan"];
let pi = 0, letras = lista[0].length, borrando = true;
function escribir() {
  const actual = lista[pi];
  palabraEl.textContent = actual.slice(0, letras);
  if (borrando) {
    letras--;
    if (letras < 0) { borrando = false; pi = (pi + 1) % lista.length; letras = 0; }
    setTimeout(escribir, 60);
  } else {
    letras++;
    if (letras > lista[pi].length) { borrando = true; letras = lista[pi].length; setTimeout(escribir, 1600); return; }
    setTimeout(escribir, 100);
  }
}
setTimeout(escribir, 1800);

// =====================================================
// 14. AJUSTES (color, transparencia, desenfoque, letra, animación)
// =====================================================
const por = function (id) { return document.getElementById(id); };
let ajustes = JSON.parse(localStorage.getItem("ajustes") || "{}");

function aplicarAjustes() {
  const b = document.body;
  if (ajustes.rgb) { b.style.setProperty("--acento", "rgb(" + ajustes.rgb + ")"); b.style.setProperty("--linea-red", ajustes.rgb); }
  else { b.style.removeProperty("--acento"); b.style.removeProperty("--linea-red"); }
  if (ajustes.transp != null) b.style.setProperty("--vidrio-fondo", "rgba(255,255,255," + ajustes.transp / 100 + ")");
  else b.style.removeProperty("--vidrio-fondo");
  if (ajustes.blur != null) b.style.setProperty("--desenfoque", ajustes.blur + "px");
  else b.style.removeProperty("--desenfoque");
  document.documentElement.style.fontSize = (ajustes.letra || 100) + "%";
  b.classList.toggle("sin-anim", ajustes.anim === false);
  document.querySelectorAll(".color").forEach(function (c) { c.classList.toggle("elegido", c.dataset.rgb === ajustes.rgb); });
  localStorage.setItem("ajustes", JSON.stringify(ajustes));
}
por("ajustes-boton").addEventListener("click", function () {
  const abierto = por("ajustes").classList.toggle("oculto") === false;
  por("ajustes-boton").setAttribute("aria-expanded", String(abierto));
});
document.querySelectorAll(".color").forEach(function (c) {
  c.addEventListener("click", function () { ajustes.rgb = c.dataset.rgb; aplicarAjustes(); });
});
por("aj-transp").addEventListener("input", function (e) { ajustes.transp = Number(e.target.value); aplicarAjustes(); });
por("aj-blur").addEventListener("input", function (e) { ajustes.blur = Number(e.target.value); aplicarAjustes(); });
por("aj-letra").addEventListener("input", function (e) { ajustes.letra = Number(e.target.value); aplicarAjustes(); });
por("aj-anim").addEventListener("change", function (e) { ajustes.anim = e.target.checked; aplicarAjustes(); });
por("aj-reset").addEventListener("click", function () {
  ajustes = {};
  por("aj-transp").value = 10; por("aj-blur").value = 14; por("aj-letra").value = 100; por("aj-anim").checked = true;
  aplicarAjustes();
});
if (ajustes.transp != null) por("aj-transp").value = ajustes.transp;
if (ajustes.blur != null) por("aj-blur").value = ajustes.blur;
if (ajustes.letra) por("aj-letra").value = ajustes.letra;
if (ajustes.anim === false) por("aj-anim").checked = false;
aplicarAjustes();

// =====================================================
// 15. JUEGO 1: TRES EN RAYA (la IA usa minimax)
// =====================================================
const lineas = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const trTablero = por("tres-tablero");
let tr = [], trFin = false, iaPensando = false;
const trPuntos = { yo: 0, emp: 0, ia: 0 };

function ganador(t) {
  for (const l of lineas) {
    if (t[l[0]] && t[l[0]] === t[l[1]] && t[l[0]] === t[l[2]]) return { j: t[l[0]], l: l };
  }
  return null;
}
// Minimax: prueba todas las jugadas. O (la IA) quiere +1, X (tú) quiere -1
function minimax(t, turnoIA) {
  const g = ganador(t);
  if (g) return g.j === "O" ? 1 : -1;
  if (t.every(Boolean)) return 0;
  let mejor = turnoIA ? -2 : 2;
  for (let i = 0; i < 9; i++) {
    if (t[i]) continue;
    t[i] = turnoIA ? "O" : "X";
    const v = minimax(t, !turnoIA);
    t[i] = null;
    mejor = turnoIA ? Math.max(mejor, v) : Math.min(mejor, v);
  }
  return mejor;
}
function jugadaIA() {
  const libres = [];
  tr.forEach(function (c, i) { if (!c) libres.push(i); });
  if (Math.random() < Number(por("tres-nivel").value)) return libres[Math.floor(Math.random() * libres.length)];
  let mejor = -2, elegidas = [];
  libres.forEach(function (i) {
    tr[i] = "O"; const v = minimax(tr, false); tr[i] = null;
    if (v > mejor) { mejor = v; elegidas = [i]; } else if (v === mejor) elegidas.push(i);
  });
  return elegidas[Math.floor(Math.random() * elegidas.length)];
}
function dibujarTres(g) {
  trTablero.innerHTML = "";
  tr.forEach(function (c, i) {
    const b = document.createElement("button");
    b.className = "casilla" + (c ? " " + c.toLowerCase() : "") + (g && g.l.indexOf(i) >= 0 ? " gana" : "");
    b.textContent = c || "";
    b.disabled = trFin || iaPensando || !!c;
    b.addEventListener("click", function () { jugarTres(i); });
    trTablero.appendChild(b);
  });
  por("tres-yo").textContent = trPuntos.yo; por("tres-emp").textContent = trPuntos.emp; por("tres-ia").textContent = trPuntos.ia;
}
function evaluarTres() {
  const g = ganador(tr);
  if (g) {
    trFin = true;
    if (g.j === "X") { trPuntos.yo++; por("tres-msg").textContent = "¡Ganaste! Le ganaste a la IA."; }
    else { trPuntos.ia++; por("tres-msg").textContent = "Ganó la IA. Prueba otra estrategia."; }
  } else if (tr.every(Boolean)) {
    trFin = true; trPuntos.emp++; por("tres-msg").textContent = "Empate.";
  }
  dibujarTres(g);
  return trFin;
}
function jugarTres(i) {
  if (trFin || iaPensando || tr[i]) return;
  tr[i] = "X";
  if (evaluarTres()) return;
  turnoIATres();
}
function turnoIATres() {
  iaPensando = true; por("tres-msg").textContent = "La IA está pensando..."; dibujarTres();
  setTimeout(function () {
    tr[jugadaIA()] = "O"; iaPensando = false;
    if (!evaluarTres()) por("tres-msg").textContent = "Tu turno.";
  }, 500);
}
function nuevoTres() {
  tr = Array(9).fill(null); trFin = false; iaPensando = false;
  dibujarTres(); por("tres-msg").textContent = "Tu turno.";
  if (por("tres-inicio").value === "ia") turnoIATres();
}
por("tres-nuevo").addEventListener("click", nuevoTres);
por("tres-inicio").addEventListener("change", nuevoTres);
nuevoTres();

// =====================================================
// 16. JUEGO 2: PIEDRA, PAPEL O TIJERA (la IA aprende tus hábitos)
// 0 = piedra, 1 = papel, 2 = tijera. El número i le gana a j si (i - j + 3) % 3 === 1
// =====================================================
const emojis = ["✊", "✋", "✌️"], nombres = ["Piedra", "Papel", "Tijera"];
let rpsConteo = [[1,1,1],[1,1,1],[1,1,1]], rpsUltima = null, rpsRondas = 0;
const rpsPuntos = { yo: 0, emp: 0, ia: 0 };

function prediccion() {
  const fila = rpsUltima === null ? [1, 1, 1] : rpsConteo[rpsUltima];
  const total = fila[0] + fila[1] + fila[2];
  return fila.map(function (v) { return v / total; });
}
function dibujarPrediccion() {
  const p = prediccion();
  por("rps-pred").innerHTML = p.map(function (v, i) {
    const n = Math.round(v * 100);
    return '<div class="barra-fila"><span>' + emojis[i] + " " + nombres[i] + '</span><div><i style="width:' + n + '%"></i></div><span>' + n + "%</span></div>";
  }).join("");
}
function jugarRps(m) {
  let ia;
  if (por("rps-modo").value === "azar" || rpsRondas < 3) ia = Math.floor(Math.random() * 3);
  else { const p = prediccion(); ia = (p.indexOf(Math.max.apply(null, p)) + 1) % 3; } // juega lo que le gana a tu jugada más probable
  if (rpsUltima !== null) rpsConteo[rpsUltima][m]++;   // aprende: después de X sueles jugar Y
  rpsUltima = m; rpsRondas++;
  let texto;
  if (m === ia) { rpsPuntos.emp++; texto = "Empate."; }
  else if ((m - ia + 3) % 3 === 1) { rpsPuntos.yo++; texto = "¡Ganaste esta ronda!"; }
  else { rpsPuntos.ia++; texto = "Ganó la IA esta ronda."; }
  por("rps-tu").textContent = emojis[m]; por("rps-iam").textContent = emojis[ia];
  [por("rps-tu"), por("rps-iam")].forEach(function (el) { el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude"); });
  por("rps-yo").textContent = rpsPuntos.yo; por("rps-emp").textContent = rpsPuntos.emp; por("rps-ia").textContent = rpsPuntos.ia;
  por("rps-msg").textContent = texto + " (ronda " + rpsRondas + ")";
  dibujarPrediccion();
}
document.querySelectorAll("[data-mov]").forEach(function (b) {
  b.addEventListener("click", function () { jugarRps(Number(b.dataset.mov)); });
});
por("rps-reiniciar").addEventListener("click", function () {
  rpsConteo = [[1,1,1],[1,1,1],[1,1,1]]; rpsUltima = null; rpsRondas = 0;
  rpsPuntos.yo = rpsPuntos.emp = rpsPuntos.ia = 0;
  ["rps-yo", "rps-emp", "rps-ia"].forEach(function (id) { por(id).textContent = 0; });
  por("rps-tu").textContent = "❔"; por("rps-iam").textContent = "❔"; por("rps-msg").textContent = "Elige una jugada.";
  dibujarPrediccion();
});
dibujarPrediccion();

// =====================================================
// 17. JUEGO 3: ROBOT EN EL LABERINTO (aprendizaje por refuerzo, Q-learning)
// El robot guarda en la tabla Q qué tan buena es cada acción en cada casilla
// =====================================================
const COL = 8, FIL = 6, TAM = 60;
const robLienzo = por("robot"), rc = robLienzo.getContext("2d");
const dirs = [[0,-1],[1,0],[0,1],[-1,0]], flechas = ["↑", "→", "↓", "←"];
const meta = { x: COL - 1, y: FIL - 1 };
let muros = new Set(), Q = [], episodios = 0, entrenando = false, robot = { x: 0, y: 0 }, siguiendo = null;

function reiniciarQ() {
  Q = Array.from({ length: COL * FIL }, function () { return [0, 0, 0, 0]; });
  episodios = 0; robot = { x: 0, y: 0 };
}
function pasoRobot(x, y, a) {
  const nx = x + dirs[a][0], ny = y + dirs[a][1];
  if (nx < 0 || ny < 0 || nx >= COL || ny >= FIL || muros.has(nx + "," + ny)) return { x: x, y: y, r: -0.05, fin: false };
  if (nx === meta.x && ny === meta.y) return { x: nx, y: ny, r: 1, fin: true };
  return { x: nx, y: ny, r: -0.01, fin: false };
}
function mejorAccion(s) {
  const m = Math.max.apply(null, Q[s]);
  const c = [0, 1, 2, 3].filter(function (i) { return Q[s][i] === m; });
  return c[Math.floor(Math.random() * c.length)];
}
function episodio() {
  let x = 0, y = 0;
  for (let n = 0; n < 150; n++) {
    const s = y * COL + x;
    const a = Math.random() < 0.2 ? Math.floor(Math.random() * 4) : mejorAccion(s);
    const r = pasoRobot(x, y, a);
    Q[s][a] += 0.5 * (r.r + 0.9 * Math.max.apply(null, Q[r.y * COL + r.x]) - Q[s][a]);
    x = r.x; y = r.y;
    if (r.fin) break;
  }
  episodios++;
}
function dibujarRobot() {
  const texto = getComputedStyle(document.body).getPropertyValue("--texto");
  rc.clearRect(0, 0, robLienzo.width, robLienzo.height);
  rc.textAlign = "center"; rc.textBaseline = "middle";
  for (let y = 0; y < FIL; y++) {
    for (let x = 0; x < COL; x++) {
      const px = x * TAM, py = y * TAM, q = Q[y * COL + x], mx = Math.max.apply(null, q);
      if (muros.has(x + "," + y)) { rc.fillStyle = "rgba(15,27,51,0.75)"; rc.fillRect(px, py, TAM, TAM); continue; }
      if (mx > 0) { rc.fillStyle = "rgba(34,197,94," + Math.min(mx, 1) * 0.55 + ")"; rc.fillRect(px, py, TAM, TAM); }
      rc.strokeStyle = "rgba(255,255,255,0.35)"; rc.strokeRect(px, py, TAM, TAM);
      if (mx > 0.001) { rc.font = "22px sans-serif"; rc.fillStyle = texto; rc.fillText(flechas[q.indexOf(mx)], px + TAM / 2, py + TAM / 2 + 14); }
    }
  }
  rc.font = "34px sans-serif"; rc.fillText("🏁", meta.x * TAM + TAM / 2, meta.y * TAM + TAM / 2);
  rc.fillText("🤖", robot.x * TAM + TAM / 2, robot.y * TAM + TAM / 2 - 6);
  por("rob-info").textContent = "Episodios de entrenamiento: " + episodios + (episodios === 0 ? ". Pulsa Entrenar." : ". Las casillas verdes y flechas muestran lo que aprendió.");
}
function bucleRobot() {
  if (entrenando) { for (let i = 0; i < Number(por("rob-vel").value); i++) episodio(); }
  if (robLienzo.offsetParent !== null) dibujarRobot();
  requestAnimationFrame(bucleRobot);
}
robLienzo.addEventListener("pointerdown", function (e) {
  const r = robLienzo.getBoundingClientRect();
  const x = Math.floor((e.clientX - r.left) / r.width * COL), y = Math.floor((e.clientY - r.top) / r.height * FIL);
  if ((x === 0 && y === 0) || (x === meta.x && y === meta.y)) return;
  const k = x + "," + y;
  if (muros.has(k)) muros.delete(k); else muros.add(k);
  reiniciarQ(); // el mapa cambió: debe volver a aprender
});
por("rob-entrenar").addEventListener("click", function () {
  entrenando = !entrenando;
  por("rob-entrenar").textContent = entrenando ? "Pausar" : "Entrenar";
});
por("rob-ruta").addEventListener("click", function () {
  clearInterval(siguiendo); robot = { x: 0, y: 0 }; let pasos = 0;
  siguiendo = setInterval(function () {
    const s = robot.y * COL + robot.x, a = Q[s].indexOf(Math.max.apply(null, Q[s]));
    const r = pasoRobot(robot.x, robot.y, a);
    robot.x = r.x; robot.y = r.y; pasos++;
    if (r.fin || pasos > 40) clearInterval(siguiendo);
  }, 250);
});
por("rob-reset").addEventListener("click", function () { clearInterval(siguiendo); reiniciarQ(); });
por("rob-limpiar").addEventListener("click", function () { muros.clear(); clearInterval(siguiendo); reiniciarQ(); });
reiniciarQ(); bucleRobot();

// =====================================================
// 18. JUEGO 4: SIMÓN (memoria de secuencias)
// =====================================================
const pads = document.querySelectorAll(".pad");
const frecuencias = [329.6, 261.6, 392, 523.3];
let rondaSimon = 0, secuencia = [], posicion = 0, aceptando = false, nivelSimon = 0, audio = null;
let record = Number(localStorage.getItem("simonRecord")) || 0;
por("simon-rec").textContent = record;

const esperar = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
function tono(i, ms) {
  if (!por("simon-sonido").checked) return;
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  const o = audio.createOscillator(), g = audio.createGain();
  o.frequency.value = frecuencias[i];
  g.gain.setValueAtTime(0.2, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + ms / 1000);
  o.connect(g); g.connect(audio.destination);
  o.start(); o.stop(audio.currentTime + ms / 1000);
}
async function iluminar(i, ms) {
  pads[i].classList.add("on"); tono(i, ms);
  await esperar(ms);
  pads[i].classList.remove("on");
}
async function siguienteNivel() {
  const mia = ++rondaSimon;
  aceptando = false; posicion = 0; nivelSimon++;
  secuencia.push(Math.floor(Math.random() * 4));
  por("simon-nivel").textContent = nivelSimon;
  por("simon-msg").textContent = "Mira la secuencia...";
  const vel = Number(por("simon-vel").value);
  await esperar(600);
  for (const i of secuencia) {
    if (mia !== rondaSimon) return;
    await iluminar(i, vel * 0.7); await esperar(vel * 0.3);
  }
  if (mia !== rondaSimon) return;
  por("simon-msg").textContent = "Tu turno";
  aceptando = true;
}
pads.forEach(function (p) {
  p.addEventListener("click", function () {
    if (!aceptando) return;
    const i = Number(p.dataset.i);
    iluminar(i, 220);
    if (i === secuencia[posicion]) {
      posicion++;
      if (posicion === secuencia.length) {
        aceptando = false; por("simon-msg").textContent = "¡Muy bien!";
        setTimeout(siguienteNivel, 800);
      }
    } else {
      aceptando = false;
      const tablero = document.querySelector(".simon-tablero");
      tablero.classList.add("error"); setTimeout(function () { tablero.classList.remove("error"); }, 400);
      if (nivelSimon - 1 > record) { record = nivelSimon - 1; localStorage.setItem("simonRecord", record); por("simon-rec").textContent = record; }
      por("simon-msg").textContent = "Fallaste en el nivel " + nivelSimon + ". Pulsa Empezar para intentarlo otra vez.";
    }
  });
});
por("simon-inicio").addEventListener("click", function () {
  secuencia = []; nivelSimon = 0; por("simon-inicio").textContent = "Reiniciar";
  siguienteNivel();
});
