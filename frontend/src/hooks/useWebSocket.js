import { useCallback, useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'

const WebSocket = (setComments, setFilterDel = function () {}) => {
  let stompClient = null
  const connect = (channel, id) => {
    //TODO: replace the url on production
    const socket = new SockJS('http://localhost:8080/ws')
    const stomp = Stomp.over(socket)
    stompClient = stomp
    stomp.connect({}, frame => {
      console.log('Connected', frame)
      stomp.subscribe(`/topic/${channel}/${id}`, message => {
        const messageRes = JSON.parse(message.body)
        console.log({ messageRes })
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

export const useStompClient = (topic, onMessageReceived) => {
  const [client, setClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)

    // disable console debug logs if not needed
    //    stompClient.debug = null

    stompClient.connect(
      {},
      () => {
        setIsConnected(true)
        stompClient.subscribe(topic, message => {
          if (onMessageReceived) {
            onMessageReceived(JSON.parse(message.body))
          }
        })
      },
      error => {
        console.log('Connection error: ', error)
      }
    )

    setClient(stompClient)

    //Cleanup on unmount
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect()
      }
    }
  }, [topic, onMessageReceived])

  const sendMessage = useCallback(
    (destination, message) => {
      if (client && isConnected) {
        client.send(destination, {}, JSON.stringify(message))
      } else {
        console.warn('Client is not connected')
      }
    },
    [client, isConnected]
  )

  return { sendMessage, isConnected }
}

export default WebSocket
