import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Login: React.FC = () => {
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
        <h1 className="nav-title">Вход</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Вход в систему</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Для входа используйте данные из Telegram
        </p>

        <div className="notification info">
          <strong>Автоматический вход</strong>
          <p style={{ marginTop: '8px' }}>
            Вход в систему происходит автоматически через Telegram. 
            Если у вас возникли проблемы, обратитесь к администратору.
          </p>
        </div>

        <button className="btn-primary" onClick={handleBack}>
          Вернуться на главную
        </button>
      </div>
    </div>
  )
}

export default Login 