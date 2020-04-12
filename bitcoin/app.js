//var http = require("http");

var express = require("express");
var app = express();

var request = require("request");

const PORT = 8080;

// http.createServer(function(req, res) {

	// request({
	// 	url: "https://api.blockchain.info/stats?format=json",
	// 	json: true
	// }, function(error, response, body) {
	// 	console.log(response);
	// });

// 	console.log("Hi I'm a new BitCoin user " + req.url);
// 	res.end("End");

// }).listen(PORT);

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
app.listen(PORT, function() {
	console.log("Server is running");
});
