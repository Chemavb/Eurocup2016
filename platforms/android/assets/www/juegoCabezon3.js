//TODO_HECHO: 1. Arreglar controles para el tap por la zona izquierda de los controles fuera del campo.
//TODO: 2. Crear stage Pantalla Inicial, Pantalla Game Over, Pantalla Has ganado - Continuar nivel.
//TODO: 3. Crear variableGLobal para dificultad y en el create del estado gameState crear el jugador rival en función de la dificultad.
//TODO: 4. Lógica de los estados en función del minuto / victoria o derrota / pantalla Inicial / gameOver y botones.
//TODO: 5. Una vez creada toda la lógica funcional y general de los estados, es hora de crear los bots!!!!
//TODO: 6. Bot principiante. Ideas: Se mueve de derecha a izquierda en una zona, salta al azar en x tiempos.
//TODO: 7. Bot avanzado. Ideas: Se mueve a por el balón, tiene más bouncy (restitution). Mejor sprite.


//TODO_HECHO: 1. World limits por encima del suelo parar poner controles debajo.
//TODO_HECHO: 2. Sprites de los jugadores x2 de grandes.
//TODO_HECHO: 3. Sprites de los controles más grandes y separados.
//TODO_HECHO: 4. Multi touching screen (input general en la pantalla que salte IF no está en las coordenadas de los controles.
//Aclaracion: ActivePointer siempre se superpone al anterior puntero!
//TODO_HECHO: 5. Materials entre larguero y pelota (que rebote más).
//TODO_HECHO: 6. Fondo bueno y que se vea bien para poner marcador por encima.
//TODO_HECHO: 7. Lógica de es gol, actualizar marcador con goles y con tiempo.


//Cosas para el servidor

myId = 0;

//

//Clase jugador


var botonPulsadoIzquierdo = false;
var botonPulsadoDerecho = false;

Jugador = function (index, game, player) {
    this.cursor = {
        left: false,
        right: false,
        up: false,
        fire: false
    }

    this.input = {
        left: false,
        right: false,
        up: false,
        fire: false
    }


    var x = SAFE_ZONE_WIDTH/2 - SAFE_ZONE_WIDTH/4;
    var y = SAFE_ZONE_HEIGHT;

    this.game = game;
    this.player = player;
    this.currentSpeed = 0;

    this.jugador = game.add.sprite(x, y, 'jugador262');
    this.jugador.scale.setTo(1.5, 1.5);
    this.jugador.id = index;
    game.physics.p2.enable(this.jugador);
    this.jugador.body.setCircle(33);
    this.jugador.body.mass = 100;
    this.jugador.body.fixedRotation = true;
    this.jugador.body.collideWorldBounds = true;
    //this.jugador.body.gravity.y = 50;



    //Funciones del boton:
    this.moverDerecha = function () {
        botonPulsadoDerecho = true;
    }

    this.dejarMoverDerecha = function() {
        botonPulsadoDerecho = false;
    }

    this.moverIzquierda = function () {
        botonPulsadoIzquierdo = true;
    }

    this.dejarMoverIzquierda = function () {
        botonPulsadoIzquierdo = false;
    }


    //Botones de controles:
    this.botonDerecho = game.add.button(550, 380, 'buttonDerecha');
    this.botonDerecho.onInputDown.add(this.moverDerecha, this);
    this.botonDerecho.onInputUp.add(this.dejarMoverDerecha, this);
    this.botonDerecho.alpha = 0.75;
    this.botonIzquierdo = game.add.button(415, 380, 'buttonIzquierda');
    this.botonIzquierdo.onInputDown.add(this.moverIzquierda, this);
    this.botonIzquierdo.onInputUp.add(this.dejarMoverIzquierda, this);

    this.botonIzquierdo.alpha = 0.75;


    this.update = function() {


        var estasEnSuelo = false; //Variable true si esta en Suelo, false en caso contrario.
        if(this.jugador.body.y > (SAFE_ZONE_HEIGHT - 35)) {
            estasEnSuelo = true;
        }

        if (cursors.left.isDown || botonPulsadoIzquierdo) {
            this.jugador.body.moveLeft(275);
            if(cursors.up.isDown && estasEnSuelo ){
                this.jugador.body.moveUp(250);
            }
        } else if (cursors.right.isDown || botonPulsadoDerecho) {
            this.jugador.body.moveRight(275);
            if(cursors.up.isDown && estasEnSuelo) {
                this.jugador.body.moveUp(250);
            }
        } else if (cursors.up.isDown && estasEnSuelo) {
            this.jugador.body.moveUp(250);
        } else {
            this.jugador.body.velocity.x = 0;
        }

        //Prueba con touch on screen:
        if (game.input.activePointer.isDown && estasEnSuelo) { //Si se clickea en la pantalla
           if(game.input.activePointer.y < SAFE_ZONE_HEIGHT || game.input.activePointer.x < SAFE_ZONE_WIDTH/2) { //Si el click es en el campo (no en los controles).
               this.jugador.body.moveUp(250);
           }
        }

    }

}//

