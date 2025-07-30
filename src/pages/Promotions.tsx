import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { promotionService, Promotion } from '../services/axleCrm'
import { ArrowLeft, Gift, Percent, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const Promotions: React.FC = () => {
  const navigate = useNavigate()
  const { user: tgUser, showAlert } = useTelegram()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<number | null>(null)

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      const activePromotions = await promotionService.getActive()
      setPromotions(activePromotions)
    } catch (error) {
      console.error('Ошибка загрузки акций:', error)
      toast.error('Не удалось загрузить акции')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleActivatePromotion = async (promotionId: number) => {
    if (!tgUser?.id) {
      toast.error('Необходимо войти в систему')
      return
    }

    setActivating(promotionId)
    
    try {
      const success = await promotionService.activatePromotion(tgUser.id, promotionId)
      
      if (success) {
        toast.success('Акция успешно активирована!')
        showAlert('Акция активирована! Покажите это сообщение администратору при посещении.')
      } else {
        toast.error('Не удалось активировать акцию')
      }
    } catch (error) {
      console.error('Ошибка активации акции:', error)
      toast.error('Ошибка при активации акции')
    } finally {
      setActivating(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'dd MMMM yyyy', { locale: ru })
    } catch {
      return dateString
    }
  }

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'hookah_5_plus_1':
        return <Gift className="icon" style={{ color: '#FF6B6B' }} />
      case 'discount':
        return <Percent className="icon" style={{ color: '#4ECDC4' }} />
      case 'free_drink':
        return <Gift className="icon" style={{ color: '#45B7D1' }} />
      default:
        return <Gift className="icon" />
    }
  }

  const getPromotionTypeText = (type: string) => {
    switch (type) {
      case 'hookah_5_plus_1':
        return 'Акция 5+1'
      case 'discount':
        return 'Скидка'
      case 'free_drink':
        return 'Бесплатный напиток'
      default:
        return 'Акция'
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
          <h1 className="nav-title">Акции</h1>
          <div></div>
        </div>
        <div className="card">
          <div className="loading">
            <h2>Загрузка акций...</h2>
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
        <h1 className="nav-title">Акции и скидки</h1>
        <div></div>
      </div>

      <div className="card fade-in">
        <h2 className="section-title">Действующие акции</h2>
        <p className="tg-hint" style={{ marginBottom: '24px' }}>
          Активируйте акции и получайте специальные предложения
        </p>

        {promotions.length === 0 ? (
          <div className="notification info">
            <strong>В данный момент нет активных акций</strong>
            <p style={{ marginTop: '8px' }}>
              Следите за обновлениями! Новые акции появляются регулярно.
            </p>
          </div>
        ) : (
          <div>
            {promotions.map((promotion) => (
              <div key={promotion.id} className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {getPromotionIcon(promotion.type)}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {promotion.title}
                      </h3>
                      <span className="status-badge status-active">
                        {getPromotionTypeText(promotion.type)}
                      </span>
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      color: 'var(--tg-theme-text-color, #000000)' 
                    }}>
                      {promotion.description}
                    </p>
                    
                    {promotion.discount_percent && (
                      <div style={{ 
                        marginBottom: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#FF6B6B'
                      }}>
                        Скидка {promotion.discount_percent}%
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '12px',
                      color: 'var(--tg-theme-hint-color, #999999)',
                      marginBottom: '16px'
                    }}>
                      <Clock className="icon" style={{ width: '14px', height: '14px' }} />
                      Действует до {formatDate(promotion.valid_to)}
                    </div>
                    
                    <button
                      className="btn-primary"
                      onClick={() => handleActivatePromotion(promotion.id)}
                      disabled={activating === promotion.id}
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                      {activating === promotion.id ? (
                        'Активация...'
                      ) : (
                        <>
                          <CheckCircle className="icon" style={{ marginRight: '8px' }} />
                          Активировать акцию
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="divider" />

        <div className="card">
          <h3 className="section-title">Акция 5+1 - Кальян бесплатно!</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Условия акции:</strong>
            </p>
            <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
              <li>Закажите 5 кальянов в течение одного визита</li>
              <li>Получите 6-й кальян абсолютно бесплатно</li>
              <li>Акция действует на все виды кальянов</li>
              <li>Не суммируется с другими акциями</li>
            </ul>
            <p style={{ marginBottom: '12px' }}>
              <strong>Как использовать:</strong>
            </p>
            <ol style={{ marginBottom: '16px', paddingLeft: '20px' }}>
              <li>Активируйте акцию в приложении</li>
              <li>Закажите 5 кальянов</li>
              <li>Покажите активированную акцию администратору</li>
              <li>Получите 6-й кальян бесплатно!</li>
            </ol>
            <div className="notification success">
              <strong>Важно:</strong> Акция действует только при предварительной активации в приложении
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Правила использования акций</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '8px' }}>
              • Одна акция может быть активирована только один раз
            </p>
            <p style={{ marginBottom: '8px' }}>
              • Акции не суммируются между собой
            </p>
            <p style={{ marginBottom: '8px' }}>
              • Активированную акцию необходимо использовать в течение срока действия
            </p>
            <p style={{ marginBottom: '8px' }}>
              • При использовании акции предъявите сообщение администратору
            </p>
            <p>
              • Администрация оставляет за собой право изменять условия акций
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promotions 