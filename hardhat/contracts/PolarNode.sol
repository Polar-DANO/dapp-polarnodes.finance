// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IHandler.sol";
import "./Owners.sol";


contract PolarNode is ERC721, ERC721Enumerable, Owners {
	using Counters for Counters.Counter;

	address public handler;
	mapping(uint => string) public tokenIdsToNodeType;

	Counters.Counter private _tokenIdCounter;
	string private uriBase;

	mapping(address => bool) public isBlacklisted;

	bool public openCreateNft = false;

	address[] public nodeOwners;
	mapping(address => bool) public nodeOwnersInserted;

	constructor(
		string memory uri,
		address _handler
	) ERC721("Polar Node", "PN") {
		uriBase = uri;
		handler = _handler;
	}

	modifier onlyHandler() {
		require(msg.sender == handler, "PolarNode: God mode not activated");
		_;
	}

	// external
	function burnBatch(address user, uint[] memory tokenIds) external onlyHandler {
		for (uint i = 0; i < tokenIds.length; i++) {
			require(ownerOf(tokenIds[i]) == user, "PolarNode: Not nft owner");
			super._burn(tokenIds[i]);
		}
	}

	function generateNfts(
		string memory name,
		address user,
		uint count
	)
		external
		onlyHandler
		returns(uint[] memory)
	{
		require(!isBlacklisted[user], "PolarNode: Blacklisted address");
		require(openCreateNft, "PolarNode: Not open");

		if (nodeOwnersInserted[user] == false) {
			nodeOwners.push(user);
			nodeOwnersInserted[user] = true;
		}

		uint[] memory tokenIds = new uint[](count);
		
		for (uint i = 0; i < count; i++) {
			uint tokenId = _tokenIdCounter.current();
			tokenIds[i] = tokenId;
			tokenIdsToNodeType[tokenId] = name;
			_safeMint(user, tokenId);
			_tokenIdCounter.increment();
		}

		return tokenIds;
	}

	// external setters
	function setTokenIdToNodeType(uint tokenId, string memory nodeType) external onlyHandler {	
	   tokenIdsToNodeType[tokenId] = nodeType;
	}

	function setBaseURI(string memory _new) external onlyOwners {
		uriBase = _new;
	}
	
	function setHandler(address _new) external onlyOwners {
		handler = _new;
	}
	
	function setIsBlacklisted(address _new, bool _value) external onlyOwners {
		isBlacklisted[_new] = _value;
	}
	
	function setOpenCreateNft(bool _new) external onlyOwners {
		openCreateNft = _new;
	}

	// external view
	function baseURI() external view returns(string memory) {
		return _baseURI();
	}

	function tokensOfOwner(address user) external view returns(uint256[] memory) {
		uint256[] memory result = new uint256[](balanceOf(user));
		for(uint256 i = 0; i < balanceOf(user); i++)
			result[i] = tokenOfOwnerByIndex(user, i);
		return result;
	}

	function tokensOfOwnerByIndexesBetween(
		address user,
		uint iStart,
		uint iEnd
	)
		external
		view
		returns(uint[] memory)
	{
		uint256[] memory result = new uint256[](iEnd - iStart);
		for(uint256 i = iStart; i < iEnd; i++)
			result[i - iStart] = tokenOfOwnerByIndex(user, i);
		return result;
	}

	function getNodeOwnersSize() external view returns(uint) {
		return nodeOwners.length;
	}

	function getNodeOwnersBetweenIndexes(
		uint iStart,
		uint iEnd
	)
		external
		view
		returns(address[] memory)
	{
		address[] memory no = new address[](iEnd - iStart);
		for (uint256 i = iStart; i < iEnd; i++)
			no[i - iStart] = nodeOwners[i];
		return no;
	}
	// public

	// internal
	function _baseURI() internal view override returns(string memory) {
		return uriBase;
	}

	function _transfer(
		address from,
		address to,
		uint256 tokenId
	)
		internal
		override
	{
		require(!isBlacklisted[from] && !isBlacklisted[to], 
			"PolarNode: Blacklisted address");

		if (nodeOwnersInserted[to] == false) {
			nodeOwners.push(to);
			nodeOwnersInserted[to] = true;
		}

		IHandler(handler).transferFrom(from, to, tokenId);
		super._transfer(from, to, tokenId);
	}

	// ERC721 && ERC721Enumerable required overriding
	function _beforeTokenTransfer(
		address from, 
		address to, 
		uint256 tokenId
	)
		internal
		override(ERC721, ERC721Enumerable)
	{
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC721Enumerable)
		returns(bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
