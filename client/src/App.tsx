import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'
import { MyToast } from './components'
import { LoadingOverlay } from './components/ui/LoadingOverlay'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <MyToast />
      <LoadingOverlay />
    </>
  )
}

export default App
