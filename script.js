var palos = [
  { nombre: "corazones", simbolo: "♥" },
  { nombre: "diamantes", simbolo: "♦" },
  { nombre: "tréboles", simbolo: "♣" },
  { nombre: "picas", simbolo: "♠" }
];

var valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function crearCarta(palo, valor) {
  var puntos;

  if (valor === "A") {
    puntos = 1;
  } else if (valor === "J" || valor === "Q" || valor === "K") {
    puntos = 11;
  } else {
    puntos = Number(valor);
  }

  return {
    palo: palo.nombre,
    simbolo: palo.simbolo,
    valor: valor,
    puntos: puntos
  };
}

var baraja = {
  cartas: [],

  generar: function () {
    var i;
    var j;

    this.cartas = [];

    for (i = 0; i < palos.length; i++) {
      for (j = 0; j < valores.length; j++) {
        this.cartas.push(crearCarta(palos[i], valores[j]));
      }
    }
  },

  mezclar: function () {
    var i;
    var posicion;
    var auxiliar;

    for (i = this.cartas.length - 1; i > 0; i--) {
      posicion = Math.floor(Math.random() * (i + 1));
      auxiliar = this.cartas[i];
      this.cartas[i] = this.cartas[posicion];
      this.cartas[posicion] = auxiliar;
    }
  },

  repartir: function () {
    if (this.cartas.length === 0) {
      return null;
    }

    return this.cartas.pop();
  }
};

function crearParticipante(nombre) {
  return {
    nombre: nombre,
    cartas: [],

    calcularPuntuacion: function () {
      var total = 0;
      var i;

      for (i = 0; i < this.cartas.length; i++) {
        total = total + this.cartas[i].puntos;
      }

      return total;
    }
  };
}

var jugador;
var banca;
var btnPedir;
var btnPlantarse;
var btnNueva;
var modalNombre;
var formNombre;
var inputNombre;
var partidaTerminada = false;
var turnoBancaActivo = false;
var temporizadorBanca = null;

function mostrarMensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}

function actualizarPuntosBanca() {
  document.getElementById("puntos-banca").textContent = banca.calcularPuntuacion();
}

function actualizarPuntosJugador() {
  document.getElementById("puntos-jugador").textContent = jugador.calcularPuntuacion();
}

function deshabilitarBotones() {
  btnPedir.disabled = true;
  btnPlantarse.disabled = true;
}

function habilitarBotones() {
  btnPedir.disabled = false;
  btnPlantarse.disabled = false;
}

function vaciarCartas(idContenedor) {
  var contenedor = document.getElementById(idContenedor);

  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}

function mostrarCarta(carta, idContenedor) {
  var contenedor = document.getElementById(idContenedor);
  var articulo = document.createElement("article");
  var esquina = document.createElement("span");
  var palo = document.createElement("span");

  articulo.className = "carta";

  if (carta.palo === "corazones" || carta.palo === "diamantes") {
    articulo.className = "carta roja";
  }

  esquina.className = "esquina";
  esquina.textContent = carta.valor;

  palo.className = "palo";
  palo.textContent = carta.simbolo;

  articulo.appendChild(esquina);
  articulo.appendChild(palo);
  contenedor.appendChild(articulo);
}

function detenerTurnoBanca() {
  turnoBancaActivo = false;

  if (temporizadorBanca !== null) {
    clearTimeout(temporizadorBanca);
    temporizadorBanca = null;
  }
}

function finalizarPartida(texto) {
  partidaTerminada = true;
  turnoBancaActivo = false;
  deshabilitarBotones();
  mostrarMensaje(texto + " Pulsa Nueva partida para seguir.");
}

function repartirCartaBanca() {
  var carta;
  var puntos;

  if (!turnoBancaActivo) {
    return;
  }

  carta = baraja.repartir();

  if (carta === null) {
    return;
  }

  banca.cartas.push(carta);
  mostrarCarta(carta, "cartas-banca");
  actualizarPuntosBanca();

  puntos = banca.calcularPuntuacion();

  if (puntos >= 22) {
    finalizarPartida("La banca se ha pasado. Ganas la partida.");
  } else if (puntos >= 17) {
    turnoBancaActivo = false;
    mostrarMensaje("Turno de " + jugador.nombre + ". Puedes pedir carta o plantarte.");
    habilitarBotones();
  } else {
    temporizadorBanca = setTimeout(repartirCartaBanca, 700);
  }
}

function turnoBanca() {
  deshabilitarBotones();
  turnoBancaActivo = true;
  mostrarMensaje("La banca está jugando...");
  temporizadorBanca = setTimeout(repartirCartaBanca, 700);
}

function pedirCarta() {
  var carta;
  var puntos;

  if (partidaTerminada) {
    return;
  }

  carta = baraja.repartir();

  if (carta === null) {
    return;
  }

  jugador.cartas.push(carta);
  mostrarCarta(carta, "cartas-jugador");
  actualizarPuntosJugador();

  puntos = jugador.calcularPuntuacion();

  if (puntos >= 22) {
    finalizarPartida("Te has pasado. Gana la banca.");
  }
}

function plantarse() {
  var puntosJugador;
  var puntosBanca;

  if (partidaTerminada) {
    return;
  }

  puntosJugador = jugador.calcularPuntuacion();
  puntosBanca = banca.calcularPuntuacion();

  if (puntosJugador > puntosBanca) {
    finalizarPartida("Has ganado. " + puntosJugador + " frente a " + puntosBanca + ".");
  } else if (puntosJugador < puntosBanca) {
    finalizarPartida("Gana la banca. " + puntosBanca + " frente a " + puntosJugador + ".");
  } else {
    finalizarPartida("Empate a " + puntosJugador + " puntos.");
  }
}

function nuevaPartida() {
  var nombreActual;

  if (!jugador) {
    return;
  }

  detenerTurnoBanca();

  partidaTerminada = false;
  nombreActual = jugador.nombre;
  btnNueva.disabled = false;

  jugador = crearParticipante(nombreActual);
  banca = crearParticipante("Banca");

  document.getElementById("puntos-banca").textContent = "0";
  document.getElementById("puntos-jugador").textContent = "0";

  vaciarCartas("cartas-banca");
  vaciarCartas("cartas-jugador");

  baraja.generar();
  baraja.mezclar();

  turnoBanca();
}

function cerrarModalNombre() {
  modalNombre.classList.add("oculto");
}

function confirmarNombre(evento) {
  var nombre;

  evento.preventDefault();

  nombre = inputNombre.value.trim();

  if (nombre === "") {
    nombre = "Jugador";
  }

  cerrarModalNombre();

  jugador = crearParticipante(nombre);
  document.getElementById("nombre-jugador").textContent = jugador.nombre;

  nuevaPartida();
}

function iniciar() {
  btnPedir = document.getElementById("btn-pedir");
  btnPlantarse = document.getElementById("btn-plantarse");
  btnNueva = document.getElementById("btn-nueva");
  modalNombre = document.getElementById("modal-nombre");
  formNombre = document.getElementById("form-nombre");
  inputNombre = document.getElementById("input-nombre");

  deshabilitarBotones();
  btnNueva.disabled = true;
  mostrarMensaje("Escribe tu nombre para empezar.");

  btnPedir.addEventListener("click", pedirCarta);
  btnPlantarse.addEventListener("click", plantarse);
  btnNueva.addEventListener("click", nuevaPartida);
  formNombre.addEventListener("submit", confirmarNombre);

  inputNombre.focus();
}

window.addEventListener("load", iniciar);
