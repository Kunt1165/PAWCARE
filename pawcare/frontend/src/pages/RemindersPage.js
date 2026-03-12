import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ pet_id: '', medicine_name: '', dosage: '', date: '', time: '', notes: '' });

  const load = async () => {
    const [rRes, pRes] = await Promise.all([api.get('/reminders'), api.get('/pets')]);
    setReminders(rRes.data);
    setPets(pRes.data);
    if (pRes.data.length > 0) setForm(f => ({ ...f, pet_id: f.pet_id || pRes.data[0].pet_id }));
  };

  useEffect(() => { load(); }, []);

  const filtered = reminders.filter(r => {
    const d = new Date(r.date + 'T00:00:00');
    if (filter === 'upcoming') return !r.completed && !isPast(d) || isToday(d);
    if (filter === 'completed') return r.completed;
    return true;
  });

  const toggle = async r => {
    await api.patch(`/reminders/${r.reminder_id}/complete`);
    load();
    toast.success(r.completed ? 'Позначено як незавершене' : 'Виконано! ✅');
  };

  const del = async id => {
    await api.delete(`/reminders/${id}`);
    toast.success('Видалено');
    load();
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      await api.post('/reminders', form);
      toast.success('Нагадування додано!');
      setShowModal(false);
      load();
    } catch { toast.error('Помилка'); }
  };

  const getUrgency = r => {
    if (r.completed) return { label: '✅ Виконано', cls: 'badge-green' };
    if (!r.date) return { label: '📅 Дата не вказана', cls: 'badge-grey' };
    const d = new Date(r.date + 'T00:00:00');
    if (isNaN(d.getTime())) return { label: '📅 Невірна дата', cls: 'badge-grey' };
    if (isPast(d) && !isToday(d)) return { label: '⚠ Прострочено', cls: 'badge-red' };
    if (isToday(d)) return { label: '🔔 Сьогодні', cls: 'badge-orange' };
    if (isTomorrow(d)) return { label: '📅 Завтра', cls: 'badge-mint' };
    return { label: format(d, 'd MMM', { locale: uk }), cls: 'badge-grey' };
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>Нагадування</h1>
          <p>Ліки та важливі процедури для ваших тварин</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Нагадування</button>
      </div>

      <div className="page-content">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--sand)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[['upcoming', '🔔 Майбутні'], ['all', '📋 Всі'], ['completed', '✅ Виконані']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '8px 16px', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
              background: filter === key ? 'white' : 'none',
              color: filter === key ? 'var(--charcoal)' : 'var(--warm-grey)',
              boxShadow: filter === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>Немає нагадувань</h3>
            <p>Додайте нагадування про ліки або процедури</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Додати нагадування</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(r => {
              const urgency = getUrgency(r);
              return (
                <div key={r.reminder_id} className="card card-body fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: r.completed ? 0.7 : 1 }}>
                  <button onClick={() => toggle(r)} style={{
                    width: 40, height: 40, borderRadius: '50%', border: '2px solid',
                    borderColor: r.completed ? '#22c55e' : 'var(--border)',
                    background: r.completed ? 'var(--soft-green)' : 'white',
                    cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s'
                  }}>{r.completed ? '✓' : ''}</button>

                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    💊
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, textDecoration: r.completed ? 'line-through' : 'none', marginBottom: 2 }}>
                      {r.medicine_name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--warm-grey)' }}>
                      {r.pet_name} {r.dosage && `· ${r.dosage}`} {r.time && `· ${r.time.slice(0, 5)}`}
                    </div>
                    {r.notes && <div style={{ fontSize: 13, color: 'var(--warm-grey)', marginTop: 2 }}>{r.notes}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                    <span className={`badge ${urgency.cls}`}>{urgency.label}</span>
                    <button onClick={() => del(r.reminder_id)} className="btn btn-danger btn-sm">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Нове нагадування</h2>
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
                <label className="form-label">Назва препарату *</label>
                <input className="form-control" value={form.medicine_name} onChange={e => setForm(f => ({ ...f, medicine_name: e.target.value }))} placeholder="Дронтал, Омега-3..." required />
              </div>
              <div className="form-group">
                <label className="form-label">Дозування</label>
                <input className="form-control" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="1 таблетка, 2 краплі..." />
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
                <label className="form-label">Нотатки</label>
                <textarea className="form-control" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Давати з їжею, особливі інструкції..." />
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