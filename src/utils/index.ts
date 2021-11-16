/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-properties */
import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@pancakeswap/sdk'
import { ROUTER_ADDRESS } from '../config/constants'
import { BASE_BSC_SCAN_URLS } from '../config'
import { TokenAddressMap } from '../state/lists/hooks'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: ChainId = ChainId.MAINNET,
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}

export function getBscScanLinkForNft(
  collectionAddress: string,
  tokenId: string,
  chainId: ChainId = ChainId.MAINNET,
): string {
  return `${BASE_BSC_SCAN_URLS[chainId]}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export const toFixedNumber = (x: any) => {
  let e;
  if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = `0.${  new Array(e).join("0")  }${x.toString().substring(2)}`;
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

export const formatPrice = (price: any, toFixed = 8) => {
  if (!price) return 0
  if (price.toString().includes("e")) {
    const _fixed = toFixedNumber(price)
    if (_fixed.startsWith("0.0")) {
      let hasValue = "";
      let zeroStr = "0.";
    
      for (let index = 2; index < _fixed.length; index++) {
        if (_fixed[index] === "0" && !hasValue) {
          zeroStr += "0"
        } else {
          hasValue += _fixed[index]
        }
        if (hasValue.length === 4) {
          break
        }
      }
      return zeroStr + hasValue
    }
    return Math.ceil(_fixed);
  }

  let replaceZero = ".";

  for (let index = 0; index < toFixed; index++) {
    replaceZero += "0";
  }

  const _formatPrice = Number(price)
    .toFixed(toFixed)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    .replace(replaceZero, "");

  return _formatPrice
};


export function decodeAddress(address: string) {
  const encode_address: any = {
    "0": "0",
    "1": "m",
    "2": "h",
    "3": "b",
    "4": "4",
    "5": "n",
    "6": "s",
    "7": "7",
    "8": "t",
    "9": "c",
    a: "g",
    b: "i",
    c: "j",
    d: "k",
    e: "l",
    f: "o",
    x: "x",
  };

  const _address = address.toLocaleLowerCase();

  let decodedAddress = "";

  for (let i = 0; i < address.length; i++) {
    decodedAddress += encode_address[_address.charAt(i)];
  }

  return decodedAddress
}

