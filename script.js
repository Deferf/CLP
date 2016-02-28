"use strict";

//varibles globales---------------------------------
var _mesero = "Andres";
var _mesa = "0";
var _togo = false;
var _platos = [];
var _bebida = [];
var _aux = {};
var _edLocal = 0;
var _edReal = 0;
var cambios = 0;
var _plattemp = [];
var _nmesas = 22;
//--------------------------------------------------
var idEdicion;
var arrayVerdura = ["lechuga", "cebolla", "quesosec", "queso", "crema", "pepino", "zanahoria", "carne", "papa"]; // "gordita", "tostada"];

//Una funcion que asigne una id ya sea pieza o plato
var Id = function(tipo){
	//Encontrar variable global, buscar huecos, etc...
	//Por ahora dará un numero al azar
	var n = Math.floor(Math.random()*9000) + 1000;
	return n;
}

//menu = menu.responseText;
//menu = JSON.parse(menu.responseText);

//Objeto final final superset del pedido

function Request(tipo, data){
	this.tipo = tipo;
	this.data = data;

}

//Objeto base final si logro que tenga esta estructura seré dios...ya lo hice...SOY DIOS!
function Pedido(folio, mesero, mesa, togo,_platos, _bebida, aux){
	this.folio = folio;
	this.estado = "abierto";
	this.mesero = mesero;
	this.mesa = mesa;
	this.togo = togo;
	this.orden = {};
	this.orden["platos"] = _platos;
	this.orden["bebida"] = _bebida;
	this.orden["aux"] = aux;
	this.estado = "Abierto";
	this.fecha = new Date();
	this.version = "2.0";
}

//Objeto base de taco
var Pieza = function(tipo,variacion){
	var arring = _menu["menu"][tipo][variacion]["ingredientes"]
	//this.id = Id("pieza");
	this.nombre =  _menu["menu"][tipo][variacion]["nombre"];
	this.tipo = tipo;
	this.variacion = variacion;
	this.cantidad = 1;
	this.precio = _menu["menu"][tipo][variacion]["precio"];
	arring ? this.ingredientes = objetoIngredientes(arring): this.ingredientes = [];
	this.notas = "";
	this.estado = "";
	this.id = Id(tipo);
}
/*
var Caldo = function(tipo){
	this.tipo = tipo;
	this.cantidad = 1;
	this.precio = 60;
	this.ingredientes = ["grano", "carne", "caldo", "pata"];			//Array de ingredientes inicial, luego veo como eliminar la opcion gordita y tostada
	this.notas = "";
	this.estado = "";
}
*/

//Devuelve un objeto a partir de un array de ingredientes
var objetoIngredientes = function(arring){
	var l = arring.length;
	var o = {};
	for(var a = 0; a < l; a++){
		o[arring[a]] = true;
	}
	return o;
}

//Esta funcion crea un formulario de pieza o no?, debe recibir la pieza no buscarla en un objeto
var piezaEditar = function(o, bool, lugar){
	//proximo if para saber si es una pieza nueva o se esta formeando una pieza
	if(bool){//Objeto de pieza
		var pieza = o;
	}
	else//Objeto nesteado
	{
		var pieza = o["orden"]["platos"]["piezas"];
	}
	
	var ident = pieza["id"].toString();
	//se crea un div en #back por que no?
	$(lugar).append("<div tipo='" + pieza.tipo + "' variacion='" + pieza.variacion + "' id='" + ident + "' data-role='none'></div>")
	var padre = $(lugar)[0]["lastChild"];								//En un futuro esto variará y se asignara el tag al que se quiere adherir lo parseado
	$(padre).append("<h1>" + pieza.nombre + "</h1>");
	$(padre).append("<span>Cantidad:</span><br><input type='text' name='cantidad' value='1'><br>");
	var ingres = pieza.ingredientes;	
	for(var ingrediente in ingres)					//Crea el listado de ingredientes
	{
		$(padre).append("<input type='checkbox' " + (ingres[ingrediente] == "true"? "checked" : "") + " tipo='ingrediente' name='" + ingrediente + "'>");
		$(padre).append("<span>" + ingrediente + "</span><br>");
	}
	$(padre).append("<span>Comentarios:</span><br> <input type='text' name='comentarios' value='" + pieza.notas + "''>");
	$(padre).append("<button type='button' onclick='sobreEscribir(this)'>Enviar Edición</button>");
}

