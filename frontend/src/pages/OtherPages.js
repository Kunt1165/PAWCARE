import React, { useState } from 'react';

const articles = [
  { id: 1, cat: 'Харчування', title: 'Що можна і не можна давати собаці', excerpt: 'Повний список безпечних та небезпечних продуктів. Деякі звичні людські продукти смертельно небезпечні для тварин.', emoji: '🥦', readTime: '5 хв', date: '5 берез. 2025' },
  { id: 2, cat: 'Здоров\'я', title: 'Коли терміново до ветеринара: 10 тривожних симптомів', excerpt: 'Знаки, на які варто звернути увагу негайно. Рання діагностика часто рятує життя вашого улюбленця.', emoji: '🌡️', readTime: '7 хв', date: '1 берез. 2025' },
  { id: 3, cat: 'Виховання', title: 'Базові команди для щеня: з чого почати', excerpt: 'Простий план тренувань. Перші 30 днів — найважливіші для формування поведінки.', emoji: '🎓', readTime: '6 хв', date: '25 лют. 2025' },
  { id: 4, cat: 'Здоров\'я', title: 'Вакцинація кішок: повний графік', excerpt: 'Які щеплення потрібні, коли їх робити і що очікувати після вакцинації.', emoji: '💉', readTime: '4 хв', date: '20 лют. 2025' },
  { id: 5, cat: 'Догляд', title: 'Грумінг вдома: покрокова інструкція', excerpt: 'Як самостійно підстригти кігті, почистити вуха і викупати вашого улюбленця.', emoji: '✂️', readTime: '8 хв', date: '15 лют. 2025' },
  { id: 6, cat: 'Харчування', title: 'Натуральний корм чи сухий: що вибрати', excerpt: 'Плюси та мінуси кожного типу харчування для собак і кішок різного віку.', emoji: '🍖', readTime: '6 хв', date: '10 лют. 2025' },
];

const categories = ['Всі', 'Харчування', 'Здоров\'я', 'Виховання', 'Догляд'];
const catColors = { 'Харчування': '#D4EDD9', 'Здоров\'я': '#E8F7F5', 'Виховання': '#FEE9E2', 'Догляд': '#F5EFE6' };

