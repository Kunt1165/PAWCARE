import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { uk } from 'date-fns/locale';

const typeEmoji = { vaccination: '💉', checkup: '🩺', medication: '💊', grooming: '✂️', other: '📌' };
const typeLabel = { vaccination: 'Вакцинація', checkup: 'Огляд', medication: 'Ліки', grooming: 'Грумінг', other: 'Інше' };
const typeColor = { vaccination: '#E8F7F5', checkup: '#D4EDD9', medication: '#FDE8FF', grooming: '#FEE9E2', other: '#F5EFE6' };

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ pet_id: '', title: '', date: '', time: '', type: 'checkup', notes: '' });

  const load = async () => {
    const [eRes, pRes] = await Promise.all([api.get('/events'), api.get('/pets')]);
    setEvents(eRes.data);
    setPets(pRes.data);
    if (pRes.data.length > 0 && !form.pet_id) setForm(f => ({ ...f, pet_id: pRes.data[0].pet_id }));
  };

  useEffect(() => { load(); }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = day => events.filter(e => isSameDay(new Date(e.date + 'T00:00:00'), day));

  const openAdd = day => {
    setSelectedDay(day);
    setForm(f => ({ ...f, date: format(day, 'yyyy-MM-dd'), title: '', time: '', type: 'checkup', notes: '' }));
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      await api.post('/events', form);
      toast.success('Подію додано!');
      setShowModal(false);
      load();
    } catch { toast.error('Помилка'); }
  };

  const toggleComplete = async ev => {
    await api.patch(`/events/${ev.event_id}/complete`);
    load();
  };

  const deleteEvent = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/events/${id}`);
    toast.success('Видалено');
    load();
  };

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : events.filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    return isSameMonth(d, currentDate);
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>Календар</h1>
          <p>Плануйте ветеринарні візити та процедури</p>
        </div>
        <button className="btn btn-primary" onClick={() => openAdd(new Date())}>+ Додати подію</button>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Calendar grid */}
          <div className="card fade-up">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1))}>←</button>
              <h2 style={{ fontSize: 20 }}>{format(currentDate, 'LLLL yyyy', { locale: uk })}</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1))}>→</button>
            </div>

            <div style={{ padding: 16 }}>
              {/* Weekday headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--warm-grey)', padding: '4px 0' }}>{d}</div>
                ))}
              </div>

              {/* Calendar days */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {days.map(day => {
                  const dayEvs = getEventsForDay(day);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const inMonth = isSameMonth(day, currentDate);
                  return (
                    <div
                      key={day.toString()}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      style={{
                        minHeight: 70,
                        padding: '6px 8px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: isSelected ? 'var(--mint-light)' : isToday(day) ? '#E8F7F5' : 'transparent',
                        border: isSelected ? '1.5px solid var(--mint)' : isToday(day) ? '1.5px solid rgba(61,187,171,0.4)' : '1.5px solid transparent',
                        opacity: inMonth ? 1 : 0.3,
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: isToday(day) ? 700 : 400, color: isToday(day) ? 'var(--mint-dark)' : 'var(--charcoal)', marginBottom: 4 }}>
                        {format(day, 'd')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {dayEvs.slice(0, 2).map(ev => (
                          <div key={ev.event_id} style={{
                            fontSize: 10,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: typeColor[ev.type],
                            color: 'var(--charcoal)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            opacity: ev.completed ? 0.5 : 1
                          }}>
                            {typeEmoji[ev.type]} {ev.title}
                          </div>
                        ))}
                        {dayEvs.length > 2 && <div style={{ fontSize: 10, color: 'var(--warm-grey)' }}>+{dayEvs.length - 2}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Events sidebar */}
          <div className="card fade-up" style={{ height: 'fit-content' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16 }}>
                {selectedDay ? format(selectedDay, 'd MMMM', { locale: uk }) : format(currentDate, 'LLLL', { locale: uk })}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--warm-grey)' }}>{dayEvents.length} подій</p>
            </div>
            <div style={{ padding: '8px 0', maxHeight: 500, overflowY: 'auto' }}>
              {dayEvents.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--warm-grey)', fontSize: 14 }}>
                  {selectedDay ? 'Немає подій в цей день' : 'Немає подій в цьому місяці'}
                </div>
              ) : dayEvents.map(ev => (
                <div key={ev.event_id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', opacity: ev.completed ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{typeEmoji[ev.type]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, textDecoration: ev.completed ? 'line-through' : 'none' }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--warm-grey)' }}>{ev.pet_name} {ev.time ? `· ${ev.time.slice(0, 5)}` : ''}</div>
                      {ev.notes && <div style={{ fontSize: 12, color: 'var(--warm-grey)', marginTop: 2 }}>{ev.notes}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button onClick={() => toggleComplete(ev)} title={ev.completed ? 'Скасувати' : 'Виконано'} style={{ background: ev.completed ? 'var(--soft-green)' : 'var(--sand)', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 12 }}>
                        {ev.completed ? '✓' : '○'}
                      </button>
                      <button onClick={e => deleteEvent(ev.event_id, e)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 12 }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedDay && (
              <div style={{ padding: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openAdd(selectedDay)}>
                  + Додати на {format(selectedDay, 'd MMM', { locale: uk })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Нова подія</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Тварина *</label>
                <select className="form-control" value={form.pet_id} onChange={e => setForm(f => ({ ...f, pet_id: e.target.value }))} required>
                  {pets.map(p => <option key={p.pet_id} value={p.pet_id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Назва події *</label>
                <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Вакцинація, огляд..." required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Дата *</label>
                  <input className="form-control" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Час</label>
                  <input className="form-control" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Тип</label>
                <select className="form-control" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{typeEmoji[k]} {v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Нотатки</label>
                <textarea className="form-control" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Адреса клініки, додаткова інформація..." />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Скасувати</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Зберегти</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
