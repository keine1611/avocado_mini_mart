import { authController, cartController } from '@/controllers'
import { Server } from 'socket.io'
import cookie from 'cookie'
import { verifyAccessToken } from '@/utils'
import { cartService } from '@/services/cart'

const clientUrl = process.env.CLIENT_URL

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true,
    },
  })

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '')
    const accessToken = cookies.accessToken
    if (!accessToken) {
      return next(new Error('Authentication error: No access token provided'))
    }
    try {
      const account = await verifyAccessToken({ accessToken })
      socket.account = account
      next()
    } catch (error) {
      return next(new Error('Authentication error: Invalid access token')) // Từ chối kết nối
    }
  })
  io.on('connection', (socket) => {
    const account = socket.account

    if (!account) return socket.disconnect()
    socket.join(`user-${account.id}`)

    socket.on('registerUser', (email) => {
      socket.userEmail = email
    })

    socket.on('syncFavorites', (favorites) => {
      console.log('Received favorites:', favorites)
      socket.emit('favoritesUpdated', {
        data: favorites,
      })
    })

    socket.on('syncCart', async (cart) => {
      await cartService.syncCart({
        cartItems: cart,
        accountId: account.id,
      })
      const cartUpdated = await cartService.getCart({ accountId: account.id })
      io.to(`user-${account.id}`).emit('cartUpdated', cartUpdated)
    })

    socket.on('disconnect', () => {
      socket.leave(`user-${account.id}`)
    })
  })

  return io
}

export { setupWebSocket }