//En una futura version esta madre DEBE ser menos dependiente del DOM y mas flexible para ser reutilizable
var piezaForma = function(pieza, esto){ //Dime en donde poner la forma y yo la hago
	var ident = Id(pieza.tipo);
	$("#revpedido").append("<div tipo='" + pieza.tipo + "' variacion='" + pieza.variacion + "' id='" + ident + "'></div>")
	var padre = $("#revpedido");								//En un futuro esto variará y se asignara el tag al que se quiere adherir lo parseado
	$(padre).append("<h1>" + pieza.nombre + "</h1>");
	$(padre).append("<span>Cantidad:</span><br><input type='text' name='cantidad' value='1'><br>");
	var l = pieza.ingredientes.length;						//Crea el listado de ingredientes
	for(var a = 0; a < l; a++){
		$(padre).append("<input type='checkbox' checked tipo='ingrediente' name='" + pieza.ingredientes[a] + "'>");
		$(padre).append("<span>" + pieza.ingredientes[a] + "</span><br>");
	}
	$(padre).append("<span>Comentarios:</span><br> <input type='text' name='comentarios'>");

}

var nPlato = function(){
	//$("forth")
	var id = Id("plato").toString();
	var padre = ("#" + id);
    $("#forth").append("<div id='" + id + "' tipo='Plato'></div>");
    mostrarMenu(_menu,padre);
    //$("#headerMenuRight").controlgroup("container").prepend('<a onclick=' + "'appendPieza()'" +' class="ui-btn ui-corner-all ui-shadow ui-icon-bars ui-btn-icon-notext">Parse</a>');
    //$("#headerMenuRight").controlgroup("refresh");
    /*
    $(padre).append("<button type='button' onclick='nTaco(this)'>Taco</button>");
    $(padre).append("<button type='button' onclick='nGordita(this)'>Gordita</button>");
    $(padre).append("<button type='button' onclick='nFlauta(this)'>Flauta</button>");
    $(padre).append("<button type='button' onclick='nPozole(this)'>Pozole</button>");
    $(padre).append("<button type='button' onclick='liberar(this)'>Clear</button>");*/
}

var resetShit = function(){
	_mesero = "Andres";
	_mesa = "0";
	_togo = false;
	_platos = [];
	_bebida = {};
	_aux = {};
	_plattemp = [];
	$("#revpedido").html("");
	$("div[data-role|='collapsible']" ).collapsible("collapse")
} 

//Lee los inputs 
var parser = function(esto){
	console.log("parser(): funcionando")
	var opl = {};
	var padre = esto.parentNode;
	var l = padre.children.length;
	var op = [];/*
	for(var a = 0; a < l; a++){
		var div = padre.childNodes[a];
		if(div.tagName == "DIV" && div.hasAttribute("tipo")){
		var f = piezaParser(div);
		op.push(f);

		}
	}*/
	console.log("El padre es " + padre.id);
	var d = padre.id;
	opl["piezas"] = /*op*/ _plattemp;
	opl["id"] = d;
	console.log(padre.children.length);
	console.log(padre.children[1].tagName == "DIV");
	console.log(JSON.stringify(opl));
	liberar(esto);
	_platos.push(opl);
	console.log("El objeto platos es " + JSON.stringify(_platos));
	//$("#forth").append("<button type='button' onclick='enviar(this)'>Enviar</button>");
	return opl;
}

//grega los objetos de piezas al objeto global
var appendPieza = function(){
	if(_plattemp != false){
	console.log("appendPieza(): funcionando")
	var opl = {};
	opl["piezas"] = /*op*/ _plattemp;
	opl["id"] = Id("plato");
	console.log(JSON.stringify(opl));
	//liberar(esto);
	_platos.push(opl);
	console.log("El objeto platos es " + JSON.stringify(_platos));
	//$("#forth").append("<button type='button' onclick='enviar(this)'>Enviar</button>");
	return true;
	}
	else{
		window.alert("Elige un plato paro");
		return false;
	}
	

}

