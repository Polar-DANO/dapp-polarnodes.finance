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
			forking: {
				url: "https://api.avax.network/ext/bc/C/rpc",
				chainId: 31337,
			},
		},
		avalanche : {
			url: "https://api.avax.network/ext/bc/C/rpc",
			chainId: 43114,
		},
	},
};
