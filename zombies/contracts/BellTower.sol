// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract BellTower {
    // counter for how many times the bell has benn rung
    uint256 bellRung;

    // event for ringing a bellRung
    event BellRung(uint256 rungForTheTime, address whoRungIt);

    function ringBell() public {
        bellRung++;

        emit BellRung(bellRung, msg.sender);
    }
}