var piezaParser = function(div){
	var objPiez;
	var op = [];
	
//Se empiezan a buscar las formas individuales para parsear
	{
		//console.log(padre.children[a].tagName);
//Aqui se determina el div que contiene la forma
		if(div.tagName == "DIV" && div.hasAttribute("tipo")){
			var id = div.id;
			var tip = div.getAttribute("tipo");
			var variacion = div.getAttribute("variacion");
//Se crea un nuevo objeto de pieza
			objPiez = new Pieza(tip,variacion);
//Como me da weba modificar el codigo del piezaForma mejor hago que ingredientes sea un objeto/diccionario
			objPiez["ingredientes"] = {};
			objPiez["id"] = id;
			/*console.log("Se encontro div, id " + id);
			console.log(div.attributes);
			console.log("El tipo del nodo es " + div.getAttribute("tipo"));
			console.log("Ruta " + div);
			console.log(JSON.stringify(objPiez));*/
 			var largo = div.children.length;
//Si hay un input dentro del div se guarda en el objeto
			for(var b = 0; b < largo; b++){
//Children[a] busca divs, children[b] busca inputs
				var ruta = div.children[b];
//Si hay cualquier nodo con un atributo tipo se le asignara al objeto
				if(ruta.tagName == "INPUT"){
					console.log("Se encontro input " + ruta.type + ", de " + ruta.name);
//Para seguir con el formato del JSON se separan las checkboxes
					if(ruta.type == "checkbox"){
						console.log(ruta.tipo == "ingrediente");
						var key = ruta.name;
						//op[id]["ingredientes"] = {};
 						objPiez["ingredientes"][key] = ruta.checked;
					}
//Para todo lo demas existe Master Card
					else{
						var key = ruta.name;
						objPiez[key] = ruta.value;
					}
				}
			}
		(objPiez);
		}
	}
	console.log(JSON.stringify(objPiez));
	return objPiez;
}
//???
var liberar = function(esto){
	console.log(esto);
	//esto.parentNode.innerHTML = ('');
	document.getElementById("revpedido").removeChild(esto.parentNode);
	//resetShit();
}

var enviar = function(esto){
	//for(var a = 0; a < ; a ++)parser(esto[a]);
	if(appendPieza()){
		var folio = Id();
		var npedido = new Pedido(folio, "Andres", _mesa, true, _platos, {}, {});
		//console.log(npedido);
		var nreq = new Request("store",npedido)
		$.post( "controller.php", nreq ).done(function( data ) {
    	if ( console && console.log ) {
    	console.log( data );
    	}});
    	resetShit();
	}
	else{

	}

}
// Todas estas funciones se unificaran en un EnviarRequest(tipo,datos), ya debe estar la pieza parseada eso de parsear aqui como que noo
var sobreEscribir = function(div){
	console.log(div.parentNode);
	var npedido = piezaParser(div.parentNode);
	var edicion = {
		"pieza" : npedido,
		"idPlato" : idEdicion
	}
	var nreq = new Request("edit", edicion)
	//console.log(npedido);
	$.post( "controller.php", nreq ).done(function( data ) {
    if ( console && console.log ) {
      console.log( data );
    }});

    resetShit();
}

function checkChanges(){
	//console.log("checkChanges(): funcionando")
	var nreq = new Request("changeCheck",{"dummy":"dummy"});
	$.post( "controller.php", nreq ).done(function( data ) {
		var nume = parseInt(data);
		console.log("ResponseText: " + data + typeof nume);
    	console.log("Cambios: " + cambios + typeof cambios);
    	
    	if(cambios != nume){
    	cambios = nume;
    	retrieve();
    }
	});
}
//Devovler los abiertos
function retrieve() {
	var nreq = new Request("retrieve",{"estado":"Abierto"});
	$.post( "controller.php", nreq ).done(function( data ) {
		var a = JSON.parse(data);
		//console.log(a);
    	ficha(a);
	});
	
}

function flush() {
	var nreq = new Request("flush",{});
	$.post( "controller.php", nreq );
}

