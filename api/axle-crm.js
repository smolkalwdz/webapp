module.exports = async (req, res) => {
  // Включаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Api-Key')

  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { method, url, body, headers } = req
    
    // Извлекаем путь после /api/axle-crm/
    const pathMatch = url.match(/\/api\/axle-crm\/(.+)/)
    if (!pathMatch) {
      res.status(404).json({ error: 'Invalid path' })
      return
    }

    const apiPath = pathMatch[1]
    const targetUrl = `https://api.axle-crm.com/v1/${apiPath}`
    
    console.log(`📡 ${method} запрос к:`, targetUrl)
    console.log('📄 Данные:', body)
    console.log('🔑 API Key:', headers['api-key'])

    const response = await fetch(targetUrl, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': headers['api-key'] || '16cda9d095f968b402ff6830a43052e8'
      }
    })

    const responseData = await response.json()
    console.log('✅ Успешный ответ:', responseData)
    
    res.status(response.status).json(responseData)
  } catch (error) {
    console.error('❌ Ошибка прокси:', error.message)
    res.status(500).json({
      error: error.message,
      status: 500
    })
  }
} 