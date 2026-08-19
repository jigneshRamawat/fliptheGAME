import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Game from './game.jsx'
import 'remixicon/fonts/remixicon.css'
// import Test from '../src/testGmae.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Game/>
  </StrictMode>,
)
