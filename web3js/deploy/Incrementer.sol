// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Incrementer {
    uint256 public number;
    event Increment(uint256 value);
    event Reset();

    constructor(uint256 _initialNumber) {
        number = _initialNumber;
    }

    function increment(uint256 _number) public {
        number += _number;
        emit Increment(number);
    }

    function reset() public {
        number = 0;
        emit Reset();
    }
}
