const { ethers } = require("hardhat");
const fs = require("fs");
const address = require("./address");
const params = require("./params");
const { getWallets } = require("./utils/getWallets");
const { getContracts } = require("./utils/getContracts");

async function caller() {
	const [
		handler,
		nt,
		polarNode,
		polarLuckyBox,
		swapper,
		polar,
		router,
		dai,
		wavax,
		old,
		factory
	] = await getContracts();

	await main(handler, nt, polarNode, polarLuckyBox, swapper);
}

async function main(handler, nt, polarNode, polarLuckyBox, swapper) {
	const [owner,metamask,payees,distri] = await getWallets();
	
	let res, estimatedGas, args;

	console.log("-----SETUP-----");

	console.log("\tHandler Node Types");
	res = await handler.getNodeTypesSize();
	console.log("\t\thandler.getNodeTypesSize() =", res.toNumber());
	args = [nt[0].address, nt[1].address, nt[2].address, nt[3].address, nt[4].address];
	estimatedGas = await handler.connect(owner).estimateGas.addMultipleNodeTypes(args);
	res = await handler.connect(owner).addMultipleNodeTypes(args, { 
		gasLimit: estimatedGas.toNumber() + 50000 
	});
	console.log("\t\thandler.addMultipleNodeTypes()");
	await res.wait();
	res = await handler.getNodeTypesSize();
	console.log("\t\thandler.getNodeTypesSize() =", res.toNumber());
	res = await handler.getNodeTypesBetweenIndexes(0, 5);
	console.log("\t\thandler.getNodeTypesBetweenIndexes(0,5) =", res);

	console.log("\tHandler Nft");
	res = await handler.nft();
	console.log("\t\thandler.nft() =", res);
	estimatedGas = await handler.connect(owner).estimateGas.setNft(polarNode.address);
	res = await handler.connect(owner).setNft(polarNode.address, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\thandler.setNft("+polarNode.address+")");
	await res.wait();
	res = await handler.nft();
	console.log("\t\thandler.nft() =", res);

	console.log("\tHandler Lucky");
	estimatedGas = await handler.connect(owner).estimateGas.setLucky(polarLuckyBox.address);
	res = await handler.connect(owner).setLucky(polarLuckyBox.address, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\thandler.setLucky("+polarLuckyBox.address+")");
	await res.wait();

	console.log("\tHandler Swapper");
	estimatedGas = await handler.connect(owner).estimateGas.setSwapper(swapper.address);
	res = await handler.connect(owner).setSwapper(swapper.address, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\thandler.setSwapper("+swapper.address+")");
	await res.wait();

	console.log("\tPolarLuckyBox Lucky Boxes");
	res = await polarLuckyBox.getBoxSize();
	console.log("\t\tpolarLuckyBox.getBoxSize() =", res.toNumber());
	args = [
		params.LuckyBox0.name,
		params.LuckyBox0.priceTokens,
		params.LuckyBox0.probability,
		params.LuckyBox0.nodeType,
		params.LuckyBox0.feature,
		params.LuckyBox0.remaining,
		params.LuckyBox0.maxBox,
		params.LuckyBox0.maxUser,
	];
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.addPolarLuckyBox(...args);
	res = await polarLuckyBox.connect(owner).addPolarLuckyBox(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tpolarLuckyBox.addPolarLuckyBox()");
	await res.wait();
	args = [
		params.LuckyBox1.name,
		params.LuckyBox1.priceTokens,
		params.LuckyBox1.probability,
		params.LuckyBox1.nodeType,
		params.LuckyBox1.feature,
		params.LuckyBox1.remaining,
		params.LuckyBox1.maxBox,
		params.LuckyBox1.maxUser,
	];
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.addPolarLuckyBox(...args);
	res = await polarLuckyBox.connect(owner).addPolarLuckyBox(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tpolarLuckyBox.addPolarLuckyBox()");
	await res.wait();
	args = [
		params.LuckyBox2.name,
		params.LuckyBox2.priceTokens,
		params.LuckyBox2.probability,
		params.LuckyBox2.nodeType,
		params.LuckyBox2.feature,
		params.LuckyBox2.remaining,
		params.LuckyBox2.maxBox,
		params.LuckyBox2.maxUser,
	];
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.addPolarLuckyBox(...args);
	res = await polarLuckyBox.connect(owner).addPolarLuckyBox(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tpolarLuckyBox.addPolarLuckyBox()");
	await res.wait();
	args = [
		params.LuckyBox3.name,
		params.LuckyBox3.priceTokens,
		params.LuckyBox3.probability,
		params.LuckyBox3.nodeType,
		params.LuckyBox3.feature,
		params.LuckyBox3.remaining,
		params.LuckyBox3.maxBox,
		params.LuckyBox3.maxUser,
	];
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.addPolarLuckyBox(...args);
	res = await polarLuckyBox.connect(owner).addPolarLuckyBox(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tpolarLuckyBox.addPolarLuckyBox()");
	await res.wait();
	res = await polarLuckyBox.getBoxSize();
	console.log("\t\tpolarLuckyBox.getBoxSize() =", res.toNumber());
	res = await polarLuckyBox.getMapKeysBetweenIndexes(0, 4);
	console.log("\t\tpolarLuckyBox.getMapKeysBetweenIndexes(0,4) =", res);

	console.log("\tEverest Features");
	res = await nt[4].getFeaturesSize();
	console.log("\t\tEverest.getFeaturesSize() =", res.toNumber());
	args = [
		params.NodeType4Feature0.name,
		params.NodeType4Feature0.rate,
	];
	estimatedGas = await nt[4].connect(owner).estimateGas.addFeature(...args);
	res = await nt[4].connect(owner).addFeature(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tEverest.addFeature()");
	await res.wait();
	args = [
		params.NodeType4Feature1.name,
		params.NodeType4Feature1.rate,
	];
	estimatedGas = await nt[4].connect(owner).estimateGas.addFeature(...args);
	res = await nt[4].connect(owner).addFeature(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tEverest.addFeature()");
	await res.wait();
	args = [
		params.NodeType4Feature2.name,
		params.NodeType4Feature2.rate,
	];
	estimatedGas = await nt[4].connect(owner).estimateGas.addFeature(...args);
	res = await nt[4].connect(owner).addFeature(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000
	});
	console.log("\t\tEverest.addFeature()");
	await res.wait();
	res = await nt[4].getFeaturesSize();
	console.log("\t\tEverest.getFeaturesSize() =", res.toNumber());
	res = await nt[4].getFeaturesBetweenIndexes(0, 3);
	console.log("\t\tEverest.getFeaturesBetweenIndexes(0,3) =", res);

	console.log("\tSwapper Path");
	res = await swapper.getMapPathSize();
	console.log("\t\tswapper.getMapPathSize() =", res.toNumber());
	args = [params.SwapperPath0.token, params.SwapperPath0.pathIn, params.SwapperPath0.pathOut];
	estimatedGas = await swapper.connect(owner).estimateGas.addMapPath(...args);
	res = await swapper.connect(owner).addMapPath(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000 
	});
	console.log("\t\tswapper.addMapPath()");
	await res.wait();

	args = [params.SwapperPath1.token, params.SwapperPath1.pathIn, params.SwapperPath1.pathOut];
	estimatedGas = await swapper.connect(owner).estimateGas.addMapPath(...args);
	res = await swapper.connect(owner).addMapPath(...args, { 
		gasLimit: estimatedGas.toNumber() + 50000 
	});
	console.log("\t\tswapper.addMapPath()");
	await res.wait();
	res = await swapper.getMapPathSize();
	console.log("\t\tswapper.getMapPathSize() =", res.toNumber());

	console.log();
}

if (require.main === module)
	caller()
		.then( _ => process.exit())
		.catch(e => {
			console.error(e);
			process.exit(1);
		})

module.exports = main
