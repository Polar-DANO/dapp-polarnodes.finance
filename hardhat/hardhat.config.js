require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.0",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.6.12",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.8.2",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.6.2",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			}
		],
	},
	abiExporter: {
		path: './abi',
		runOnCompile: true,
	},
	networks: {
		hardhat : {
			chainId: 43113,
			forking: {
				url: "https://api.avax-test.network/ext/bc/C/rpc",
				enabled: true,
			},
		},
	},
};
