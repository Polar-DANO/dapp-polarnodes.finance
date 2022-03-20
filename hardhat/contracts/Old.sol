// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

contract Old {
	uint private nonce;

	mapping(address => mapping(string => uint)) public number;
	mapping(address => mapping(string => uint)) public pending;
	mapping(address => mapping(string => uint)) public levelUp;
	mapping(address => mapping(string => bool)) public isSetUp;

	address public mm;

	constructor(address _mm) {
		mm = _mm;

		isSetUp[mm]["Fuji"] = true;
		number[mm]["Fuji"] = 3;
		pending[mm]["Fuji"] = 1;
		levelUp[mm]["Fuji"] = 1;
		
		isSetUp[mm]["Mont Blanc"] = true;
		number[mm]["Mont Blanc"] = 3;
		pending[mm]["Mont Blanc"] = 2;
		levelUp[mm]["Mont Blanc"] = 0;
	}

	function getNodeTypeOwnerCreatedPending(
		string memory name, 
		address owner
	) 
		external 
		returns(uint)
	{
		if (!isSetUp[owner][name]) {
			uint a = _generatePseudoRandom(owner, 1, 6);
			uint b = _generatePseudoRandom(owner, 0, a + 1);
			uint c = _generatePseudoRandom(owner, 0, a - b + 1);

			isSetUp[owner][name] = true;

			number[owner][name] = a;
			pending[owner][name] = b;
			levelUp[owner][name] = c;
		}

		return pending[owner][name];
	}
	
	function getNodeTypeLevelUp(
		string memory name, 
		address owner
	) 
		external 
		view
		returns(uint)
	{
		require(isSetUp[owner][name], "Old: Not set up");

		return levelUp[owner][name];
	}

	function getNodeTypeOwnerNumber(
		string memory name, 
		address owner
	) 
		external 
		view
		returns(uint)
	{
		require(isSetUp[owner][name], "Old: Not set up");

		return number[owner][name];
	}


	function _generatePseudoRandom(address user, uint min, uint max) internal returns(uint) {
		uint r = uint(keccak256(abi.encodePacked(nonce, user, block.difficulty, block.timestamp)));
		unchecked { nonce++; }
		return min + r % max;
	}
}
