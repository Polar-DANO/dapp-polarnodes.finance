const { ethers } = require("hardhat");
const address = require("./address");

// NodeTypes
const NodeType0 = {
	name: "Fuji",
	values: [
		1000000, // maxCount
		ethers.utils.parseUnits("30", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.075", 18), // rewardAmount
		4000, // claimTaxRoi
		0, // maxLevelUpUser
		0, // maxLevelUpTotal
		20, // maxCreationPendingUser
		1000000, // maxCreationPendingTotal
		1000000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		500, // isBoostedTokenRate
		1 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		0, // global tax
		7 * 24 * 3600, // claimTimeReference
		100, // claimTimeRate
		10, // maxMultiObtaining
		0, // maxMultiClaim
	]
}
const NodeType1 = {
	name: "Mont Blanc",
	values: [
		50000, // maxCount
		ethers.utils.parseUnits("55", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.165", 18), // rewardAmount
		4000, // claimTaxRoi
		10, // maxLevelUpUser
		10000, // maxLevelUpTotal
		5, // maxCreationPendingUser
		10000, // maxCreationPendingTotal
		50000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		500, // isBoostedTokenRate
		1 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		0, // global tax
		7 * 24 * 3600, // claimTimeReference
		100, // claimTimeRate
		10, // maxMultiObtaining
		0, // maxMultiClaim
	]
}
const NodeType2 = {
	name: "Kilimanjaro",
	values: [
		2000, // maxCount
		ethers.utils.parseUnits("250", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.8333333333", 18), // rewardAmount
		4000, // claimTaxRoi
		2, // maxLevelUpUser
		100, // maxLevelUpTotal
		1, // maxCreationPendingUser
		100, // maxCreationPendingTotal
		100, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		500, // isBoostedTokenRate
		1 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		0, // global tax
		7 * 24 * 3600, // claimTimeReference
		100, // claimTimeRate
		10, // maxMultiObtaining
		0, // maxMultiClaim
	]
}
const NodeType3 = {
	name: "Ushuaia",
	values: [
		1000, // maxCount
		ethers.utils.parseUnits("400", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("1.5333333333", 18), // rewardAmount
		4000, // claimTaxRoi
		2, // maxLevelUpUser
		0, // maxLevelUpTotal
		1, // maxCreationPendingUser
		0, // maxCreationPendingTotal
		50, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		500, // isBoostedTokenRate
		1 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		0, // global tax
		7 * 24 * 3600, // claimTimeReference
		100, // claimTimeRate
		10, // maxMultiObtaining
		0, // maxMultiClaim
	]
}
const NodeType4 = {
	name: "Everest",
	values: [
		1000, // maxCount
		ethers.utils.parseUnits("1000", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("5.8333333333", 18), // rewardAmount
		4000, // claimTaxRoi
		2, // maxLevelUpUser
		2, // maxLevelUpTotal
		1, // maxCreationPendingUser
		2, // maxCreationPendingTotal
		50, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		500, // isBoostedTokenRate
		1 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		0, // global tax
		7 * 24 * 3600, // claimTimeReference
		100, // claimTimeRate
		10, // maxMultiObtaining
		0, // maxMultiClaim
	]
}

// PolarNode
const PolarNode = {
	baseUri: "https://PolarNode.com/"
}

// PolarLuckyBox
const PolarLuckyBox = {
	baseUri: "https://PolarLuckyBox.com/"
}

// Swapper
const Swapper = {
	payees: address.Payees,
	shares: [25, 25, 21, 21, 8],
	addresses: [
		address.Token,
		address.Futur,
		address.Distri,
		address.LpHandler,
		address.Router,
		address.Native,
		address.Pair
	],
	fees: [1500, 7000, 500],
	swapTokensAmounts: [
		ethers.utils.parseUnits("30", 18),
		ethers.utils.parseUnits("0.001", 18)
	]
}

// LuckyBoxes
const LuckyBox0 = {
	name: "Lucky Box 1",
	priceTokens: ethers.utils.parseUnits("120", 18),
	probability: [
		3300, 5000, 1500, 195, 5
	],
	nodeType: [
		"Fuji", "Mont Blanc", "Kilimanjaro", "Ushuaia", "Everest"
	],
	feature: [
		"", "", "", "", ""
	],
	remaining: [
		10000, 10000, 10000, 10000, 10000
	],
	maxBox: 10000,
	maxUser: 500
}
const LuckyBox1 = {
	name: "Lucky Box 2",
	priceTokens: ethers.utils.parseUnits("300", 18),
	probability: [
		200, 200, 8000, 1500, 100
	],
	nodeType: [
		"Fuji", "Mont Blanc", "Kilimanjaro", "Ushuaia", "Everest"
	],
	feature: [
		"", "", "", "", ""
	],
	remaining: [
		10000, 10000, 10000, 10000, 10000
	],
	maxBox: 5000,
	maxUser: 200
}
const LuckyBox2 = {
	name: "Lucky Box 3",
	priceTokens: ethers.utils.parseUnits("700", 18),
	probability: [
		1500, 6500, 2000
	],
	nodeType: [
		"Kilimanjaro", "Ushuaia", "Everest"
	],
	feature: [
		"", "", ""
	],
	remaining: [
		10000, 1000, 100
	],
	maxBox: 1000,
	maxUser: 100
}
const LuckyBox3 = {
	name: "Lucky Box 4",
	priceTokens: ethers.utils.parseUnits("1500", 18),
	probability: [
		4000, 2000, 2000, 2000
	],
	nodeType: [
		"Everest", "Everest", "Everest", "Everest"
	],
	feature: [
		"", "Gold", "Diamond", "Emerald",
	],
	remaining: [
		10000, 30, 20, 10,
	],
	maxBox: 500,
	maxUser: 10
}
const NodeType4Feature0 = {
	name: "Gold",
	rate: 500,
}
const NodeType4Feature1 = {
	name: "Diamond",
	rate: 1000,
}
const NodeType4Feature2 = {
	name: "Emerald",
	rate: 2000,
}

const SwapperPath0 = {
	token: address.Native,
	pathIn: [
		address.Native, address.Token
	],
	pathOut: [
		address.Native
	]
}
const SwapperPath1 = {
	token: address.Dai,
	pathIn: [
		address.Dai, address.Native, address.Token
	],
	pathOut: [
		address.Dai
	]
}

const AddOwner = [
	"0xdd2fd4581271e230360230f9337d5c0430bf44c0", // hardhat18 = distri
	true // change super owner
]

const NodeTypes = [
	NodeType0, NodeType1, NodeType2, NodeType3, NodeType4
]

const MinPricesNode = {
	names: [
		NodeTypes[0].name,
		NodeTypes[1].name,
		NodeTypes[2].name,
		NodeTypes[3].name,
		NodeTypes[4].name,
	],
	offerPrices: [
		ethers.utils.parseUnits("1", 18), // fuji
		ethers.utils.parseUnits("1", 18), // mont blanc
		ethers.utils.parseUnits("1", 18), // kilimanjaro
		ethers.utils.parseUnits("1", 18), // ushuaia
		ethers.utils.parseUnits("1", 18), // everest
	],
	auctionPrices: [
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
	],
}

const MinPricesLucky = {
	names: [
		LuckyBox0.name,
		LuckyBox1.name,
		LuckyBox2.name,
		LuckyBox3.name,
	],
	offerPrices: [
		ethers.utils.parseUnits("1", 18), // box 1
		ethers.utils.parseUnits("1", 18), // box 2
		ethers.utils.parseUnits("1", 18), // box 3
		ethers.utils.parseUnits("1", 18), // box 4
	],
	auctionPrices: [
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
		ethers.utils.parseUnits("1", 18),
	],
}

module.exports = {
	NodeType0, NodeType1, NodeType2, NodeType3, NodeType4,
	PolarNode, PolarLuckyBox, Swapper,
	LuckyBox0, LuckyBox1, LuckyBox2, LuckyBox3,
	NodeType4Feature0, NodeType4Feature1, NodeType4Feature2,
	SwapperPath0, SwapperPath1,
	AddOwner,
	NodeTypes, MinPricesNode, MinPricesLucky
}

