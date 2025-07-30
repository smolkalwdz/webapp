# Hookah Cafe - Telegram Mini Web App

Telegram Mini Web App для тайм кафе с кальянами с интеграцией Axle CRM. Мини-приложение открывается прямо внутри Telegram бота!

## 🚀 Возможности

- **Мини-приложение внутри Telegram** - открывается прямо в боте
- **Регистрация пользователей** с автоматической интеграцией в Axle CRM
- **Система бронирования** для турниров и мероприятий
- **Акция 5+1** - 6 кальян бесплатно при заказе 5
- **Личный кабинет** пользователя
- **Активация акций** через приложение
- **Адаптивный дизайн** для Telegram Web App
- **Нативная интеграция** с Telegram UI

## 🛠 Технологии

- **Frontend**: React 18 + TypeScript
- **Стилизация**: CSS с поддержкой Telegram темы
- **Роутинг**: React Router DOM
- **Формы**: React Hook Form
- **HTTP клиент**: Axios
- **Иконки**: Lucide React
- **Уведомления**: React Hot Toast
- **Сборка**: Vite

## 📋 Требования

- Node.js 16+ 
- npm или yarn
- Telegram Bot Token
- Axle CRM API ключ

## 🚀 Быстрый запуск

Смотрите `QUICK_START.md` для быстрого запуска за 5 минут!

## 📋 Установка

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd hookah-cafe-telegram-webapp
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Создайте файл .env:**
```bash
cp env.example .env
```

4. **Настройте переменные окружения:**
```env
# Axle CRM
REACT_APP_AXLE_CRM_URL=https://api.axle-crm.com
REACT_APP_AXLE_CRM_API_KEY=your_api_key_here

# Telegram Bot
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## 🔧 Настройка Telegram Bot

1. **Создайте бота через @BotFather:**
   - Отправьте `/newbot` в @BotFather
   - Следуйте инструкциям для создания бота
   - Получите токен бота

2. **Настройте Web App:**
   - Отправьте `/setmenubutton` в @BotFather
   - Выберите вашего бота
   - Укажите текст кнопки: "Hookah Cafe"
   - Укажите URL вашего Web App

3. **Настройте команды бота:**
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Открыть Hookah Cafe"},
      {"command": "menu", "description": "Главное меню"}
    ]
  }'
```

## 🏃‍♂️ Запуск

### Режим разработки:
```bash
npm run dev
```

### Сборка для продакшена:
```bash
npm run build
```

### Предварительный просмотр сборки:
```bash
npm run preview
```

## 📱 Использование

### Для пользователей:
1. Откройте бота в Telegram
2. Нажмите кнопку "Hookah Cafe" или отправьте `/start`
3. Зарегистрируйтесь в системе
4. Используйте функции приложения:
   - Просмотр мероприятий
   - Активация акций
   - Бронирование столиков
   - Личный кабинет

### Для администраторов:
1. Настройте Axle CRM
2. Добавьте мероприятия через CRM
3. Создайте акции в системе
4. Управляйте пользователями

## 🔌 Интеграция с Axle CRM

### API Endpoints:

#### Пользователи:
- `POST /users` - Регистрация пользователя
- `GET /users/telegram/{id}` - Получение пользователя по Telegram ID
- `PUT /users/telegram/{id}` - Обновление данных пользователя

#### Мероприятия:
- `GET /events?status=active` - Получение активных мероприятий
- `GET /events/{id}` - Получение мероприятия по ID
- `GET /users/telegram/{id}/events` - Мероприятия пользователя

#### Бронирования:
- `POST /bookings` - Создание бронирования
- `GET /users/telegram/{id}/bookings` - Бронирования пользователя
- `PUT /bookings/{id}/cancel` - Отмена бронирования

#### Акции:
- `GET /promotions?is_active=true` - Получение активных акций
- `GET /promotions?type=hookah_5_plus_1&is_active=true` - Акция 5+1
- `POST /users/telegram/{id}/promotions/{promotionId}/activate` - Активация акции

## 🎨 Кастомизация

### Цвета и тема:
Приложение автоматически адаптируется под тему Telegram. Основные CSS переменные:

```css
--tg-theme-bg-color: #ffffff
--tg-theme-text-color: #000000
--tg-theme-button-color: #2481cc
--tg-theme-button-text-color: #ffffff
--tg-theme-link-color: #2481cc
--tg-theme-hint-color: #999999
```

### Добавление новых страниц:
1. Создайте компонент в `src/pages/`
2. Добавьте роут в `src/App.tsx`
3. Обновите навигацию

## 📦 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
├── hooks/              # Кастомные хуки
│   └── useTelegram.ts  # Хук для работы с Telegram Web App
├── pages/              # Страницы приложения
│   ├── Home.tsx        # Главная страница
│   ├── Registration.tsx # Регистрация
│   ├── Events.tsx      # Мероприятия
│   ├── Promotions.tsx  # Акции
│   ├── Profile.tsx     # Личный кабинет
│   └── ...
├── services/           # API сервисы
│   └── axleCrm.ts      # Интеграция с Axle CRM
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## 🔒 Безопасность

- Все API запросы используют HTTPS
- Telegram Web App автоматически проверяет подлинность данных
- API ключи хранятся в переменных окружения
- Валидация данных на клиенте и сервере

## 🚀 Деплой

### Vercel:
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Netlify:
1. Подключите репозиторий к Netlify
2. Настройте переменные окружения
3. Укажите команду сборки: `npm run build`
4. Укажите папку: `dist`

### Другие платформы:
1. Выполните `npm run build`
2. Загрузите содержимое папки `dist`
3. Настройте переменные окружения

## 🤝 Разработка

### Добавление новых функций:
1. Создайте feature branch
2. Реализуйте функциональность
3. Добавьте тесты (если необходимо)
4. Создайте Pull Request

### Стиль кода:
- Используйте TypeScript
- Следуйте ESLint правилам
- Используйте функциональные компоненты
- Добавляйте типы для всех интерфейсов

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте документацию
2. Создайте Issue в репозитории
3. Обратитесь к разработчику

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей.

## 🙏 Благодарности

- Telegram за отличную платформу Web Apps
- Axle CRM за API интеграцию
- Сообществу React за инструменты разработки 