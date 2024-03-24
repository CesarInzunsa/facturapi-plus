const NodeGeocoder = require("node-geocoder");
const CONFIG = require('../../config/config');
const {v4: uuidv4} = require('uuid');

function generateId() {
    return uuidv4().replace(/-/g, "").substring(0, 24);
}

// Función para obtener ciudad, municipio, estado y país a partir de un código postal
async function getDataFromZip(zipcode) {
    const options = {
        provider: 'google',
        apiKey: CONFIG.GOOGLE_MAPS_KEY,
    };
    const geocoder = NodeGeocoder(options);
    try {
        const res = await geocoder.geocode(zipcode);
        const data = res[0];
        const location = {
            city: data.city,
            municipality: data.city,
            state: data.administrativeLevels.level1long,
            country: data.country
        };
        return location;
    } catch (err) {
        console.log(`error ${err}`);
        return null;
    }
}

module.exports = {
    generateId,
    getDataFromZip
}