var platoLeer = function(o, t){
	//$("#forth").append("<br><span class='listado'>" + n + " ordenes activas </span><br>");
	$("#forth").append("<table id='tpedidoactivo' style='tpedidos'></table");
	var t = document.getElementById("tpedidoactivo");
	var l = o.length;
	for(var b = 0; b < l ; b++){
	var piezas = o[b]["piezas"];
	var idPlato = o[b]["id"];
	var z = piezas.length;
	console.log("Hay " + z + " pieza en el plato " + idPlato);
		for(var c = 0; c < z; c++){
		
			//$("#tpedidos").append("<td>" + plat[b]["cantidad"] + "</td")
			var tr = document.createElement("tr");
			var piez = piezas[c];
			var cant = document.createElement("td");
			cant.innerHTML = piez["cantidad"]
			tr.appendChild(cant);
			cant = document.createElement("td");
			cant.innerHTML = piez["tipo"]
			console.log(c);
							//console.log(tabla.children[c]);
			tr.appendChild(cant);
			var  noIng = [];
			for(var dat in piez){
				if(dat == "ingredientes"){
					var  noIng = [];
					console.log("Ingredientes encontrados");
					var ingre = piez[dat];
						for(var cosa in ingre){
							if(ingre[cosa] == "false"){
								var cos = cosa.toString()
								noIng.push(cos);
								}
										//$("#back").append("<span class='listado_ingredientes'> "+ cosa.toString() + " " + ingre[cosa].toString() + "</span><br>");
						}
									
				}
								//else
									//$("#back").append("<span class='listado_piezas'>" + dat.toString() + " " + piez[dat].toString() + "</span><br>");
			}
			noIng[0] ? $(tr).append("<td style='background-color:pink'>Sin "+ noIng.join(', ') + "</td>") : undefined;
			piez["comentarios"] ? $(tr).append("<td style='background-color:light-gray'>"+ piez["comentarios"] + "</td>") : console.log(piez["cometarios"]);
			t.appendChild(tr);

						}
}
}
var ficha = function(o){
		document.getElementById("back").innerHTML = '';
		var n = o.length.toString();
		if(o[0]){
		console.log(JSON.stringify(o));
		//          o[a].orden.platos[b].piezas[c].ingredientes.lechuga);
		console.log(o[0].orden.platos[0].piezas[0].ingredientes.lechuga);
		$("#back").append("<br><span class='listado'>" + n + " ordenes activas </span><br>");
		$("#back").append("<table id='tpedidos' style='tpedidos'></table");
		var tabla = document.getElementById("tpedidos");
		//Este loop busca en el array de pedidos obtenido 
		for(var a = 0; a < n; a++){
			var pedido = o[a];
			var th = document.createElement("th");
			th.innerHTML = "Pedido " + o[a].mesa;
			tabla.appendChild(th);

			//Se busca la meta-informacion y se aislan las propiedades orden y bebida
			for(var prop in pedido){
				var orden = pedido[prop];
				if(prop == ("orden" || "bebidas")){

					var plat = orden["platos"];
					var l = plat.length;
					//Se busca en el array de platos
					for(var b = 0; b < l; b++){

						//platoLeer(orden["platos"],tabla);

						var piezas = plat[b]["piezas"];
						var idPlato = plat[b]["id"];
						var z = piezas.length;
						console.log("Hay " + z + " pieza en el plato " + idPlato);
						var tr = tabla.children[a];
						//Se buscan piezas en el array,
						for(var c = 0; c < z; c++){
							
							//$("#tpedidos").append("<td>" + plat[b]["piezas"][c]["cantidad"] + "</td")
							var tr = document.createElement("tr");
							var piez = piezas[c];
							var cant = document.createElement("td");
							cant.innerHTML = piez["cantidad"]
							tr.appendChild(cant);
							cant = document.createElement("td");
							cant.innerHTML = piez["nombre"];
							console.log(c);
							//console.log(tabla.children[c]);
							tr.appendChild(cant);
							
							var  noIng = [];
							for(var dat in piez){

								if(dat == "ingredientes"){
									var  noIng = [];
									console.log("Ingredientes encontrados");
									var ingre = piez[dat];
									for(var cosa in ingre){
										if(ingre[cosa] == "false"){
											var cos = cosa.toString()
											//$("#back").append("<span class='listado_ingredientes'>Sin "+ cos + "</span><br>");
											//$(tr).append("<td style='background-color:pink'>Sin "+ cos + "</td>");
											noIng.push(cos);
											//tpedidos.children[b].
										}
										//$("#back").append("<span class='listado_ingredientes'> "+ cosa.toString() + " " + ingre[cosa].toString() + "</span><br>");
									}
									
								}
								//else
									//$("#back").append("<span class='listado_piezas'>" + dat.toString() + " " + piez[dat].toString() + "</span><br>");
							}
							noIng[0] ? $(tr).append("<td style='background-color:pink'>Sin "+ noIng.join(', ') + "</td>") : undefined;
							piez["comentarios"] ? $(tr).append("<td style='background-color:light-gray'>"+ piez["comentarios"] + "</td>") : console.log(piez["cometarios"]);
							//console.log(tr);
							cant = document.createElement("td");
							cant.innerHTML = "<button id='" + piez.id +  "' onclick=editar(this," + "'pieza'" + ") >Editar</button>";
							tr.appendChild(cant);

							tabla.appendChild(tr);

						}
					}
				}
				else if(prop != "_id"){
					$("#back").append("<span class='listado'> "+ prop.toString()+ " " + o[a][prop].toString()+ "</span><br>");

				}
			}
			$("#back").append("<br>");
		}
	}	
		else{
			$("#back").append("<br><span class='listado'>" + n + " ordenes activas </span><br>");
		}
}

