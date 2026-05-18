import fs from "fs";
import path from "path";

// FONCTION 1 : Traduction des codes météo

function getWeatherDescription(code) {
  const descriptions = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Chute de neige légère",
    73: "Chute de neige modérée",
    75: "Chute de neige forte",
    80: "Averses de pluie légères",
    81: "Averses de pluie modérées",
    82: "Averses de pluie violentes",
    95: "Orage",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle forte",
  };
  return descriptions[code] || "Météo inconnue";
}

// FONCTION 2 : Gestion des icônes jour/nuit

function getIconName(weatherCode, isDay) {
  const dayNight = isDay === 1 ? "d" : "n";

  const iconMapping = {
    0: "01",
    1: "02",
    2: "03",
    3: "04",
    45: "50",
    48: "50",
    51: "09",
    53: "09",
    55: "09",
    61: "10",
    63: "10",
    65: "10",
    71: "13",
    73: "13",
    75: "13",
    80: "09",
    81: "09",
    82: "09",
    95: "11",
    96: "11",
    99: "11",
  };

  const iconCode = iconMapping[weatherCode] || "01";
  return `${iconCode}${dayNight}`;
}

// FONCTION PRINCIPALE : API Route Handler

export default async function handler(req, res) {
  try {
    // LIRE LE FICHIER config.json
    const configPath = path.join(process.cwd(), "config.json");
    const configFile = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configFile);

    // EXTRAIRE LES DONNÉES
    const { latitude, longitude, name } = config.city;

    // APPELER L'API OPEN-METEO
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;

    const getWeatherData = await fetch(url);
    const data = await getWeatherData.json();

    // TRANSFORMER LES DONNÉES
    const currentTime = Math.floor(Date.now() / 1000);

    const response = {
      name: name,
      coord: {
        lon: longitude,
        lat: latitude,
      },
      sys: {
        country: "FR",
        sunrise: currentTime - 3600,
        sunset: currentTime + 32400,
      },
      weather: [
        {
          id: data.current.weather_code,
          main: getWeatherDescription(data.current.weather_code),
          description: getWeatherDescription(data.current.weather_code),
          icon: getIconName(data.current.weather_code, data.current.is_day),
        },
      ],
      main: {
        temp: data.current.temperature_2m,
        feels_like: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        pressure: 1013,
        temp_min: data.current.temperature_2m - 2,
        temp_max: data.current.temperature_2m + 2,
      },
      wind: {
        speed: data.current.wind_speed_10m,
        deg: 0,
      },
      visibility: 10000,
      dt: currentTime,
      //timezone: 3600 heure d'hiver
      timezone: 7200, //heure d'été
      id: 0,
      cod: 200,
    };

    // 5️⃣ RENVOYER LES DONNÉES
    res.status(200).json(response);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({
      error: "Impossible de récupérer la météo",
      message: error.message,
    });
  }
}
