import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './config/theme'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <ChakraProvider theme={theme} resetCSS={true}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>,
)
