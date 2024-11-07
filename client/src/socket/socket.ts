import { io } from 'socket.io-client'

const socket = io('http://localhost:1611', {
  withCredentials: true,
})

export { socket }
