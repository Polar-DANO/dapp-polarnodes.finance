# Whatever

## Test network:

1. Start local node on dedicated terminal
	=> npx hardhat node

2. Run your commands
	bashScripts/:	
		Full contrat setup:
			=> bash bashScripts/fullSetUpForTests.sh
		Simulate an epoch:
			=> bash bashScripts/increaseBlockTimestamp.sh
		Infinite loop to buy token, create node, display tokenTokenomics:
			=> bash bashScripts/infinitBuyCreateDataEco.sh
				Note: errors happens due to maxTx and nodePrice. Fixed by following iteration
		Read publicly available token information:
			=> bash bashScripts/readToken.sh
				Note: Some errors if metamask.address has no node
		Full tokenomics:
			=> bash bashScripts/tokenomics.sh
		Update tokenomics fees:
			=> bash bashScripts/updateTokenomics.sh
				Note: Only useful if combined with other test scripts
	
	scripts/:
		=> npx hardhat run --network localhost scripts/${scriptName}
			Manual set up:
				Files: 00* up to 03*
			Collect contract avax balance
				File: 04_release.js
		Private keys:
			File: key.js
		Addresses:
			File: address.js

	scripts/utils/:
		=> npx hardhat run --network localhost scripts/utils/${scriptName}
			Several useful scripts for traderjoe interaction
		Other files:
			Contracts interactions helpers

	scripts/utils/abi/:
		Token.sol modified:
			=> cp abi/contracts/Token.sol/ASTRO.json scripts/utils/abi/Token.json

	scripts/userCalls/:
		=> npx hardhat run --network localhost scripts/userCalls/${scriptName}
			Token contract interaction based on key.Metamask
				Note: Public calls

	scripts.privilegedCalls/:
		=> npx hardhat run --network localhost scripts/privilegedCalls/${scriptName}
			Token contract interaction based on key.owner
				Note: Protected calls

## Avalanche network

Replace '--network localhost' by '--network avalanche' for all previous script launchers/cmds

Note:
	=> npx hardhat run --network avalanche scripts/00_deploy
		Wont work due to gas, remix or fix required

## package.json

You may need to install hardhat-abi-exporter
	=> npm i hardhat-abi-exporter
