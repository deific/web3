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
    // Event that will be emitted whenever the project starter has received the funds
    event CreatorPaid(address recipient);

    // Modifier to check current state
    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint fundRaisingDeadline,
        uint goalAmount
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        amountGoal = goalAmount;
        raiseBy = fundRaisingDeadline;
        currentBalance = 0;
    }
}
