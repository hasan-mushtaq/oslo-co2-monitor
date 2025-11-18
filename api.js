const API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const LAT = 59.91;
const LON = 10.75;

export async function fetchCO2Data(pastDays = 0) {
    try {
        let url = `${API_URL}?latitude=${LAT}&longitude=${LON}&current=carbon_dioxide&hourly=carbon_dioxide&timezone=auto`;

        if (pastDays > 0) {
            url += `&past_days=${pastDays}&forecast_days=1`;
        } else {
            url += `&forecast_days=1`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch CO2 data:", error);
        return null;
    }
}
