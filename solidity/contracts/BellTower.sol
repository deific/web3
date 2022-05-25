pragma solidity ^0.8.4;


contract BellTower {

    // counter for how many times the bell has benn rung
    uint bellRung;

    // event for ringing a bellRung
    event BellRung(uint rungForTheTime, address whoRungIt);

    function ringBell() public {
        bellRung ++;

        emit BellRung(bellRung, msg.sender);
    }

}

