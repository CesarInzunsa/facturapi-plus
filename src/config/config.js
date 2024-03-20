const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DATABASE: process.env.DATABASE,
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
}