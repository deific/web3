contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexedOwner);
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner == owner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}