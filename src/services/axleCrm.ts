import axios from 'axios'

// Конфигурация API
const API_BASE_URL = '/api/axle-crm' // Относительный путь для Vercel
const API_KEY = '16cda9d095f968b402ff6830a43052e8'

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': API_KEY
  },
  timeout: 10000
})

// Интерфейсы
export interface User {
  id?: number
  client_id?: number
  telegram_id?: number
  first_name?: string
  last_name?: string
  phone?: string
  sex?: 'male' | 'female'
  subscription_sms?: boolean
  bonus_balance?: number
  created_at?: string
  updated_at?: string
}

// Сервис для работы с пользователями
export const userService = {
  // Регистрация пользователя
  async register(userData: {
    first_name: string
    last_name: string
    phone: string
    sex: 'male' | 'female'
    subscription_sms: boolean
    comment?: string
  }): Promise<User> {
    try {
      console.log('🚀 Отправка данных регистрации:', userData)
      
      const response = await api.post('/client/add', userData)
      
      console.log('✅ Ответ от API:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Ошибка регистрации:', error)
      
      if (error.response) {
        console.error('Данные ошибки:', error.response.data)
        throw new Error(error.response.data.error || 'Ошибка регистрации')
      } else if (error.request) {
        throw new Error('Нет ответа от сервера')
      } else {
        throw new Error(error.message || 'Неизвестная ошибка')
      }
    }
  },

  // Получение пользователя по Telegram ID
  async getByTelegramId(telegramId: number): Promise<User | null> {
    try {
      const response = await api.get(`/client/telegram/${telegramId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения пользователя:', error)
      return null
    }
  },

  // Проверка существования пользователя
  async exists(telegramId: number): Promise<boolean> {
    try {
      const response = await api.get(`/client/exists/${telegramId}`)
      return response.data.exists
    } catch (error) {
      console.error('Ошибка проверки пользователя:', error)
      return false
    }
  }
}

// Сервис для проверки здоровья API
export const healthService = {
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health')
      return response.status === 200
    } catch (error) {
      console.error('Ошибка проверки здоровья API:', error)
      return false
    }
  }
} 