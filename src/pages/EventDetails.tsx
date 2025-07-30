import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const EventDetails: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/events')
  }

  return (
    <div className="container">
      <div className="nav">
        <button className="nav-back" onClick={handleBack}>
          <ArrowLeft className="icon" />
          Назад
        </button>
        <h1 className="nav-title">Детали мероприятия</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Информация о мероприятии</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Подробная информация о мероприятии
        </p>

        <div className="notification info">
          <strong>Страница в разработке</strong>
          <p style={{ marginTop: '8px' }}>
            Детальная информация о мероприятиях будет доступна в следующем обновлении.
          </p>
        </div>

        <button className="btn-primary" onClick={handleBack}>
          Вернуться к мероприятиям
        </button>
      </div>
    </div>
  )
}

export default EventDetails 