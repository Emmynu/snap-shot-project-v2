import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClientProvider,QueryClient,useQuery } from '@tanstack/react-query'
const client =  new QueryClient()
localStorage.setItem("searchType","Photos")


ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
)