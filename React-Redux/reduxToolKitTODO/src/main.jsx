import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AddTodo from './components/AddTodo.jsx'
import { Provider } from 'react-redux'
import store from './utils/appStore.js'
import Todos from './components/Todos.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <AddTodo/>
  </Provider>,
)
