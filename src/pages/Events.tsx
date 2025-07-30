import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { eventService, Event } from '../services/axleCrm'
import { ArrowLeft, Calendar, Clock, Users, MapPin, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const Events: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const activeEvents = await eventService.getActive()
      setEvents(activeEvents)
    } catch (error) {
      console.error('Ошибка загрузки мероприятий:', error)
      toast.error('Не удалось загрузить мероприятия')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleEventClick = (eventId: number) => {
    navigate(`/events/${eventId}`)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'dd MMMM yyyy', { locale: ru })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getEventTypeIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('турнир') || lowerTitle.includes('соревнование')) {
      return <Trophy className="icon" style={{ color: '#FFD700' }} />
    }
    return <Calendar className="icon" />
  }

  const getEventStatus = (event: Event) => {
    const available = event.max_participants - event.current_participants
    if (available === 0) {
      return { text: 'Мест нет', class: 'status-error' }
    }
    if (available <= 3) {
      return { text: `Осталось ${available} места`, class: 'status-warning' }
    }
    return { text: `Свободно мест: ${available}`, class: 'status-success' }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Мероприятия</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="loading">
            <h2>Загрузка мероприятий...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="nav">
        <button className="nav-back" onClick={handleBack}>
          <ArrowLeft className="icon" />
          Назад
        </button>
        <h1 className="nav-title">Мероприятия</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Ближайшие мероприятия</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Участвуйте в турнирах, мастер-классах и других интересных событиях
        </p>

        {events.length === 0 ? (
          <div className="notification info">
            <strong>В данный момент нет активных мероприятий</strong>
            <p style={{ marginTop: '8px' }}>
              Следите за обновлениями! Новые события появляются регулярно.
            </p>
          </div>
        ) : (
          <div>
            {events.map((event) => {
              const status = getEventStatus(event)
              return (
                <div
                  key={event.id}
                  className="list-item"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      {getEventTypeIcon(event.title)}
                      <h3 style={{ margin: '0 0 0 8px', fontSize: '16px', fontWeight: '600' }}>
                        {event.title}
                      </h3>
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '14px', 
                      color: 'var(--tg-theme-hint-color, #999999)' 
                    }}>
                      {event.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar className="icon" style={{ width: '14px', height: '14px' }} />
                        {formatDate(event.date)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock className="icon" style={{ width: '14px', height: '14px' }} />
                        {formatTime(event.time)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users className="icon" style={{ width: '14px', height: '14px' }} />
                        {event.current_participants}/{event.max_participants}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div className={`status-badge ${status.class}`}>
                      {status.text}
                    </div>
                    {event.price && (
                      <div style={{ 
                        marginTop: '4px', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: 'var(--tg-theme-button-color, #2481cc)'
                      }}>
                        {event.price} ₽
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="divider" />

        <div className="card">
          <h3 className="section-title">Информация о мероприятиях</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Турниры:</strong> Соревнования по различным играм с призами
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Мастер-классы:</strong> Обучение приготовлению кальянов и коктейлей
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Вечеринки:</strong> Тематические мероприятия с музыкой и развлечениями
            </p>
            <p>
              <strong>Важно:</strong> Для участия в мероприятиях необходимо предварительное бронирование
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Как записаться?</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '8px' }}>
              1. Выберите интересующее мероприятие
            </p>
            <p style={{ marginBottom: '8px' }}>
              2. Нажмите на него для просмотра подробностей
            </p>
            <p style={{ marginBottom: '8px' }}>
              3. Нажмите "Записаться" для бронирования места
            </p>
            <p>
              4. Подтвердите участие в личном кабинете
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events 