import { fetchCO2Data } from './api.js';

const statusIndicator = document.getElementById('status-indicator');
const co2ValueElement = document.getElementById('co2-value');
const qualityLabel = document.getElementById('quality-label');
const aqiText = document.getElementById('aqi-text');
const lastUpdatedText = document.getElementById('last-updated');
let co2Chart = null;

function getQualityStatus(co2) {
    if (co2 < 600) return { label: 'Excellent', class: 'status-good' };
    if (co2 < 1000) return { label: 'Good', class: 'status-good' };
    if (co2 < 1500) return { label: 'Moderate', class: 'status-moderate' };
    return { label: 'Poor', class: 'status-poor' };
}

function updateUI(data) {
    if (!data || !data.current) return;

    const currentCO2 = Math.round(data.current.carbon_dioxide);
    const status = getQualityStatus(currentCO2);

    // Update Main Display
    co2ValueElement.textContent = currentCO2;
    qualityLabel.textContent = status.label;

    // Update Classes
    statusIndicator.className = 'status-circle'; // Reset
    statusIndicator.classList.add(status.class);

    // Update Details
    aqiText.textContent = data.current.us_aqi ? data.current.us_aqi : "N/A"; // Open-Meteo might not send AQI in this specific call unless requested, checking...
    // Actually we didn't request US AQI in the API call, let's fix that in api.js or just show "N/A" for now. 
    // For this MVP, we focus on CO2.
    aqiText.textContent = "CO2 Focused";

    const time = new Date(data.current.time);
    lastUpdatedText.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update Chart
    updateChart(data.hourly);
}

function updateChart(hourlyData) {
    const ctx = document.getElementById('co2Chart').getContext('2d');

    const labels = hourlyData.time.map(t => {
        const date = new Date(t);
        // If showing more than 24 hours (approx check), show date + time
        if (hourlyData.time.length > 25) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + date.getHours() + ':00';
        }
        return date.getHours() + ':00';
    });
    const values = hourlyData.carbon_dioxide;

    if (co2Chart) {
        co2Chart.destroy();
    }

    co2Chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO2 (ppm)',
                data: values,
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)',
                        maxTicksLimit: 8,
                        maxRotation: 0
                    }
                },
                y: {
                    display: false,
                    grid: { display: false }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

async function loadData(pastDays = 0) {
    const data = await fetchCO2Data(pastDays);
    if (data) {
        updateUI(data);
    }
}

function setupControls() {
    const buttons = document.querySelectorAll('.time-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');

            const days = parseInt(e.target.dataset.days);
            // If days is 1, we pass 0 to pastDays (default view), or actually 1? 
            // Open-Meteo: past_days=1 gives yesterday + today. 
            // Let's interpret "24 Hours" as just forecast_days=1 (default) or past_days=0?
            // The user asked for "Last Week".
            // If days=1, we want the default view (today). pastDays=0.
            // If days=7, we want last week. pastDays=7.

            const pastDays = days === 1 ? 0 : 7;
            loadData(pastDays);
        });
    });
}

async function init() {
    setupControls();
    loadData(0);
}

// Refresh every 15 minutes
init();
setInterval(() => loadData(0), 15 * 60 * 1000);