Rival0 = function(index, game, player) {
    var x = SAFE_ZONE_WIDTH / 2 + SAFE_ZONE_WIDTH/4;
    var y = SAFE_ZONE_HEIGHT;

    this.game = game;
    this.player = player;
    this.currentSpeed = 0;

    this.jugador = game.add.sprite(x, y, 'jugadorRival0');
    this.jugador.scale.setTo(1.5, 1.5);
    this.jugador.id = index;
    game.physics.p2.enable(this.jugador);
    this.jugador.body.setCircle(33);
    this.jugador.body.mass = 100;
    this.jugador.body.fixedRotation = true;
    this.jugador.body.collideWorldBounds = true;

    this.update = function() {

        var estasEnSuelo = false;

        if(this.jugador.body.y > (SAFE_ZONE_HEIGHT - 20)) {
            estasEnSuelo = true;
        }

        //Lógica del Bot dificultad 1: Cada x tiempo salta un poco:
        if((seconds % 3 == 0) && estasEnSuelo) { //Si el segundo es multiplo de 4 (4, 8, 12, 16...)
            this.jugador.body.moveUp(175);
        }
        //Si se mete en la porteria, se mueve hacia la izquierda para salir:

        if(this.jugador.body.x > (800-82+5)) {
            this.jugador.body.moveLeft(175);
        }

        //Si se mete en campo contrario, vuelve a la derecha:
        if(this.jugador.body.x < SAFE_ZONE_WIDTH/2) {
            this.jugador.body.moveRight(250);
        }

    }

}

Rival1 = function(index, game, player) {
    var x = SAFE_ZONE_WIDTH / 2 + SAFE_ZONE_WIDTH/4;
    var y = SAFE_ZONE_HEIGHT;

    this.game = game;
    this.player = player;
    this.currentSpeed = 0;

    this.jugador = game.add.sprite(x, y, 'jugadorRival1');
    this.jugador.scale.setTo(1.5, 1.5);
    this.jugador.id = index;
    game.physics.p2.enable(this.jugador);
    this.jugador.body.setCircle(33);
    this.jugador.body.mass = 100;
    this.jugador.body.fixedRotation = true;
    this.jugador.body.collideWorldBounds = true;

    this.update = function() {

        var estasEnSuelo = false;

        if(this.jugador.body.y > (SAFE_ZONE_HEIGHT - 35)) {
            estasEnSuelo = true;
        }

        //Lógica del Bot dificultad 1: Cada x tiempo se mueve de derecha a izquierda:
        if(seconds % 2 == 0) { //Si estamos en un segundo par
            this.jugador.body.moveRight(250);
        } else {
            this.jugador.body.moveLeft(250);
        }




    }

}

Rival2 = function(index, game, player) {



    var x = SAFE_ZONE_WIDTH / 2 + SAFE_ZONE_WIDTH/4;
    var y = SAFE_ZONE_HEIGHT;

    this.game = game;
    this.player = player;
    this.currentSpeed = 0;

    this.jugador = game.add.sprite(x, y, 'jugadorRival2');
    this.jugador.scale.setTo(1.55, 1.55); //Modificacion: En este caso es 1.6 en vez de 1.5
    this.jugador.anchor.setTo(0.5,0.5); //origen del sprite en el centro.
    this.jugador.id = index;
    game.physics.p2.enable(this.jugador);
    this.jugador.body.setCircle(34); //Modificacion: En este caso el circulo es 35px de radio en vez de 33.
    this.jugador.body.mass = 120; //Modificacion: En este caso tiene 120 de masa en vez de 100.
    this.jugador.body.fixedRotation = true;
    this.jugador.body.collideWorldBounds = true;


    this.update = function() {

        var estasEnSuelo = false;


        if(this.jugador.body.y > (SAFE_ZONE_HEIGHT - 15)) {
            estasEnSuelo = true;
        }

        //Lógica del Bot dificultad 2: Cada x tiempo se mueve de derecha a izquierda:
        if(seconds % 2 == 0) { //Si estamos en un segundo par y no estamos en el limite
            this.jugador.body.moveRight(250);
        } else {
            this.jugador.body.moveLeft(250);
        }

        //Y además si está en el suelo, vuelve a saltar:
        if (estasEnSuelo) {
            this.jugador.body.moveUp(150);
        }


    }

}

