// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Owners.sol";

import "hardhat/console.sol";

contract PolarMarketPlace is Owners, ReentrancyGuard {

	struct Offer {
		address owner;
		uint tokenId;
		uint price;
		uint creationTime;
	}

	struct Auction {
		address owner;
		uint tokenId;
		uint currentPrice;
		address nextOwner;
		uint end;
		uint creationTime;
	}

	struct MapOffer {
		uint[] keys; // tokenId to offers
		mapping(uint => Offer) values;
		mapping(uint => uint256) indexOf;
		mapping(uint => bool) inserted;
	}

	struct MapAuction {
		uint[] keys; // tokenId to auctions
		mapping(uint => Auction) values;
		mapping(uint => uint) indexOf;
		mapping(uint => bool) inserted;
	}
	
	struct Nft {
		MapOffer mapOffer;
		MapAuction mapAuction;
	}

	struct MapNft {
		address[] keys; // nft address to Nft struct
		mapping(address => Nft) values;
		mapping(address => uint) indexOf;
		mapping(address => bool) inserted;
	}
	
	MapNft private nft;
	
	address public polar;
	address public swapper;
	uint public fee;

	bool public openOffer;
	bool public openAuction;

	mapping(address => bool) public isBlacklistedNft;

	constructor(address _polar, address _swapper, uint _fee) {
		polar = _polar;
		swapper = _swapper;
		fee = _fee;
	}

	// external offer
	function sellOfferItem(address _nft, uint _tokenId, uint _price) external nonReentrant {
		require(_price > 0, "PolarMarketPlace: Price must be greater than 0");
		require(!isBlacklistedNft[_nft], "PolarMarketPlace: Not authorized contract");
		require(openOffer, "PolarMarketPlace: Not open");

		IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);
		
		mapNftAdd(_nft);
		mapOfferSet(nft.values[_nft].mapOffer, _tokenId, Offer({
			owner: msg.sender,
			tokenId: _tokenId,
			price: _price,
			creationTime: block.timestamp
		}));
	}

	function purchaseOfferItem(address _nft, uint _tokenId) external nonReentrant {
		require(nft.inserted[_nft], "PolarMarketPlace: Nft contract is not setup");
		require(nft.values[_nft].mapOffer.inserted[_tokenId], "PolarMarketPlace: Item doesnt exist");

		Offer memory offer = nft.values[_nft].mapOffer.values[_tokenId];

		require(offer.owner != msg.sender, "PolarMarketPlace: You cannot buy your own nft");

		uint feePrice = offer.price * fee / 10000;

		IERC20(polar).transferFrom(msg.sender, offer.owner, offer.price - feePrice);
		if (feePrice > 0)
			IERC20(polar).transferFrom(msg.sender, swapper, feePrice);
		IERC721(_nft).transferFrom(address(this), msg.sender, _tokenId);

		mapOfferRemove(nft.values[_nft].mapOffer, _tokenId);
		mapNftDelete(_nft);
	}

	function recoverOfferItem(address _nft, uint _tokenId) external nonReentrant {
		require(nft.inserted[_nft], "PolarMarketPlace: Nft contract is not setup");
		require(nft.values[_nft].mapOffer.inserted[_tokenId], "PolarMarketPlace: Item doesnt exist");
		
		Offer memory offer = nft.values[_nft].mapOffer.values[_tokenId];

		require(offer.owner == msg.sender || isOwner[msg.sender], "PolarMarketPlace: Unauthorized");

		IERC721(_nft).transferFrom(address(this), offer.owner, _tokenId);
		
		mapOfferRemove(nft.values[_nft].mapOffer, _tokenId);
		mapNftDelete(_nft);
	}

	// external auction
	function sellAuctionItem(
		address _nft, 
		uint _tokenId, 
		uint _currentPrice, 
		uint _end
	) 
		external
		nonReentrant
	{
		require(!isBlacklistedNft[_nft], "PolarMarketPlace: Not authorized contract");
		require(openAuction, "PolarMarketPlace: Not open");

		IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

		mapNftAdd(_nft);
		mapAuctionSet(nft.values[_nft].mapAuction, _tokenId, Auction({
			owner: msg.sender,
			tokenId: _tokenId,
			currentPrice: _currentPrice,
			nextOwner: msg.sender,
			end: _end,
			creationTime: block.timestamp
		}));
	}
	
	function purchaseAuctionItem(address _nft, uint _tokenId, uint _currentPrice) external nonReentrant {
		require(nft.inserted[_nft], "PolarMarketPlace: Nft contract is not setup");
		require(nft.values[_nft].mapAuction.inserted[_tokenId], "PolarMarketPlace: Item doesnt exist");

		Auction memory auction = nft.values[_nft].mapAuction.values[_tokenId];

		require(auction.owner != msg.sender, "PolarMarketPlace: You cannot buy your own nft");
		require(block.timestamp < auction.end, "PolarMarketPlace: Auction already finished");
		require(_currentPrice > auction.currentPrice, 
				"PolarMarketPlace: New price must be bigger than current one");

		if (auction.owner != auction.nextOwner)
			IERC20(polar).transfer(auction.nextOwner, auction.currentPrice);
		IERC20(polar).transferFrom(msg.sender, address(this), _currentPrice);

		mapAuctionSet(nft.values[_nft].mapAuction, _tokenId, Auction({
			owner: auction.owner,
			tokenId: auction.tokenId,
			currentPrice: _currentPrice,
			nextOwner: msg.sender,
			end: auction.end,
			creationTime: auction.creationTime
		}));
	}

	function recoverAuctionItem(address _nft, uint _tokenId) external nonReentrant {
		require(nft.inserted[_nft], "PolarMarketPlace: Nft contract is not setup");
		require(nft.values[_nft].mapAuction.inserted[_tokenId], "PolarMarketPlace: Item doesnt exist");
		
		Auction memory auction = nft.values[_nft].mapAuction.values[_tokenId];

		require(auction.nextOwner == msg.sender || isOwner[msg.sender], "PolarMarketPlace: Unauthorized");
		require(block.timestamp >= auction.end, "PolarMarketPlace: Auction not finished yet");

		if (auction.owner != auction.nextOwner) {
			uint feePrice = auction.currentPrice * fee / 10000;

			IERC20(polar).transfer(auction.owner, auction.currentPrice - feePrice);
			if (feePrice > 0)
				IERC20(polar).transfer(swapper, feePrice);
		}

		IERC721(_nft).transferFrom(address(this), auction.nextOwner, _tokenId);

		mapAuctionRemove(nft.values[_nft].mapAuction, _tokenId);
		mapNftDelete(_nft);
	}
	
	function forceAuctionEnd(address _nft, uint _tokenId) external onlyOwners {
		require(nft.inserted[_nft], "PolarMarketPlace: Nft contract is not setup");
		require(nft.values[_nft].mapAuction.inserted[_tokenId], "PolarMarketPlace: Item doesnt exist");
		
		Auction memory auction = nft.values[_nft].mapAuction.values[_tokenId];

		if (auction.owner != auction.nextOwner) {
			uint feePrice = auction.currentPrice * fee / 10000;

			IERC20(polar).transfer(auction.owner, auction.currentPrice - feePrice);
			if (feePrice > 0)
				IERC20(polar).transfer(swapper, feePrice);
		}

		IERC721(_nft).transferFrom(address(this), auction.nextOwner, _tokenId);

		mapAuctionRemove(nft.values[_nft].mapAuction, _tokenId);
		mapNftDelete(_nft);
	}

	// external setters
	function setPolar(address _new) external onlyOwners {
		polar = _new;
	}
	
	function setSwapper(address _new) external onlyOwners {
		polar = _new;
	}
	
	function setFee(uint _new) external onlyOwners {
		fee = _new;
	}
	
	function setIsBlacklistedNft(address _nft, bool _new) external onlyOwners {
		isBlacklistedNft[_nft] = _new;
	}
	
	function setOpenOffer(bool _new) external onlyOwners {
		openOffer = _new;
	}
	
	function setOpenAuction(bool _new) external onlyOwners {
		openAuction = _new;
	}

	//external view
	// map nft
	function getNftSize() external view returns(uint) {
		return nft.keys.length;
	}

	function getNftAddressBetweenIndexes(
		uint iStart, 
		uint iEnd
	) 
		external 
		view 
		returns(
			address[] memory
		) 
	{
		address[] memory addresses = new address[](iEnd - iStart);
		for (uint256 i = iStart; i < iEnd; i++)
			addresses[i - iStart] = nft.keys[i];
		return addresses;
	}

	function getNftAddressAll() external view returns(address[] memory) {
		return nft.keys;
	}

	// map offer
	function getOfferOfSize(address _nft) external view returns(uint) {
		return nft.values[_nft].mapOffer.keys.length;
	}
	
	function getOfferOfKeysBetweenIndexes(
		address _nft, 
		uint iStart, 
		uint iEnd
	) 
		external 
		view
		returns(
			uint[] memory
		)
	{
		uint[] memory tokenIds = new uint[](iEnd - iStart);
		MapOffer storage mapOffer = nft.values[_nft].mapOffer;
		for (uint256 i = iStart; i < iEnd; i++)
			tokenIds[i - iStart] = mapOffer.keys[i];
		return tokenIds;
	}

	function getOfferOfBetweenIndexes(
		address _nft, 
		uint iStart, 
		uint iEnd
	) 
		external 
		view
		returns(
			Offer[] memory
		)
	{
		Offer[] memory offers = new Offer[](iEnd - iStart);
		MapOffer storage mapOffer = nft.values[_nft].mapOffer;
		for (uint256 i = iStart; i < iEnd; i++)
			offers[i - iStart] = mapOffer.values[mapOffer.keys[i]];
		return offers;
	}

	// map auction
	function getAuctionOfSize(address _nft) external view returns(uint) {
		return nft.values[_nft].mapAuction.keys.length;
	}
	
	function getAuctionOfKeysBetweenIndexes(
		address _nft, 
		uint iStart, 
		uint iEnd
	) 
		external 
		view
		returns(
			uint[] memory
		)
	{
		uint[] memory tokenIds = new uint[](iEnd - iStart);
		MapAuction storage mapAuction = nft.values[_nft].mapAuction;
		for (uint256 i = iStart; i < iEnd; i++)
			tokenIds[i - iStart] = mapAuction.keys[i];
		return tokenIds;
	}

	function getAuctionOfBetweenIndexes(
		address _nft, 
		uint iStart, 
		uint iEnd
	) 
		external 
		view
		returns(
			Auction[] memory
		)
	{
		Auction[] memory auctions = new Auction[](iEnd - iStart);
		MapAuction storage mapAuction = nft.values[_nft].mapAuction;
		for (uint256 i = iStart; i < iEnd; i++)
			auctions[i - iStart] = mapAuction.values[mapAuction.keys[i]];
		return auctions;
	}

	// private

	// maps
	function mapOfferSet(
		MapOffer storage map,
        uint key,
        Offer memory value
    ) private {
        if (map.inserted[key]) {
            map.values[key] = value;
        } else {
            map.inserted[key] = true;
            map.values[key] = value;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }
	
	function mapOfferRemove(MapOffer storage map, uint key) private {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint256 index = map.indexOf[key];
        uint256 lastIndex = map.keys.length - 1;
        uint256 lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

		if (lastIndex != index)
			map.keys[index] = lastKey;
        map.keys.pop();
    }
	
	function mapAuctionSet(
		MapAuction storage map,
        uint key,
        Auction memory value
    ) private {
        if (map.inserted[key]) {
            map.values[key] = value;
        } else {
            map.inserted[key] = true;
            map.values[key] = value;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }
	
	function mapAuctionRemove(MapAuction storage map, uint key) private {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint256 index = map.indexOf[key];
        uint256 lastIndex = map.keys.length - 1;
        uint256 lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

		if (lastIndex != index)
			map.keys[index] = lastKey;
        map.keys.pop();
    }
	
	function mapNftAdd(
        address key
    ) private {
        if (nft.inserted[key]) {
			return;
        } else {
            nft.inserted[key] = true;
            nft.indexOf[key] = nft.keys.length;
            nft.keys.push(key);
        }
    }
	
	function mapNftDelete(
        address key
    ) private {
        if (!nft.inserted[key]) {
			return;
        } else {
			uint sizeOffer = nft.values[key].mapOffer.keys.length;
			uint sizeAuction = nft.values[key].mapAuction.keys.length;
			if (sizeOffer == 0 && sizeAuction == 0) {
				delete nft.inserted[key];
				delete nft.values[key];

				uint256 index = nft.indexOf[key];
				uint256 lastIndex = nft.keys.length - 1;
				address lastKey = nft.keys[lastIndex];

				nft.indexOf[lastKey] = index;
				delete nft.indexOf[key];

				if (lastIndex != index)
					nft.keys[index] = lastKey;
				nft.keys.pop();
			}
        }
    }
}