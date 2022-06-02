// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract Ownable {
    address payable public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexedOwner
    );

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner == owner);
        emit OwnershipTransferred(owner, newOwner);
        owner = payable(newOwner);
    }
}