function estadoInicial() {
    console.log("estado inicial");
    //Balon a posición inicial:
    balon.balonSprite.body.x = SAFE_ZONE_WIDTH/2;
    balon.balonSprite.body.y = 50;
    balon.balonSprite.body.setZeroVelocity();

    //goles Recientes false para que vuelva a identificar nuevos goles.
    balon.esGolIzquierdaReciente = false;
    balon.esGolDerechaReciente = false;

}

Balon = function (game) {
    var x = SAFE_ZONE_WIDTH/2;
    var y = 50;

    this.esGolIzquierdaReciente = false;
    this.esGolDerechaReciente = false;

    this.balonSprite = game.add.sprite(x,y, 'soccer_ball');
    game.physics.p2.enable(this.balonSprite);
    this.balonSprite.scale.setTo(1.25, 1.25);
    this.balonSprite.body.setCircle(12);
    this.balonSprite.body.mass = 1;
    this.balonSprite.body.collideWorldBounds = true;

    this.esGol = function() {
        if(this.balonSprite.body.x < (82-5) && this.balonSprite.body.y > (SAFE_ZONE_HEIGHT-130) ) { //Es gol izquierda

            if(!this.esGolIzquierdaReciente && !this.esGolDerechaReciente ) {
                //Actualiza marcador Izquierdo
                marcadorIzquierdo += 1;
                console.log(marcadorIzquierdo);
                textoMarcador.setText(marcadorDerecho + ' - ' + marcadorIzquierdo);
                game.time.events.add(Phaser.Timer.SECOND * 2, estadoInicial, this);

            }
            this.esGolIzquierdaReciente = true;
            //LLama a un estado "inicial" donde se restaura posicion del balon, posicion del jugador
            // y se vuelve a poner gol reciente = false; (tras un tiempo).

        }else if(this.balonSprite.body.x > (800-82+5) && this.balonSprite.body.y > (SAFE_ZONE_HEIGHT - 130)) {

            if(!this.esGolIzquierdaReciente && !this.esGolDerechaReciente) {
                marcadorDerecho += 1;
                console.log(marcadorDerecho);
                textoMarcador.setText(marcadorDerecho + ' - ' + marcadorIzquierdo);
                game.time.events.add(Phaser.Timer.SECOND * 2, estadoInicial, this);

            }
            this.esGolDerechaReciente = true;
        }
    }


}

Rectangulo = function (game) {
    this.bounds = new Phaser.Rectangle(0, 0, 800, 400 );

    this.customBounds = { left: null, right: null, top: null, bottom: null };

    this.graphics = game.add.graphics(bounds.x, bounds.y);
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.drawRect(0, 0, this.bounds.width, bounds.height);
}

Largueros = function(game) {

    //Crear 2 largueros en la posicion correcta.
    var x_larguero1 = 40;
    var y_larguero1 = SAFE_ZONE_HEIGHT-139;
    var x_larguero2 = SAFE_ZONE_WIDTH-40;
    var y_larguero2 = y_larguero1;

    this.largueroSprite1 = game.add.sprite(x_larguero1, y_larguero1, 'larguero');
    this.largueroSprite2 = game.add.sprite(x_larguero2, y_larguero2, 'larguero');

    //Añadimos fisica a cada uno de ellos.
    game.physics.p2.enable(this.largueroSprite1);
    this.largueroSprite1.physicsBodyType = Phaser.Physics.P2JS;
    game.physics.p2.enable(this.largueroSprite2);



    this.largueroSprite1.body.colideWorldBounds = true;
    this.largueroSprite1.body.mass = 100;
    this.largueroSprite1.body.setRectangle(82, 12);
    this.largueroSprite1.body.kinematic = true;


    this.largueroSprite2.body.collideWorldBounds = true;
    this.largueroSprite2.body.mass = 100;
    this.largueroSprite2.body.setRectangle(82,12);
    this.largueroSprite2.body.kinematic = true;


    //Hacemos transparente los largueros.
    this.largueroSprite1.alpha = 0;
    this.largueroSprite2.alpha = 0;

    //Añadimos material Largueros-Pelota y lo configuramos.
    //TODO: Añadir material de contacto que rebote larguero y pelota.

}

