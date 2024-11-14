import { useCallback, useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'

export const useStompClient = (topic, id, onMessageReceived) => {
  const [client, setClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!id) return
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)

    // disable console debug logs if not needed
    //    stompClient.debug = null

    stompClient.connect(
      {},
      () => {
        setIsConnected(true)
        stompClient.subscribe(`${topic}/${id}`, message => {
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
  }, [id, onMessageReceived])

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
