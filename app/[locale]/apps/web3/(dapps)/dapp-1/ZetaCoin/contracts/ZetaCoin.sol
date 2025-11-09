// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZetaCoin is ERC20, Ownable {
    address public vault;
    
    // max supply 1 billion tokens
    uint256 public constant MAX_SUPPLY = 1000000000 * 10 ** 18;

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can perform this action");
        _;
    }

    constructor() ERC20("ZetaCoin", "ZETA") Ownable(msg.sender) {

    }

    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid vault address");
        vault = _vault;
    }

    function mint(address to, uint256 amount) public onlyVault {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply reached");
        _mint(to, amount);
    }

    function burn(uint256 amount) public onlyVault {
        require(balanceOf(vault) >= amount, "Insufficient balance");
        _burn(vault, amount);
    }
}

 