import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoursePage from './pages/Course'
import ThankYou from './pages/ThankYou'
import PaymentFailed from './pages/PaymentFailed'
import PublicOffer from './pages/PublicOffer'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Base path только для production (GitHub Pages)
const basename = import.meta.env.PROD ? '/dukhovnoye_razvitiye' : ''

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:slug" element={<CoursePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/public-offer" element={<PublicOffer />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  )
}
