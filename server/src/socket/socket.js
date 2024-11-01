import { Server } from 'socket.io'

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log('A user connected')

    // Lắng nghe sự kiện đồng bộ favorites
    socket.on('syncFavorites', (favorites) => {
      console.log('Received favorites:', favorites)
      socket.emit('favoritesUpdated', {
        data: favorites,
      })
    })

    // Lắng nghe sự kiện thêm favorite
    socket.on('addFavorite', (favorite) => {
      console.log('Added favorite:', favorite)
      socket.emit('favoriteAdded', { data: favorite })
    })

    // Lắng nghe sự kiện xóa favorite
    socket.on('removeFavorite', (favoriteId) => {
      console.log('Removed favorite with ID:', favoriteId)
      socket.emit('favoriteRemoved', { id: favoriteId })
    })

    // Lắng nghe sự kiện đồng bộ cart
    socket.on('syncCart', (cartItems) => {
      console.log('Received cart items:', cartItems)
      socket.emit('cartUpdated', { message: 'Cart synced successfully' })
    })

    // Lắng nghe sự kiện thêm cart item
    socket.on('addCartItem', (cartItem) => {
      console.log('Added cart item:', cartItem)
      socket.emit('cartItemAdded', { data: cartItem })
    })

    // Lắng nghe sự kiện xóa cart item
    socket.on('removeCartItem', (cartItemId) => {
      console.log('Removed cart item with ID:', cartItemId)
      socket.emit('cartItemRemoved', { id: cartItemId })
    })

    // Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  return io
}

export { setupWebSocket }
