const mongoose = require('mongoose');
const env = require('../config/environment');

mongoose.connect(`mongodb://localhost/${env.db}`,{
    family:4
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log('Connected to Database:: MongoDb');
})

module.exports = db;