var stopRetrieving = function(){
	clearInterval(intervalo);
}

var editar = function(a,tipo){
	console.log(a.id);
	var o = {"tipo" : tipo,"id" : a.id };
	var nreq = new Request("search",o)
	$.post( "controller.php", nreq ).done(function( data ) {
    if ( console && console.log ) {
      console.log( data );
      o = JSON.parse(data);
      console.log(o.orden.platos.id);
      idEdicion = o.orden.platos.id;
      piezaEditar(o, false, "#back");
    }});
}
//Muestra el menu, altamente experimental
var mostrarMenu = function(omenu,padre){
	var men = omenu["menu"];
	for(var plat in men){
		console.log(plat);
		//$(padre).append("<h4>" + plat +"</h4");
		var collap = document.createElement("div");
		collap.setAttribute("data-role","collapsible");
		collap.setAttribute("data-content-theme","false");
		collap.setAttribute("data-mini","true");
		collap.setAttribute("data-collapsed-icon","carat-d");
		collap.setAttribute("data-expanded-icon","carat-u");
		collap.setAttribute("class","lista");
		$(collap).append("<h4>" + plat +"</h4");
		for(var piez in men[plat]){
			var but = document.createElement("button");
			but.setAttribute("tip", plat);
			but.setAttribute("subtip", piez);
			but.setAttribute("class","ui-btn ui-mini ui-btn-inline");
			but.innerHTML = men[plat][piez]["nombre"];
			console.log(but);
			//console.log("---> " + men[plat][piez]["nombre"] + " $" + men[plat][piez]["precio"]);
			var pl = "'" + plat.toString() + "'";
			var pi = "'" + piez.toString() + "'";
			var a = "nPieza(" + "this," + pl + "," + pi + ")";
			console.log(a);
			but.setAttribute("onclick", a);
			$(collap).append(but);
			//$(collap).enhanceWithin();
			//$("#forth").append("<button class='button-circle' onclick='console.log(this)>" + men[plat][piez]["nombre"] + "</button>");
		}
		$(padre).append(collap);
		$(padre).enhanceWithin();
	}
}

var nPieza = function(esto, tip, subtip){
	var piez = new Pieza(tip, subtip);/*piezaForma(piez,esto)}*/
	console.log(piez);
	_plattemp.push(piez);
	var l = _plattemp.length;
	var b = "";
	for(var a = 0; a < l; a++){
		var lapieza = _plattemp[a];

		b = b + "<a onclick='findundEdit(" + lapieza["id"] + ")'> " + lapieza["nombre"] +"</a>";
		//console.log(b);
	}
	$("#revpedido").html(b);
}

