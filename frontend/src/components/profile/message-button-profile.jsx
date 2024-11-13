import { Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../config/axios'
import { getCurrentSelectedRoom } from '../../redux/conversationSlice'
import { useToast } from '@chakra-ui/react'

const MessaageButton = ({ member, receiver }) => {
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [senderId, receiveId] = member

  const handleGoToRoomChat = async () => {
    if (senderId && receiveId) {
      try {
        const res = await axiosClient.get(`/conversation/find/${senderId}/${receiveId}`)
        if (res) {
          dispatch(getCurrentSelectedRoom({ info: res, receiver }))
        } else {
          const res = await axiosClient.post(`/conversation/create`, { member: member })
          dispatch(getCurrentSelectedRoom({ info: res, receiver }))
        }
        navigate('/chat')
      } catch (err) {
        toast({
          position: 'bottom-right',
          title: 'Message',
          description: 'Something went wrong',
          duration: 1500
        })
        console.log(err)
      }
    }
  }
  return <Button onClick={handleGoToRoomChat}>Messages</Button>
}

export default MessaageButton
