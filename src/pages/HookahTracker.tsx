import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { hookahService, HookahStats, HookahPurchase } from '../services/axleCrm'
import { ArrowLeft, Flame, Gift, History, Plus, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const HookahTracker: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser } = useTelegram()
  const [stats, setStats] = useState<HookahStats | null>(null)
  const [purchases, setPurchases] = useState<HookahPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    loadHookahData()
  }, [tgUser])

  const loadHookahData = async () => {
    if (!tgUser?.id) {
      setLoading(false)
      return
    }

    try {
      const [statsData, purchasesData] = await Promise.all([
        hookahService.getStats(tgUser.id),
        hookahService.getPurchaseHistory(tgUser.id)
      ])
      
      setStats(statsData)
      setPurchases(purchasesData)
    } catch (error) {
      console.error('Ошибка загрузки данных кальянов:', error)
      toast.error('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimFreeHookah = async () => {
    if (!tgUser?.id || !stats?.can_claim_free) return

    setClaiming(true)
    try {
      await hookahService.claimFreeHookah(tgUser.id)
      toast.success('Запрос на бесплатный кальян отправлен администраторам!')
      // Перезагружаем данные
      await loadHookahData()
    } catch (error) {
      console.error('Ошибка запроса бесплатного кальяна:', error)
      toast.error('Не удалось запросить бесплатный кальян')
    } finally {
      setClaiming(false)
    }
  }

  const handleBack = () => {
    navigate('/')
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
          <h1 className="nav-title">Акция 5+1</h1>
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

  if (!stats) {
    return (
      <div className="container">
        <div className="nav">
          <button className="nav-back" onClick={handleBack}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="nav-title">Акция 5+1</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="notification error">
            <strong>Ошибка загрузки</strong>
            <p>Не удалось загрузить данные акции</p>
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
        <h1 className="nav-title">Акция 5+1</h1>
        <div></div>
      </div>

      {/* Статистика */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Flame className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
          <h2 className="section-title">Ваша статистика</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            background: 'var(--tg-theme-bg-color)', 
            padding: '12px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--tg-theme-hint-color)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color)' }}>
              {stats.purchases_count}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
              Куплено кальянов
            </div>
          </div>

          <div style={{ 
            background: 'var(--tg-theme-bg-color)', 
            padding: '12px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--tg-theme-hint-color)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {stats.purchases_until_free}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
              До бесплатного
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            <span>Прогресс до бесплатного кальяна</span>
            <span>{stats.purchases_count % 5}/5</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'var(--tg-theme-hint-color)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(stats.purchases_count % 5) * 20}%`, 
              height: '100%', 
              background: 'var(--tg-theme-button-color)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Бесплатные кальяны */}
        {stats.free_hookahs_available > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '16px', 
            borderRadius: '8px',
            color: 'white',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Gift className="icon" style={{ width: '20px', height: '20px' }} />
              <strong>Доступно бесплатных кальянов: {stats.free_hookahs_available}</strong>
            </div>
            <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>
              Закажите 5 кальянов и получите 6-й бесплатно!
            </p>
          </div>
        )}
      </div>

      {/* Кнопка запроса бесплатного кальяна */}
      {stats.can_claim_free && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <button 
            className="btn-primary" 
            onClick={handleClaimFreeHookah}
            disabled={claiming}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Gift className="icon" style={{ width: '20px', height: '20px' }} />
            {claiming ? 'Отправка запроса...' : 'Запросить бесплатный кальян'}
          </button>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--tg-theme-hint-color)', 
            textAlign: 'center', 
            marginTop: '8px' 
          }}>
            Запрос будет отправлен администраторам для подтверждения
          </p>
        </div>
      )}

      {/* История покупок */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <History className="icon" style={{ width: '24px', height: '24px', color: 'var(--tg-theme-button-color)' }} />
          <h2 className="section-title">История покупок</h2>
        </div>

        {purchases.length === 0 ? (
          <p style={{ color: 'var(--tg-theme-hint-color)', textAlign: 'center' }}>
            У вас пока нет покупок кальянов
          </p>
        ) : (
          <div>
            {purchases.slice(0, 10).map((purchase) => (
              <div key={purchase.id} className="list-item" style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Flame className="icon" style={{ width: '16px', height: '16px' }} />
                     <span>
                       {purchase.is_free ? 'Бесплатный кальян' : 'Кальян'}
                     </span>
                    {purchase.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star className="icon" style={{ width: '14px', height: '14px', fill: '#ffd700' }} />
                        <span style={{ fontSize: '12px' }}>{purchase.rating}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                    {formatDate(purchase.created_at)}
                  </span>
                </div>
                {purchase.rating_comment && (
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'var(--tg-theme-hint-color)', 
                    margin: '4px 0 0 24px',
                    fontStyle: 'italic'
                  }}>
                    "{purchase.rating_comment}"
                  </p>
                )}
              </div>
            ))}
            
            {purchases.length > 10 && (
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color)', 
                textAlign: 'center',
                marginTop: '12px'
              }}>
                Показано последних 10 покупок из {purchases.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HookahTracker 