var findundEdit = function(id){
	var l = _plattemp.length;
	var a = 0;
	for(; a < l; a++){
		if(_plattemp[a]["id"] == id){
			break;
		}
	}
	console.log(_plattemp[a]);
	piezaEditar(_plattemp[a],true, "#editarPop");
    $(':mobile-pagecontainer').pagecontainer('change', '#Pop', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
}

var cancelarPedido = function(){
	resetShit();
	$(':mobile-pagecontainer').pagecontainer('change', '#pedact', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
}

var cambiarMesa = function(m){
	_mesa = parseInt(m);
}

//Genera la tabla de mesas
var generarMesas = function(nmesas){
	var a = Math.ceil(nmesas/4);
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var num = 0;
	//Filas
	for(var b = 0; b < a; b++){
		var tr = document.createElement("tr");
		//Columnas
		for(var c = 1; c <= 4; c++){
			num = (b * 4) + c
			var td = document.createElement("td");
			td.setAttribute("class","contenedorBoton");
			var bt = document.createElement("button");
			bt.setAttribute("data-role","none");
			bt.setAttribute("class","botonMesa");
			bt.setAttribute("name", num);
			bt.setAttribute("onclick", "cambiarMesa(" + num.toString() +")");
			bt.innerHTML = num;
			td.appendChild(bt);
			tr.appendChild(td);
			if(num == nmesas) {break;}
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	table.setAttribute("id","tablaMesas");
	$("#contenidoMesas").append(table);
}

//Preliminar: Te saca el total de una cuenta
var total = function(folio){
	var req = new Request("retrieve", {"folio": folio});
	$.post( "controller.php", req ).done(function( data ) {
		var a = JSON.parse(data);
		console.log(a);
    	totalCB(a);//Utiliza un callback por el pishi asynchronous
	});	
}

//encuentra los precios
function totalCB(o) {
	var sigma = 0;
	var orden = o.orden;
	//Por ahora nos concentraremos en piezas, bebidas despues
	var platos = orden.platos;
	var l = platos.length;
	//Aqui se va de plato en plato a
	for(var a = 0; a < l; a++){

		var lb = platos[a].piezas.length;
		for(var b = 0; b < lb; b++){
			//Por seguridad se realiza un cast de tipo, ya que hay problemas con el DB sobre la mezcolanza de tipos de variable
			var cast = parseInt(platos[a].piezas[b].precio);
			sigma += cast;
		}
	}
	return sigma;
}


var nTaco = function(esto){var a = new Pieza("tacos","regular");piezaForma(a,esto)}

var nGordita = function(esto){var a = new Pieza("gorditas");piezaForma(a,esto)}

var nFlauta = function(esto){var a = new Pieza("flautas");piezaForma(a,esto)}

var nPozole = function(esto){var a = new Caldo("caldos");piezaForma(a,esto)}

$( document ).ready(function() {
	generarMesas(_nmesas);
	//Funcion temporal que agrega un boton para parsear
    $("#forth").append("<button type='button' onclick='nPlato()'>Nuevo Plato</button>");
    //$("#forth").append("<button type='button' onclick='enviar(this)'>Enviar</button>");
    $("#mypanel").append("<button type='button' onclick='flush()'>Flush</button>");
    $("#mypanel").append("<button type='button' onclick='stopRetrieving()'>Stop Retrieving</button>");
    $("#back").append("<button type='button' onclick='retrieve()'>Retrief</button>");
        // Bind the swiperightHandler callback function to the swipe event on div.box
  $( "#pedact" ).on( "swiperight", swiperightHandler );
  $( "#back" ).on( "swipeleft", swipeleftHandler);
 
  // Callback function references the event target and adds the 'swiperight' class to it
  function swiperightHandler(  ){
    $( "#mypanel" ).panel( "open" );

  }

  function swipeleftHandler(  ){
    $(':mobile-pagecontainer').pagecontainer('change', '#forth', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });

  }
});
//window.setInterval(function(){platoLeer(platos, document.getElementById("tpedidos"))},100);
var intervalo = window.setInterval(checkChanges,200);