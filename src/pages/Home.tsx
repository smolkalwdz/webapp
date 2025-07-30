import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { userService, User } from '../services/axleCrm'
import { Calendar, Users, Gift, User as UserIcon, LogIn, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser, showAlert } = useTelegram()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      if (tgUser?.id) {
        try {
          const existingUser = await userService.getByTelegramId(tgUser.id)
          setUser(existingUser)
        } catch (error) {
          console.error('Ошибка проверки пользователя:', error)
          // Пользователь не найден - это нормально для новых пользователей
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [tgUser])

  const handleRegister = () => {
    navigate('/registration')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleEvents = () => {
    navigate('/events')
  }

  const handlePromotions = () => {
    navigate('/promotions')
  }

  const handleBooking = () => {
    navigate('/booking')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <h2>Загрузка...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card fade-in">
        <h1 className="page-title">Hookah Cafe</h1>
        <p className="tg-hint" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Добро пожаловать в личный кабинет тайм кафе с кальянами!
        </p>

        {!user ? (
          // Неавторизованный пользователь
          <div>
            <div className="notification info">
              <strong>Для доступа к функциям необходимо зарегистрироваться</strong>
              <br />
              <small>Регистрация интегрирована с Axle CRM</small>
            </div>
            
            <button className="nav-button" onClick={handleRegister}>
              <Plus className="icon" />
              Регистрация
            </button>
            
            <button className="nav-button secondary" onClick={handleLogin}>
              <LogIn className="icon" />
              Войти
            </button>
            

          </div>
        ) : (
          // Авторизованный пользователь
          <div>
            <div className="notification success">
              <strong>Добро пожаловать, {user.first_name}!</strong>
            </div>

            <button className="nav-button" onClick={handleEvents}>
              <Calendar className="icon" />
              Мероприятия и турниры
            </button>

            <button className="nav-button" onClick={handleBooking}>
              <Users className="icon" />
              Забронировать столик
            </button>

            <button className="nav-button" onClick={handlePromotions}>
              <Gift className="icon" />
              Акции и скидки
            </button>

                         <button className="nav-button secondary" onClick={handleProfile}>
               <UserIcon className="icon" />
               Личный кабинет
             </button>
          </div>
        )}

        <div className="divider" />

        <div className="card">
          <h3 className="section-title">Акция 5+1</h3>
          <p style={{ marginBottom: '16px' }}>
            Закажите 5 кальянов и получите 6-й бесплатно! 
            Уникальное предложение для наших гостей.
          </p>
          <button 
            className="btn-primary" 
            onClick={handlePromotions}
            style={{ marginTop: '8px' }}
          >
            Подробнее об акции
          </button>
        </div>

        <div className="card">
          <h3 className="section-title">Ближайшие мероприятия</h3>
          <p style={{ marginBottom: '16px' }}>
            Участвуйте в турнирах, мастер-классах и других интересных событиях!
          </p>
          <button 
            className="btn-primary" 
            onClick={handleEvents}
            style={{ marginTop: '8px' }}
          >
            Посмотреть все мероприятия
          </button>
        </div>

        <div className="card">
          <h3 className="section-title">Контакты</h3>
          <p style={{ marginBottom: '8px' }}>
            <strong>Адрес:</strong> ул. Примерная, 123
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Телефон:</strong> +7 (999) 123-45-67
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Время работы:</strong> 12:00 - 02:00
          </p>
          <button 
            className="btn-secondary" 
            onClick={() => showAlert('Спасибо за интерес к нашему кафе! Мы свяжемся с вами в ближайшее время.')}
          >
            Связаться с нами
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home 