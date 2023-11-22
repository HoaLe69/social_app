import {
  Box,
  Text,
  Tooltip,
  Avatar,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { AiFillHeart, AiFillMessage } from "react-icons/ai";
import { BsPatchPlusFill } from "react-icons/bs";
import CreatePostModal from "../modals/create";
import ToggleThemeButton from "../theme-toggle-btn";
import { COLOR_THEME } from "../../constant";
import Notify from "../notify/notify";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import RoomsHome from "../chat-float/room-float";
import axios from "axios";

const MenuItemPc = ({ icon, onOpen }) => {
  return (
    <Box
      onClick={onOpen}
      cursor="pointer"
      rounded="full"
      fontSize={"22px"}
      bg={COLOR_THEME.BG_BUTTON}
      p={3}
    >
      {icon}
    </Box>
  );
};

const NavMenuPc = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userLogin = JSON.parse(localStorage.getItem("user"));
  const handleLogOut = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/auth/log-out/${userLogin?.userName}`,
      );
      if (res) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box display={{ base: "none", lg: "flex" }} alignItems="center" gap="10px">
      <Box>
        <MenuItemPc icon={<BsPatchPlusFill />} title="create" onOpen={onOpen} />
        <CreatePostModal isOpen={isOpen} onClose={onClose} />
      </Box>
      <Menu placement="auto">
        <Tooltip label="notification">
          <MenuButton _expanded={{ color: "grassTeal" }}>
            <MenuItemPc icon={<AiFillHeart />} title="notification" />
          </MenuButton>
        </Tooltip>
        <MenuList bg={COLOR_THEME.BG} width="md" maxH="60vh">
          <Notify />
        </MenuList>
      </Menu>
      <Menu placement="bottom">
        <Tooltip label="message">
          <MenuButton _expanded={{ color: "grassTeal" }}>
            <MenuItemPc icon={<AiFillMessage />} title="message" />
          </MenuButton>
        </Tooltip>
        <MenuList bg={COLOR_THEME.BG} width={"md"} maxH="60vh">
          <Box>
            <RoomsHome />
          </Box>
        </MenuList>
      </Menu>
      <Menu placement="auto">
        <Tooltip label="account">
          <MenuButton>
            <Avatar
              cursor="pointer"
              borderWidth={2}
              borderStyle="solid"
              borderColor={useColorModeValue("gray.500", "whiteAlpha.500")}
              size={"md"}
              src={userLogin?.avatar}
            />
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuGroup title="Profile">
            <Link to={`/profile/${userLogin?.id}`}>
              <MenuItem>
                <Box as="span" fontSize="lg" mr={2}>
                  <CgProfile />
                </Box>
                <Text> My Profile</Text>
              </MenuItem>
            </Link>
            <MenuItem onClick={handleLogOut}>
              <Box as="span" fontSize="lg" mr={2}>
                <BiLogOut />
              </Box>
              Log out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
      <ToggleThemeButton />
    </Box>
  );
};

export default NavMenuPc;
