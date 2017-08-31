var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index2.html'));
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

const driver = neo4j.driver('bolt://localhost');
const session = driver.session();

const personName = 'Alice';
const resultPromise = session.run(
  'CREATE (a:Person1 {name: $name}) RETURN a',
  {name: personName}
);

resultPromise.then(result => {
  session.close();

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);

  // on application exit:
  driver.close();
});
