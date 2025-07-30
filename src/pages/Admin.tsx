import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Admin: React.FC = () => {
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
        <h1 className="nav-title">Админ панель</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Административная панель</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Управление системой и данными
        </p>

        <div className="notification warning">
          <strong>Доступ ограничен</strong>
          <p style={{ marginTop: '8px' }}>
            Административная панель доступна только для администраторов системы.
          </p>
        </div>

        <button className="btn-secondary" onClick={handleBack}>
          Вернуться на главную
        </button>
      </div>
    </div>
  )
}

export default Admin 