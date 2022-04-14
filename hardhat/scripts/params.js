const { ethers } = require("hardhat");
const address = require("./address");

// NodeTypes
const NodeType0 = {
	name: "Fuji",
	values: [
		10000000, // maxCount
		ethers.utils.parseUnits("45", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.075", 18), // rewardAmount
		1000, // claimTaxRoi
		0, // maxLevelUpUser
		0, // maxLevelUpTotal
		5, // maxCreationPendingUser
		10000000, // maxCreationPendingTotal
		10000000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		0, // isBoostedTokenRate
		14 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("1", 18), // noClaimRewardAmount
		200, // global tax
		12 * 24 * 3600, // claimTimeReference
		2000, // claimTimeRate
		0, // maxMultiObtaining
		5, // maxMultiClaim
	]
}
const NodeType1 = {
	name: "Mont Blanc",
	values: [
		10000000, // maxCount
		ethers.utils.parseUnits("80", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.165", 18), // rewardAmount
		1500, // claimTaxRoi
		10, // maxLevelUpUser
		10000000, // maxLevelUpTotal
		5, // maxCreationPendingUser
		10000000, // maxCreationPendingTotal
		10000000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		0, // isBoostedTokenRate
		14 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("2", 18), // noClaimRewardAmount
		300, // global tax
		15 * 24 * 3600, // claimTimeReference
		2000, // claimTimeRate
		0, // maxMultiObtaining
		5, // maxMultiClaim
	]
}
const NodeType2 = {
	name: "Kilimanjaro",
	values: [
		10000, // maxCount
		ethers.utils.parseUnits("315", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("0.8333333333", 18), // rewardAmount
		1700, // claimTaxRoi
		0, // maxLevelUpUser
		500, // maxLevelUpTotal
		5, // maxCreationPendingUser
		500, // maxCreationPendingTotal
		2000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		0, // isBoostedTokenRate
		14 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("10", 18), // noClaimRewardAmount
		500, // global tax
		18 * 24 * 3600, // claimTimeReference
		2000, // claimTimeRate
		0, // maxMultiObtaining
		5, // maxMultiClaim
	]
}
const NodeType3 = {
	name: "Ushuaia",
	values: [
		10000, // maxCount
		ethers.utils.parseUnits("460", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("1.5333333333", 18), // rewardAmount
		2000, // claimTaxRoi
		0, // maxLevelUpUser
		500, // maxLevelUpTotal
		2, // maxCreationPendingUser
		500, // maxCreationPendingTotal
		2000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		0, // isBoostedTokenRate
		14 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("16", 18), // noClaimRewardAmount
		700, // global tax
		21 * 24 * 3600, // claimTimeReference
		2000, // claimTimeRate
		0, // maxMultiObtaining
		5, // maxMultiClaim
	]
}
const NodeType4 = {
	name: "Everest",
	values: [
		7500, // maxCount
		ethers.utils.parseUnits("1200", 18), // price
		14400, // claimTime
		ethers.utils.parseUnits("5.8333333333", 18), // rewardAmount
		2200, // claimTaxRoi
		0, // maxLevelUpUser
		500, // maxLevelUpTotal
		1, // maxCreationPendingUser
		500, // maxCreationPendingTotal
		3000, // maxUser
		500, // isBoostedNftRate
		1000, // isBoostedNftProbability
		7 * 24 * 3600, // obtainingTimeReference
		100, // obtainingTimeRate
		0, // isBoostedTokenRate
		14 * 24 * 3600, // noClaimTimeReference
		ethers.utils.parseUnits("60", 18), // noClaimRewardAmount
		900, // global tax
		24 * 24 * 3600, // claimTimeReference
		2000, // claimTimeRate
		0, // maxMultiObtaining
		5, // maxMultiClaim
	]
}

// PolarNode
const PolarNode = {
	baseUri: "https://api.polar.financial/node/"
}

// PolarLuckyBox
const PolarLuckyBox = {
	baseUri: "https://api.polar.financial/luckybox/"
}

// Swapper
const Swapper = {
	payees: address.Payees,
	shares: [25, 21, 21, 21, 12],
	addresses: [
		address.Token,
		address.Futur,
		address.Distri,
		address.LpHandler,
		address.Router,
		address.Native,
		address.Pair
	],
	fees: [500, 6500, 500], // [futur, rewards, lp]
	swapTokensAmounts: ethers.utils.parseUnits("30", 18),
}

// LuckyBoxes
const LuckyBox0 = {
	name: "Neutral Lucky Box",
	priceTokens: ethers.utils.parseUnits("135", 18),
	probability: [
		8000, 1300, 200, 180, 170, 70, 65, 10, 5
	],
	nodeType: [
		"Mont Blanc", "Kilimanjaro", "Ushuaia", "Fuji", "Fuji", "Mont Blanc", "Mont Blanc", "Kilimanjaro", "Kilimanjaro"
	],
	feature: [
		"", "", "", "Diamond", "Emerald", "Diamond", "Emerald", "Diamond", "Emerald"
	],
	remaining: [
		100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000
	],
	maxBox: 100000,
	maxUser: 100000,
	attribute: ""
}
const LuckyBox1 = {
	name: "Fresh Lucky Box",
	priceTokens: ethers.utils.parseUnits("350", 18),
	probability: [
		8300, 1200, 300, 150, 20, 15, 10, 5
	],
	nodeType: [
		"Kilimanjaro", "Ushuaia", "Mont Blanc", "Mont Blanc", "Kilimanjaro", "Kilimanjaro", "Ushuaia", "Ushuaia"
	],
	feature: [
		"", "", "Diamond", "Emerald", "Diamond", "Emerald", "Diamond", "Emerald"
	],
	remaining: [
		100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000
	],
	maxBox: 100000,
	maxUser: 100000,
	attribute: ""
}
const LuckyBox2 = {
	name: "Icy Lucky Box",
	priceTokens: ethers.utils.parseUnits("500", 18),
	probability: [
		8500, 800, 400, 200, 50, 35, 10, 5
	],
	nodeType: [
		"Ushuaia", "Everest", "Kilimanjaro", "Kilimanjaro", "Ushuaia", "Ushuaia", "Everest", "Everest"
	],
	feature: [
		"", "", "Diamond", "Emerald", "Diamond", "Emerald", "Diamond", "Emerald"
	],
	remaining: [
		100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000
	],
	maxBox: 100000,
	maxUser: 100000,
	attribute: ""
}
const LuckyBox3 = {
	name: "Everest Lucky Box",
	priceTokens: ethers.utils.parseUnits("1500", 18),
	probability: [
		8000, 1500, 500
	],
	nodeType: [
		"Everest", "Everest", "Everest"
	],
	feature: [
		"", "Diamond", "Emerald"
	],
	remaining: [
		100000, 100000, 100000
	],
	maxBox: 100000,
	maxUser: 100000,
	attribute: ""
}
// features for all
const NodeType0Features = [
	{
		name: "Silver",
		rate: 5500,
	},
	{
		name: "Gold",
		rate: 9500,
	},
	{
		name: "Diamond",
		rate: 17000,
	},
	{
		name: "Emerald",
		rate: 21000,
	},
]
const NodeType1Features = [
	{
		name: "Silver",
		rate: 3200,
	},
	{
		name: "Gold",
		rate: 6500,
	},
	{
		name: "Diamond",
		rate: 10000,
	},
	{
		name: "Emerald",
		rate: 15000,
	},
]
const NodeType2Features = [
	{
		name: "Silver",
		rate: 1760,
	},
	{
		name: "Gold",
		rate: 4000,
	},
	{
		name: "Diamond",
		rate: 8900,
	},
	{
		name: "Emerald",
		rate: 13500,
	},
]
const NodeType3Features = [
	{
		name: "Silver",
		rate: 1600,
	},
	{
		name: "Gold",
		rate: 3300,
	},
	{
		name: "Diamond",
		rate: 6600,
	},
	{
		name: "Emerald",
		rate: 10000,
	},
]
const NodeType4Features = [
	{
		name: "Silver",
		rate: 700,
	},
	{
		name: "Gold",
		rate: 1400,
	},
	{
		name: "Diamond",
		rate: 2800,
	},
	{
		name: "Emerald",
		rate: 5000,
	},
]

const SwapperPath0 = {
	token: address.Native,
	pathIn: [
		address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath1 = {
	token: address.Dai,
	pathIn: [
		address.Dai, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath2 = {
	token: address.Thor,
	pathIn: [
		address.Thor, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath3 = {
	token: address.Vpnd,
	pathIn: [
		address.Vpnd, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath4 = {
	token: address.Fire,
	pathIn: [
		address.Fire, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath5 = {
	token: address.Mead,
	pathIn: [
		address.Mead, address.Usdc, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath6 = {
	token: address.Pxt2,
	pathIn: [
		address.Pxt2, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}
const SwapperPath7 = {
	token: address.Time,
	pathIn: [
		address.Time, address.Native, address.Token
	],
	pathOut: [
		address.Null
	]
}

const AddOwner = [
	"0xE964346CeA0fA249c3FE5EECb4FEA289964799Fa", // owner polar
	true // change super owner // put true
]

const NodeTypes = [
	NodeType0, NodeType1, NodeType2, NodeType3, NodeType4
]

const MarketPlace = {
	fee: 200,
	auctionBeforeRef: 60,
	auctionBeforeAdd: 60
}

const MinPricesNode = {
	names: [
		NodeTypes[0].name,
		NodeTypes[1].name,
		NodeTypes[2].name,
		NodeTypes[3].name,
		NodeTypes[4].name,
	],
	offerPrices: [
		ethers.utils.parseUnits("45", 18), // fuji
		ethers.utils.parseUnits("80", 18), // mont blanc
		ethers.utils.parseUnits("315", 18), // kilimanjaro
		ethers.utils.parseUnits("460", 18), // ushuaia
		ethers.utils.parseUnits("1200", 18), // everest
	],
	auctionPrices: [
		ethers.utils.parseUnits("45", 18),
		ethers.utils.parseUnits("80", 18),
		ethers.utils.parseUnits("315", 18),
		ethers.utils.parseUnits("460", 18),
		ethers.utils.parseUnits("1200", 18),
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
		ethers.utils.parseUnits("135", 18), // box 1
		ethers.utils.parseUnits("350", 18), // box 2
		ethers.utils.parseUnits("500", 18), // box 3
		ethers.utils.parseUnits("1500", 18), // box 4
	],
	auctionPrices: [
		ethers.utils.parseUnits("135", 18),
		ethers.utils.parseUnits("350", 18),
		ethers.utils.parseUnits("500", 18),
		ethers.utils.parseUnits("1500", 18),
	],
}

module.exports = {
	NodeType0, NodeType1, NodeType2, NodeType3, NodeType4,
	PolarNode, PolarLuckyBox, Swapper,
	LuckyBox0, LuckyBox1, LuckyBox2, LuckyBox3,
	NodeType0Features, NodeType1Features, NodeType2Features, 
	NodeType3Features, NodeType4Features,
	SwapperPath0, SwapperPath1, SwapperPath2, SwapperPath3,
	SwapperPath4, SwapperPath5, SwapperPath6, SwapperPath7, 
	AddOwner, MarketPlace,
	NodeTypes, MinPricesNode, MinPricesLucky
}

