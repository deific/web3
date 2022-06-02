// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "./ZombieBattle.sol";
import "./ERC721.sol";

/// @title 一个管理转移僵尸所有权的合约
/// @author steven
/// @dev 符合 OpenZeppelin 对 ERC721 标准草案的实现
contract ZombieOwnership is ZombieBattle, ERC721 {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    mapping(uint256 => address) zombieApprovals;

    function balanceOf(address _owner)
        public
        view
        override
        returns (uint256 _balance)
    {
        // 1. 在这里返回 `_owner` 拥有的僵尸数
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId)
        public
        view
        override
        returns (address _owner)
    {
        // 2. 在这里返回 `_tokenId` 的所有者
        return zombieToOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId)
        public
        override
        onlyOwnerOf(_tokenId)
    {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId)
        public
        override
        onlyOwnerOf(_tokenId)
    {
        zombieApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public override {
        require(zombieApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
        ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }
}
