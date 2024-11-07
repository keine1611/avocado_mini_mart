import { useAppDispatch, useAppSelector } from '@/store'
import { socket } from '@/socket'
import { useEffect } from 'react'

const useWebSocket = () => {
  const userEmail = useAppSelector((state) => state.auth.user?.email)

  useEffect(() => {
    if (!userEmail) return
    socket.emit('registerUser', userEmail)
  }, [userEmail])
}

export { useWebSocket }
