# Blackjack DAW

Juego de Blackjack desarrollado para la asignatura Desarrollo Web en Entorno Cliente (DWEC) de segundo de DAW.

## Descripción

Aplicación web en la que la banca juega automáticamente hasta alcanzar al menos 17 puntos. Después, el jugador puede pedir carta o plantarse. Gana quien se acerque más a 21 sin pasarse.

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla)

## Cómo ejecutar

1. Abre el archivo `index.html` en un navegador.
2. Escribe tu nombre en el modal y pulsa **Empezar partida**.
3. Espera el turno de la banca y juega con los botones **Pedir carta** y **Plantarse**.
4. Al terminar, pulsa **Nueva partida** para jugar otra mano con el mismo nombre.

## Reglas principales

- As = 1 punto.
- Cartas del 2 al 10 = su valor numérico.
- J, Q y K = 11 puntos.
- La banca pide cartas hasta llegar a 17 puntos o más.
- Quien llegue a 22 o más pierde automáticamente.
- Al plantarse se compara la puntuación con la banca y se declara victoria, derrota o empate.
- Con **Nueva partida** se limpia la mesa, se vuelve a mezclar la baraja y empieza otra mano.
