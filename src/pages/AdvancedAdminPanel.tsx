import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { adminService, hookahService, userService, User, Admin } from '../services/axleCrm'
import { ArrowLeft, Search, Plus, User as UserIcon, Phone, Trash2, Shield, Users, MessageSquare, Gift, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const AdvancedAdminPanel: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMainAdmin, setIsMainAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState<'main' | 'add-purchase' | 'delete-purchase' | 'manage-admins' | 'broadcast'>('main')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [foundUsers, setFoundUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [addingPurchase, setAddingPurchase] = useState(false)
  const [deletingPurchase, setDeletingPurchase] = useState(false)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [broadcastMessage, setBroadcastMessage] = useState('')

  useEffect(() => {
    checkAdminStatus()
  }, [tgUser])

  const checkAdminStatus = async () => {
    if (!tgUser?.id) {
      setLoading(false)
      return
    }

    try {
      const [adminStatus, adminInfo] = await Promise.all([
        adminService.isAdmin(tgUser.id),
        adminService.getAdmin(tgUser.id)
      ])
      
      setIsAdmin(adminStatus)
      setIsMainAdmin(adminInfo?.is_main_admin || false)
      
      if (!adminStatus) {
        toast.error('У вас нет прав администратора')
        navigate('/')
      } else {
        loadAdmins()
      }
    } catch (error) {
      console.error('Ошибка проверки администратора:', error)
      toast.error('Ошибка проверки прав доступа')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadAdmins = async () => {
    try {
      const adminsList = await adminService.getAllAdmins()
      setAdmins(adminsList)
    } catch (error) {
      console.error('Ошибка загрузки администраторов:', error)
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
      }
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error)
      toast.error('Ошибка поиска пользователя')
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleAddPurchase = async () => {
    if (!selectedUser || !tgUser?.id) return

    setAddingPurchase(true)
    try {
      await adminService.addHookahPurchase(tgUser.id, selectedUser.phone || '')
      toast.success(`Покупка кальяна добавлена для ${selectedUser.first_name} ${selectedUser.last_name}`)
      resetForm()
    } catch (error) {
      console.error('Ошибка добавления покупки:', error)
      toast.error('Не удалось добавить покупку')
    } finally {
      setAddingPurchase(false)
    }
  }

  const handleDeletePurchase = async () => {
    if (!selectedUser || !tgUser?.id) return

    setDeletingPurchase(true)
    try {
      await hookahService.deleteLastPurchase(tgUser.id, selectedUser.phone || '')
      toast.success(`Последняя покупка удалена у ${selectedUser.first_name} ${selectedUser.last_name}`)
      resetForm()
    } catch (error) {
      console.error('Ошибка удаления покупки:', error)
      toast.error('Не удалось удалить покупку')
    } finally {
      setDeletingPurchase(false)
    }
  }

  const handleAddAdmin = async (userTelegramId: number) => {
    if (!tgUser?.id) return

    try {
      await adminService.addAdmin(tgUser.id, userTelegramId)
      toast.success('Администратор добавлен')
      await loadAdmins()
    } catch (error) {
      console.error('Ошибка добавления администратора:', error)
      toast.error('Не удалось добавить администратора')
    }
  }

  const handleRemoveAdmin = async (adminTelegramId: number) => {
    if (!tgUser?.id) return

    try {
      await adminService.removeAdmin(tgUser.id, adminTelegramId)
      toast.success('Администратор удален')
      await loadAdmins()
    } catch (error) {
      console.error('Ошибка удаления администратора:', error)
      toast.error('Не удалось удалить администратора')
    }
  }

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('Введите сообщение для рассылки')
      return
    }

    try {
      // В мок-режиме просто логируем
      console.log(`📢 Рассылка от администратора ${tgUser?.first_name}: ${broadcastMessage}`)
      toast.success('Сообщение отправлено всем пользователям')
      setBroadcastMessage('')
      setCurrentSection('main')
    } catch (error) {
      console.error('Ошибка рассылки:', error)
      toast.error('Не удалось отправить сообщение')
    }
  }

  const resetForm = () => {
    setSelectedUser(null)
    setPhoneLast4('')
    setFoundUsers([])
  }

  const handleBack = () => {
    if (currentSection !== 'main') {
      setCurrentSection('main')
      resetForm()
    } else {
      navigate('/admin-panel')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Расширенная панель администратора</h1>
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
          <h1 className="nav-title">Расширенная панель администратора</h1>
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

  // Главное меню
  if (currentSection === 'main') {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Расширенная панель администратора</h1>
          <div></div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Settings className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Основные функции</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              className="btn-primary" 
              onClick={() => setCurrentSection('add-purchase')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Plus className="icon" style={{ width: '16px', height: '16px' }} />
              Добавить покупку
            </button>

            <button 
              className="btn-secondary" 
              onClick={() => setCurrentSection('delete-purchase')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Trash2 className="icon" style={{ width: '16px', height: '16px' }} />
              Удалить кальян
            </button>
          </div>
        </div>

        {isMainAdmin && (
          <>
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Shield className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
                <h2 className="section-title">Управление администраторами</h2>
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => setCurrentSection('manage-admins')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Users className="icon" style={{ width: '16px', height: '16px' }} />
                Управление администраторами
              </button>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <MessageSquare className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
                <h2 className="section-title">Рассылка</h2>
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => setCurrentSection('broadcast')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MessageSquare className="icon" style={{ width: '16px', height: '16px' }} />
                Отправить рассылку
              </button>
            </div>
          </>
        )}

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Gift className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Бесплатные кальяны</h2>
          </div>

          <button 
            className="btn-secondary" 
            onClick={() => navigate('/free-hookah-requests')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Gift className="icon" style={{ width: '16px', height: '16px' }} />
            Просмотр запросов на бесплатные кальяны
          </button>
        </div>
      </div>
    )
  }

  // Секция добавления покупки
  if (currentSection === 'add-purchase') {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Добавить покупку</h1>
          <div></div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Plus className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
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
                    marginBottom: '8px',
                    background: selectedUser?.id === user.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-bg-color)',
                    color: selectedUser?.id === user.id ? 'white' : 'var(--tg-theme-text-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon className="icon" style={{ width: '16px', height: '16px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {user.first_name} {user.last_name}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {user.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ 
                background: 'var(--tg-theme-bg-color)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--tg-theme-hint-color)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <UserIcon className="icon" style={{ width: '20px', height: '20px' }} />
                  <strong>Выбран: {selectedUser.first_name} {selectedUser.last_name}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone className="icon" style={{ width: '16px', height: '16px' }} />
                  <span>{selectedUser.phone}</span>
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleAddPurchase}
                disabled={addingPurchase}
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Plus className="icon" style={{ width: '16px', height: '16px' }} />
                {addingPurchase ? 'Добавление...' : 'Добавить покупку'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Секция удаления покупки
  if (currentSection === 'delete-purchase') {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Удалить кальян</h1>
          <div></div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Trash2 className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Удалить последнюю покупку</h2>
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
                    marginBottom: '8px',
                    background: selectedUser?.id === user.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-bg-color)',
                    color: selectedUser?.id === user.id ? 'white' : 'var(--tg-theme-text-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon className="icon" style={{ width: '16px', height: '16px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {user.first_name} {user.last_name}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {user.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ 
                background: 'var(--tg-theme-bg-color)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--tg-theme-hint-color)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <UserIcon className="icon" style={{ width: '20px', height: '20px' }} />
                  <strong>Выбран: {selectedUser.first_name} {selectedUser.last_name}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone className="icon" style={{ width: '16px', height: '16px' }} />
                  <span>{selectedUser.phone}</span>
                </div>
              </div>

              <button 
                className="btn-secondary" 
                onClick={handleDeletePurchase}
                disabled={deletingPurchase}
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Trash2 className="icon" style={{ width: '16px', height: '16px' }} />
                {deletingPurchase ? 'Удаление...' : 'Удалить последнюю покупку'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Секция управления администраторами
  if (currentSection === 'manage-admins') {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Управление администраторами</h1>
          <div></div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Shield className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Список администраторов</h2>
          </div>

          {admins.length === 0 ? (
            <p style={{ color: 'var(--tg-theme-hint-color)', textAlign: 'center' }}>
              Нет администраторов
            </p>
          ) : (
            <div>
              {admins.map((admin) => (
                <div key={admin.id} className="list-item" style={{ 
                  padding: '12px', 
                  marginBottom: '8px',
                  border: '1px solid var(--tg-theme-hint-color)',
                  borderRadius: '8px',
                  background: 'var(--tg-theme-bg-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield className="icon" style={{ width: '16px', height: '16px' }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {admin.first_name} {admin.last_name}
                          {admin.is_main_admin && <span style={{ color: 'var(--tg-theme-button-color)', marginLeft: '8px' }}>👑</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                          ID: {admin.telegram_id}
                        </div>
                      </div>
                    </div>
                    {!admin.is_main_admin && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleRemoveAdmin(admin.telegram_id)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Секция рассылки
  if (currentSection === 'broadcast') {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Рассылка</h1>
          <div></div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <MessageSquare className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Отправить рассылку</h2>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Сообщение для рассылки:
            </label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Введите сообщение для всех пользователей..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '8px',
                background: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleBroadcast}
            disabled={!broadcastMessage.trim()}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <MessageSquare className="icon" style={{ width: '16px', height: '16px' }} />
            Отправить рассылку
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default AdvancedAdminPanel 