// 天気予報アプリ

// 天気アイコンのマッピング
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// 日本語の天気説明
const weatherDescriptions = {
    'clear': '晴れ',
    'clouds': '曇り',
    'rain': '雨',
    'drizzle': '霧雨',
    'thunderstorm': '雷雨',
    'snow': '雪',
    'mist': '霧',
    'fog': '霧',
    'haze': '霞'
};

// DOM要素
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');

// 初期表示
showPlaceholder();

// イベントリスナー
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// プレースホルダーを表示
function showPlaceholder() {
    weatherDisplay.innerHTML = `
        <div class="placeholder">
            <div class="icon">🌤️</div>
            <p>都市名を入力して天気を検索してください</p>
        </div>
    `;
}

// 天気を検索
async function searchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('都市名を入力してください');
        return;
    }

    hideError();
    weatherDisplay.innerHTML = '<div class="weather-info"><p style="text-align: center;">読み込み中...</p></div>';

    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
    } catch (error) {
        showError(error.message);
    }
}

// OpenWeatherMap APIから天気データを取得
async function fetchWeatherData(city) {
    // 注：実際に使用するにはAPIキーが必要です
    // https://openweathermap.org/api で無料のAPIキーを取得できます

    const API_KEY = 'YOUR_API_KEY_HERE'; // ここにAPIキーを入れてください
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    // デモ用のモックデータ（APIキーがない場合）
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        return getMockWeatherData(city);
    }

    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&lang=ja&appid=${API_KEY}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('都市が見つかりません');
        } else {
            throw new Error('天気データの取得に失敗しました');
        }
    }

    return await response.json();
}

// モックデータ（デモ用）
function getMockWeatherData(city) {
    const mockData = {
        '東京': {
            name: '東京',
            main: { temp: 22, feels_like: 21, humidity: 65 },
            weather: [{ icon: '01d', description: 'clear sky' }],
            wind: { speed: 3.5 }
        },
        'tokyo': {
            name: 'Tokyo',
            main: { temp: 22, feels_like: 21, humidity: 65 },
            weather: [{ icon: '01d', description: 'clear sky' }],
            wind: { speed: 3.5 }
        },
        'ロンドン': {
            name: 'ロンドン',
            main: { temp: 15, feels_like: 14, humidity: 78 },
            weather: [{ icon: '10d', description: 'rain' }],
            wind: { speed: 5.2 }
        },
        'london': {
            name: 'London',
            main: { temp: 15, feels_like: 14, humidity: 78 },
            weather: [{ icon: '10d', description: 'rain' }],
            wind: { speed: 5.2 }
        },
        'ニューヨーク': {
            name: 'ニューヨーク',
            main: { temp: 18, feels_like: 17, humidity: 55 },
            weather: [{ icon: '02d', description: 'clouds' }],
            wind: { speed: 4.1 }
        },
        'new york': {
            name: 'New York',
            main: { temp: 18, feels_like: 17, humidity: 55 },
            weather: [{ icon: '02d', description: 'clouds' }],
            wind: { speed: 4.1 }
        },
        'パリ': {
            name: 'パリ',
            main: { temp: 16, feels_like: 15, humidity: 70 },
            weather: [{ icon: '03d', description: 'clouds' }],
            wind: { speed: 3.8 }
        },
        'paris': {
            name: 'Paris',
            main: { temp: 16, feels_like: 15, humidity: 70 },
            weather: [{ icon: '03d', description: 'clouds' }],
            wind: { speed: 3.8 }
        }
    };

    const cityLower = city.toLowerCase();
    if (mockData[cityLower]) {
        return mockData[cityLower];
    }

    // デフォルトのモックデータ
    return {
        name: city,
        main: { temp: 20, feels_like: 19, humidity: 60 },
        weather: [{ icon: '01d', description: 'clear sky' }],
        wind: { speed: 3.0 }
    };
}

// 天気を表示
function displayWeather(data) {
    const icon = weatherIcons[data.weather[0].icon] || '🌤️';
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = getJapaneseDescription(data.weather[0].description);

    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <div class="city-name">${data.name}</div>
            <div class="date">${dateStr}</div>
            <div class="weather-icon">${icon}</div>
            <div class="temperature">${temp}°C</div>
            <div class="description">${description}</div>

            <div class="weather-details">
                <div class="weather-detail">
                    <div class="label">体感温度</div>
                    <div class="value">🌡️ ${feelsLike}°C</div>
                </div>
                <div class="weather-detail">
                    <div class="label">湿度</div>
                    <div class="value">💧 ${humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="label">風速</div>
                    <div class="value">💨 ${windSpeed} m/s</div>
                </div>
                <div class="weather-detail">
                    <div class="label">状態</div>
                    <div class="value">${icon} ${description}</div>
                </div>
            </div>
        </div>
    `;
}

// 日本語の天気説明を取得
function getJapaneseDescription(description) {
    const desc = description.toLowerCase();

    for (const [key, value] of Object.entries(weatherDescriptions)) {
        if (desc.includes(key)) {
            return value;
        }
    }

    return description;
}

// エラーを表示
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    weatherDisplay.innerHTML = '';
}

// エラーを非表示
function hideError() {
    errorMessage.style.display = 'none';
}