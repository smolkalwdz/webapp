import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Booking: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="container">
      <div className="nav">
        <button className="nav-back" onClick={handleBack}>
          <ArrowLeft className="icon" />
          Назад
        </button>
        <h1 className="nav-title">Бронирование</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Бронирование столика</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Забронируйте столик для комфортного отдыха
        </p>

        <div className="notification info">
          <strong>Система бронирования в разработке</strong>
          <p style={{ marginTop: '8px' }}>
            Функция бронирования столиков будет доступна в следующем обновлении.
            Для бронирования свяжитесь с нами по телефону.
          </p>
        </div>

        <div className="card">
          <h3 className="section-title">Контакты для бронирования</h3>
          <p style={{ marginBottom: '8px' }}>
            <strong>Телефон:</strong> +7 (999) 123-45-67
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>WhatsApp:</strong> +7 (999) 123-45-67
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Время работы:</strong> 12:00 - 02:00
          </p>
          <button className="btn-primary">
            Связаться для бронирования
          </button>
        </div>

        <button className="btn-secondary" onClick={handleBack}>
          Вернуться на главную
        </button>
      </div>
    </div>
  )
}

export default Booking 