import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import '@fontsource/m-plus-rounded-1c/300.css'
import '@fontsource/m-plus-rounded-1c/700.css'
import { modalTheme } from '@components/theme/modal'

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true
}
const styles = {
  global: props => ({
    body: {
      bg: mode('#f0e7db', '#202023')(props)
    },
    'html *::-webkit-scrollbar': {
      borderRadius: 0,
      width: '8px'
    },
    'html *::-webkit-scrollbar-thumb': {
      borderRadius: '4px',
      backgroundColor: '#888'
    },
    'html *::-webkit-scrollbar-track': {
      borderRadius: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }
  })
}
const fonts = {
  heading: `'M PLUS Rounded 1c' , san-serif`
}
const colors = {
  grassTeal: '#88ccca'
}
const theme = extendTheme({
  config,
  styles,
  fonts,
  colors,
  components: { Modal: modalTheme }
})

export default theme
