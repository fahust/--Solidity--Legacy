//const { BigNumber, ethers } = require("ethers");
//const keccak256 = require("keccak256");
const LEGACY = artifacts.require("LEGACY");
const truffleAssert = require("truffle-assertions");
const { ethers } = require("ethers");

function bytes32FromNumber(number) {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(number), 32);
}

function numberFromBytes32(bytes32) {
  return parseInt(Number(bytes32));
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

contract("KANJIDROPERC721AWithReceive", async accounts => {
  const leg = {
    name: web3.utils.fromAscii("test de name un poil long").padEnd(66, "0"),
    founder: accounts[0],
    heir: accounts[1],
    startAt: Math.round(Date.now() / 1000) - 10,
    endAt: Math.round(Date.now() / 1000) + 1000,
    lastClaim: 0,
    weiBySeconds: 10,
    founds: 1000,
    openFounds: 1000,
  };

  before(async function () {
    this.legacy = await LEGACY.new(); // we deploy contract
  });

  describe("", async function () {
    it("SUCCESS : createLeg", async function () {
      await this.legacy.createLeg(leg, { from: accounts[0], value: "1000" });
    });

    it("SUCCESS : claimAuthorization", async function () {
      const authorization = await this.legacy.claimAuthorization(0, {
        from: accounts[1],
      });
      console.log("authorized : ", authorization + "");
      const founds = await this.legacy.founds(0, {
        from: accounts[1],
      });
      console.log("founds : ", founds + "");
    });

    it("SUCCESS : takeMyLeg", async function () {
      await timeout(5000);
      await this.legacy.takeMyLeg(1000, 0, { from: accounts[1] });
    });

    it("SUCCESS : claimAuthorization", async function () {
      const authorization = await this.legacy.claimAuthorization(0, {
        from: accounts[1],
      });
      console.log("authorized : ", authorization + "");
      const founds = await this.legacy.founds(0, {
        from: accounts[1],
      });
      console.log("founds : ", founds + "");
    });

    it("SUCCESS : takeMyLeg", async function () {
      await this.legacy.takeMyLeg(20, 0, { from: accounts[1] });
    });

    it("SUCCESS : claimAuthorization", async function () {
      const authorization = await this.legacy.claimAuthorization(0, {
        from: accounts[1],
      });
      console.log("authorized : ", authorization + "");
      const founds = await this.legacy.founds(0, {
        from: accounts[1],
      });
      console.log("founds : ", founds + "");
    });
  });
});
