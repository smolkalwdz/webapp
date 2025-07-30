import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { userService, apiService } from '../services/axleCrm'
import { ArrowLeft, Database, User, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const AxleCrmSync: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [loading, setLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{
    apiHealth: boolean | null
    localUser: any | null
    axelUser: any | null
    syncResult: 'success' | 'error' | 'pending' | null
  }>({
    apiHealth: null,
    localUser: null,
    axelUser: null,
    syncResult: null
  })

  useEffect(() => {
    if (tgUser?.id) {
      checkSyncStatus()
    }
  }, [tgUser])

  const checkSyncStatus = async () => {
    if (!tgUser?.id) return

    setLoading(true)
    setSyncStatus({
      apiHealth: null,
      localUser: null,
      axelUser: null,
      syncResult: null
    })

    try {
      // Проверяем здоровье API
      const isHealthy = await apiService.healthCheck()
      setSyncStatus(prev => ({ ...prev, apiHealth: isHealthy }))

      if (!isHealthy) {
        toast.error('Axle CRM API недоступен')
        setLoading(false)
        return
      }

      // Ищем пользователя в localStorage
      const localUser = await userService.getByTelegramId(tgUser.id)
      setSyncStatus(prev => ({ ...prev, localUser }))

      if (localUser) {
        toast.success(`Пользователь найден в localStorage: ${localUser.first_name} ${localUser.last_name}`)
      } else {
        toast.error('Пользователь не найден в localStorage')
      }

      // Пытаемся найти в Axle CRM
      try {
        const axelUser = await userService.getUserFromAxleCrm(tgUser.id)
        setSyncStatus(prev => ({ ...prev, axelUser }))
        
        if (axelUser) {
          toast.success(`Пользователь найден в Axle CRM: ${axelUser.first_name} ${axelUser.last_name}`)
          setSyncStatus(prev => ({ ...prev, syncResult: 'success' }))
        } else {
          toast.error('Пользователь не найден в Axle CRM')
          setSyncStatus(prev => ({ ...prev, syncResult: 'error' }))
        }
      } catch (error) {
        console.error('Ошибка поиска в Axle CRM:', error)
        setSyncStatus(prev => ({ ...prev, syncResult: 'error' }))
        toast.error('Ошибка подключения к Axle CRM')
      }

    } catch (error) {
      console.error('Ошибка проверки синхронизации:', error)
      toast.error('Ошибка проверки статуса')
    } finally {
      setLoading(false)
    }
  }

  const forceSync = async () => {
    if (!tgUser?.id) return

    setLoading(true)
    try {
      // Принудительно обновляем данные из Axle CRM
      const axelUser = await userService.getUserFromAxleCrm(tgUser.id)
      if (axelUser) {
        setSyncStatus(prev => ({ ...prev, axelUser, syncResult: 'success' }))
        toast.success('Данные успешно синхронизированы с Axle CRM')
      } else {
        setSyncStatus(prev => ({ ...prev, syncResult: 'error' }))
        toast.error('Не удалось синхронизировать данные')
      }
    } catch (error) {
      console.error('Ошибка принудительной синхронизации:', error)
      setSyncStatus(prev => ({ ...prev, syncResult: 'error' }))
      toast.error('Ошибка синхронизации')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader className="icon" style={{ width: '16px', height: '16px' }} />
    if (status) return <CheckCircle className="icon" style={{ width: '16px', height: '16px', color: 'green' }} />
    return <XCircle className="icon" style={{ width: '16px', height: '16px', color: 'red' }} />
  }

  const getSyncIcon = (status: 'success' | 'error' | 'pending' | null) => {
    if (status === null) return <Loader className="icon" style={{ width: '16px', height: '16px' }} />
    if (status === 'pending') return <Loader className="icon" style={{ width: '16px', height: '16px' }} />
    if (status === 'success') return <CheckCircle className="icon" style={{ width: '16px', height: '16px', color: 'green' }} />
    return <XCircle className="icon" style={{ width: '16px', height: '16px', color: 'red' }} />
  }

  return (
    <div className="container">
      <div className="nav">
        <button className="nav-back" onClick={handleBack}>
          <ArrowLeft className="icon" />
          Назад
        </button>
        <h1 className="nav-title">Синхронизация Axle CRM</h1>
        <div></div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Database className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
          <h2 className="section-title">Статус синхронизации</h2>
        </div>

        <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px',
            border: '1px solid var(--tg-theme-hint-color)',
            borderRadius: '8px'
          }}>
            <span>API Axle CRM</span>
            {getStatusIcon(syncStatus.apiHealth)}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px',
            border: '1px solid var(--tg-theme-hint-color)',
            borderRadius: '8px'
          }}>
            <span>Пользователь в localStorage</span>
            {getStatusIcon(!!syncStatus.localUser)}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px',
            border: '1px solid var(--tg-theme-hint-color)',
            borderRadius: '8px'
          }}>
            <span>Пользователь в Axle CRM</span>
            {getStatusIcon(!!syncStatus.axelUser)}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px',
            border: '1px solid var(--tg-theme-hint-color)',
            borderRadius: '8px'
          }}>
            <span>Результат синхронизации</span>
            {getSyncIcon(syncStatus.syncResult)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button 
            className="btn-primary" 
            onClick={checkSyncStatus}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <RefreshCw className="icon" style={{ width: '16px', height: '16px' }} />
            Проверить
          </button>

          <button 
            className="btn-secondary" 
            onClick={forceSync}
            disabled={loading || !syncStatus.apiHealth}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Database className="icon" style={{ width: '16px', height: '16px' }} />
            Синхронизировать
          </button>
        </div>
      </div>

      {syncStatus.localUser && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>Данные в localStorage</h3>
          <div style={{ 
            background: 'var(--tg-theme-bg-color)', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid var(--tg-theme-hint-color)'
          }}>
            <div><strong>ID:</strong> {syncStatus.localUser.id}</div>
            <div><strong>Имя:</strong> {syncStatus.localUser.first_name} {syncStatus.localUser.last_name}</div>
            <div><strong>Телефон:</strong> {syncStatus.localUser.phone}</div>
            <div><strong>Email:</strong> {syncStatus.localUser.email}</div>
            <div><strong>Telegram ID:</strong> {syncStatus.localUser.telegram_id}</div>
            <div><strong>Создан:</strong> {new Date(syncStatus.localUser.created_at).toLocaleString()}</div>
          </div>
        </div>
      )}

      {syncStatus.axelUser && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Данные в Axle CRM</h3>
          <div style={{ 
            background: 'var(--tg-theme-bg-color)', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid var(--tg-theme-hint-color)'
          }}>
            <div><strong>ID:</strong> {syncStatus.axelUser.id}</div>
            <div><strong>Имя:</strong> {syncStatus.axelUser.first_name} {syncStatus.axelUser.last_name}</div>
            <div><strong>Телефон:</strong> {syncStatus.axelUser.phone}</div>
            <div><strong>Email:</strong> {syncStatus.axelUser.email}</div>
            <div><strong>Telegram ID:</strong> {syncStatus.axelUser.telegram_id}</div>
            <div><strong>Создан:</strong> {new Date(syncStatus.axelUser.created_at).toLocaleString()}</div>
          </div>
        </div>
      )}

      {!syncStatus.apiHealth && (
        <div className="card">
          <div style={{ 
            padding: '12px',
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid red',
            borderRadius: '8px',
            color: 'red'
          }}>
            <strong>Проблемы с подключением к Axle CRM:</strong>
            <ul style={{ margin: '8px 0 0 16px' }}>
              <li>Проверьте URL API в настройках</li>
              <li>Убедитесь, что API ключ правильный</li>
              <li>Проверьте доступность сервера Axle CRM</li>
              <li>Возможно, нужно включить мок-данные для тестирования</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AxleCrmSync 