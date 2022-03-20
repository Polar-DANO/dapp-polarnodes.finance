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

	const setUp = require("./01_setUp");
	//await setUp(handler, nt, polarNode, polarLuckyBox, swapper);

	await main(handler, nt, polarNode, polarLuckyBox, swapper)
}

async function main(handler, nt, polarNode, polarLuckyBox, swapper) {
	const [owner,metamask,payees,distri] = await getWallets();
	
	let res, estimatedGas, args;

	console.log("-----OPEN ALL-----");

	for (let n of nt) {
		const name = await n.name();
		console.log("\t" + name + " Open");
		
		estimatedGas = await n.connect(owner).estimateGas.setOpenCreateNodesWithTokens(true);
		res = await n.connect(owner).setOpenCreateNodesWithTokens(true, {
			gasLimit: estimatedGas.toNumber() + 50000
		});
		await res.wait()
		console.log("\t\t" + name + ".setOpenCreateNodesWithTokens(true)");

		estimatedGas = await n.connect(owner).estimateGas.setOpenCreateNodesLevelUp(true);
		res = await n.connect(owner).setOpenCreateNodesLevelUp(true, {
			gasLimit: estimatedGas.toNumber() + 50000
		});
		await res.wait()
		console.log("\t\t" + name + ".setOpenCreateNodesLevelUp(true)");
		
		estimatedGas = await n.connect(owner).estimateGas.setOpenCreateNodesWithPending(true);
		res = await n.connect(owner).setOpenCreateNodesWithPending(true, {
			gasLimit: estimatedGas.toNumber() + 50000
		});
		await res.wait()
		console.log("\t\t" + name + ".setOpenCreateNodesWithPending(true)");
		
		estimatedGas = await n.connect(owner).estimateGas.setOpenCreateNodesWithLuckyBoxes(true);
		res = await n.connect(owner).setOpenCreateNodesWithLuckyBoxes(true, {
			gasLimit: estimatedGas.toNumber() + 50000
		});
		await res.wait()
		console.log("\t\t" + name + ".setOpenCreateNodesWithLuckyBoxes(true)");
		
		estimatedGas = await n.connect(owner).estimateGas.setOpenCreateNodesMigration(true);
		res = await n.connect(owner).setOpenCreateNodesMigration(true, {
			gasLimit: estimatedGas.toNumber() + 50000
		});
		await res.wait()
		console.log("\t\t" + name + ".setOpenCreateNodesMigration(true)");

		res = await n.openCreateNodesWithTokens();
		console.log("\t\t" + name + ".openCreateNodesWithTokens() =", res);
		res = await n.openCreateNodesLevelUp();
		console.log("\t\t" + name + ".openCreateNodesLevelUp() =", res);
		res = await n.openCreateNodesWithPending();
		console.log("\t\t" + name + ".openCreateNodesWithPending() =", res);
		res = await n.openCreateNodesWithLuckyBoxes();
		console.log("\t\t" + name + ".openCreateNodesWithLuckyBoxes() =", res);
		res = await n.openCreateNodesMigration();
		console.log("\t\t" + name + ".openCreateNodesMigration() =", res);

	}

	console.log("\tPolarLuckyBox Open");
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.setOpenCreateLuckyBoxesWithTokens(true);
	res = await polarLuckyBox.connect(owner).setOpenCreateLuckyBoxesWithTokens(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tpolarLuckyBoxes.setOpenCreateLuckyBoxesWithTokens(true)");
	res = await polarLuckyBox.openCreateLuckyBoxesWithTokens();
	console.log("\t\tpolarLuckyBoxes.openCreateLuckyBoxesWithTokens() =", res);
	estimatedGas = await polarLuckyBox.connect(owner).estimateGas.setOpenCreateLuckyBoxesWithNodes(true);
	res = await polarLuckyBox.connect(owner).setOpenCreateLuckyBoxesWithNodes(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tpolarLuckyBoxes.setOpenCreateLuckyBoxesWithNodes(true)");
	res = await polarLuckyBox.openCreateLuckyBoxesWithNodes();
	console.log("\t\tpolarLuckyBoxes.openCreateLuckyBoxesWithNodes() =", res);

	console.log("\tPolarNode Open");
	estimatedGas = await polarNode.connect(owner).estimateGas.setOpenCreateNft(true);
	res = await polarNode.connect(owner).setOpenCreateNft(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tpolarNode.setOpenCreateNft(true)");
	res = await polarNode.openCreateNft();
	console.log("\t\tpolarNode.openCreateNft() =", res);

	console.log("\tSwapper Open");
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateNodesWithTokens(true);
	res = await swapper.connect(owner).setOpenSwapCreateNodesWithTokens(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapCreateNodesWithTokens(true)");
	res = await swapper.openSwapCreateNodesWithTokens();
	console.log("\t\tswapper.openSwapCreateNodesWithTokens() =", res);
	
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateNodesWithPending(true);
	res = await swapper.connect(owner).setOpenSwapCreateNodesWithPending(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapCreateNodesWithPending(true)");
	res = await swapper.openSwapCreateNodesWithPending();
	console.log("\t\tswapper.openSwapCreateNodesWithPending() =", res);
	
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateLuckyBoxesWithTokens(true);
	res = await swapper.connect(owner).setOpenSwapCreateLuckyBoxesWithTokens(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapCreateLuckyBoxesWithTokens(true)");
	res = await swapper.openSwapCreateLuckyBoxesWithTokens();
	console.log("\t\tswapper.openSwapCreateLuckyBoxesWithTokens() =", res);
	
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsAll(true);
	res = await swapper.connect(owner).setOpenSwapClaimRewardsAll(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapClaimRewardsAll(true)");
	res = await swapper.openSwapClaimRewardsAll();
	console.log("\t\tswapper.openSwapClaimRewardsAll() =", res);
	
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsBatch(true);
	res = await swapper.connect(owner).setOpenSwapClaimRewardsBatch(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapClaimRewardsBatch(true)");
	res = await swapper.openSwapClaimRewardsBatch();
	console.log("\t\tswapper.openSwapClaimRewardsBatch() =", res);
	
	estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsNodeType(true);
	res = await swapper.connect(owner).setOpenSwapClaimRewardsNodeType(true,
		{ gasLimit: estimatedGas.toNumber() + 50000 }
	);
	await res.wait()
	console.log("\t\tswapper.setOpenSwapClaimRewardsNodeType(true)");
	res = await swapper.openSwapClaimRewardsNodeType();
	console.log("\t\tswapper.openSwapClaimRewardsNodeType() =", res);
	
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
