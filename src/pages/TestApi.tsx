import React, { useState } from 'react'
import { userService, apiService } from '../services/axleCrm'
import toast from 'react-hot-toast'

const TestApi: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      // Простой тест с fetch через прокси
      const response = await fetch('/api/client/add', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
        }
      })
      
      setResult(`Health Check: Status ${response.status} - ${response.statusText}`)
      toast.success('Health check completed')
    } catch (error) {
      setResult(`Health Check Error: ${error}`)
      toast.error('Health check failed')
    }
    setLoading(false)
  }

  const testRegister = async () => {
    setLoading(true)
    try {
      const testUser = {
        first_name: 'Test',
        last_name: 'User',
        phone: '+79001234567',
        email: 'test@example.com',
        sex: 'male' as const,
        subscription_sms: true,
        comment: 'Тестовый пользователь из Telegram Web App'
      }
      
      console.log('Отправка данных:', testUser)
      
      const response = await fetch('/api/client/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
        },
        body: JSON.stringify(testUser)
      })
      
      console.log('Статус ответа:', response.status)
      console.log('Заголовки ответа:', response.headers)
      
      const responseText = await response.text()
      console.log('Текст ответа:', responseText)
      
      if (response.ok) {
        setResult(`Registration: SUCCESS - Status: ${response.status}`)
        toast.success('Registration successful')
      } else {
        setResult(`Registration Error: Status ${response.status} - ${responseText}`)
        toast.error('Registration failed')
      }
    } catch (error) {
      console.error('Ошибка fetch:', error)
      setResult(`Registration Error: ${error}`)
      toast.error('Registration failed')
    }
    setLoading(false)
  }

  const testGetUser = async () => {
    setLoading(true)
    try {
      const user = await userService.getByTelegramId(123456789)
      setResult(`Get User: ${user ? `FOUND - ${user.first_name}` : 'NOT FOUND'}`)
      toast.success('Get user completed')
    } catch (error) {
      setResult(`Get User Error: ${apiService.handleError(error)}`)
      toast.error('Get user failed')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Тест API Axle CRM</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="nav-button" 
            onClick={testHealthCheck}
            disabled={loading}
          >
            {loading ? 'Тестирование...' : 'Проверить подключение'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            className="nav-button secondary" 
            onClick={async () => {
              setLoading(true)
              try {
                const response = await fetch('/api/client/add', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': '226d5d8237fe912af0be9a0ffef377ee'
                  },
                  body: JSON.stringify({
                    first_name: 'Test',
                    last_name: 'Minimal',
                    sex: 'male'
                  })
                })
                setResult(`Test минимальных данных: Status ${response.status} - ${response.statusText}`)
                toast.success('Test completed')
              } catch (error) {
                setResult(`Test Error: ${error}`)
                toast.error('Test failed')
              }
              setLoading(false)
            }}
            disabled={loading}
          >
            {loading ? 'Тестирование...' : 'Тест минимальных данных'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            className="nav-button" 
            onClick={testRegister}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Тест регистрации'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            className="nav-button" 
            onClick={testGetUser}
            disabled={loading}
          >
            {loading ? 'Поиск...' : 'Тест получения пользователя'}
          </button>
        </div>

        {result && (
          <div className="card">
            <h3>Результат:</h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {result}
            </pre>
          </div>
        )}

        <div className="card">
          <h3>Информация об API:</h3>
          <p><strong>URL:</strong> https://api.axle-crm.com/v1</p>
          <p><strong>Эндпоинт регистрации:</strong> /client/add</p>
          <p><strong>API Key:</strong> 226d5d8237fe912af0be9a0ffef377ee</p>
        </div>
      </div>
    </div>
  )
}

export default TestApi 