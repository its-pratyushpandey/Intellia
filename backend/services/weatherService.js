import axios from 'axios'

class WeatherService {
    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY
        this.baseUrl = 'http://api.openweathermap.org/data/2.5'
    }

    // Get current weather by city name
    async getCurrentWeather(city = 'New York') {
        try {
            if (!this.apiKey) {
                return this.getMockWeatherData(city)
            }

            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                },
                timeout: 5000
            })

            const data = response.data
            return {
                city: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                windDirection: data.wind.deg,
                description: data.weather[0].description,
                main: data.weather[0].main.toLowerCase(),
                icon: data.weather[0].icon,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
            }
        } catch (error) {
            console.error('Weather API error:', error.message)
            return this.getMockWeatherData(city)
        }
    }

    // Get weather forecast
    async getWeatherForecast(city = 'New York', days = 5) {
        try {
            if (!this.apiKey) {
                return this.getMockForecastData(city, days)
            }

            const response = await axios.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                },
                timeout: 5000
            })

            const data = response.data
            const forecast = []

            // Group forecasts by day
            const dailyForecasts = {}
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toDateString()
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = []
                }
                dailyForecasts[date].push(item)
            })

            // Extract daily summaries
            Object.entries(dailyForecasts).slice(0, days).forEach(([date, forecasts]) => {
                const temps = forecasts.map(f => f.main.temp)
                const high = Math.round(Math.max(...temps))
                const low = Math.round(Math.min(...temps))
                const mainWeather = forecasts[0].weather[0].main.toLowerCase()
                const description = forecasts[0].weather[0].description
                const precipitation = forecasts.reduce((acc, f) => acc + (f.rain?.['3h'] || 0), 0)

                forecast.push({
                    date: date,
                    day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    high,
                    low,
                    main: mainWeather,
                    description,
                    precipitation: Math.round(precipitation),
                    icon: forecasts[0].weather[0].icon
                })
            })

            return forecast
        } catch (error) {
            console.error('Weather forecast error:', error.message)
            return this.getMockForecastData(city, days)
        }
    }

    // Get weather by coordinates
    async getWeatherByCoords(lat, lon) {
        try {
            if (!this.apiKey) {
                return this.getMockWeatherData('Unknown Location')
            }

            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    lat,
                    lon,
                    appid: this.apiKey,
                    units: 'metric'
                },
                timeout: 5000
            })

            const data = response.data
            return {
                city: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
                windSpeed: Math.round(data.wind.speed * 3.6),
                windDirection: data.wind.deg,
                description: data.weather[0].description,
                main: data.weather[0].main.toLowerCase(),
                icon: data.weather[0].icon,
                coordinates: { lat, lon }
            }
        } catch (error) {
            console.error('Weather by coords error:', error.message)
            return this.getMockWeatherData('Unknown Location')
        }
    }

    // Mock weather data for demo/fallback
    getMockWeatherData(city) {
        const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy']
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
        const temperature = Math.floor(Math.random() * 30) + 5 // 5-35°C

        return {
            city,
            country: 'Demo',
            temperature,
            feelsLike: temperature + Math.floor(Math.random() * 6) - 3,
            humidity: Math.floor(Math.random() * 40) + 30,
            pressure: Math.floor(Math.random() * 50) + 1000,
            visibility: Math.floor(Math.random() * 15) + 5,
            windSpeed: Math.floor(Math.random() * 20),
            windDirection: Math.floor(Math.random() * 360),
            description: this.getWeatherDescription(randomCondition),
            main: randomCondition,
            icon: this.getWeatherIcon(randomCondition),
            sunrise: '06:30',
            sunset: '18:45',
            isMock: true
        }
    }

    // Mock forecast data
    getMockForecastData(city, days) {
        const forecast = []
        const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy']
        const dayNames = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

        for (let i = 0; i < days; i++) {
            const condition = conditions[Math.floor(Math.random() * conditions.length)]
            const high = Math.floor(Math.random() * 15) + 15
            const low = high - Math.floor(Math.random() * 10) - 5

            forecast.push({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toDateString(),
                day: dayNames[i] || new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                high,
                low,
                main: condition,
                description: this.getWeatherDescription(condition),
                precipitation: Math.floor(Math.random() * 100),
                icon: this.getWeatherIcon(condition),
                isMock: true
            })
        }

        return forecast
    }

    // Helper method to get weather description
    getWeatherDescription(condition) {
        const descriptions = {
            sunny: 'Clear sky',
            cloudy: 'Overcast',
            rainy: 'Light rain',
            'partly-cloudy': 'Partly cloudy'
        }
        return descriptions[condition] || 'Unknown'
    }

    // Helper method to get weather icon
    getWeatherIcon(condition) {
        const icons = {
            sunny: '01d',
            cloudy: '04d',
            rainy: '10d',
            'partly-cloudy': '02d'
        }
        return icons[condition] || '01d'
    }

    // Parse weather command
    parseWeatherCommand(command) {
        const lowerCommand = command.toLowerCase()
        
        // Extract city name if mentioned
        const cityPatterns = [
            /weather in (.+?)(?:\s|$)/i,
            /weather for (.+?)(?:\s|$)/i,
            /weather at (.+?)(?:\s|$)/i,
            /(.+?) weather/i
        ]

        for (const pattern of cityPatterns) {
            const match = command.match(pattern)
            if (match && match[1]) {
                return {
                    city: match[1].trim(),
                    type: lowerCommand.includes('forecast') ? 'forecast' : 'current'
                }
            }
        }

        return {
            city: 'New York', // Default city
            type: lowerCommand.includes('forecast') ? 'forecast' : 'current'
        }
    }
}

export default new WeatherService()
