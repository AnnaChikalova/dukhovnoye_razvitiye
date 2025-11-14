import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoursePage from './pages/Course'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:slug" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  )
}
