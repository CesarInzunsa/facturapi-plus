const mongoose = require('mongoose');
const config = require('./config');

(async () => {
    try {
        const db = await mongoose.connect(config.MONGO_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
            dbName: config.DATABASE
        });
        console.log('Database is connected to: ', db.connection.name);
    } catch (error) {
        console.log('Error: ', error);
    }
})();