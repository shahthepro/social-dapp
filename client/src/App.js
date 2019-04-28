import React, { Component } from "react"
import SimpleStorageContract from "./contracts/SimpleStorage.json"
import getWeb3 from "./utils/getWeb3"

import "./App.css"

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = SimpleStorageContract.networks[networkId]
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  getAbsoluteURL = (host, relativeUrl, params) => {
    const url = new URL(`${host}${relativeUrl}`)
    if (!params) {
      return url.toString()
    }

    for (let key in params) {
      url.searchParams.append(key, params[key])
    }

    return url.toString()
  }

  getAbsoluteServerURL = (relativeUrl, params) => {
    return this.getAbsoluteURL(process.env.REACT_APP_API_SERVER_HOST, relativeUrl, params)
  }

  getAbsoluteClientURL = (relativeUrl, params) => {
    return this.getAbsoluteURL(process.env.REACT_APP_CLIENT_HOST, relativeUrl, params)
  }

  authorizeService = (serviceName) => {
    switch (serviceName) {
      case 'google':
        window.location = this.getAbsoluteServerURL('/google/auth', {
          redirect: this.getAbsoluteClientURL('/', {
            serviceName: 'google'
          })
        })
        break
      default:
        return
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading...</div>
    }
    return (
      <div className="App">
        <button onClick={() => {
          this.authorizeService('google')
        }}>Google</button>
      </div>
    )
  }
}

export default App
