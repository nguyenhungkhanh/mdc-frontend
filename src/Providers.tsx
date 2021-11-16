import React from 'react'
import { ModalProvider, light, dark } from '@pancakeswap/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { Web3ReactProvider as Web3ReactProviderCustom  } from "contexts/Web3ReactContext";
import { HistoryTokenProvider } from 'contexts/HistoryTokenContext';

import store from 'state'


const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactProviderCustom>
        <HistoryTokenProvider>
          <Provider store={store}>
            <ToastsProvider>
              <HelmetProvider>
                <ThemeProviderWrapper>
                  <LanguageProvider>
                    <RefreshContextProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </RefreshContextProvider>
                  </LanguageProvider>
                </ThemeProviderWrapper>
              </HelmetProvider>
            </ToastsProvider>
          </Provider>
        </HistoryTokenProvider>
      </Web3ReactProviderCustom>
    </Web3ReactProvider>
  )
}

export default Providers
