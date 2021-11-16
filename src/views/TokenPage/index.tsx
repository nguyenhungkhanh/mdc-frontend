/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// @ts-nocheck
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import classNames from "classnames";
import Swap from "views/Swap";
import Page from "views/Page";
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import TokenExplore from "../../components/TokenExplore";
import { BuyIcon, HeartIcon, HeartSolidIcon, NewsIcon, SellIcon, TradeIcon, UserIcon } from "../../components/icons";
import TransactionItem from "./TransactionItem";
import Loading from "../../components/Loading";
import useBNB from "../../hooks/useBNB";
import useTokenInfo from "../../hooks/useTokenInfo";
import useWeb3 from "../../hooks/useWeb3";
import logoImage from "../../assets/images/logo.png";
import bscscanImage from "../../assets/images/bscscan.png";
import bitqueryImage from "../../assets/images/bitquery.png";
import { getTokenPrice } from "../../utils/web3";
import { formatPrice } from "../../utils";
import styles from "./index.module.scss";
import useTransactions from "../../hooks/useTransactions";
import { HistoryTokenContext } from "../../contexts/HistoryTokenContext";
import useWindowDimensions from "../../hooks/useDimensions";

function nFormatter(num: any) {
  if (num >= 1000000000) {
     return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')  }G`;
  }
  if (num >= 1000000) {
     return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')  }M`;
  }
  if (num >= 1000) {
     return `${(num / 1000).toFixed(1).replace(/\.0$/, '')  }K`;
  }
  return num;
}

