pragma solidity ^0.8.4;

import "./ZombieBattle";

contract ZombieOwnership is ZombieBattle, ERC721 {
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        // 1. 在这里返回 `_owner` 拥有的僵尸数
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        // 2. 在这里返回 `_tokenId` 的所有者
        return zombieToOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId)
        public
        onlyOwnerOf(_tokenId)
    {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {}

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerZombieCount[_to]++;
        ownerZombieCount[_from]--;
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }
}
