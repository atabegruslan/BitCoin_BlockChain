//var http = require("http");

var express = require("express");
var app = express();

var request = require("request");

var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib");

app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());

app.set("view engine", "ejs"); // By default, looks for views/

const PORT = 8080;

function brainWallet(userInput, callback)
{
	var input = Buffer.from(userInput);
	var hash = bitcore.crypto.Hash.sha256(input);
	var bn = bitcore.crypto.BN.fromBuffer(hash);
	var pk = new bitcore.PrivateKey(bn).toWIF();
	var address = new bitcore.PrivateKey(bn).toAddress();
	callback(pk, address);
};

/*
http.createServer(function(req, res) {

	request({
		url: "https://api.blockchain.info/stats?format=json",
		json: true
	}, function(error, response, body) {
		console.log(response);
	});

	console.log("Hi I'm a new BitCoin user " + req.url);
	res.end("End");

}).listen(PORT);

request({
	url: "https://api.blockchain.info/stats?format=json",
	json: true
}, function(error, response, body) {
	btcPrice = body.market_price_usd;
	btcBlocks = body.n_blocks_total;
});

app.get("/", function(req, res) { // http://localhost:8080/
	res.send({btcPrice});
});
app.get("/block", function(req, res) { // http://localhost:8080/block
	res.send({btcBlocks});
});
*/

function getMarketPrice(callback) {
	request({
		url: "https://blockchain.info/ticker?format=json",
	}, function(err, res, body) {
		price = callback(JSON.parse(body).USD.last);
	});
}

app.get("/", function(req, res) {
	res.render("index");
});	
app.get("/wallet", function(req, res) { // http://localhost:8080/wallet
	//res.sendFile(__dirname + '/index.html');

	res.render("wallet");
});
app.get("/converter", function(req, res) {
	getMarketPrice(function(marketPrice) {
		res.render("converter", {
			marketPrice: marketPrice
		});
	});
});
app.post("/wallet", function(req, res) {
	var brainsrc = req.body.brainsrc;
	brainWallet(brainsrc, function(priv, addr) {
		//res.send({priv, addr});

		res.render("wallet", {
			url1: 'http://blockchain.info/rawaddr/' + addr.toString(),
			url2: 'https://www.blockchain.com/explorer'
		});
	});
});

app.listen(PORT, function() {
	console.log("Server is running at localhost:" + PORT);
});
