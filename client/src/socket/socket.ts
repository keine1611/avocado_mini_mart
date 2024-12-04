import { io } from 'socket.io-client'

const apiSocket = import.meta.env.VITE_API_SOCKET

const socket = io(apiSocket, {
  withCredentials: true,
  autoConnect: false,
})

export { socket }
