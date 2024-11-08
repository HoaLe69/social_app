import { AnimatePresence, motion } from 'framer-motion'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FiSun } from 'react-icons/fi'
import { BiSolidMoon } from 'react-icons/bi'

const ToggleThemeButton = () => {
  const { toggleColorMode } = useColorMode()
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={useColorModeValue('light', 'dark')}
        transition={{ duration: 0.2 }}
        exit={{ y: 20, opacity: 0 }}
        style={{ display: 'inline-block' }}
      >
        <IconButton
          aria-label="toggle theme"
          colorScheme={useColorModeValue('purple', 'orange')}
          icon={useColorModeValue(<BiSolidMoon />, <FiSun />)}
          onClick={toggleColorMode}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ToggleThemeButton
