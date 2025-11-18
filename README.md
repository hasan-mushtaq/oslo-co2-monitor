# Oslo CO2 Monitor

A beautiful, real-time CO2 monitoring dashboard for Oslo, Norway.

![Oslo CO2 Monitor](https://img.shields.io/badge/status-active-success)

## Features

- 🌍 Real-time CO2 data for Oslo
- 📊 Interactive charts with Chart.js
- 🕐 24-hour and 7-day historical views
- 🎨 Premium dark mode design with glassmorphism
- 📱 Responsive layout

## Data Source

This project uses the [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) to fetch CO2 data for Oslo (Lat: 59.91, Lon: 10.75).

## Setup

1. Clone the repository:
```bash
git clone https://github.com/hasan-mushtaq/oslo-co2-monitor.git
cd oslo-co2-monitor
```

2. Serve the files locally:
```bash
python3 -m http.server 8000
```

3. Open your browser to `http://localhost:8000`

## Project Structure

```
.
├── index.html      # Main HTML structure
├── style.css       # Premium styling with glassmorphism
├── api.js          # API integration with Open-Meteo
├── main.js         # Application logic and Chart.js
└── README.md       # This file
```

## Technologies

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - ES6 modules
- **Chart.js** - Data visualization
- **Open-Meteo API** - CO2 data source

## Deployment to Cloud Run

### Prerequisites
- Google Cloud account with billing enabled
- `gcloud` CLI installed and configured

### Deploy Steps

1. Build and deploy to Cloud Run:
```bash
gcloud run deploy oslo-co2-monitor \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

2. The service will be deployed and you'll receive a URL like:
```
https://oslo-co2-monitor-xxxxx-ew.a.run.app
```

### Manual Docker Build (Optional)

If you want to build the Docker image manually:

```bash
# Build the image
docker build -t oslo-co2-monitor .

# Test locally
docker run -p 8080:8080 oslo-co2-monitor

# Tag for Google Container Registry
docker tag oslo-co2-monitor gcr.io/YOUR_PROJECT_ID/oslo-co2-monitor

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/oslo-co2-monitor

# Deploy from GCR
gcloud run deploy oslo-co2-monitor \
  --image gcr.io/YOUR_PROJECT_ID/oslo-co2-monitor \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

## License

MIT
