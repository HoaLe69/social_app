import {
  Box,
  Heading,
  Button,
  Textarea,
  Input,
  FormLabel,
  Image,
  useColorModeValue,
  Avatar,
  useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdOutlineCloudUpload } from 'react-icons/md'
import { createPost } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'
import { FaRegSmile } from 'react-icons/fa'
import { editPost } from '../../redux/api-request/posts'

const MakePost = ({ postDataEditMode }) => {
  const toast = useToast()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(state => state.post.createPost.isFetching)
  const isLoadingEdit = useSelector(state => state.post.editPost.isFetching)
  const [previewSource, setPreviewSource] = useState(postDataEditMode?.thumbnail || undefined)
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const [err, setErr] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const [formData, setFormData] = useState({
    thumbnail: null,
    formData: {
      userId: userLogin?.id,
      photoUrl: userLogin?.avatar,
      description: postDataEditMode?.description || '',
      displayName: userLogin?.displayName,
      tag: postDataEditMode?.tag || ''
    }
  })
  useEffect(() => {
    if (err) {
      toast({
        title: 'Create Post',
        description: err,
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      })
      setErr('')
    }
  }, [err])
  const handleOnChange = e => {
    let { name, value } = e.target
    if (name === 'image') {
      const file = e.target.files[0]
      setFormData(pre => ({ ...pre, thumbnail: file }))
      previewImage(file)
    } else if (name === 'tag') {
      setFormData(pre => ({
        ...pre,
        formData: { ...pre.formData, [name]: value }
      }))
    } else {
      setFormData(pre => ({
        ...pre,
        formData: { ...pre.formData, [name]: value }
      }))
    }
  }
  const previewImage = file => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
      setPreviewSource(reader.result)
    }
  }
  const handleSubmit = () => {
    if (!formData.thumbnail && formData.formData.description && !postDataEditMode) {
      setErr('You must upload image')
      return
    }
    if (!formData.thumbnail && !formData.formData.description) {
      setErr('empty post')
      return
    }
    const form = new FormData()
    const blob = new Blob([JSON.stringify(formData.formData)], {
      type: 'application/json'
    })
    form.append('thumbnail', formData.thumbnail)
    form.append('formData', blob)
    if (postDataEditMode) {
      editPost(dispatch, form, postDataEditMode?.id, postDataEditMode?.cloudinaryId, userLogin?.accessToken)
    } else createPost(dispatch, navigate, form, userLogin?.accessToken)
  }
  const handleHideEmojiKeyboard = e => {
    if (e.target.closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }
  return (
    <Box pb={2} pt={2} onClick={handleHideEmojiKeyboard}>
      <Box>
        <Box display="flex" alignItems="center" gap="5px">
          <Avatar size="sm" src={userLogin?.avatar} />
          <Heading fontSize="15px">{userLogin?.displayName}</Heading>
        </Box>
        <Box position="relative">
          <Textarea
            mt={2}
            placeholder="What your on mind ?"
            bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}
            resize="vertical"
            name="description"
            onChange={handleOnChange}
            value={formData.formData.description}
          />
          <Box fontSize="20px" position="absolute" right={2} bottom={2} zIndex={10} cursor="pointer" className="emoji">
            <FaRegSmile />
            <Box display={showEmoji ? 'block' : 'none'} position="absolute" top={0} right={'20px'}>
              <EmojiKeyboard
                height={320}
                width={350}
                theme={useColorModeValue('light', 'dark')}
                searchLabel="Procurar emoji"
                searchDisabled={false}
                onEmojiSelect={emoji =>
                  setFormData(pre => ({
                    ...pre,
                    formData: {
                      ...pre.formData,
                      description: pre.formData.description + emoji.character
                    }
                  }))
                }
                categoryDisabled={false}
              />
            </Box>
          </Box>
        </Box>
        <FormLabel
          mt={2}
          htmlFor="input-file"
          display="inline-flex"
          alignItems="center"
          gap="5px"
          p={2}
          bg="teal"
          borderRadius="10px"
          cursor="pointer"
          color={useColorModeValue('whiteAlpha.900', 'gray.900')}
        >
          {postDataEditMode ? 'Change' : 'Upload'}
          <MdOutlineCloudUpload />
          <Input id="input-file" type="file" name="image" display="none" onChange={handleOnChange} />
        </FormLabel>
        <Box display="flex" justifyContent="center">
          <Image src={previewSource} boxSize="xs" objectFit="cover" />
        </Box>

        <FormLabel>
          HasTag
          <Input
            mt={2}
            id="input-hastag"
            type="text"
            onChange={handleOnChange}
            name="tag"
            placeholder="Write title about your post..."
            value={formData.formData.tag}
          />
        </FormLabel>
      </Box>
      <Box pt="3" display="flex" justifyContent="center">
        <Button
          isLoading={postDataEditMode ? isLoadingEdit : isLoading}
          loadingText={postDataEditMode ? 'Saving...' : 'Upload...'}
          colorScheme="teal"
          px={8}
          onClick={handleSubmit}
        >
          {postDataEditMode ? 'Save' : 'Post'}
        </Button>
      </Box>
    </Box>
  )
}

export default MakePost
