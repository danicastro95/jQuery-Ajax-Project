# jQuery-Ajax-project

Proyecto para Desarrollo Web en Entornos Cliente empleando jQuery y Ajax.

La página emplea la API de Twitch, una plataforma de transmisión de vídeo enfocada a los videojuegos.
https://dev.twitch.tv/docs/api/ y https://dev.twitch.tv/docs/v5/

Las partes principales del proyecto son:
  - Página principal: En ella se muestran diferentes videojuegos ordenados por número de espectadores totales. Posee scroll infinito por lo que al llegar al final del scroll carga automáticamente más elementos y los maqueta. Durante la carga de las imágenes de los videojuegos se muestra un gif de carga.
  - Vista de streams: Al hacer clic en cualquier juego se abre un diálogo que muestra retransmisiones en directo del juego seleccionado ordenadas por número de espectadores. Al hacer clic sobre un elemento la retransmisión seleccionada se abre en la página de Twitch en una nueva pestaña del navegador. Para cerrar este diálogo basta con hacer clic fuera de él.
  - Búsqueda: Existe una barra de búsqueda en la que buscar juegos por nombre. Al escribir en ella va mostrando los juegos que coinciden con el texto introducido. Al clicar sobre algún elemento mostrado abre de nuevo el diálogo modal mostrando las retransmisiones en directo disponibles ordenadas por número de espectadores.
