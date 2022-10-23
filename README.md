# Customs smart contracts

### Install library dependancies for local test

```bash
yarn
```

### Start local network with ganache

```bash
yarn ganache
```

### All available commands

The package.json file contains a set of scripts to help on the development phase. Below is a short description for each

- **"ganache"** run local node (development network) with ganache-cli
- **"migrate"** run migration on development network
- **"test"** run tests locally
- **"test:ci"** run tests in CI system
- **"lint:sol"** lint solidity code according to rules
- **"lint:js"** lint javascript code according to rules
- **"lint"** lint solidity code
- **"truffle test -- -g "name of test""** run specific test

### Solhint

[You can find rules and explanations here](https://github.com/protofire/solhint/blob/master/docs/rules.md)

# CONTRACTS

# LEGACY

This contract is a contract of creation of inheritance, which allows to choose a date of departure for the withdrawals of the heir, the heir can make at any time a request to release funds.

We can decide how many wei will be unlocked per second, or unlock a certain amount of wei by hand.

## STRUCTURE

```javascript
struct Leg {
    bytes32 name;
    address founder;
    address heir;
    uint256 startAt;
    uint256 endAt;
    uint256 lastClaim;
    uint256 weiBySeconds;
    uint256 founds;
    uint256 reclaim;
  }
```

## SETTER

You can add, update or delete legs.

```javascript
function createLeg(Leg memory leg) external payable {
    require(msg.value == leg.founds);
    leg.lastClaim = leg.startAt;
    legs[countLegs] = leg;
    countLegs++;
  }
```

```javascript
function unlockFounds(uint256 legId, uint256 unlockFound) external isFounder(legId) {
    legs[legId].lastClaim -= unlockFound / legs[legId].weiBySeconds;
  }
```

```javascript
function changeWeiBySeconds(uint256 legId, uint256 weiBySeconds)
    external
    isFounder(legId)
  {
    uint256 currentClaimable = claimAuthorization(legId);
    legs[legId].weiBySeconds = weiBySeconds;
    legs[legId].lastClaim = block.timestamp - (currentClaimable / weiBySeconds);
  }
```

```javascript
function addFounds(uint256 legId) external payable isFounder(legId) {
    legs[legId].founds += msg.value;
  }
```

```javascript
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
```

```javascript
function giveMeMore(uint256 legId, uint256 newReclaim) external {
    legs[legId].reclaim = newReclaim;
  }
```

```javascript
function acceptReclaim(uint256 legId) external isFounder(legId) {
    legs[legId].lastClaim -= legs[legId].reclaim / legs[legId].weiBySeconds;
  }
```

```javascript
function refound(uint256 legId, uint256 refound) external isFounder(legId) {
    require(legs[legId].founds <= refound);
    (success, ) = payable(_msgSender()).call{ value: refound }("");
    require(success == true, "transaction not succeded");
  }
```

## GUETTER

```javascript
function claimAuthorization(uint256 legId) public view returns (uint256) {
    uint256 maxClaimable = ((block.timestamp - legs[legId].lastClaim) *
      legs[legId].weiBySeconds);

    return maxClaimable;
  }
```

```javascript
function founds(uint256 legId) external view returns (uint256) {
    return legs[legId].founds;
  }
```

```javascript
function time() external view returns (uint256) {
    return block.timestamp;
  }
```

```javascript
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
```

```javascript
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
```
