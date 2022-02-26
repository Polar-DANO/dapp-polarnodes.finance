// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract TestToken is ERC20 {
    constructor(address holder) ERC20("TestToken", "TestToken")
    {
        _mint(msg.sender, 1000 * 10e18);
        _mint(0x91deC291491E1C2736a75915D7ca345Ea559A913, 1000 * 10e18);
        _mint(holder, 1000 * 10e18);
    }
} 