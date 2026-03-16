'use client'

import { useState } from 'react'

const CLIENT_SLUG = 'western-n-third'

const HOURS: Record<string, string> = {
  Monday: '8:00 AM – 5:00 PM',
  Tuesday: '8:00 AM – 5:00 PM',
  Wednesday: '8:00 AM – 5:00 PM',
  Thursday: '8:00 AM – 5:00 PM',
  Friday: '8:00 AM – 6:00 PM',
  Saturday: '9:00 AM – 4:00 PM',
  Sunday: 'Closed',
}

const CATEGORIES = [
  {
    name: { en: 'Lumber & Wood', es: 'Madera y Tablones' },
    desc: { en: 'Reclaimed wood, dimensional lumber, specialty cuts', es: 'Madera reciclada, madera dimensionada, cortes especiales' },
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop',
  },
  {
    name: { en: 'Industrial Metals', es: 'Metales Industriales' },
    desc: { en: 'Steel beams, copper, aluminum, sheet metal', es: 'Vigas de acero, cobre, aluminio, láminas metálicas' },
    image: 'https://images.unsplash.com/photo-1581092161562-40038bac2c4d?w=600&h=400&fit=crop',
  },
  {
    name: { en: 'Fixtures & Hardware', es: 'Herrajes y Accesorios' },
    desc: { en: 'Door handles, hinges, locks, cabinet hardware', es: 'Manijas, bisagras, cerraduras, herrajes de gabinete' },
    image: 'https://images.unsplash.com/photo-1532159537384-5733f992f633?w=600&h=400&fit=crop',
  },
  {
    name: { en: 'Tools & Equipment', es: 'Herramientas y Equipos' },
    desc: { en: 'Power tools, hand tools, construction equipment', es: 'Herramientas eléctricas, manuales, equipos de construcción' },
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
  },
  {
    name: { en: 'Flooring & Tile', es: 'Pisos y Azulejos' },
    desc: { en: 'Hardwood, vinyl, ceramic, specialty flooring', es: 'Madera dura, vinilo, cerámica, pisos especiales' },
    image: 'https://images.unsplash.com/photo-1535655519166-45c1a5c20da5?w=600&h=400&fit=crop',
  },
  {
    name: { en: 'Windows & Doors', es: 'Ventanas y Puertas' },
    desc: { en: 'Exterior and interior doors, window frames, glass', es: 'Puertas exteriores e interiores, marcos de ventana, vidrio' },
    image: 'https://images.unsplash.com/photo-1553531088-d1b88ad1d291?w=600&h=400&fit=crop',
  },
]

export default function Page() {
  const [lang, setLang] = useState<'en' | 'es'>('en')

  const t = {
    heroTitle:      { en: "Western 'N' Third",                    es: "Western 'N' Third" },
    heroSub:        { en: 'Industrial Building Materials',       es: 'Materiales de Construcción Industrial' },
    heroBuySell:    { en: 'Buy • Sell • Trade',                  es: 'Compra • Venta • Intercambio' },
    heroCopy:       {
      en: 'Premium industrial-grade building materials for contractors, designers, and builders. Quality stock at unbeatable prices. Located in downtown Wilmington.',
      es: 'Materiales de construcción de calidad industrial para contratistas, diseñadores y constructores. Calidad sin igual en el centro de Wilmington.',
    },
    shopBtn:        { en: 'Explore Materials',   es: 'Explorar Materiales' },
    contactBtn:     { en: 'Contact Now',          es: 'Contáctanos' },
    materialsTitle: { en: 'What We Carry',        es: 'Lo Que Llevamos' },
    hoursTitle:     { en: 'Hours of Operation',   es: 'Horarios de Atención' },
    locationTitle:  { en: 'Location & Contact',   es: 'Ubicación y Contacto' },
    phone:          { en: '(910) 555-0123',        es: '(910) 555-0123' },
    address:        { en: '123 Western Ave N, Wilmington, NC 28401', es: '123 Western Ave N, Wilmington, NC 28401' },
    footerCopy:     { en: "© 2026 Western 'N' Third Building Materials. All rights reserved.", es: "© 2026 Western 'N' Third. Todos los derechos reservados." },
  }

  return (
    <main>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: "Western 'N' Third Building Materials",
          telephone: '(910) 555-0123',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Western Ave N',
            addressLocality: 'Wilmington',
            addressRegion: 'NC',
            postalCode: '28401',
            addressCountry: 'US',
          },
          url: 'https://western-n-third.com',
          areaServed: 'Wilmington, NC',
          openingHours: ['Mo-Fr 08:00-18:00', 'Sa 09:00-16:00'],
        })}}
      />

      {/* Nav */}
      <nav className="nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Western 'N' Third" className="nav-logo-img" />
        <div className="nav-right">
          <a href="#materials" className="nav-link">
            {lang === 'en' ? 'Materials' : 'Materiales'}
          </a>
          <a href="#hours" className="nav-link">
            {lang === 'en' ? 'Hours' : 'Horarios'}
          </a>
          <a href="/marketplace" className="nav-link">
            {lang === 'en' ? 'Marketplace' : 'Mercado'}
          </a>
          <a href="/vendor/login" className="nav-link">
            {lang === 'en' ? 'Vendor Login' : 'Vendedor'}
          </a>
          <a href="/qr" className="nav-link">QR</a>
          <button
            className="lang-toggle"
            onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=800&fit=crop"
          alt="Industrial metal warehouse"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>{t.heroTitle[lang]}</h1>
          <p className="tagline">{t.heroSub[lang]}</p>
          <p className="tagline" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            {t.heroBuySell[lang]}
          </p>
          <p>{t.heroCopy[lang]}</p>
          <div className="hero-ctas">
            <a href="#materials" className="cta-button">{t.shopBtn[lang]}</a>
            <a href="tel:9105550123" className="cta-button cta-button-secondary">{t.contactBtn[lang]}</a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="materials" className="section">
        <h2 className="section-title">{t.materialsTitle[lang]}</h2>
        <div className="cards">
          {CATEGORIES.map((cat) => (
            <div key={cat.name.en} className="card">
              <div className="card-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name[lang]} />
              </div>
              <div className="card-content">
                <h3>{cat.name[lang]}</h3>
                <p>{cat.desc[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hours & Location */}
      <section id="hours" className="section">
        <div className="two-col">
          <div>
            <h2 className="section-title">{t.hoursTitle[lang]}</h2>
            <div className="info-block">
              {Object.entries(HOURS).map(([day, time]) => (
                <div key={day} className="hours-item">
                  <span className="hours-day">{day}</span>
                  <span className="hours-time">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="section-title">{t.locationTitle[lang]}</h2>
            <div className="info-block">
              <p style={{ fontWeight: 600, marginBottom: '12px', color: 'var(--accent-deep)', fontSize: '1.1rem' }}>
                Western 'N' Third Building Materials
              </p>
              <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>{t.address[lang]}</p>
              <p style={{ marginBottom: '12px' }}>
                <a href="tel:9105550123" style={{ color: 'var(--metal-gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {t.phone[lang]}
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@western-n-third.com"
                  style={{ color: 'var(--metal-gold)', fontSize: '0.9rem' }}
                >
                  info@western-n-third.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>{t.footerCopy[lang]}</p>
        <p>
          Wilmington, NC &nbsp;·&nbsp;
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          &nbsp;·&nbsp;
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        </p>
      </footer>
    </main>
  )
}
