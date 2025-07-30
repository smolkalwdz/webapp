import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { userService, bookingService, User, Booking } from '../services/axleCrm'
import { ArrowLeft, User as UserIcon, Phone, Mail, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [tgUser])

  const loadUserData = async () => {
    console.log('🔍 Загрузка данных пользователя...')
    console.log('📱 Telegram User:', tgUser)
    console.log('🆔 Telegram ID:', tgUser?.id)
    
    if (!tgUser?.id) {
      console.log('❌ Telegram ID не найден')
      setLoading(false)
      return
    }

    try {
      console.log('🔍 Поиск пользователя с telegram_id:', tgUser.id)
      
      // Добавляем небольшую задержку для синхронизации с Axle CRM
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const [userData, userBookings] = await Promise.all([
        userService.getByTelegramId(tgUser.id),
        bookingService.getUserBookings(tgUser.id)
      ])
      
      console.log('✅ Найден пользователь:', userData)
      console.log('📅 Бронирования:', userBookings)
      
      if (userData) {
      setUser(userData)
      setBookings(userBookings)
        console.log('✅ Профиль успешно загружен')
      } else {
        console.log('❌ Пользователь не найден в системе')
        toast.error('Пользователь не найден. Попробуйте зарегистрироваться.')
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки данных пользователя:', error)
      toast.error('Не удалось загрузить данные профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleEditProfile = () => {
    // В будущем можно добавить редактирование профиля
    toast('Функция редактирования профиля в разработке')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Профиль</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="loading">
            <h2>Загрузка профиля...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Профиль</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="notification error">
            <strong>Пользователь не найден</strong>
            <p style={{ marginTop: '8px' }}>
              Необходимо зарегистрироваться в системе
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/registration')}>
            Зарегистрироваться
          </button>
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
        <h1 className="nav-title">Личный кабинет</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Профиль пользователя</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--tg-theme-button-color, #2481cc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            {(user.first_name || 'П').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>
              {user.first_name} {user.last_name || ''}
            </h3>
            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #999999)' }}>
              ID: {user.telegram_id}
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 className="section-title">Контактная информация</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <UserIcon className="icon" style={{ width: '16px', height: '16px' }} />
            <span><strong>Имя:</strong> {user.first_name}</span>
          </div>
          
          {user.last_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <UserIcon className="icon" style={{ width: '16px', height: '16px' }} />
              <span><strong>Фамилия:</strong> {user.last_name}</span>
            </div>
          )}
          
          {user.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Phone className="icon" style={{ width: '16px', height: '16px' }} />
              <span><strong>Телефон:</strong> {user.phone}</span>
            </div>
          )}
          
          {user.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Mail className="icon" style={{ width: '16px', height: '16px' }} />
              <span><strong>Email:</strong> {user.email}</span>
            </div>
          )}
          
          {/* Username field removed as it's not in User interface */}
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 className="section-title">Мои бронирования</h3>
          
          {bookings.length === 0 ? (
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              У вас пока нет бронирований
            </p>
          ) : (
            <div>
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="list-item" style={{ padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar className="icon" style={{ width: '16px', height: '16px' }} />
                    <span>Бронирование #{booking.id}</span>
                  </div>
                  <div className={`status-badge status-${booking.status}`}>
                    {booking.status === 'pending' && 'Ожидает подтверждения'}
                    {booking.status === 'confirmed' && 'Подтверждено'}
                    {booking.status === 'cancelled' && 'Отменено'}
                  </div>
                </div>
              ))}
              
              {bookings.length > 3 && (
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/booking')}
                  style={{ marginTop: '12px' }}
                >
                  Посмотреть все ({bookings.length})
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Статистика</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--tg-theme-button-color, #2481cc)' }}>
                {bookings.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #999999)' }}>
                Бронирований
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#4CAF50' }}>
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #999999)' }}>
                Подтверждено
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#FF9800' }}>
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #999999)' }}>
                Ожидает
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <button className="btn-secondary" onClick={handleEditProfile}>
          Редактировать профиль
        </button>
      </div>
    </div>
  )
}

export default Profile 