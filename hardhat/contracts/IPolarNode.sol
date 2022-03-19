// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

interface IPolarNode {
	function generateNfts(
		string memory name,
		address user,
		uint count
	)
		external
		returns(uint[] memory);
	
	function burnBatch(address user, uint[] memory tokenIds) external;

	function setTokenIdToNodeType(uint tokenId, string memory nodeType) external;
}
