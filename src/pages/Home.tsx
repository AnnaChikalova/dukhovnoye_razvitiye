import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import heroImage from '../assets/frame2.jpg'
import courseHeroImage from '../assets/firstPage2.webp'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { href: '#benefits', label: 'Зачем' },
    { href: '#courses', label: 'Курсы' },
  ]

  // Функция для правильной обработки путей к изображениям с base path
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return ''
    // Если это уже полный URL (http/https), возвращаем как есть
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // В dev-режиме возвращаем путь как есть
    if (import.meta.env.DEV) {
      return imageUrl
    }
    // В production добавляем base path только если его еще нет
    const basePath = '/dukhovnoye_razvitiye'
    if (imageUrl.startsWith(basePath)) {
      return imageUrl
    }
    // Если путь начинается с /assets/, добавляем base path
    if (imageUrl.startsWith('/assets/')) {
      return `${basePath}${imageUrl}`
    }
    // Если путь начинается с /, добавляем base path
    if (imageUrl.startsWith('/')) {
      return `${basePath}${imageUrl}`
    }
    // Для относительных путей
    if (imageUrl.includes('/assets/')) {
      const assetsIndex = imageUrl.indexOf('/assets/')
      const pathAfterAssets = imageUrl.substring(assetsIndex)
      return `${basePath}${pathAfterAssets}`
    }
    // Для других относительных путей
    return `${basePath}/${imageUrl}`
  }

  // Обновление Open Graph изображения для главной страницы
  useEffect(() => {
    const updateMetaImage = () => {
      // Используем getImageUrl для правильной обработки пути
      const relativePath = getImageUrl(heroImage)
      const imageUrl = import.meta.env.PROD
        ? `https://AnnaChikalova.github.io${relativePath}`
        : `${window.location.origin}${relativePath}`

      let ogImage = document.querySelector('meta[property="og:image"]')
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.appendChild(ogImage)
      }
      ogImage.setAttribute('content', imageUrl)
    }
    updateMetaImage()
  }, [])

  return (
    <div className="page">
      <header className="header">
        <a className="logo" href="#hero">
          {brand.logoUrl ? (
            <img className="logo-img" src={brand.logoUrl} alt={brand.name} />
          ) : (
            brand.name
          )}
        </a>
        <nav className="nav">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <Link to="/courses/mindfulness-101#author">Об авторе</Link>
        </nav>
        <button
          className={`burger${menuOpen ? ' open' : ''}`}
          type="button"
          aria-label="Открыть меню"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <a className="cta-link" href="#cta">Приобрести курс</a>
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <Link to="/courses/mindfulness-101#author" onClick={() => setMenuOpen(false)}>Об авторе</Link>
          <a className="btn primary" href="#cta" onClick={() => setMenuOpen(false)}>Приобрести курс</a>
        </div>
      </header>

      <section
        id="hero"
        className="home-hero"
        style={{
          backgroundImage: `linear-gradient(192deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.62) 100%), url(${getImageUrl(heroImage)})`,
        }}
        role="img"
        aria-label="Первый экран"
      >
        <div className="home-hero-content">
          <h1>{brand.tagline}</h1>
          <p>Осознанность, энергетические практики и познание тонкого плана в светлой, бережной атмосфере.</p>
          <div className="hero-actions">
            <a href="#courses" className="btn primary">Смотреть курсы</a>
          </div>
        </div>
      </section>

      <section id="benefits" className="section">
        <h2>Зачем это вам</h2>
        <div className="grid benefits">
          <div className="card">
            <h3>Внутренняя опора</h3>
            <p>Практики осознанности для спокойствия ума и устойчивости в изменчивом мире.</p>
          </div>
          <div className="card">
            <h3>Энергетический баланс</h3>
            <p>Мягкие техники работы с энергией и телом без перегрузок и мистификации.</p>
          </div>
          <div className="card">
            <h3>Познание тонкого</h3>
            <p>Экологичное исследование тонкого плана: чувствительность, намерение, этика.</p>
          </div>
        </div>
      </section>

      <section id="courses" className="section">
        <h2>Курсы</h2>
        <div className="grid courses">
          {courses.filter((c) => c.slug === 'mindfulness-101').map((c) => (
            <article key={c.slug} className="course">
              <div className="course-image" style={{ backgroundImage: `url(${getImageUrl(courseHeroImage)})` }} aria-label={c.title}></div>
              <div className="course-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <Link to={`/courses/${c.slug}`} className="btn primary small">Открыть курс</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="cta" className="section cta">
        <h2>Готовы начать?</h2>
        {/* Home uses the global CTA in footer on Course pages; keep simple here */}
        <a href="#courses" className="btn primary">Смотреть курсы</a>
        {/* Временные ссылки для тестирования страниц */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/thank-you" className="btn" style={{ fontSize: '14px' }}>Тест: Страница благодарности</Link>
          <Link to="/payment-failed" className="btn" style={{ fontSize: '14px' }}>Тест: Неуспешная оплата</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="brand">© {new Date().getFullYear()} {brand.name}</div>
        <div className="links">
          <a href="#hero">Главная</a>
          <a href="#courses">Курсы</a>
          <a href="#pricing">Тарифы</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  )
}





