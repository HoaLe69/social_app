import SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'

const WebSocket = (setComments, setFilterDel = function () {}) => {
  // const [stompClient, setStompClient] = useState(null);
  let stompClient = null
  // const [message, setMessage] = useState({});
  const connect = (channel, id) => {
    const socket = new SockJS('http://localhost:8080/ws')
    const stomp = Stomp.over(socket)
    stompClient = stomp
    stomp.connect({}, frame => {
      console.log('Connected', frame)
      stomp.subscribe(`/topic/${channel}/${id}`, message => {
        const messageRes = JSON.parse(message.body)
        if (messageRes.body.message) {
          setFilterDel(messageRes.body)
        } else {
          setComments(pre => {
            const index = pre.findIndex(mess => mess.id === messageRes.body.id)
            if (index !== -1) {
              const newListComment = pre
              const temp = newListComment.splice(index, 1, messageRes.body)
              return [...newListComment]
            }
            return [...pre, messageRes.body]
          })
        }
      })
    })

    // setStompClient(stomp);
  }
  const sendMessage = (message, channel, id) => {
    if (stompClient) {
      stompClient.send(
        `/app/${channel}/${id}`,
        {},
        JSON.stringify({
          ...message
        })
      )
    }
  }
  const disconnect = () => {
    if (stompClient) stompClient.disconnect()
  }
  return { sendMessage, disconnect, connect }
}

export default WebSocket
