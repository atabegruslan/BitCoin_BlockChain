/*
 * https://www.youtube.com/watch?v=SSo_EIwHSd4  
 * https://www.youtube.com/playlist?list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4
 */

const SHA256 = require('crypto-js/sha256');

class Block
{
	constructor(index, timestamp, data, previousHash)
	{
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash()
	{
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain
{
	constructor()
	{
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock()
	{
		return new Block(0, "01/01/2020", "Genesis block", "0");
	}

	getLatestBlock()
	{
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock)
	{
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid()
	{
		for (let i = 1; i < this.chain.length; i++)
		{
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash())
			{
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash)
			{
				return false;
			}
		}

		return true;
	}
}

let ruslanCoin = new Blockchain();
ruslanCoin.addBlock(new Block(1, "08/03/2020", {amount: 4}));
ruslanCoin.addBlock(new Block(2, "09/03/2020", {amount: 5}));

console.log(JSON.stringify(ruslanCoin, null, 4));

// Chain is valid
console.log("Is chain valid? " + ruslanCoin.isChainValid());

// Chain tampered
ruslanCoin.chain[1].data = {amount: 6};
ruslanCoin.chain[1].hash = ruslanCoin.chain[1].calculateHash();

// Chain isn't valid now
console.log("Is chain valid? " + ruslanCoin.isChainValid());
