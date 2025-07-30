import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { userService, adminService, User } from '../services/axleCrm'
import { Calendar, Gift, User as UserIcon, Plus, Phone, MapPin, Clock, Flame, Database, RefreshCw } from 'lucide-react'

const SimpleHome: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser, showMainButton, hideMainButton } = useTelegram()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      if (tgUser?.id) {
        try {
          const [existingUser, adminStatus] = await Promise.all([
            userService.getByTelegramId(tgUser.id),
            adminService.isAdmin(tgUser.id)
          ])
          setUser(existingUser)
          setIsAdmin(adminStatus)
        } catch (error) {
          console.error('Ошибка проверки пользователя:', error)
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [tgUser])

  useEffect(() => {
    if (!user) {
      showMainButton('Регистрация', () => navigate('/registration'))
    } else {
      hideMainButton()
    }
  }, [user, showMainButton, hideMainButton, navigate])

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
        <h1 className="page-title">⚔️ Тайм кафе Dungeon</h1>
        
        {!user ? (
          <div className="welcome-section">
            <p className="welcome-text">
              Добро пожаловать в Тайм кафе Dungeon! 
              Зарегистрируйтесь, чтобы получить доступ ко всем возможностям.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <Calendar className="feature-icon" />
                <span>Мероприятия</span>
              </div>
              <div className="feature-item">
                <Gift className="feature-icon" />
                <span>Акции</span>
              </div>
              <div className="feature-item">
                <UserIcon className="feature-icon" />
                <span>Личный кабинет</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="user-section">
            <div className="user-greeting">
              <h3>Привет, {user.first_name}! 👋</h3>
              <p>Выберите нужную функцию:</p>
        </div>
        
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/hookah-tracker')}>
                <Flame className="btn-icon" />
                Акция 5+1
              </button>
              
              <button className="action-btn primary" onClick={() => navigate('/events')}>
                <Calendar className="btn-icon" />
                Мероприятия
              </button>
              
              <button className="action-btn primary" onClick={() => navigate('/promotions')}>
                <Gift className="btn-icon" />
                Акции
              </button>
              
              <button className="action-btn secondary" onClick={() => navigate('/profile')}>
                <UserIcon className="btn-icon" />
                Профиль
              </button>
              
                      {isAdmin && (
          <button className="action-btn admin" onClick={() => navigate('/admin-panel')}>
            <UserIcon className="btn-icon" />
            Панель администратора
          </button>
        )}

        <button className="action-btn secondary" onClick={() => navigate('/axle-crm-test')}>
          <Database className="btn-icon" />
          Тест Axle CRM
        </button>

        <button className="action-btn secondary" onClick={() => navigate('/axle-crm-sync')}>
          <RefreshCw className="btn-icon" />
          Синхронизация Axle CRM
          </button>
        </div>
          </div>
        )}



        <div className="contact-section">
          <h3>📞 Контакты</h3>
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <span>ул. Примерная, 123</span>
          </div>
          <div className="contact-item">
            <Phone className="contact-icon" />
            <span>+7 (999) 123-45-67</span>
          </div>
          <div className="contact-item">
            <Clock className="contact-icon" />
            <span>12:00 - 02:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleHome 