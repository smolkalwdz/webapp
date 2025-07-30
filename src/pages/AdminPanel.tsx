import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { adminService, userService, User } from '../services/axleCrm'
import { ArrowLeft, Search, Plus, User as UserIcon, Phone, Gift, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminPanel: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchMode, setSearchMode] = useState(false)
  const [phoneLast4, setPhoneLast4] = useState('')
  const [foundUsers, setFoundUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [addingPurchase, setAddingPurchase] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [tgUser])

  const checkAdminStatus = async () => {
    if (!tgUser?.id) {
      setLoading(false)
      return
    }

    try {
      const adminStatus = await adminService.isAdmin(tgUser.id)
      setIsAdmin(adminStatus)
      
      if (!adminStatus) {
        toast.error('У вас нет прав администратора')
        navigate('/')
      }
    } catch (error) {
      console.error('Ошибка проверки администратора:', error)
      toast.error('Ошибка проверки прав доступа')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!phoneLast4 || phoneLast4.length !== 4) {
      toast.error('Введите ровно 4 цифры номера телефона')
      return
    }

    try {
      const users = await adminService.findUserByPhoneLast4(phoneLast4)
      setFoundUsers(users)
      
      if (users.length === 0) {
        toast.error('Пользователь с таким номером не найден')
      } else if (users.length === 1) {
        setSelectedUser(users[0])
        setSearchMode(false)
      }
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error)
      toast.error('Ошибка поиска пользователя')
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setSearchMode(false)
  }

  const handleAddPurchase = async () => {
    if (!selectedUser || !tgUser?.id) return

    setAddingPurchase(true)
    try {
      await adminService.addHookahPurchase(tgUser.id, selectedUser.phone || '')
      toast.success(`Покупка кальяна добавлена для ${selectedUser.first_name} ${selectedUser.last_name}`)
      setSelectedUser(null)
      setPhoneLast4('')
      setFoundUsers([])
    } catch (error) {
      console.error('Ошибка добавления покупки:', error)
      toast.error('Не удалось добавить покупку')
    } finally {
      setAddingPurchase(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleNewSearch = () => {
    setSearchMode(true)
    setSelectedUser(null)
    setFoundUsers([])
    setPhoneLast4('')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Панель администратора</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="loading">
            <h2>Загрузка...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Панель администратора</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="notification error">
            <strong>Доступ запрещен</strong>
            <p>У вас нет прав администратора</p>
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
        <h1 className="nav-title">Панель администратора</h1>
        <div></div>
      </div>

      {/* Поиск пользователя */}
      {!selectedUser && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Search className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Добавить покупку кальяна</h2>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Введите последние 4 цифры номера телефона:
            </label>
            <input
              type="text"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '8px',
                background: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleSearch}
            disabled={phoneLast4.length !== 4}
            style={{ width: '100%' }}
          >
            <Search className="icon" style={{ width: '16px', height: '16px' }} />
            Найти пользователя
          </button>

          {/* Результаты поиска */}
          {foundUsers.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>
                Найдено пользователей: {foundUsers.length}
              </h3>
              {foundUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="list-item"
                  onClick={() => handleUserSelect(user)}
                  style={{ 
                    padding: '12px', 
                    cursor: 'pointer',
                    border: '1px solid var(--tg-theme-hint-color)',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon className="icon" style={{ width: '16px', height: '16px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {user.first_name} {user.last_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                        {user.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Выбранный пользователь */}
      {selectedUser && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <UserIcon className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Выбранный пользователь</h2>
          </div>

          <div style={{ 
            background: 'var(--tg-theme-bg-color)', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid var(--tg-theme-hint-color)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <UserIcon className="icon" style={{ width: '20px', height: '20px' }} />
              <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone className="icon" style={{ width: '16px', height: '16px' }} />
              <span>{selectedUser.phone}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary" 
              onClick={handleAddPurchase}
              disabled={addingPurchase}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Plus className="icon" style={{ width: '16px', height: '16px' }} />
              {addingPurchase ? 'Добавление...' : 'Добавить покупку'}
            </button>
            
            <button 
              className="btn-secondary" 
              onClick={handleNewSearch}
              style={{ flex: 1 }}
            >
              Новый поиск
            </button>
          </div>
        </div>
      )}

      {/* Дополнительные функции */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>🔧 Дополнительные функции</h3>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/free-hookah-requests')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}
        >
          <Gift className="icon" style={{ width: '16px', height: '16px' }} />
          Просмотр запросов на бесплатные кальяны
        </button>
        
        <button 
          className="btn-primary" 
          onClick={() => navigate('/advanced-admin-panel')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Settings className="icon" style={{ width: '16px', height: '16px' }} />
          Расширенная панель администратора
        </button>
      </div>

      {/* Инструкции */}
      <div className="card">
        <h3 style={{ marginBottom: '12px' }}>📋 Инструкция</h3>
        <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
          <p style={{ marginBottom: '8px' }}>
            1. Введите последние 4 цифры номера телефона гостя
          </p>
          <p style={{ marginBottom: '8px' }}>
            2. Выберите нужного пользователя из списка
          </p>
          <p style={{ marginBottom: '8px' }}>
            3. Нажмите "Добавить покупку" для подтверждения
          </p>
          <p style={{ marginBottom: '8px' }}>
            Покупка будет добавлена в систему акции 5+1
          </p>
          <p>
            Используйте "Просмотр запросов" для подтверждения бесплатных кальянов
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 