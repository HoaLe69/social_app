import { Flex, Link, useColorModeValue, Text } from '@chakra-ui/react'
import NavWrap from './nav-wrap'
import ToggleThemeButton from '../theme-toggle-btn'
import { GoHomeFill, GoHome, GoSearch } from 'react-icons/go'
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom'
import { BsFillPersonFill, BsFillPatchPlusFill, BsPerson, BsPatchPlus } from 'react-icons/bs'
import route from '@config/route'

const MenuItem = ({ activeIcon, icon, href, title, subHref, ...props }) => {
  const { pathname } = useLocation()
  const inactiveColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  const active = href === pathname || pathname === subHref
  return (
    <Link
      as={ReactRouterLink}
      fontSize={title ? '25px' : '30px'}
      color={active ? 'grassTeal' : inactiveColor}
      to={href}
      display={'flex'}
      flexDir={'column'}
      alignItems={'center'}
      position="relative"
      _hover={{ textDecoration: 'none' }}
      _before={{
        top: '-10px',
        position: 'absolute',
        content: '""',
        width: '45px',
        borderRadius: '20px',
        height: '2px',
        display: 'inline-block',
        bg: `${active ? 'grassTeal' : 'transparent'}`
      }}
      {...props}
    >
      {active ? activeIcon : icon}
      {title && (
        <Text as="p" fontSize={'12px'} fontFamily={`'M PLUS Rounded 1c' , san-serif`}>
          {title}
        </Text>
      )}
    </Link>
  )
}

const NavBot = () => {
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const menu = [
    {
      icon: <GoHome />,
      href: route.home,
      subHref: `/post/1`,
      activeIcon: <GoHomeFill />,
      title: 'Home'
    },
    {
      icon: <GoSearch />,
      href: route.search,
      activeIcon: <GoSearch />,
      title: 'Search'
    },
    {
      icon: <BsPatchPlus />,
      href: route.makePost,
      activeIcon: <BsFillPatchPlusFill />,
      title: 'Create'
    },

    {
      icon: <BsPerson />,
      href: `/profile/${userLogin?.id}`,
      activeIcon: <BsFillPersonFill />,
      title: 'Profile'
    }
  ]
  return (
    <NavWrap bottom={0} display={{ lg: 'none' }}>
      <Flex align="center" justify="space-evenly">
        {menu?.map(item => {
          return (
            <MenuItem
              key={item.href}
              subHref={item.subHref}
              activeIcon={item.activeIcon}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          )
        })}
        <ToggleThemeButton />
      </Flex>
    </NavWrap>
  )
}

export default NavBot
