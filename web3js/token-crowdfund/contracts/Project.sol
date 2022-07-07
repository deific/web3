//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./SafeMath.sol";

contract Project {
    using SafeMath for uint256;

    // Data struct
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    // state variables
    address payable public creator;
    uint public amountGoal; // required to reach at least this much,else everyone gets refud
    uint public completeAt;
    uint256 public currentBalance;
    uint public raiseBy;
    string public title;
    string public description;
    State public state = State.Fundraising;
    mapping(address => uint) public contributions;

    // Event that will be emitted whenever funding will be received
    event FundingReceived(address contributor, uint amount, uint currentTotal);
}
