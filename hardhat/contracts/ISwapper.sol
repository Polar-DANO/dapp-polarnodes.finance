// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

interface ISwapper {
	function swapCreateNodesWithTokens(
		address tokenIn, 
		address user, 
		uint price,
		string memory sponso
	) external;
	
	function swapCreateNodesWithPending(
		address tokenOut, 
		address user, 
		uint rewardsTotal, 
		uint feesTotal
	) external;
	
	function swapCreateLuckyBoxesWithTokens(
		address tokenIn, 
		address user, 
		uint price,
		string memory sponso
	) external;

	function swapClaimRewardsAll(
		address tokenOut, 
		address user, 
		uint rewardsTotal, 
		uint feesTotal
	) external;

	function swapClaimRewardsBatch(
		address tokenOut, 
		address user, 
		uint rewardsTotal, 
		uint feesTotal
	) external;
	
	function swapClaimRewardsNodeType(
		address tokenOut, 
		address user, 
		uint rewardsTotal, 
		uint feesTotal
	) external;
}