export function ArticlesPage() {
  const [cat, setCat] = useState('Всі');
  const filtered = cat === 'Всі' ? articles : articles.filter(a => a.cat === cat);

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>Статті та поради</h1>
          <p>Корисні матеріали про догляд за улюбленцями</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '8px 18px', border: 'none', borderRadius: 50, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
              background: cat === c ? 'var(--mint)' : 'white',
              color: cat === c ? 'white' : 'var(--charcoal)',
              border: `1.5px solid ${cat === c ? 'var(--mint)' : 'var(--border)'}`,
              transition: 'all 0.2s'
            }}>{c}</button>
          ))}
        </div>

        <div className="grid-3">
          {filtered.map(article => (
            <div key={article.id} className="card fade-up" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,40,50,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ height: 140, background: catColors[article.cat] || 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>
                {article.emoji}
              </div>
              <div style={{ padding: '20px 20px 24px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <span className="badge badge-mint">{article.cat}</span>
                  <span style={{ fontSize: 12, color: 'var(--warm-grey)' }}>⏱ {article.readTime}</span>
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 8, lineHeight: 1.35 }}>{article.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--warm-grey)', lineHeight: 1.65, marginBottom: 14 }}>{article.excerpt}</p>
                <div style={{ fontSize: 12, color: 'var(--warm-grey)' }}>{article.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============== NEARBY PAGE ================

const places = [
  { id: 1, type: 'vet', name: 'ВетКлініка «Добрі лапи»', address: 'вул. Шевченка, 42', dist: '0.8 км', rating: 4.9, phone: '+380 44 123-45-67', hours: 'Пн-Нд 08:00–20:00', tags: ['Екстрена допомога', 'Вакцинація', 'УЗД', 'Хірургія'], emoji: '🏥' },
  { id: 2, type: 'grooming', name: 'Грумінг-салон «PetStyle»', address: 'вул. Франка, 17', dist: '1.2 км', rating: 4.7, phone: '+380 44 234-56-78', hours: 'Пн-Сб 09:00–19:00', tags: ['Стрижка', 'Мийка', 'Ногті', 'Фарбування'], emoji: '✂️' },
  { id: 3, type: 'shop', name: 'Зоомагазин «Хвостатий»', address: 'вул. Лесі Українки, 5', dist: '1.5 км', rating: 4.6, phone: '+380 44 345-67-89', hours: 'Пн-Нд 09:00–21:00', tags: ['Корм', 'Аксесуари', 'Ліки', 'Іграшки'], emoji: '🛒' },
  { id: 4, type: 'vet', name: 'Ветклініка «Доктор Айболить»', address: 'пр. Перемоги, 22', dist: '2.1 км', rating: 4.8, phone: '+380 44 456-78-90', hours: 'Пн-Пт 09:00–18:00', tags: ['Щеплення', 'Аналізи', 'Дерматологія'], emoji: '🏥' },
  { id: 5, type: 'grooming', name: 'Grooming Studio «Paws»', address: 'вул. Хрещатик, 8', dist: '2.4 км', rating: 4.5, phone: '+380 44 567-89-01', hours: 'Вт-Нд 10:00–20:00', tags: ['Люкс-стрижка', 'Спа', 'Ароматерапія'], emoji: '✂️' },
  { id: 6, type: 'shop', name: 'ZooMart', address: 'вул. Банкова, 15', dist: '3.0 км', rating: 4.4, phone: '+380 44 678-90-12', hours: 'Пн-Нд 08:00–22:00', tags: ['Живий корм', 'Акваріум', 'Птахи', 'Гризуни'], emoji: '🛒' },
];

const placeTypes = { all: 'Всі', vet: '🏥 Ветеринари', grooming: '✂️ Грумінг', shop: '🛒 Магазини' };

export function NearbyPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const filtered = filter === 'all' ? places : places.filter(p => p.type === filter);

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>Сервіси поряд</h1>
          <p>Ветеринари, грумінг та зоомагазини у вашому місті</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {Object.entries(placeTypes).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: '8px 18px', border: 'none', borderRadius: 50, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
              background: filter === k ? 'var(--charcoal)' : 'white',
              color: filter === k ? 'white' : 'var(--charcoal)',
              border: `1.5px solid ${filter === k ? 'var(--charcoal)' : 'var(--border)'}`,
              transition: 'all 0.2s'
            }}>{v}</button>
          ))}
        </div>

        <div className="grid-2">
          {filtered.map(place => (
            <div key={place.id} className="card fade-up" style={{ cursor: 'pointer', transition: 'all 0.2s', border: selected?.id === place.id ? '1.5px solid var(--mint)' : '1px solid var(--border)' }}
              onClick={() => setSelected(selected?.id === place.id ? null : place)}
            >
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {place.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{place.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--warm-grey)' }}>📍 {place.address} · {place.dist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF9E6', borderRadius: 8, padding: '4px 10px' }}>
                    <span>⭐</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{place.rating}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {place.tags.map(t => <span key={t} className="badge badge-grey">{t}</span>)}
                </div>

                {selected?.id === place.id && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 8, fontSize: 14 }}>
                      <span>📞</span>
                      <a href={`tel:${place.phone}`} style={{ color: 'var(--mint-dark)', fontWeight: 500, textDecoration: 'none' }}>{place.phone}</a>
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 14 }}>
                      <span>🕐</span>
                      <span style={{ color: 'var(--warm-grey)' }}>{place.hours}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <a href={`tel:${place.phone}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>📞 Зателефонувати</a>
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => window.open(`https://maps.google.com?q=${place.name}`, '_blank')}>🗺️ Навігатор</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
