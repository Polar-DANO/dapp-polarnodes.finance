const { ethers } = require("hardhat");
const { getWallets } = require("./getWallets");
const { getContracts } = require("./getContracts");
const address = require("../address");
const tokenBalanceOf = require("../token/userCalls/balanceOf");
const balance = require("../native/userCalls/balance");

async function allBalances(token, addr) {
	await tokenBalanceOf(token, addr);
	await balance(addr);
}

async function main() {
	const [owner,metamask,addresses] = await getWallets();
	const [nrm,,token] = await getContracts();

	console.log("NRM");
	await allBalances(token, nrm.address);
	console.log();

	console.log("Futur");
	await allBalances(token, address.Futur);
	console.log();
	
	console.log("Distri");
	await allBalances(token, address.Distri);
	console.log();
	
	console.log("LpHandler");
	await allBalances(token, address.LpHandler);
	console.log();
}


main()
	.then( _ => process.exit())
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