Suelo = function(game) {
    var x_suelo = SAFE_ZONE_WIDTH/2;
    var y_suelo = SAFE_ZONE_HEIGHT + 50;

    this.sueloSprite = game.add.sprite(x_suelo, y_suelo, 'suelo');

    //Añadimos física al suelo
    game.physics.p2.enable(this.sueloSprite);
    this.sueloSprite.body.mass = 100;
    this.sueloSprite.body.setRectangle( SAFE_ZONE_WIDTH, 50);
    this.sueloSprite.body.kinematic = true;
    this.sueloSprite.alpha = 0;

}

const SAFE_ZONE_WIDTH = 800;
const SAFE_ZONE_HEIGHT = 350;
const SAFE_ZONE_HEIGHT_world = 450;

var hasEnseñado = false;
var hasEnseñado1 = false;
var game;
var gameState;

var hasGanado = false; //True si has ganado al finalizar el partido, false en caso contrario.
var dificultad = 0; //Variable que se va actualizando si vas ganando partidos (rivales mas fuertes con mayor dificultad).
var DIFICULTAD_MAXIMA = 2;
var frameActual = 0; //Bandera actual seleccionada 0 = Albania...
var banderaActual;

var creaDificultad = [ //Array de funciones donde el elemento i crea el rival de dificultad i. O(1) complexity instead of O(n)
    function () {
        rival0 = new Rival0(myId, game, player);
        rivalSeleccionado = rival0;
        console.log("rival dificultad 0");
    },

    function() {
        rival1 = new Rival1(myId, game, player);
        rivalSeleccionado = rival1;
        console.log("rival dificultad 1");
    },

    function() {
        rival2 = new Rival2(myId, game, player);
        rivalSeleccionado = rival2;
        console.log("rival dificultad 2");
    }
];

var rivalSeleccionado;

