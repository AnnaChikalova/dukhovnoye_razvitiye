import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import heroImage from '../assets/frame2.png'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { href: '#benefits', label: 'Зачем' },
    { href: '#courses', label: 'Курсы' },
  ]

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
          backgroundImage: `linear-gradient(192deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.62) 100%), url(${heroImage})`,
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
          <div className="hero-stats">
            <div><strong>5 000+</strong><span>учеников</span></div>
            <div><strong>120+</strong><span>уроков</span></div>
            <div><strong>4.9/5</strong><span>оценка</span></div>
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
          {courses.map((c) => (
            <article key={c.slug} className="course">
              <div className="course-image" style={{ backgroundImage: `url(${c.imageUrl})` }} aria-label={c.title}></div>
              <div className="course-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <Link to={`/courses/${c.slug}`} className="btn small">Открыть курс</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="cta" className="section cta">
        <h2>Готовы начать?</h2>
        <p>Оставьте e‑mail, и мы пришлём стартовые материалы и расписание.</p>
        {/* Home uses the global CTA in footer on Course pages; keep simple here */}
        <a href="#courses" className="btn primary">Смотреть курсы</a>
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





