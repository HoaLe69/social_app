import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button, useDisclosure } from '@chakra-ui/react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { deletePost } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit } from 'react-icons/fa'
import CreatePostModal from './modals/create'

const MenuPost = ({ inforPost }) => {
  const { cloudinaryId, id, tag, description, thumbnail } = inforPost
  const postData = {
    id,
    cloudinaryId,
    description,
    tag,
    thumbnail
  }
  const { isOpen, onClose, onOpen } = useDisclosure()
  const isLoading = useSelector(state => state.post.deletePost.isFetching)
  const isLoadingEdit = useSelector(state => state.post.editPost.isFetching)
  const accessToken = JSON.parse(localStorage.getItem('user')).accessToken
  const dispatch = useDispatch()
  const handleOnClickMenuItemDel = () => {
    deletePost(dispatch, id, cloudinaryId, accessToken)
  }
  return (
    <Menu placement="bottom-end" closeOnSelect={false}>
      <MenuButton rounded="full" as={IconButton} icon={<BiDotsHorizontalRounded />} />
      <MenuList>
        <MenuItem
          leftIcon={<AiFillDelete />}
          isLoading={isLoading}
          loadingText="delete"
          as={Button}
          onClick={handleOnClickMenuItemDel}
        >
          Delete post
        </MenuItem>
        <MenuItem
          leftIcon={<FaEdit />}
          isLoading={isLoadingEdit}
          loadingText="Editting..."
          as={Button}
          onClick={onOpen}
        >
          Edit Post
        </MenuItem>
      </MenuList>
      <CreatePostModal postDataEditMode={postData} isOpen={isOpen} mode="edit" onClose={onClose} />
    </Menu>
  )
}

export default MenuPost
