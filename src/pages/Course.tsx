import { useParams, Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import { useMemo, useState } from 'react'
import heroImage from '../assets/firstPage2.jpg'

export default function CoursePage() {
  const { slug } = useParams()
  const course = useMemo(() => courses.find((c) => c.slug === slug), [slug])
  const [menuOpen, setMenuOpen] = useState(false)

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
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${heroImage})`,
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
                {course.aboutImages?.ifImageUrl && (
                  <div className="about-image-standalone" style={{ backgroundImage: `url(${course.aboutImages.ifImageUrl})` }} aria-label="Если вы"></div>
                )}
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
                {course.aboutImages?.wantImageUrl && (
                  <div className="about-image-standalone" style={{ backgroundImage: `url(${course.aboutImages.wantImageUrl})` }} aria-label="И хотите"></div>
                )}
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
          <div className="card then-block" style={{ marginTop: '18px', textAlign: 'center', padding: '24px' }}>
            <h3 style={{ margin: 0 }}><strong>{aboutSections.thenBlock}</strong></h3>
          </div>
        )}
        <div className="card course-process">
          <h3>Как проходит обучение</h3>
          <p>Курс состоит из пяти частей. В течение пяти дней каждое утро вы получаете один видеоурок длительностью 30–50 минут с подробными объяснениями и иллюстрациями по теме.</p>
          <p>Обучение проходит в телеграм-боте, доступ к которому открывается сразу после приобретения курса.</p>
          <p>Оплата происходит на сайте через официальную сертифицированную платёжную систему WayForPay (wayforpay.com).</p>
          <p>Доступ ко всем материалам сохраняется в течение 1 года с момента покупки.</p>
          <p>Если по какой-либо причине курс не подойдёт, сообщите нам об этом в течение 14 дней с момента оплаты — мы вернём полную стоимость.</p>
        </div>
        {aboutSections.rest.length > 0 && (
          <div className="card" style={{ marginTop: '12px' }}>
            <p>{aboutSections.rest.join(' ')}</p>
          </div>
        )}
      </section>

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
        <h2>Присоединяйтесь</h2>
        <p>Нажмите кнопку ниже, чтобы перейти на страницу оплаты и получить доступ к курсу.</p>
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
          <h2>Контакты</h2>
          <p>Если остались вопросы — напишите нам любым удобным способом.</p>
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
              <a href={brand.legal.offerUrl} target="_blank" rel="noopener noreferrer">
                Договор публичной оферты
              </a>
            )}
            {brand.legal?.privacyUrl && (
              <a href={brand.legal.privacyUrl} target="_blank" rel="noopener noreferrer">
                Политика конфиденциальности
              </a>
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


