Quiero hacer lo siguiente, la idea es usar html, javascript y css, sin usar frameworks. Pero si consideras que es mejor usar algun framework o libreria, puedes usarlo. La idea es que la estructura del proyecto sea facil de mantener y escalar.

La imagen muestra un boceto del juego.

La idea del juego es que sea un juego didactico para niños, para introducirles conceptos de programación.

En el boceto se muestran primero los comandos posibles, actualmente se ha pensado solamente en mover derecha, mover izquierda, mover abajo y mover arriba. Ademas un comando de repetir.

Luego estan las sentencias, que son combinaciones de hasta 5 comandos.

La escritura seria posfija, y los repetir serian bucles.

Entonces en el primer ejemplo, dice derecha, abajo, repetir,repetir. Esto serin dos bucle anidados, con dos movimientos.

En el segundo ejemplo seria un bucle anidado con dos movimientos, dentro de otro bucle que añade un movimiento mas.

El juego consiste en un laberinto, donde el jugador debe mover al personaje para llegar a la meta.

El personaje se mueve en una cuadrícula, y el laberinto es una serie de celdas que pueden ser paredes o caminos.

El personaje puede moverse en cuatro direcciones: arriba, abajo, izquierda y derecha.

La puntuacion se calcula en base a la cantidad de comandos usados. Mientras menos comandos se usen, mayor sera la puntuacion.

Caer fuera de la cuadricula o chocar con una pared implica una derrota y no se puntua.

Cada partida debe tener una duracion maxima de 1 minuto. Si no se llega a la meta en ese tiempo, se pierde.

A la cuadricula, rodela con un borde de color rojo que tenga el mismo grosor que el tamaño de cada celda, para que parezca parte de la cuadricula.

Para el personaje, comandos y meta utiliza emojis. Para el personaje un emoji de un robot, para los comandos emojis de flechas y para la meta un emoji de una bandera. Y evalua un emoji para el comando de repetir.

Cuando el jugador gane, se debe mostrar un mensaje de felicitaciones y la puntuacion obtenida y debe pedir su nombre para guardarlo en el local storage en un ranking. El ranking debe mostrar los 10 mejores puntajes, ordenados de mayor a menor.

Ten en cuenta que a futuro se añadiran mas comandos, y mas elementos en el juego, por ejemplo, obstaculos que el jugador debe evitar, pudiendo ser de tipo solido (bloquean el movimiento) o de tipo trampa (provocan derrota instantanea como si queda fuera de la cuadricula), tambien podra haber elementos a recojer (por ejemplo estrellas adicionales para mayor puntuacion, llaves para abrir puertas, etc.).

Por lo tanto, el codigo debe estar estructurado de manera que sea facil añadir nuevos comandos y elementos en el futuro. Por ejemplo, los comandos podrian ser un array de objetos, donde cada objeto tiene un nombre, una descripcion, un emoji y una funcion que se ejecuta cuando se ejecuta el comando. De manera similar, los elementos podrian ser un array de objetos, donde cada objeto tiene un nombre, una descripcion, un emoji y una funcion que se ejecuta cuando el jugador entra en la celda que contiene el elemento.

El primer nivel es tal como se muestra en el boceto, sin obstaculos, con el personaje en la esquina superior izquierda y la meta en la esquina inferior derecha. El tamaño de la cuadricula es de 10x10.

Debe haber tambien un boton para ejecutar la secuencia de comandos, y un boton para reiniciar el nivel. Ademas de un contador de comandos usados y un contador de tiempo.

Cuando no se alcanza el objetivo ni tampoco la derrota, ejecutar una secuencia, digamosle incompleta, deberia dar la posibilidad de reintentarla, sin resetear el tiempo.

Al reintentar, dentro de la misma partida, no debe borrarse la secuencia de comandos. El personaje debe quedar en la posicion donde llego, y debe cambiar el boton ejecutar por un reintentar.

Hacer click en alguno de los comandos de la secuencia de comandos deberia eliminarlo.

Añade un nuevo comando (y su boton), Enter, esto lo que hace es finalizar un bloque de secuencia de comandos, y empezar un nuevo bloque, de esa forma, los repetir no repetirian toda la secuencia de comandos, sino los comandos de su bloque de suecuencia, por ejemplo, abajo derecha repetir repetir enter repetir, provocaria que no se alcance la solucion y que el repetir del segundo bloque no tenga ningun efecto porque en ese bloque no hay ningun comando que repetir.