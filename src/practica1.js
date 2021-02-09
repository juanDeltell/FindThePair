
/*
• MemoryGame(gs): La constructora recibe como parámetro el servidor grá-
fico, usado posteriormente para dibujar.

• initGame(): Inicializa el juego añadiendo las cartas, desordenándolas y
comenzando el bucle de juego.

• draw(): Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
del juego y (2) pide a cada una de las cartas del tablero que se dibujen.

• loop(): Es el bucle del juego. En este caso es muy sencillo: llamamos al
método draw cada 16ms (equivalente a unos 60fps). esto se realizará con
la función setInterval de Javascript.

• onClick(cardId): Este método se llama cada vez que el jugador pulsa
sobre alguna de las cartas (identificada por el número que ocupan en el
array de cartas del juego). Es el responsable de voltear la carta y, si hay
dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
encontradas). En caso de no ser la misma las volverá a poner boca abajo(1)

(1)Para realizar la animación que aparece en el vídeo se puede utilizar la función setTimeout,
haciendo que pasados unos cuantos milisegundos las cartas se pongan boca abajo. ¡Cuidado!:
para evitar comportamientos extraños tendrás que ignorar los eventos de ratón mientras que
la carta está siendo volteada.

var hola = function (){}
*/



var MemoryGame = function(gs) {
	
	this.cartas = ["8-ball", "potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin"];
	this.estadoJuego;
	this.parejas=0;
	this.mensajePantalla;
	this.mazo = [];
	this.gs = gs;
	this.haySeleccionada = 0;
	this.nombreCartaYaSeleccionada;
	this.cartaYaSeleccionada;
	this.InitGame = function() {
		
		//añadir cartas

		for(i in this.cartas){
			this.mazo.push(new this.card(this.cartas[i]));
			this.mazo.push(new this.card(this.cartas[i]));
			this.parejas++;
		}
		
		//desordenar cartas
		this.mazo.sort(function() {return Math.random() - 0.5});
		gs.drawMessage("Click and find pairs.");
		this.draw();
		//bucle del juego
		this.loop();
   
	};

	this.draw = function() {
		
   		//pedir carta
   		for(i in this.mazo)
			this.mazo[i].draw(this.gs, i);
	};

	this.loop = function() {
		//llamamos al metodo draw cada 16ms
		var that = this;
   		this.bucle = setInterval(function() {
			that.draw();
		}, 16);
		
	};

	this.onClick = function(cardID)
	{
		//No hacer caso al click
		if(this.esperando)
			return;
		
		//var seleccionada = this.mazo[cardID];
		var seleccionada = this.mazo[cardID];
		
		if(seleccionada.spriteActivo != "back") {
			return;
		}
		
		
		if(!seleccionada)
			return;
		//seleccionar carta pinchada y poner boca arriba
		seleccionada.flip();
		this.draw();
		
		//si hay dos cartas => comprobar si tienen el mismo nombre
		if(this.haySeleccionada == 0)
		{
			this.haySeleccionada = 1;
			this.nombreCartaYaSeleccionada = this.mazo[cardID].sprite;
			this.cartaYaSeleccionada = this.mazo[cardID];
		}
		else//ya hay seleccionada
		{
			if(seleccionada.comparteTo(this.nombreCartaYaSeleccionada)){
				gs.drawMessage("Match found!!");
				seleccionada.found();
				this.cartaYaSeleccionada.found();
				this.parejas--;
			}
			else//son distintas
			{
				gs.drawMessage("Try Again!!");
				
				//Retardar las cartas
				this.esperando = true;
				clearInterval(this.bucle);
				seleccionada.flip();
				var that = this;
				this.cartaYaSeleccionada.flip();
				setTimeout(function(){
					that.esperando = false;
					that.loop();
				}, 1000);
				
			}
			this.haySeleccionada = 0;
		}
		
		//escribir el estado actual del juego
		if(this.parejas==0)
			gs.drawMessage("You win!!");

	};

};


MemoryGame.prototype.card = function(sprite) {
	
	this.estadoEncontrado = false;
	this.spriteActivo = "back";
	this.sprite = sprite;
	

	this.flip = function() {
		if(!this.estadoEncontrado){
			if(this.spriteActivo == "back")
				this.spriteActivo = this.sprite;
			else
				this.spriteActivo = "back";
		}
	};

	this.found = function() {
		
		this.estadoEncontrado = true;	
	};

	this.comparteTo = function(otherCard) {
		var resultado;
		if(this.spriteActivo == otherCard)
			resultado = true;
		else
			resultado = false
		return resultado;
	};

	this.draw = function(gs, pos) {
		
		gs.draw(this.spriteActivo, pos);
	};

};

function myFunction(){
	
	};
