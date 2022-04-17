// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

interface IPolarLuckyBox {
	function createLuckyBoxesWithTokens(
		string memory name,
		uint count,
		address user
	) external returns(uint);
	
	function createLuckyBoxesAirDrop(
		string memory name,
		uint count,
		address user
	) external;
	
	function createNodesWithLuckyBoxes(
		address user,
		uint[] memory tokenIds
	)
		external
		returns(
			string[] memory,
			string[] memory
		);
}
