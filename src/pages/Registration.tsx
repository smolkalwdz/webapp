import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { userService } from '../services/axleCrm'
import { ArrowLeft, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTelegram } from '../hooks/useTelegram'

interface RegistrationForm {
  first_name: string
  last_name: string
  phone: string
  sex: 'male' | 'female'
  subscription_sms: boolean
}

const Registration: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { user: tgUser, showMainButton, hideMainButton } = useTelegram()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegistrationForm>({
    defaultValues: {
      sex: 'male',
      subscription_sms: true
    }
  })

  // Заполняем поля из Telegram данных
  useEffect(() => {
    if (tgUser) {
      if (tgUser.first_name) {
        setValue('first_name', tgUser.first_name)
      }
      if (tgUser.last_name) {
        setValue('last_name', tgUser.last_name)
      }
    }
  }, [tgUser, setValue])

  // Показываем кнопку регистрации в Telegram только если мы в Web App
  useEffect(() => {
    // Проверяем, что мы в Telegram Web App
    if ((window as any).Telegram?.WebApp) {
      showMainButton('Зарегистрироваться', () => {
        // При нажатии на кнопку в Telegram отправляем форму
        const form = document.querySelector('form')
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true }))
        }
      })

      return () => {
        hideMainButton()
      }
    }
  }, [showMainButton, hideMainButton])

  const handleRegistration = async (data: RegistrationForm) => {
    setLoading(true)
    
    try {
      console.log('🚀 Отправка данных регистрации:', data)
      
      const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        sex: data.sex,
        subscription_sms: data.subscription_sms,
        comment: 'Регистрация из веб-приложения'
      }

      const result = await userService.register(userData)
      
                        console.log('✅ Регистрация успешна:', result)
                  toast.success(`Регистрация успешно завершена! ID: ${result.client_id}`)

                  // Показываем результат в Telegram
                  const message = `✅ Регистрация успешна!

ID: ${result.client_id}
Имя: ${result.first_name} ${result.last_name}
Телефон: ${result.phone}
Бонусы: ${result.bonus_balance}

Пользователь добавлен в Axle CRM!`

                  // Используем Telegram API для показа результата
                  if ((window as any).Telegram?.WebApp) {
                    try {
                      (window as any).Telegram.WebApp.showAlert(message)
                    } catch (tgError) {
                      // Если Telegram API недоступен, используем обычный alert
                      alert(message)
                    }
                  } else {
                    alert(message)
                  }

                  // Переходим в профиль
                  navigate('/profile')
                    } catch (error: any) {
                  console.error('❌ Ошибка регистрации:', error)
                  const errorMessage = error.message || 'Неизвестная ошибка'
                  toast.error(`Ошибка регистрации: ${errorMessage}`)

                  // Показываем ошибку в зависимости от контекста
                  const errorText = `❌ Ошибка регистрации:

${errorMessage}

Проверьте правильность данных и попробуйте еще раз.`

                  // Используем Telegram API только если мы в Web App
                  if ((window as any).Telegram?.WebApp) {
                    try {
                      (window as any).Telegram.WebApp.showAlert(errorText)
                    } catch (tgError) {
                      // Если Telegram API недоступен, используем обычный alert
                      alert(errorText)
                    }
                  } else {
                    alert(errorText)
                  }
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="nav-title">Регистрация</h1>
        <div></div>
      </div>

      <div className="card">
        <h2 className="section-title">
          <User className="icon" style={{ marginRight: '8px' }} />
          Регистрация в Axle CRM
        </h2>
        
                            <div className="notification info">
                      <strong>Информация:</strong>
                      <br />
                      • Данные из Telegram будут заполнены автоматически
                      <br />
                      • Обязательные поля: Имя, Фамилия, Телефон, Пол
                      <br />
                      • После регистрации пользователь появится в Axle CRM
                      <br />
                      • Начислятся бонусы за регистрацию (500)
                      <br />
                      • Работает как в Telegram Web App, так и в браузере
                    </div>

        <form onSubmit={handleSubmit(handleRegistration)}>
          <div className="form-group">
            <label className="form-label">
              <User className="icon" style={{ marginRight: '4px' }} />
              Имя *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите имя"
              {...register('first_name', { required: 'Имя обязательно' })}
            />
            {errors.first_name && (
              <span className="error">{errors.first_name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <User className="icon" style={{ marginRight: '4px' }} />
              Фамилия *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите фамилию"
              {...register('last_name', { required: 'Фамилия обязательна' })}
            />
            {errors.last_name && (
              <span className="error">{errors.last_name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone className="icon" style={{ marginRight: '4px' }} />
              Телефон *
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="+7 (999) 123-45-67"
              {...register('phone', { required: 'Телефон обязателен' })}
            />
            {errors.phone && (
              <span className="error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Пол *</label>
            <select
              className="form-input"
              {...register('sex', { required: 'Выберите пол' })}
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
            {errors.sex && (
              <span className="error">{errors.sex.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                {...register('subscription_sms')}
                style={{ marginRight: '8px' }}
              />
              Подписка на SMS
            </label>
          </div>

                                <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ marginTop: '16px' }}
                      >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                      </button>
        </form>

                            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                      <h4 style={{ marginBottom: '8px' }}>Что происходит при регистрации:</h4>
                      <ol style={{ marginLeft: '16px', fontSize: '14px' }}>
                        <li>Данные из Telegram заполняются автоматически</li>
                        <li>Данные отправляются в Axle CRM API</li>
                        <li>Создается новый клиент в системе</li>
                        <li>Начисляются бонусы за регистрацию (500)</li>
                        <li>Возвращается ID клиента и данные</li>
                        <li>Пользователь появляется в Axle CRM</li>
                      </ol>
                    </div>
      </div>
    </div>
  )
}

export default Registration 