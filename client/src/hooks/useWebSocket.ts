import { useAppDispatch, useAppSelector } from '@/store'
import { socket } from '@/socket'
import { useEffect } from 'react'

const useWebSocket = () => {
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      socket.connect()
      socket.emit('registerUser', user?.email)
    }
  }, [user])
}

export { useWebSocket }
