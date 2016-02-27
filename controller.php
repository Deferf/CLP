<?php

	$tipo = $_POST["tipo"];
	$datos = $_POST["data"];
//Registra un cambio
	function change(){
		//global $a;

		$a = new MongoClient();

		$admin = $a->cenaduria->admin;

		$id = new MongoId("000000000000000000000000");

		$ide = array("_id" => $id);

		$change = array("$" . "inc" => array("cambios" => 1));

		$admin->update($ide,$change);
	}
//Regresa todos los pedidos que cumplen cierto creiterio $query
	function retrieve($query){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$cursor = $pedidos->find($query);

		$listaPedidos = array();

		foreach ($cursor as $ordenes){
			
			$listaPedidos[] = $ordenes;
		}

		return $listaPedidos;
	}
//Elimina todos los documentos que cumplen cierto criterop $query
	//o elimina todo con $flush == true
	function remove($query){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$cursor = $pedidos->remove($query);

		change();
	}
	function flushdb(){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$cursor = $pedidos->remove(array());

		change();
	}
//Guarda un pedido
	function store($objeto){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$pedidos->save($objeto);

		change();

		return $objeto;
	}

	function changeCheck($num){
		//global $a;

		$a = new MongoClient();

		$admin = $a->cenaduria->admin;

		$id = new MongoId("000000000000000000000000");

		$ide = array("_id" => $id);

		$cursor = $admin->find($ide);

		$cambios = array();

		foreach ($cursor as $ordenes){

		$cambios[] = $ordenes;

		}
		//Devolver solo el numero o todo el documento?
		
		if($num){
			return $cambios[0]["cambios"];
		}
		else{
			return $cambios[0];
		}
		
		//return $cambios;
	}

	function search($orden){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$ide = $orden['id'] . "";

		if($orden['tipo'] == "pieza"){
			$sq = array('orden.platos.piezas.id' => $ide);
		}
		else{
			$sq = array('orden.platos.id' => $ide);
		}
		//Arreglar para que busque plato y piezas
		$fuckingQuery = array(
			array(
				"$" . "match" => array(
				"orden.platos.piezas.id" => $orden['id']
			)),
			array(
				"$" . "project" => array(
			//"orden.platos.piezas" => 1
				"orden.platos" => 1
			)),
			array(
				"$" . "unwind" => "$" . "orden.platos"),
			array(
				"$" . "unwind" => "$" . "orden.platos.piezas"),
			array(
				"$" . "match" => array(
				"orden.platos.piezas.id" => $orden['id']
			)),
			array(
				"$" . "project" => array(
			//"orden.platos.piezas" => 1,
				"orden" => 1,
				"_id" => 0
			)),
		);

		$kurtz = $pedidos->aggregate($fuckingQuery); 
	
		$listaPedidos = array();

		foreach ($kurtz["result"] as $ordenes){
			$listaPedidos[] = $ordenes;	
		}

	return $ordenes; 
	
	}

	function edit($req){
		//global $pedidos;

		$a = new MongoClient();

		$pedidos = $a->cenaduria->pedidos;

		$idPlato = $req["idPlato"];

		$idPiez = $req["pieza"]["id"];

		$finder = array(
			"orden.platos.id" => $idPlato,
			"orden.platos.piezas" => array(
			"$" . "exists" => 1
			)
		);

		$puller = array(
			"$" . "pull" => array(
				"orden.platos.$.piezas" => array(
					"id" => $idPiez
					)
			)
		);

		$pusher = array(
			"$" . "push" => array(
				"orden.platos.$.piezas" => $req["pieza"]
		));

		$pedidos->update($finder,$puller);

		$pedidos->update($finder,$pusher);

		change();
	}

	switch ($tipo) {
    case "retrieve":
        echo json_encode(retrieve($datos));
        break;
    case "remove":
        echo json_encode(remove($datos));
        break;
    case "store":
        echo json_encode(store($datos)/*, JSON_NUMERIC_CHECK*/);
        break;
    case "changeCheck":
        echo json_encode(changeCheck(true));
        break;
    case "search":
        echo json_encode(search($datos));
        break;
    case "flush":
        echo json_encode(flushdb());
        break;
    case "edit":
        echo json_encode(edit($datos));
        break;
    default:
    	$a = $_POST["data"]["numero"];
    	echo json_encode($a);//array("version" => "2.0", "request" => "error", "data" => array("error" => $_POST)));
}/*
	if($_POST["tipo"] == "changeCheck"){
		echo json_encode(changeCheck(true), JSON_NUMERIC_CHECK);
	}
	elseif ($_POST["tipo"] == "retrieve") {
		echo json_encode(retrieve($_POST["data"]), JSON_NUMERIC_CHECK);
	}*/
?>