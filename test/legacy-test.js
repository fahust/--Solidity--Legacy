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

const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      },
      err => {
        if (err) {
          return reject(err);
        }
        const newBlockHash = web3.eth.getBlock("latest").hash;

        return resolve(newBlockHash);
      },
    );
  });
};

contract("KANJIDROPERC721AWithReceive", async accounts => {
  const leg = {
    name: web3.utils.fromAscii("test de name un poil long").padEnd(66, "0"),
    founder: accounts[0],
    heir: accounts[1],
    startAt: Math.round(Date.now() / 1000) - 103,
    endAt: Math.round(Date.now() / 1000) + 1000,
    lastClaim: 0,
    weiBySeconds: 10,
    founds: 1000,
    //openFounds: 1000,
  };

  before(async function () {
    this.legacy = await LEGACY.new(); // we deploy contract
  });

  describe("", async function () {
    it("SUCCESS : createLeg", async function () {
      await this.legacy.createLeg(leg, { from: accounts[0], value: "1000" });
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : takeMyLeg 10", async function () {
      await this.legacy.takeMyLeg(10, 0, { from: accounts[1] });
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : takeMyLeg 990", async function () {
      await this.legacy.takeMyLeg(990, 0, { from: accounts[1] });
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("ERROR : takeMyLeg 20", async function () {
      await truffleAssert.reverts(this.legacy.takeMyLeg(20, 0, { from: accounts[1] }));
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : add 1000 founds", async function () {
      await this.legacy.addFounds(0, { from: accounts[0], value: "1000" });
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : unlock founds 110", async function () {
      await this.legacy.unlockFounds(0, 110);
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : takeMyLeg 100", async function () {
      await this.legacy.takeMyLeg(100, 0, { from: accounts[1] });
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("ERROR : takeMyLeg 100", async function () {
      await truffleAssert.reverts(this.legacy.takeMyLeg(100, 0, { from: accounts[1] }));
    });

    it("SUCCESS : change wei by seconds", async function () {
      await this.legacy.changeWeiBySeconds(0, 1);
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : unlock founds 60", async function () {
      await this.legacy.unlockFounds(0, 60);
    });

    it("SUCCESS : change wei by seconds", async function () {
      await this.legacy.changeWeiBySeconds(0, 100);
    });

    it("SUCCESS : claimAuthorization", async function () {
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });

    it("SUCCESS : await 15 seconds & claimAuthorization", async function () {
      await timeout(15000);
      advanceBlock();
      console.log(
        "authorized : " + (await this.legacy.claimAuthorization(0)) + "",
        " & founds : " + (await this.legacy.founds(0)) + "",
        " & time : " + (await this.legacy.time()) + "",
      );
    });
  });
});