function TokenPage() {
  const prams: any = useParams()
  const { web3 } = useWeb3()
  const web3Active = useActiveWeb3React()
  const bnbValue = 500;
  const transactions: any = useTransactions(web3, prams.tokenAddress);
  const tokenInfo = useTokenInfo(prams.tokenAddress)
  const [tokenPrice, setTokenPrice] = useState<any>(null);
  const [latestTransaction, setLatestTransaction] = useState(null)
  const [page, setPage] = useState(0)
  const { isFavourite, handleSetFavourite } = useContext(HistoryTokenContext)
  const { width } = useWindowDimensions()

  const [tabActive, setTabActive] = useState('trade');
  const [rateBuySell, setRateBuySell] = useState<any>({})

  const updateRateBuySell = useCallback((dataUpdate) => {
    setRateBuySell((_rateBuySell: any) => ({
      ..._rateBuySell,
      ...dataUpdate
    }))
  }, [])

  const _getTokenPrice = useCallback(async () => {
    if (!tokenInfo) return
    try {
      const _tokenPrice = await getTokenPrice(web3, tokenInfo)
      if (_tokenPrice) {
        setTokenPrice(_tokenPrice)
      }
    } catch (error) {
      console.error(error)
    }
  }, [web3, tokenInfo])

  useEffect(() => {
    _getTokenPrice()
  }, [_getTokenPrice, latestTransaction])
  
  useEffect(() => {
    if (transactions[0]) {
      setLatestTransaction(transactions[0])
    }
  }, [transactions])

  const { totalBuy, totalSell } = useMemo(() => {
    let _totalBuy = 0;
    let _totalSell = 0;

    for (const txHash in rateBuySell) {
      _totalBuy += rateBuySell[txHash].totalBuy
      _totalSell += rateBuySell[txHash].totalSell
    }

    return { totalBuy: _totalBuy, totalSell: _totalSell }
  }, [rateBuySell])

  if (!bnbValue || !tokenInfo || !tokenPrice) {
    return <Loading />
  }

  const handleScroll = (event: any) => {
    const percentage = event.target.clientHeight / (event.target.scrollHeight - event.target.scrollTop);
    if (percentage >= 0.8) {
      setPage(page + 1)
    }
  }

  return (
    <Page>
      <div className={styles.wrapper}>
        <div className="left-content">
          <div className="token-info">
            <div>
              <span>
                Total supply: <small>{ formatPrice(tokenInfo?.totalSupply) }</small>
              </span>
              <br />
              <span>
                Market cap:{" "}
                <small style={{ color: "#28a745" }}>${ nFormatter(tokenInfo?.totalSupply * tokenPrice.price * bnbValue) }</small>
              </span>
            </div>
            <div className="split" />
            <div>
              <a href="/#">Pc v2</a> | {tokenInfo?.symbol}/BNB LP Holdings: <br />
              <small>
                { tokenPrice?.lp?.toFixed(2) } BNB <span style={{ color: "#28a745" }}>(${ nFormatter(tokenPrice?.lp * bnbValue) })</span>
              </small>{" "}
              | <a target="_blank" rel="noreferrer" href="https://bscscan.com/token/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c?a=0xb372ea0debCc8235C2374929028284973e4f5E26#tokenAnalytics">Chart</a> | <a target="_blank" rel="noreferrer" href="https://bscscan.com/token/0xb372ea0debCc8235C2374929028284973e4f5E26#balances">Holders</a>
            </div>
            <div className="split" />
            <div className="flex align-items-center">
              <img height={20} className="mr" src={bitqueryImage} alt="bitquery" />
              <a style={{ color: "rgb(198, 211, 231)" }} target="_blank" rel="noreferrer" href={`https://explorer.bitquery.io/bsc/token/${tokenInfo.address}`}>Bitquery Explorer</a>
            </div>
          </div>
          {
            width >= 1200
            ? <TokenExplore isSmall />
            : null
          }
        </div>

        <div className="main-content">
          <div className="main-content__chart">
            <div className="header-info flex">
              <div className="token-name flex align-items-center">
                <span className="mr">{ tokenInfo?.name } ({tokenInfo?.symbol}/BNB)</span>
                <span className="pointer" onClick={() => handleSetFavourite(tokenInfo)}>
                  {
                    isFavourite(tokenInfo.address)
                    ? <HeartSolidIcon fill="#ff6a6a" />
                    : <HeartIcon />
                  }
                </span>
              </div>
              <div className="flex bscscan-info">
                <img
                  className="mr"
                  style={{ borderRadius: "50%", width: "20px" }}
                  src={bscscanImage}
                  alt="bscscan-logo"
                />
                <div>
                  <a target="_blank" rel="noreferrer" href={`https://bscscan.com/token/${tokenInfo.address}`}>Transactions</a>
                  <span> | </span>
                  <a target="_blank" rel="noreferrer" href={`https://bscscan.com/address/${tokenInfo.address}#code`}>Contract</a>
                  <span> | </span>
                  <a target="_blank" rel="noreferrer" href={`https://bscscan.com/token/${tokenInfo.address}#balances`}>Holders</a>
                </div>
              </div>
            </div>
            <small className="token-price" style={{ color: "#28a745" }}>
              ${ formatPrice(tokenPrice.price * bnbValue) }
            </small>
            {
              width < 1200
              ? <div className="wrapper-swap-main">
                  <Swap />
                </div>
              : null
            }
          </div>

          <div className="main-content__info mt-1">
            <div className="tabs">
              <div className={classNames("pointer tab-item", {"is-active": tabActive === "trade" })} onClick={() => setTabActive("trade")}>
                <TradeIcon width={20} height={20} /> <span className="tab-title">Trade</span>
              </div>
              <div className={classNames("pointer tab-item", {"is-active": tabActive === "your_trade" })} onClick={() => setTabActive("your_trade")}>
                <UserIcon /> <span className="tab-title">Your trade</span>
              </div>
              <div className={classNames("pointer tab-item", {"is-active": tabActive === "top_buyers" })} onClick={() => setTabActive("top_buyers")}>
                <BuyIcon /> <span className="tab-title">Top buyers</span>
              </div>
              <div className={classNames("pointer tab-item", {"is-active": tabActive === "top_sellers" })} onClick={() => setTabActive("top_sellers")}>
                <SellIcon /> <span className="tab-title">Your sellers</span>
              </div>
              <div className={classNames("pointer tab-item", {"is-active": tabActive === "news" })} onClick={() => setTabActive("news")}>
                <NewsIcon width={20} height={20} /> <span className="tab-title">News</span>
              </div>
            </div>

            {
              tabActive === "trade"
              ? <>
                  {
                    (totalBuy + totalSell)
                    ? <div className={classNames("trending-trade", { "is-show": tabActive === "trade" })}>
                        <div 
                          className="buyer" 
                          style={{ width: (totalBuy + totalSell) ? `calc(${totalBuy * 100 / (totalBuy + totalSell)}%)` : 0 }}
                        >
                          { (totalBuy + totalSell) ? `${(totalBuy * 100 / (totalBuy + totalSell)).toFixed(2)}%` : '0%' }
                        </div>
                        <div className="middle-image">
                          <img src={logoImage} alt="logo" />  
                        </div>
                        <div 
                          className="seller"
                          style={{ width: (totalBuy + totalSell) ? `calc(${totalSell * 100 / (totalBuy + totalSell)}%)` : 0 }}
                        >
                          { (totalBuy + totalSell) ? `${(totalSell * 100 / (totalBuy + totalSell)).toFixed(2)}%` : '0%' }
                        </div>
                      </div>
                    : null
                  }
                  <table className="mt-1">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '30px' }}>Time</th>
                        <th className="traded" style={{ width: '25%' }}>Traded</th>
                        <th style={{ minWidth: '50px' }}>Price</th>
                        <th className="price-token" style={{ width: '25%' }}>Price/Token</th>
                        <th style={{ minWidth: '25px' }}>Tx</th>
                      </tr>
                    </thead>
                    <tbody onScroll={handleScroll}>
                      {
                        transactions.map((transaction: any) => {
                          return (
                            <TransactionItem 
                              key={transaction} 
                              txHash={transaction}
                              tokenInfo={tokenInfo}
                              pairAddress={tokenPrice.pair}
                              setRateBuySell={updateRateBuySell}
                              bnbValue={bnbValue}
                            />
                          )
                        })
                      }
                    </tbody>
                  </table>
                </>
              : null
            }
          </div>

          {
            width < 1200
            ? <TokenExplore isSmall />
            : null
          }
        </div>
        {
          width >= 1200
          ? <div className="right-content">
              <Swap />
            </div>
          : null
        }
      </div>
    </Page>
  );
}

export default TokenPage;

