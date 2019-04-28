const TestIdentityRegistry = artifacts.require('./ERC1484/TestIdentityRegistry.sol')
const SocialMediaResolver = artifacts.require('./SocialMediaResolver.sol')

module.exports = async function(deployer, network, accounts) {
  if (network === 'test') { return }

  console.log(network)

  if (network === 'development') {
    // Deploy identity registry for development network
    await deployer.deploy(TestIdentityRegistry)
    const instance = await TestIdentityRegistry.deployed()
    process.env.IDENTITY_RESOLVER_ADDRESS = instance.address
    process.env.SIGNING_AUTHORITY_ADDRESS = accounts[5]
  }

  const { IDENTITY_RESOLVER_ADDRESS, SIGNING_AUTHORITY_ADDRESS } = process.env

  return await deployer.deploy(SocialMediaResolver, IDENTITY_RESOLVER_ADDRESS, SIGNING_AUTHORITY_ADDRESS)
}