// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;


interface OldRewardManager {
	function _getNodeNumberOf(address account) external view returns (uint256);
}