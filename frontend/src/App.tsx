import { RouterProvider } from "react-router-dom"
import { Router } from "./routes"
import { Toaster } from "./utils/toast"

const App = () => {
  return (
    <>
      <RouterProvider router={Router}/>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Global toast options
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App