window.onload = function() {
    game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT_world, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    /*Estado del Juego gameState*/
    gameState = function(game) {}
    gameState.prototype = {
        preload: function() {
            game.load.image('soccer_ball1', 'assets/soccer_ball1.png');
            game.load.image('soccer_ball', 'assets/shapes/86.png');
            game.load.image('jugador262', 'assets/jugadores/262.png');
            game.load.image('jugadorRival0', 'assets/jugadores/jugadorRival0.png');
            game.load.image('jugadorRival1', 'assets/jugadores/jugadorRival1.png');
            game.load.image('jugadorRival2', 'assets/jugadores/jugadorRival2.png');
            game.load.image('estadio', 'assets/shapes/329_2.png');
            game.load.image('estadio1', 'assets/shapes/fondo_estadio.png');
            game.load.image('porteria', 'assets/shapes/143.png');
            game.load.image('porteriaRotada', 'assets/shapes/143_rotada.png');
            game.load.image('larguero', 'assets/shapes/largueros.png');
            game.load.image('buttonDerecha', 'assets/shapes/botonDerecho.png');
            game.load.image('buttonIzquierda', 'assets/shapes/botonIzquierdo.png');
            game.load.image('suelo', 'assets/shapes/suelo.png');
        },
        create: function() {


            //dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();


            //Quitar Banner mientras el usuario juega.
            AdMob.hideBanner();

            //Código de creación del juego.

            //Sistema de fisicas P2JS
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.gravity.y = 400;
            console.log(game.physics.p2.gravity.y);




            //Creacion del fondo:
            var estadio = game.add.sprite(-20, 0, 'estadio');
            estadio.alpha = 0.8;



            //Creacion de los largueros
            largueros = new Largueros(game);

            //Creacion del suelo
            suelo = new Suelo(game);

            //Añadimos el background
            game.stage.backgroundColor = '#FFFFFF';

            //Creamos el objeto jugador que a su vez crea su sprite Jugador.jugador
            jugador1 = new Jugador(myId, game, player);
            balon = new Balon(game);

            //Creamos el OBJETO RIVAL en función de la variable global dificultad
            creaDificultad[dificultad]();

            //Creamos el material de los objetos
            crearMaterialObjetos(balon, jugador1, largueros, rivalSeleccionado);

            //Creacion de porterias
            var porteriaIzq = game.add.sprite(0, SAFE_ZONE_HEIGHT-164+25, 'porteria');
            var porteriaDer = game.add.sprite(SAFE_ZONE_WIDTH-82, SAFE_ZONE_HEIGHT-164+25, 'porteriaRotada');


            /*Creacion de rectangulos de area de gol en porterias:
             var graphics = game.add.graphics(0, 0);
             graphics.alpha = 0.4;
             graphics.beginFill(0xFF3300);
             graphics.lineStyle(10, 0xffd900, 1);


             graphics.drawRect(0, SAFE_ZONE_HEIGHT-130, 82, 150);

             graphics.endFill();

             window.graphics = graphics;*/


            //Creacion del timer:
            timer = game.time.create(false);
            //Cada segundo actualizamos timer
            timer.loop(1000, updateTimer, this);
            timer.start();

            //Texto del timer
            textTimer = game.add.text(game.world.centerX, 40, '00:00');

            //Texto marcadores:
            textoMarcador = game.add.text(game.world.centerX, 80, '0 - 0');
            textoMarcador.anchor.set(0.5);
            textoMarcador.align = 'center';
            textoMarcador.font = 'Arial';
            textoMarcador.fontSize = 30;

            //Center align
            textTimer.anchor.set(0.5);
            textTimer.align = 'center';
            //Font style
            textTimer.font = 'Arial';
            textTimer.fontSize = 50;


            //Empezamos el juego:

            //Creacion de cursores
            cursors = game.input.keyboard.createCursorKeys();

        },
        update: function() {
            jugador1.update();

            /*Llamamos al update unicamente del rivalSeleccionado (se selecciona en el create en funcion de la dificultad
            /en la que estamos)*/
            rivalSeleccionado.update();

            //Actualiza valores esGolIzquierda o esGolDerecha si ha habido gol
            balon.esGol();

            //Actualiza el timer
        }
    }

    /*Estado pantalla Inicial */
    inicialState = function(game) {}
    inicialState.prototype = {
        preload: function() {
            game.load.image('boton1', 'assets/inicialState/spriteBotonStart.png');
            game.load.image('boton2', 'assets/inicialState/spriteBotonTutorial.png');
            game.load.image('background', 'assets/inicialState/background2.jpg');
        },
        create: function() {
            //dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();

          

            //Añadimos fondo
            //Creacion del fondo:
            var estadio = game.add.sprite(0, 0, 'background');
            estadio.alpha = 1;

            //Creamos Banner en TOP
            AdMob.showBanner(AdMob.AD_POSITION.TOP_CENTER);

            MITAD_BOTON = 80;
            ALTURA_BOTON = 46;
            botonStart = game.add.button(SAFE_ZONE_WIDTH/2 - MITAD_BOTON, SAFE_ZONE_HEIGHT/2, 'boton1');
            botonStart.onInputDown.add(this.actionBotonStart, this);
            botonTutorial = game.add.button(SAFE_ZONE_WIDTH/2 - MITAD_BOTON, SAFE_ZONE_HEIGHT/2 + ALTURA_BOTON + 20, 'boton2');
            botonTutorial.onInputDown.add(this.actionBotonTutorial, this);
        },
        update: function() {},

        actionBotonStart: function() {
            dificultad = 0;
            game.state.start("ElegirState");
        },
        actionBotonTutorial: function() {
            game.state.start("TutorialState");
        }

    }

    /*Estado has ganado-Continuar*/
    hasGanadoPerdidoState = function(game) {}
    hasGanadoPerdidoState.prototype = {
        preload: function() {
            game.load.image('estado', 'assets/shapes/329_2.png');
            game.load.image('continuar', 'assets/inicialState/continuar.png');
            game.load.image('rematch', 'assets/inicialState/rematch.png');
        },
        create: function() {

            /*Esto ocurre siempre da igual si ganas o pierdes*/
            //dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();

            

            //Estadio de fondo
            var estadio = game.add.sprite(-20, 0, 'estadio');
            estadio.alpha = 0.8;
            
          //Creamos Banner en TOP
            AdMob.showBanner(AdMob.AD_POSITION.TOP_CENTER);


            //Datos de los botones
            MITAD_BOTON = 80;
            ALTURA_BOTON = 46;

            var nextRival;
            

            if(dificultad == 0 ){
                nextRival = "Next Rival: Round 2";
            } //TODO

            //Si has ganado boton continuar, si has perdido boton Re-match.
            if(hasGanado) {
                textoHasGanado = game.add.text(SAFE_ZONE_WIDTH/2 - 110, 50, 'VICTORY');
                textoNextRival = game.add.text(SAFE_ZONE_WIDTH/2, 115, nextRival);
                textoNextRival.anchor.set(0.5);
                textoNextRival.align = 'center';
                textoNextRival.fontSize = 25;
                textoHasGanado.align = 'center';
                textoHasGanado.fontSize = 50;
                botonContinuar = game.add.button(SAFE_ZONE_WIDTH/2 - MITAD_BOTON, SAFE_ZONE_HEIGHT/2, 'continuar');
                botonContinuar.onInputDown.add(this.actionBotonContinuar, this);
            } else {
                textoHasGanado = game.add.text(SAFE_ZONE_WIDTH/2 - 100, 50, 'DEFEAT');
                textoHasGanado.align = 'center';
                textoHasGanado.fontSize = 50;
                botonReMatch = game.add.button(SAFE_ZONE_WIDTH/2 - MITAD_BOTON, SAFE_ZONE_HEIGHT/2, 'rematch');
                botonReMatch.onInputDown.add(this.actionBotonReMatch, this);
            }




        },
        update: function() {},

        actionBotonContinuar: function() {
        	
        	 //Creamos intersticial cuando has perdido y estas en x niveles:
            if (dificultad == DIFICULTAD_MAXIMA-1 && hasEnseñado1 == false) {
                AdMob.showInterstitial();
                hasEnseñado1=true;
                game.state.start("HasGanadoPerdidoState");
            } else {
            	dificultad += 1;
	            minutes = 0;
	            seconds = 0;
	            marcadorDerecho = 0;
	            marcadorIzquierdo = 0;
	            game.state.start("GameState");
            }
        	
        },

        actionBotonReMatch: function() {

            //Creamos intersticial cuando has perdido y estas en x niveles:
            if (dificultad == DIFICULTAD_MAXIMA && hasEnseñado == false) {
                AdMob.showInterstitial();
                hasEnseñado=true;
                game.state.start("HasGanadoPerdidoState");
            } else {
	            minutes = 0;
	            seconds = 0;
	            marcadorDerecho = 0;
	            marcadorIzquierdo = 0;
	            game.state.start("GameState");
            }
        }




    }

    /*Estado Tutorial*/
    tutorialState = function(game) {}
    tutorialState.prototype = {
        preload: function() {
            game.load.image('tutorial', 'assets/shapes/tutorial.png');
            game.load.image('botonVolver', 'assets/shapes/botonVolver.png');
        },
        create: function() {

            //dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();
            
            //Creamos Banner
            AdMob.showBanner(AdMob.AD_POSITION.TOP_CENTER);


            //Background
            game.stage.backgroundColor = "#299a0b";

            //Imagen de fondo
            var tutorialImagen = game.add.sprite(0, 30, 'tutorial');


            botonVolver = game.add.button(160, 70, 'botonVolver');

            botonVolver.onInputDown.add(this.actionBotonVolver, this);

        },
        update: function() {

        },
        actionBotonVolver: function() {
            game.state.start("InicialState");
        }
    }

    /*Estado Elegir Equipo*/
    elegirState = function(game){}
    elegirState.prototype = {
        preload: function() {
            game.load.spritesheet('banderas', 'assets/banderassheet.png', 80, 53, 24);
            game.load.image('fondoEligeSeleccion', 'assets/EligeSeleccionState.png');
            game.load.image('flechaDerecha', 'assets/flechaDer.png');
            game.load.image('flechaIzquierda', 'assets/flechaIzq.png');
            game.load.image('boton1', 'assets/inicialState/spriteBotonStart.png');

        },
        create: function() {

        	//dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();
            
            //Creamos Banner
            AdMob.showBanner(AdMob.AD_POSITION.TOP_CENTER);
        	
            //Fondo EligeSeleccionState
            game.add.sprite(0, 0, 'fondoEligeSeleccion');


            banderaActual = game.add.sprite(316, 257 ,'banderas');
            banderaActual.frame = frameActual;
            banderaActual.scale.setTo(2, 2);

            var botonFlechaDerecha =  game.add.button(490, 248, 'flechaDerecha', this.actionBotonDerecha, this);
            var botonFlechaIzquierda =  game.add.button(150, 248, 'flechaIzquierda', this.actionBotonIzquierda, this);

            botonStart = game.add.button(SAFE_ZONE_WIDTH/2 - MITAD_BOTON, SAFE_ZONE_HEIGHT/4, 'boton1');
            botonStart.onInputDown.add(this.actionBotonStart, this);


        },
        update: function() {},
        actionBotonDerecha: function() {
            if(frameActual == 23) {
                frameActual = -1;
            }
            frameActual += 1;
            banderaActual.frame = frameActual;
            console.log("boton Derecha pulsado");
        },
        actionBotonIzquierda: function() {

            if(frameActual == 0) {
                frameActual = 24;
            }
            frameActual -= 1;
            banderaActual.frame = frameActual;
            console.log("boton Izquierda pulsado");
        },
        actionBotonStart: function() {
            game.state.start("GameState");
        }
    }

    /*Estado CampeonatoGanado*/
    campeonatoState = function(game) {}
    campeonatoState.prototype = {
        preload: function() {
            game.load.image('campeonato', 'assets/shapes/campeonato.png');
            game.load.image('botonVolver', 'assets/shapes/botonVolver.png');
        },
        create: function() {

            //dnassler approach
            game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();

            var campeonatoImagen = game.add.sprite(0, 0, 'campeonato');

            botonVolver = game.add.button(20, 355, 'botonVolver');

            botonVolver.onInputDown.add(this.actionBotonVolver, this);
        },
        update: function() {

        },
        actionBotonVolver: function() {
            minutes = 0;
            seconds = 0;
            marcadorDerecho = 0;
            marcadorIzquierdo = 0;
            dificultad = 0;
            hasEnseñado = false;
            hasEnseñado1 = false;
            game.state.start("InicialState");
        }
    }

    //Añadimos los estados al juego
    game.state.add("GameState", gameState);
    game.state.add("InicialState", inicialState);
    game.state.add("ElegirState", elegirState);
    game.state.add("HasGanadoPerdidoState", hasGanadoPerdidoState);
    game.state.add("TutorialState", tutorialState);
    game.state.add("CampeonatoState", campeonatoState);


    //Empezamos el estadoInicial
    game.state.start("InicialState");

}



