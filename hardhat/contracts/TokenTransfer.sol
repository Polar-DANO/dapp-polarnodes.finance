// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "./IERC20.sol";

contract TokenTransfer {
    IERC20 _token;

    function setToken(address token)
        public
    {
        _token = IERC20(token);
    }

    function transfer(address recipient, uint256 amount)
        public
    {
        _token.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount)
        public
    {
        _token.approve(sender, amount);
        _token.transferFrom(sender, recipient, amount);
    }
} 