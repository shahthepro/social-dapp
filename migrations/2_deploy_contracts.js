var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = async function(deployer) {
  return await deployer.deploy(SimpleStorage);
};
