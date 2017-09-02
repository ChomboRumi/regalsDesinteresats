var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index2.html'));
});
app.get('/graf', function (req, res) {
    res.sendFile(path.join(__dirname + '/graf1.html'));
});
app.get('/ult', function (req, res) {
    res.send([{name : "prueba1", url : "#"},{name : "prueba2", url : "#"}]);
});
app.get('/lib/*', function (req, res) {
	res.sendFile(path.join(__dirname + '/node_modules/neo4j-driver/'+ req.originalUrl));
});
app.get('/info', function (req, res) {
    res.sendFile(path.join(__dirname + '/infografia-adictos-a-las-redes1.jpg'));
});
app.get('/participantes', function (req, res) {
    fs.readFile(__dirname + '/Sin.csv',"utf8", (err, data) => {
	var rows=data.split('\n');
	var x =1;
	var datos=[];
	var col1 = rows[0].split(',');
	while(rows.length-1 > x){
		var col = rows[x].split(',');
		var y =0;
		var datos2={};
		while(col.length > y ){
			datos2[col1[y]]=col[y];
			y++;		
		}
		
		datos[x-1]=datos2;
		x++;
	}
	res.send(datos);
});
});
app.get('/descripcion', function (req, res) {
    fs.readFile(__dirname + '/desc.txt',"utf8", (err, data) => {
	console.log(err);
	res.send(data);
});
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const neo4j = require('neo4j-driver').v1;
app.get('/grap', function (req, res) {
    

const driver = neo4j.driver('bolt://localhost');
const session = driver.session();


const resultPromise = session.run(
  'Match (a)-[r]->(b) RETURN a,r,b'
);

resultPromise.then(result => {
  session.close();
	var cont =0;
	//console.log(result);
	var nodo = {};
	var rel = [];
	while (cont < result.records.length){
		console.log(nodo[result.records[cont].get('a').identity  ] == undefined);
		if(nodo[result.records[cont].get('a').identity] == undefined ){
			var strAux= result.records[cont].get('a').identity;
			nodo[strAux]= { 'labels' : result.records[cont].get('a').labels,  'id' : result.records[cont].get('a').properties.name};
		}
		if(nodo[result.records[cont].get('b').identity] == undefined){
			var strAux= result.records[cont].get('b').identity;
			nodo[strAux]= { 'labels' : result.records[cont].get('b').labels,  'id' : result.records[cont].get('b').properties.name};
		}
			console.log(result.records[cont].get('r').properties);
			rel[cont]={"type" : result.records[cont].get('r').type, "source": result.records[cont].get('a').properties.name , "target":  result.records[cont].get('b').properties.name , "value" : result.records[cont].get('r').properties};
			
		cont++;
}
	nodos = [];
	for(a in nodo){
		nodos.push(nodo[a]);
}
var resu = {"nodes" : nodos, "links": rel};
console.log(resu);
res.send(resu);
  // on application exit:
  driver.close();
});
});
