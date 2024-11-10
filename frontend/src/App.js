import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { routesPublic, routesPrivate } from './routes'
import RequireAuthentication from './components/require-auth'
import PageNotFound from './pages/not-found'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_KEY}>
      <Box className="App">
        <Routes>
          {routesPublic?.map(route => {
            return <Route path={route.path} element={route.component} key={route.path} />
          })}
          {routesPrivate?.map(route => {
            return (
              <Route
                path={route.path}
                element={<RequireAuthentication>{route.component}</RequireAuthentication>}
                key={route.path}
              />
            )
          })}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </GoogleOAuthProvider>
  )
}

export default App
