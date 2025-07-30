import React, { useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { apiService, userService } from '../services/axleCrm'
import { ArrowLeft, Database, RefreshCw, CheckCircle, XCircle, AlertCircle, Trash2, UserPlus, FileText, Wifi, WifiOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AxleCrmTest: React.FC = () => {
  const { user: tgUser } = useTelegram()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Функция для добавления логов в интерфейс
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] ${message}`
    setLogs(prev => [...prev, logEntry])
    console.log(message) // Также выводим в консоль
  }

  // Функция очистки localStorage
  const clearLocalStorage = () => {
    try {
      addLog('🗑️ Начало очистки localStorage...')
      
      // Очищаем все данные, связанные с нашим приложением
      localStorage.removeItem('mock_users')
      localStorage.removeItem('mock_admins')
      localStorage.removeItem('mock_hookah_purchases')
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      
      // Очищаем все ключи, начинающиеся с mock_
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('mock_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      addLog('✅ localStorage успешно очищен')
      toast.success('База данных очищена!')
    } catch (error) {
      addLog(`❌ Ошибка очистки localStorage: ${error}`)
      toast.error('Ошибка очистки базы данных')
    }
  }

  // Функция тестирования подключения к Axle CRM
  const testAxleCrmConnection = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('🌐 Тестирование подключения к Axle CRM...')
    
    try {
      // Импортируем axios для прямого использования
      const axios = (await import('axios')).default
      
      // Тест 1: Проверка доступности сервера через axios
      addLog('🔍 Тест 1: Проверка доступности сервера через axios...')
      try {
        const response = await axios.get('https://api.axle-crm.com/v1/client/add', {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
          }
        })
        addLog(`📡 GET статус: ${response.status} ${response.statusText}`)
        addLog(`📡 GET данные: ${JSON.stringify(response.data)}`)
      } catch (error: any) {
        addLog(`📡 GET статус: ${error.response?.status} ${error.response?.statusText}`)
        addLog(`📡 GET ошибка: ${error.message}`)
        
        if (error.response?.status === 405) {
          addLog('✅ Сервер доступен (Method Not Allowed - ожидаемо для GET)')
        } else if (error.response?.status === 401) {
          addLog('✅ Сервер доступен (Unauthorized - проблема с авторизацией)')
        } else if (error.response?.status === 404) {
          addLog('✅ Сервер доступен (Not Found - эндпоинт не существует)')
        } else if (error.response?.status) {
          addLog(`⚠️ Неожиданный статус: ${error.response.status}`)
        } else {
          addLog(`❌ Ошибка подключения: ${error.message}`)
        }
      }

      // Тест 2: Проверка POST запроса через axios
      addLog('🔍 Тест 2: Проверка POST запроса через axios...')
      try {
        const testData = {
          first_name: 'Тест',
          last_name: 'Пользователь',
          phone: '+7 (999) 000-00-00',
          email: 'test@example.com',
          sex: 'male',
          subscription_sms: true,
          telegram_id: 123456789,
          comment: 'Тест подключения',
          source: 'telegram_webapp'
        }
        
        const response = await axios.post('https://api.axle-crm.com/v1/client/add', testData, {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
          }
        })
        
        addLog(`📡 POST статус: ${response.status} ${response.statusText}`)
        addLog(`✅ POST успешен: ${JSON.stringify(response.data)}`)
      } catch (error: any) {
        addLog(`📡 POST статус: ${error.response?.status} ${error.response?.statusText}`)
        addLog(`📡 POST ошибка: ${error.response?.data || error.message}`)
      }

      // Тест 3: Проверка через наш apiService
      addLog('🔍 Тест 3: Проверка через наш apiService...')
      try {
        const healthResult = await apiService.healthCheck()
        addLog(`✅ apiService health check: ${healthResult}`)
      } catch (error: any) {
        addLog(`❌ apiService health check ошибка: ${error.message}`)
      }

    } catch (error: any) {
      addLog(`❌ Общая ошибка тестирования: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция тестирования регистрации с реальным Telegram ID
  const testRealRegistration = async () => {
    if (!tgUser?.id) {
      addLog('❌ Telegram ID не найден')
      toast.error('Telegram ID не найден')
      return
    }

    setIsLoading(true)
    setLogs([]) // Очищаем логи
    addLog('🧪 Начало тестирования регистрации с реальным Telegram ID')
    
    try {
      addLog(`📱 Telegram ID: ${tgUser.id}`)
      addLog(`👤 Имя: ${tgUser.first_name || 'Не определено'}`)
      
      const testUserData = {
        telegram_id: tgUser.id,
        first_name: tgUser.first_name || 'Тестовый',
        last_name: tgUser.last_name || 'Пользователь',
        phone: '+7 (999) 888-77-66',
        email: 'test@example.com',
        sex: 'male' as const,
        subscription_sms: true,
        comment: `Тестовая регистрация из Telegram Web App (ID: ${tgUser.id})`
      }
      
      addLog('📝 Подготовка данных для регистрации...')
      addLog(`   - Имя: ${testUserData.first_name}`)
      addLog(`   - Фамилия: ${testUserData.last_name}`)
      addLog(`   - Телефон: ${testUserData.phone}`)
      addLog(`   - Email: ${testUserData.email}`)
      
      addLog('🔄 Вызов userService.register...')
      const registeredUser = await userService.register(testUserData)
      
      addLog(`✅ Регистрация успешна! ID: ${registeredUser.id}`)
      addLog(`   - Client ID: ${registeredUser.client_id}`)
      addLog(`   - Created: ${registeredUser.created_at}`)
      
      toast.success(`Регистрация успешна! ID: ${registeredUser.id}`)
      
      // Проверяем, что пользователь действительно сохранен
      addLog('🔄 Проверка сохранения пользователя...')
      setTimeout(async () => {
        try {
          const foundUser = await userService.getByTelegramId(tgUser.id)
          if (foundUser) {
            addLog('✅ Пользователь найден после регистрации')
            addLog(`   - ID: ${foundUser.id}`)
            addLog(`   - Имя: ${foundUser.first_name} ${foundUser.last_name}`)
            toast.success('Пользователь успешно сохранен в системе!')
          } else {
            addLog('❌ Пользователь не найден после регистрации')
            toast.error('Пользователь не найден после регистрации')
          }
        } catch (error) {
          addLog(`❌ Ошибка поиска после регистрации: ${error}`)
          toast.error('Ошибка поиска пользователя')
        }
      }, 2000)
      
    } catch (error) {
      addLog(`❌ Ошибка тестовой регистрации: ${error}`)
      toast.error(`Ошибка регистрации: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Функция принудительной синхронизации с Axle CRM
  const forceSyncWithAxleCrm = async () => {
    if (!tgUser?.id) {
      addLog('❌ Telegram ID не найден')
      toast.error('Telegram ID не найден')
      return
    }

    setIsLoading(true)
    setLogs([]) // Очищаем логи
    addLog('🔄 Начало принудительной синхронизации с Axle CRM')
    
    try {
      addLog(`📱 Telegram ID: ${tgUser.id}`)
      
      // Сначала попробуем простой fetch запрос
      addLog('🔍 Тест 1: Простой fetch запрос...')
      try {
        const response = await fetch('https://api.axle-crm.com/v1/client/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
          },
          body: JSON.stringify({
            first_name: 'Тест',
            last_name: 'Синхронизация',
            phone: '+7 (999) 000-00-00',
            email: 'test@example.com',
            sex: 'male',
            subscription_sms: true,
            telegram_id: tgUser.id,
            comment: 'Тест принудительной синхронизации',
            source: 'telegram_webapp'
          })
        })
        
        addLog(`📡 Fetch статус: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          const data = await response.json()
          addLog(`✅ Fetch успешен: ${JSON.stringify(data)}`)
          toast.success('Синхронизация через fetch успешна!')
          return
        } else {
          const errorText = await response.text()
          addLog(`❌ Fetch ошибка: ${errorText}`)
        }
      } catch (fetchError: any) {
        addLog(`❌ Fetch ошибка: ${fetchError.message}`)
      }
      
      // Если fetch не сработал, пробуем через userService
      addLog('🔄 Тест 2: Через userService.forceSyncWithAxleCrm...')
      const result = await userService.forceSyncWithAxleCrm(tgUser.id)
      
      if (result.success) {
        addLog(`✅ Синхронизация успешна!`)
        addLog(`   - Сообщение: ${result.message}`)
        if (result.data) {
          addLog(`   - Данные: ${JSON.stringify(result.data)}`)
        }
        toast.success('Синхронизация успешна!')
      } else {
        addLog(`❌ Ошибка синхронизации: ${result.message}`)
        toast.error(`Ошибка синхронизации: ${result.message}`)
      }
      
    } catch (error: any) {
      addLog(`❌ Общая ошибка синхронизации: ${error.message}`)
      toast.error(`Общая ошибка: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    setTestResults(null)
    setLogs([]) // Очищаем логи
    
    addLog('🧪 Начало выполнения тестов...')
    
    const results = {
      apiHealth: false,
      apiHealthDetails: '',
      registration: false,
      registrationDetails: '',
      userSearch: false,
      userSearchDetails: ''
    }

    try {
      // Тест 1: Проверка здоровья API
      addLog('🧪 Тест 1: Проверка здоровья API...')
      try {
        const healthResult = await apiService.healthCheck()
        results.apiHealth = healthResult
        results.apiHealthDetails = healthResult ? 'API доступен' : 'API недоступен'
        addLog(`✅ Результат проверки здоровья: ${healthResult}`)
      } catch (error) {
        results.apiHealthDetails = `Ошибка: ${error}`
        addLog(`❌ Ошибка проверки здоровья: ${error}`)
      }

      // Тест 2: Регистрация тестового пользователя
      addLog('🧪 Тест 2: Регистрация тестового пользователя...')
      try {
        const testUserData = {
          telegram_id: 999999999,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          phone: '+7 (999) 999-99-99',
          email: 'test@example.com',
          sex: 'male' as const,
          subscription_sms: true
        }
        
        addLog('📝 Регистрация пользователя с ID: 999999999')
        const registeredUser = await userService.register(testUserData)
        results.registration = true
        results.registrationDetails = `Пользователь зарегистрирован с ID: ${registeredUser.id}`
        addLog(`✅ Результат регистрации: ID ${registeredUser.id}`)
      } catch (error) {
        results.registrationDetails = `Ошибка: ${error}`
        addLog(`❌ Ошибка регистрации: ${error}`)
      }

      // Тест 3: Поиск пользователя
      addLog('🧪 Тест 3: Поиск пользователя...')
      try {
        const foundUser = await userService.getByTelegramId(999999999)
        results.userSearch = foundUser !== null
        results.userSearchDetails = foundUser ? `Пользователь найден: ${foundUser.first_name} ${foundUser.last_name}` : 'Пользователь не найден'
        addLog(`✅ Результат поиска: ${foundUser ? 'найден' : 'не найден'}`)
      } catch (error) {
        results.userSearchDetails = `Ошибка: ${error}`
        addLog(`❌ Ошибка поиска: ${error}`)
      }

    } catch (error) {
      addLog(`❌ Общая ошибка тестирования: ${error}`)
    } finally {
      setIsLoading(false)
      setTestResults(results)
      addLog('🏁 Тестирование завершено')
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Тест Axle CRM</h1>
            <p className="text-sm text-gray-600">Проверка подключения к API</p>
          </div>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-2">Информация о пользователе</h2>
          <div className="text-sm text-gray-600">
            <p>Telegram ID: {tgUser?.id || 'Не определен'}</p>
            <p>Имя: {tgUser?.first_name || 'Не определено'}</p>
            <p>Username: {tgUser?.username || 'Не определен'}</p>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm space-y-3">
          <button
            onClick={testAxleCrmConnection}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Wifi className="w-5 h-5" />
            Тест подключения к Axle CRM
          </button>

          <button
            onClick={runTests}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Запуск тестов...
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                Запустить тесты
              </>
            )}
          </button>

          <button
            onClick={testRealRegistration}
            disabled={isLoading || !tgUser?.id}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Тест регистрации с моим ID
          </button>

          <button
            onClick={forceSyncWithAxleCrm}
            disabled={isLoading || !tgUser?.id}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Принудительная синхронизация
          </button>

          <button
            onClick={clearLocalStorage}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Очистить базу данных
          </button>
        </div>

        {/* Логи */}
        {logs.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Логи выполнения
              </h2>
              <button
                onClick={clearLogs}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Очистить
              </button>
            </div>
            <div className="bg-gray-100 rounded p-3 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-xs font-mono text-gray-800 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Результаты тестов */}
        {testResults && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Результаты тестов</h2>
            
            <div className="space-y-4">
              {/* Тест здоровья API */}
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.apiHealth)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Здоровье API</h3>
                  <p className="text-sm text-gray-600">{testResults.apiHealthDetails}</p>
                </div>
              </div>

              {/* Тест регистрации */}
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.registration)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Регистрация пользователя</h3>
                  <p className="text-sm text-gray-600">{testResults.registrationDetails}</p>
                </div>
              </div>

              {/* Тест поиска */}
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.userSearch)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Поиск пользователя</h3>
                  <p className="text-sm text-gray-600">{testResults.userSearchDetails}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Инструкции */}
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-blue-900 mb-2">Как интерпретировать результаты:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Тест подключения:</strong> Проверяет доступность сервера Axle CRM</li>
            <li>• <strong>Здоровье API:</strong> Проверяет доступность сервера</li>
            <li>• <strong>Регистрация:</strong> Тестирует создание нового пользователя</li>
            <li>• <strong>Поиск:</strong> Проверяет поиск пользователя по Telegram ID</li>
            <li>• <strong>Тест с моим ID:</strong> Регистрирует вас с вашим реальным Telegram ID</li>
          </ul>
        </div>

        {/* Инструкции по очистке */}
        <div className="bg-yellow-50 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-yellow-900 mb-2">Очистка базы данных:</h3>
          <p className="text-sm text-yellow-800">
            Нажмите "Очистить базу данных" чтобы удалить все локальные данные. 
            Это поможет протестировать чистую регистрацию в Axle CRM.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AxleCrmTest 