function preload() {

    /*game.load.image('soccer_ball1', 'assets/soccer_ball1.png');
    game.load.image('soccer_ball', 'assets/shapes/86.png');
    game.load.image('jugador262', 'assets/jugadores/262.png');
    game.load.image('estadio', 'assets/shapes/329_2.png');
    game.load.image('estadio1', 'assets/shapes/fondo_estadio.png');
    game.load.image('porteria', 'assets/shapes/143.png');
    game.load.image('porteriaRotada', 'assets/shapes/143_rotada.png');
    game.load.image('larguero', 'assets/shapes/largueros.png');
    game.load.image('buttonDerecha', 'assets/shapes/botonDerecho.png');
    game.load.image('buttonIzquierda', 'assets/shapes/botonIzquierdo.png');
    game.load.image('suelo', 'assets/shapes/suelo.png');*/


}

var asteroides; //Grupo asteroides
var city; //Grupo city
var score = 0;
var scoreText;
var chocadoText;
var hasGanadoText;

var player;
var jugador1;
var balon;
var largueros;
var suelo;
var rival1;

var playerCollisionGroup;
var balonCollisionGroup;

function crearMaterialObjetos(balon, jugador1, largueros, rival1) {
    var balonMaterial = game.physics.p2.createMaterial('spriteMaterial', balon.balonSprite.body);
    var jugadorMaterial = game.physics.p2.createMaterial('spriteMaterial', jugador1.jugador.body);
    var sueloMaterial = game.physics.p2.createMaterial('spriteMaterial', suelo.sueloSprite.body);
    var largueroMaterial1 = game.physics.p2.createMaterial('spriteMaterial', largueros.largueroSprite1.body);
    var largueroMaterial2 = game.physics.p2.createMaterial('spriteMaterial', largueros.largueroSprite2.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
    var contactMaterialBalonWorld = game.physics.p2.createContactMaterial(balonMaterial, worldMaterial);
    var contactMaterialJugadorBalon = game.physics.p2.createContactMaterial(jugadorMaterial, balonMaterial);
    var contactMaterialBalonSuelo = game.physics.p2.createContactMaterial(balonMaterial, sueloMaterial);
    var contactMaterialBalonLarguero1 = game.physics.p2.createContactMaterial(balonMaterial, largueroMaterial1);
    var contactMaterialBalonLarguero2 = game.physics.p2.createContactMaterial(balonMaterial, largueroMaterial2);

    var rivalSeleccionadoMaterial = game.physics.p2.createMaterial('spriteMaterial', rivalSeleccionado.jugador.body);
    var contactMaterialRivalSeleccionadoBalon = game.physics.p2.createContactMaterial(rivalSeleccionadoMaterial, balonMaterial);

    //contactMaterial Balon-World
    contactMaterialBalonWorld.friction = 0.3;
    contactMaterialBalonWorld.restitution = 0.8;


    //contactMaterial Jugador-Balon
    contactMaterialJugadorBalon.friction = 0.3;
    contactMaterialJugadorBalon.restitution = 1.25;

    //contactMaterial Balon-Suelo
    contactMaterialBalonSuelo.friction = 0.3;
    contactMaterialBalonSuelo.restitution = 0.7;

    //contactMaterial Balon-Larguero1
    contactMaterialBalonLarguero1.friction = 0.3;
    contactMaterialBalonLarguero1.restitution = 0.7;

    //contactMaterial Balon-Larguero2
    contactMaterialBalonLarguero2.friction = 0.3;
    contactMaterialBalonLarguero2.restitution = 0.7;

    /* CONTACT MATERIAL RIVALES - BALON */
    contactMaterialRivalSeleccionadoBalon.friction = 0.6;

    //En funcion de la dificultad, mas rebote o menos en los rivales:
    if (dificultad < 4) {
        contactMaterialRivalSeleccionadoBalon.restitution = 0.8;
    } else {
        contactMaterialRivalSeleccionadoBalon.restitution = 0.9;
    }

}

var textTimer;
var timer;
var marcadorIzquierdo = 0;
var marcadorDerecho = 0;
var textoMarcador;

function create() {

    //dnassler Approach
    game.stage.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVertically = true;
    //game.stage.scale.refresh();




}

var minutes = 0;
var seconds = 0;

var GAME_LENGTH = 1;
function updateTimer() {

    seconds += 1;
    console.log(seconds);
    console.log(minutes);

    if (seconds == 60) {
            minutes += 1;
            seconds = 0;
    }


    if (seconds < 10) {
        secondsTexto = '0' + seconds;
    } else {
        secondsTexto = seconds;
    }

    if (minutes < 10) {
        minutesTexto = '0' + minutes;
    } else {
        minutesTexto = minutes;
    }

    if ( minutes >= GAME_LENGTH) { //Finaliza la partida si alguien ha ganado

        if(marcadorIzquierdo > marcadorDerecho) { //Has perdido
            hasGanado = false;
            game.state.start("HasGanadoPerdidoState");

        }else if (marcadorIzquierdo < marcadorDerecho) { //Has ganado
            hasGanado = true;

            //Si has ganado y estas en la maxima dificultad, has ganado el campeonato:
            if (dificultad == DIFICULTAD_MAXIMA) {
            	
                game.state.start("CampeonatoState");
            } else {
                game.state.start("HasGanadoPerdidoState");
            }



        }

    }

    textTimer.setText(minutesTexto + ':' + secondsTexto);
}


function update() {

    jugador1.update();

    //Actualiza valores esGolIzquierda o esGolDerecha si ha habido gol
    balon.esGol();

    //Actualiza el timer



}

function render() {

}