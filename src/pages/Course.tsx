import { useParams, Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import { useMemo, useState, useEffect } from 'react'
import heroImage from '../assets/firstPage2.webp'
import frame5Image from '../assets/frame5.jpg'
import frame4Image from '../assets/frame4.jpg'
import frame3Image from '../assets/frame3.jpg'
import frame7Image from '../assets/frame7.jpg'

export default function CoursePage() {
  const { slug } = useParams()
  const course = useMemo(() => courses.find((c) => c.slug === slug), [slug])
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  // Прокрутка к началу страницы при переходе на курс
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Обновление Open Graph изображения для страницы курса
  useEffect(() => {
    if (!course) return

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
  }, [course, slug])

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

  if (!course) {
    return (
      <div className="page section">
        <p>Курс не найден.</p>
        <Link className="btn" to="/">На главную</Link>
      </div>
    )
  }

  function parseAbout(about: string) {
    const lines = about.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    let mode: 'none' | 'if' | 'want' = 'none'
    const ifList: string[] = []
    const wantList: string[] = []
    const rest: string[] = []
    let thenBlock: string | null = null

    for (const line of lines) {
      if (/^если\s*вы:?/i.test(line)) { mode = 'if'; continue }
      if (/^и\s*хотите:?/i.test(line)) { mode = 'want'; continue }
      if (/^тогда\s*этот\s*курс/i.test(line)) {
        thenBlock = line
        mode = 'none'
        continue
      }
      if (mode === 'if') { ifList.push(line); continue }
      if (mode === 'want') { wantList.push(line); continue }
      rest.push(line)
    }
    return { ifList, wantList, thenBlock, rest }
  }

  const aboutSections = useMemo(() => parseAbout(course.about), [course.about])
  const navItems = [
    { href: '#syllabus', label: 'Программа' },
    { href: '#author', label: 'Об авторе' },
    { href: '#about', label: 'О курсе' },
    { href: '#reviews', label: 'Отзывы' },
    { href: '#faq', label: 'Вопросы' },
  ]

  return (
    <div className="page">
      <header className="header">
        <Link className="logo" to="/">{brand.logoUrl ? <img className="logo-img" src={brand.logoUrl} alt={brand.name} /> : brand.name}</Link>
        <nav className="nav">
          <Link to="/">Главная</Link>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
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
          <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="btn primary" href="#cta" onClick={() => setMenuOpen(false)}>Приобрести курс</a>
        </div>
      </header>

      <section
        className="course-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${getImageUrl(heroImage)})`,
        }}
        aria-label={course.title}
      >
        <div className="course-hero-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          {course.durationText && <div className="muted light" style={{ margin: '10px 0 18px 0' }}>{course.durationText}</div>}
          {course.pricing && (
            <div className="price-wrap hero-pricing">
              {course.pricing.original && (
                <span className="price-old">{course.pricing.original} {course.pricing.currency}</span>
              )}
              <span className="price-now">{course.pricing.current} {course.pricing.currency}</span>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="section">
        <h2>О курсе</h2>
        {course.courseFor && <div className="muted" style={{ marginBottom: '6px' }}>{course.courseFor}</div>}
        {(aboutSections.ifList.length > 0 || aboutSections.wantList.length > 0) ? (
          <div className="about-blocks-wrapper">
            {aboutSections.ifList.length > 0 && (
              <div className="about-block-row">
                <div className="card about-block-content-only">
                  <h3><strong>Если вы</strong></h3>
                  <ul className="list">
                    {aboutSections.ifList.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {aboutSections.wantList.length > 0 && (
              <div className="about-block-row">
                <div className="card about-block-content-only">
                  <h3><strong>И хотите</strong></h3>
                  <ul className="list">
                    {aboutSections.wantList.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : null}
        {aboutSections.thenBlock && (
          <div className="about-block-row" style={{ marginTop: '32px' }}>
            <div className="card about-block-content-only">
              <h3><strong>{aboutSections.thenBlock}</strong></h3>
              <p>Он поможет Вам понять, как именно всё происходит, и как на это можно влиять.</p>
            </div>
          </div>
        )}
        <section
          className="course-hero frame5-section"
          style={{
            marginTop: '32px',
            minHeight: '500px',
            backgroundImage: `url(${getImageUrl(frame5Image)})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center 70%',
            backgroundRepeat: 'no-repeat',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
          aria-label="Изображение"
        />
        {aboutSections.rest.length > 0 && (
          <div className="card" style={{ marginTop: '12px' }}>
            <p>{aboutSections.rest.join(' ')}</p>
          </div>
        )}
      </section>
      <div className="course-process-wrapper section" style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        <div className="card course-process" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h3>Как проходит обучение</h3>
          <p>Курс состоит из пяти частей. В течение пяти дней каждое утро вы получаете один видеоурок длительностью 30–50 минут с подробными объяснениями и иллюстрациями по теме.</p>
          <p>Обучение проходит в телеграм-боте, доступ к которому открывается сразу после приобретения курса.</p>
          <p>Оплата происходит на сайте через официальную сертифицированную платёжную систему WayForPay (wayforpay.com).</p>
          <p>Доступ ко всем материалам сохраняется в течение 1 года с момента покупки.</p>
          <p>Если по какой-либо причине курс не подойдёт, сообщите нам об этом в течение 14 дней с момента оплаты — мы вернём полную стоимость.</p>
        </div>
        <section
          className="course-hero frame4-section"
          style={{
            flex: '1',
            padding: 0,
            minHeight: '450px',
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%), url(${getImageUrl(frame4Image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Изображение"
        />
      </div>

      <div className="course-process-wrapper section" style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        <div className="card course-process" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h3>"Мир невидимый", что это?</h3>
          <p>Вам наверняка знакомы такие понятия как: душа, аура, тонкий план и многие другие, которыми часто называют то, что лежит за пределами восприятия физических органов чувств человека (зрения, слуха и прочих....).</p>
          <p>Эта тема окружена мистикой, таинственностью, а иногда и повышенной секретностью....</p>
          <p>Хотя на самом деле, все эти явления имеют такие же чёткие физические парамерты и закономерности, как например, то же электричество или радиоволны, но только пока еще не изученные человеком.</p>
          <p>Поэтому, этот курс был специально создан для того, чтобы в простой понятной форме показать, как же устроена та часть нашего мира, которую мы не воспринимаем нашими физическими органами чувств, но в которой все постоянно находимся и непрерывно взаимодействуем.</p>
        </div>
        <section
          className="course-hero frame4-section"
          style={{
            flex: '1',
            padding: 0,
            minHeight: '450px',
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%), url(${getImageUrl(frame3Image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Изображение"
        />
      </div>

      <section id="syllabus" className="section">
        <h2>Программа обучения</h2>
        <div className="grid">
          {course.syllabus.map((m) => (
            <div key={m.title} className="card">
              <h3>{m.title}</h3>
              <ul className="list">
                {m.items.map((it) => (<li key={it}>{it}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {course.author && (
        <section id="author" className="section">
          <h2>Об авторе</h2>
          <div className="card author-card">
            <div className="author-card-content">
              {course.author.avatarUrl && (
                <img className="author-card-avatar" src={course.author.avatarUrl} alt={course.author.name} />
              )}
              <div className="author-card-body">
                <h3>{course.author.name}</h3>
                <p>{course.author.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className="course-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${getImageUrl(frame7Image)})`,
        }}
        aria-label="Миссия данного курса"
      >
        <div className="course-hero-content">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4em', color: '#f8fafc' }}><strong>Миссия данного курса:</strong></h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#f8fafc' }}>Наш мир исторически, и астрономически подошёл к тому моменту, когда происходит переход планеты и человечества в новую информационную эру.</p>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#f8fafc' }}>Этот переход будет сопровождаться разного рода планетарными событиями, и в том числе человечеству будут открываться новые уровни мироздания.</p>
          <p style={{ margin: 0, fontSize: '1.1em', color: '#f8fafc' }}>И задача этого курса, дать человеку ориентиры, и поддержать его на этом эволюционном пути.</p>
        </div>
      </section>

      <section id="reviews" className="section">
        <h2>Отзывы</h2>
        <div className="grid testimonials">
          {course.testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              {t.imageUrl && (
                <img className="testimonial-avatar" src={t.imageUrl} alt={t.name} />
              )}
              <div className="testimonial-body">
                <p>{t.text}</p>
                <cite>— {t.name}</cite>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonials-carousel">
          <div
            className="testimonials-carousel-container"
            style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
          >
            {course.testimonials.map((t) => (
              <div
                key={t.name}
                className="testimonial-card testimonial-slide"
              >
                {t.imageUrl && (
                  <img className="testimonial-avatar" src={t.imageUrl} alt={t.name} />
                )}
                <div className="testimonial-body">
                  <p>{t.text}</p>
                  <cite>— {t.name}</cite>
                </div>
              </div>
            ))}
          </div>
          {course.testimonials.length > 1 && (
            <div className="testimonials-carousel-controls">
              <button
                className="testimonials-carousel-btn prev"
                onClick={() => setCurrentTestimonialIndex((prev) => (prev > 0 ? prev - 1 : course.testimonials.length - 1))}
                aria-label="Предыдущий отзыв"
              >
                ←
              </button>
              <div className="testimonials-carousel-dots">
                {course.testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonials-carousel-dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    aria-label={`Перейти к отзыву ${index + 1}`}
                  />
                ))}
              </div>
              <button
                className="testimonials-carousel-btn next"
                onClick={() => setCurrentTestimonialIndex((prev) => (prev < course.testimonials.length - 1 ? prev + 1 : 0))}
                aria-label="Следующий отзыв"
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="section">
        <h2>Вопросы</h2>
        {course.faqs.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section id="cta" className="section cta">
        <a
          className={`btn primary purchase-btn${brand.formEndpoint ? '' : ' disabled'}`}
          href={brand.formEndpoint || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!brand.formEndpoint}
        >
          Приобрести курс
        </a>
      </section>

      {(brand.contacts?.email || brand.contacts?.phone || brand.contacts?.telegram || brand.contacts?.name || brand.contacts?.inn) && (
        <section id="contacts" className="section contacts">
          <ul className="contacts-list">
            {brand.contacts?.name && (
              <li>

                <span>{brand.contacts.name}</span>
              </li>
            )}
            {brand.contacts?.inn && (
              <li>

                <span>{brand.contacts.inn}</span>
              </li>
            )}
            {brand.contacts?.email && (
              <li>
                <span>Почта:</span>
                <a href={`mailto:${brand.contacts.email}`}>{brand.contacts.email}</a>
              </li>
            )}
            {brand.contacts?.telegram && (
              <li>
                <span>Telegram:</span>
                <a href={brand.contacts.telegram} target="_blank" rel="noopener noreferrer">
                  {brand.contacts.telegram.replace('https://', '')}
                </a>
              </li>
            )}
            {brand.contacts?.phone && (
              <li>
                <span>Телефон:</span>
                <a href={`tel:${brand.contacts.phone.replace(/[^+\d]/g, '')}`}>{brand.contacts.phone}</a>
              </li>
            )}
          </ul>
        </section>
      )}

      {(brand.legal?.offerUrl || brand.legal?.privacyUrl) && (
        <section id="legal" className="section legal">
          <div className="legal-links">
            {brand.legal?.offerUrl && (
              <Link to="/public-offer">
                Договор публичной оферты
              </Link>
            )}
            {brand.legal?.privacyUrl && (
              <Link to="/privacy-policy">
                Политика конфиденциальности
              </Link>
            )}
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="brand">© {new Date().getFullYear()} {brand.name}</div>
        <div className="links">
          <Link to="/">Главная</Link>
          <a href="#syllabus">Программа</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  )
}


