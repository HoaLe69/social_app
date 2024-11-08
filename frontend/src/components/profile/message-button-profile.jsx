import { Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const MessaageButton = ({ member }) => {
  const navigate = useNavigate()

  const [senderId, receiveId] = member
  const { id } = useParams()

  const accessToken = JSON.parse(localStorage.getItem('user'))?.accessToken
  const baseUrl = process.env.REACT_APP_API_URL

  const handleGoToRoomChat = async () => {
    if (senderId && receiveId) {
      try {
        const res = await axios.get(`${baseUrl}/conversation/find/${senderId}/${receiveId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (res?.length > 0) {
          navigate(`/chat/${res[0].id}?receiver=${id}`)
        } else {
          const res = await axios.post(
            `${baseUrl}/conversation/create`,
            { member: member },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          navigate(`/chat/${res.id}?receiver=${id}`)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  return <Button onClick={handleGoToRoomChat}>Messages</Button>
}

export default MessaageButton
