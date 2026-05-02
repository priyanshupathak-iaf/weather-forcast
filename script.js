const apiKey = "98f6eb50a6fd7d08bf10c9334c995d0a"; // 🔑 Replace this

const input = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");

/* 🌗 Theme Toggle */
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

/* 🔍 City Auto Suggestions */
input.addEventListener("input", async () => {
  const query = input.value.trim();

  if (query.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(city => {
      const div = document.createElement("div");
      div.innerText = `${city.name}, ${city.country}`;

      div.onclick = () => {
        input.value = city.name;
        suggestions.innerHTML = "";
      };

      suggestions.appendChild(div);
    });

  } catch (err) {
    console.log("Suggestion error");
  }
});

/* 🌍 Get Weather */
async function getWeather() {
  const city = input.value.trim();

  if (!city) {
    alert("Please enter a city");
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== "200") {
      alert("City not found");
      return;
    }

    // Current weather (first item)
    const current = data.list[0];

    document.getElementById("cityName").innerText = data.city.name;
    document.getElementById("temp").innerText = Math.round(current.main.temp) + "°C";
    document.getElementById("desc").innerText = current.weather[0].description;

    showForecast(data.list);

  } catch (error) {
    alert("Error fetching weather data");
    console.log(error);
  }
}

/* 📅 5-Day Forecast */
function showForecast(list) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";

  // Pick one data point per day (12:00)
  const dailyData = list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <p>${date}</p>
      <p>${Math.round(day.main.temp)}°C</p>
      <p>${day.weather[0].main}</p>
    `;

    container.appendChild(card);
  });
}