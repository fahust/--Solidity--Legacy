// SPDX-License-Identifier: MIT

// Into the Metaverse NFTs are governed by the following terms and conditions: https://a.did.as/into_the_metaverse_tc

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LEGACY is Ownable {
  mapping(uint256 => Leg) legs;

  struct Leg {
    bytes32 name;
    address founder;
    address heir;
    uint256 startAt;
    uint256 endAt;
    uint256 lastClaim;
    uint256 weiBySeconds;
    uint256 founds;
  }

  uint256 countLegs;

  function createLeg(Leg memory leg) external payable {
    require(msg.value == leg.founds);
    leg.lastClaim = leg.startAt;
    legs[countLegs] = leg;
    countLegs++;
  }

  function unlockFounds(uint256 legId, uint256 unlockFound) external {
    require(_msgSender() == legs[legId].founder, "you are not founder");
    legs[legId].lastClaim -= unlockFound / legs[legId].weiBySeconds;
  }

  function changeWeiBySeconds(uint256 legId, uint256 weiBySeconds) external {
    require(_msgSender() == legs[legId].founder, "you are not founder");
    uint256 currentClaimable = claimAuthorization(legId);
    legs[legId].weiBySeconds = weiBySeconds;
    legs[legId].lastClaim = block.timestamp - (currentClaimable / weiBySeconds);
  }

  function addFounds(uint256 legId) external payable {
    require(_msgSender() == legs[legId].founder, "you are not founder");
    legs[legId].founds += msg.value;
  }

  function takeMyLeg(uint256 claim, uint256 legId) external returns (bool success) {
    require(_msgSender() == legs[legId].heir, "you are not good heir");
    require(block.timestamp > legs[legId].startAt, "legacy has not start");
    require(block.timestamp < legs[legId].endAt, "legacy has ended");

    uint256 maxClaimable = claimAuthorization(legId);

    require(claim <= maxClaimable, "you claim more than authorized");
    require(claim <= legs[legId].founds, "you claim more than found");

    legs[legId].lastClaim += claim / legs[legId].weiBySeconds;
    legs[legId].founds -= claim;

    (success, ) = payable(_msgSender()).call{ value: claim }("");
    require(success == true, "transaction not succeded");
  }

  function claimAuthorization(uint256 legId) public view returns (uint256) {
    uint256 maxClaimable = ((block.timestamp - legs[legId].lastClaim) *
      legs[legId].weiBySeconds);

    return maxClaimable;
  }

  function founds(uint256 legId) external view returns (uint256) {
    return legs[legId].founds;
  }

  function time() external view returns (uint256) {
    return block.timestamp;
  }

  function searchMyChests() external view returns (Leg[] memory) {
    uint256 totalMyChests;
    uint256 countMyChests;
    for (uint256 i = 0; i < countLegs; i++) {
      if (legs[i].founder == _msgSender()) totalMyChests++;
    }
    Leg[] memory myLegs = new Leg[](totalMyChests);
    for (uint256 i = 0; i < countLegs; i++) {
      if (legs[i].founder == _msgSender()) {
        countMyChests++;
        myLegs[countMyChests] = legs[i];
      }
    }
    return myLegs;
  }

  function searchMyLegs() external view returns (Leg[] memory) {
    uint256 totalMyLegs;
    uint256 countMyLegs;
    for (uint256 i = 0; i < countLegs; i++) {
      if (legs[i].heir == _msgSender()) totalMyLegs++;
    }
    Leg[] memory myLegs = new Leg[](totalMyLegs);
    for (uint256 i = 0; i < countLegs; i++) {
      if (legs[i].heir == _msgSender()) {
        countMyLegs++;
        myLegs[countMyLegs] = legs[i];
      }
    }
    return myLegs;
  }

  //refund

  //overClaim (demander un dépod plus important)
  //acceptOverClaim
}
