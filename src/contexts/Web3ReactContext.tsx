// @ts-nocheck
import React, { useState, createContext, useEffect } from "react";
import Web3 from "web3";

const WEB3_PROVIDER = "https://bsc-dataseed.binance.org"

const Web3ReactContext = createContext<any>(null);

const Web3ReactProvider = ({ children }: { children: any }) => {
  const [web3, setWeb3] = useState<any>(new Web3(window.ethereum))

  useEffect(() => { 
    let web3Instance;

    if (window.ethereum) {
      web3Instance = new Web3(window.ethereum);
      console.log(web3Instance)
    } else if (window.web3) {
      web3Instance = new Web3(window.web3.currentProvider);
    } else {
      web3Instance = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
    }
    if (web3Instance) {
      setWeb3(web3Instance)
    }
  }, [])

  console.log(web3)

  const value = { web3 }

  return (
    <Web3ReactContext.Provider value={value}>
      { children }
    </Web3ReactContext.Provider>
  )
}

export { Web3ReactContext, Web3ReactProvider }
