const weatherIcons = {
0:"https://cdn-icons-png.flaticon.com/512/869/869869.png",
1:"https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
2:"https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
3:"https://cdn-icons-png.flaticon.com/512/414/414825.png",
61:"https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
71:"https://cdn-icons-png.flaticon.com/512/642/642102.png"
}


function detectLocation(){

navigator.geolocation.getCurrentPosition(pos=>{
let lat=pos.coords.latitude
let lon=pos.coords.longitude

loadWeather(lat,lon,"Your Location")

})

}

async function searchCity(){

let city=document.getElementById("cityInput").value

let geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
let geoData=await geo.json()

let lat=geoData.results[0].latitude
let lon=geoData.results[0].longitude

loadWeather(lat,lon,city)

}


async function loadWeather(lat,lon,place){

let url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,visibility,uv_index,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`

let res=await fetch(url)
let data=await res.json()

document.getElementById("location").innerText=place
document.getElementById("temp").innerText=data.current.temperature_2m+"°C"
document.getElementById("humidity").innerText=data.current.relative_humidity_2m+"%"
document.getElementById("pressure").innerText=data.current.pressure_msl+" hPa"
document.getElementById("visibility").innerText=(data.current.visibility/1000).toFixed(1)+" km"
document.getElementById("uv").innerText=data.current.uv_index
document.getElementById("wind").innerText=data.current.wind_speed_10m+" km/h"

let code=data.current.weather_code

document.getElementById("weatherIcon").src=weatherIcons[code] || weatherIcons[1]

generateForecast(data)

}



function generateForecast(data){

let container=document.getElementById("forecastContainer")

container.innerHTML=""

for(let i=0;i<7;i++){

let day=document.createElement("div")
day.className="day"

let date=new Date(data.daily.time[i])
let dayName=date.toLocaleDateString("en",{weekday:"short"})

day.innerHTML=`

<h4>${dayName}</h4>
<img src="${weatherIcons[data.daily.weather_code[i]] || weatherIcons[1]}">
<p>${data.daily.temperature_2m_max[i]}° / ${data.daily.temperature_2m_min[i]}°</p>

`

container.appendChild(day)

}

}


detectLocation()