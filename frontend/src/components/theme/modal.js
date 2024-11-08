import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  dialog: {
    bg: '#f0e7db',
    _dark: {
      bg: '#202023'
    }
  }
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle
})
