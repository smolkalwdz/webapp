import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { adminService, hookahService, userService, User, HookahStats } from '../services/axleCrm'
import { ArrowLeft, Gift, Check, X, User as UserIcon, Phone, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface FreeHookahRequest {
  guest: User
  stats: HookahStats
  requestedAt: string
}

const FreeHookahRequests: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<FreeHookahRequest[]>([])
  const [confirming, setConfirming] = useState<number | null>(null)

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
      } else {
        loadRequests()
      }
    } catch (error) {
      console.error('Ошибка проверки администратора:', error)
      toast.error('Ошибка проверки прав доступа')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadRequests = async () => {
    if (!tgUser?.id) return

    try {
      // В мок-режиме создаем тестовые запросы
      const mockRequests: FreeHookahRequest[] = []
      
      // Получаем всех пользователей с доступными бесплатными кальянами
      const allUsers = await userService.getAllUsers()
      
      for (const user of allUsers) {
        if (user.telegram_id) {
          try {
            const stats = await hookahService.getStats(user.telegram_id)
            if (stats.can_claim_free) {
              mockRequests.push({
                guest: user,
                stats,
                requestedAt: new Date().toISOString()
              })
            }
          } catch (error) {
            console.error(`Ошибка получения статистики для пользователя ${user.telegram_id}:`, error)
          }
        }
      }
      
      setRequests(mockRequests)
    } catch (error) {
      console.error('Ошибка загрузки запросов:', error)
      toast.error('Не удалось загрузить запросы')
    }
  }

  const handleConfirm = async (guestTelegramId: number) => {
    if (!tgUser?.id) return

    setConfirming(guestTelegramId)
    try {
      await hookahService.confirmFreeHookah(tgUser.id, guestTelegramId)
      toast.success('Бесплатный кальян подтвержден!')
      // Перезагружаем запросы
      await loadRequests()
    } catch (error) {
      console.error('Ошибка подтверждения:', error)
      toast.error('Не удалось подтвердить бесплатный кальян')
    } finally {
      setConfirming(null)
    }
  }

  const handleBack = () => {
    navigate('/admin-panel')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Запросы на бесплатные кальяны</h1>
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
          <h1 className="nav-title">Запросы на бесплатные кальяны</h1>
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
        <h1 className="nav-title">Запросы на бесплатные кальяны</h1>
        <div></div>
      </div>

      {requests.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Gift className="icon" style={{ 
              width: '48px', 
              height: '48px', 
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '16px'
            }} />
            <h3 style={{ marginBottom: '8px' }}>Нет активных запросов</h3>
            <p style={{ color: 'var(--tg-theme-hint-color)', fontSize: '14px' }}>
              Пользователи с доступными бесплатными кальянами появятся здесь
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Gift className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
            <h2 className="section-title">Активные запросы ({requests.length})</h2>
          </div>

          {requests.map((request) => (
            <div key={request.guest.telegram_id} className="list-item" style={{ 
              padding: '16px', 
              marginBottom: '12px',
              border: '1px solid var(--tg-theme-hint-color)',
              borderRadius: '8px',
              background: 'var(--tg-theme-bg-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <UserIcon className="icon" style={{ width: '20px', height: '20px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {request.guest.first_name} {request.guest.last_name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                    ID: {request.guest.telegram_id}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                    {formatDate(request.requestedAt)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone className="icon" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px' }}>{request.guest.phone}</span>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '12px', 
                borderRadius: '6px',
                color: 'white',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>
                    Доступно бесплатных кальянов: {request.stats.free_hookahs_available}
                  </span>
                  <span style={{ fontSize: '12px', opacity: 0.9 }}>
                    Куплено: {request.stats.purchases_count}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleConfirm(request.guest.telegram_id || 0)}
                  disabled={confirming === request.guest.telegram_id}
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    fontSize: '14px'
                  }}
                >
                  <Check className="icon" style={{ width: '16px', height: '16px' }} />
                  {confirming === request.guest.telegram_id ? 'Подтверждение...' : 'Подтвердить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Инструкции */}
      <div className="card">
        <h3 style={{ marginBottom: '12px' }}>📋 Инструкция</h3>
        <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
          <p style={{ marginBottom: '8px' }}>
            Здесь отображаются пользователи, которые могут получить бесплатный кальян
          </p>
          <p style={{ marginBottom: '8px' }}>
            Нажмите "Подтвердить" для выдачи бесплатного кальяна
          </p>
          <p>
            После подтверждения покупка будет добавлена в систему
          </p>
        </div>
      </div>
    </div>
  )
}

export default FreeHookahRequests 