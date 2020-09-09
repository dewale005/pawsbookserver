const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const connect = () => mongoose.connect(process.env.MONGO_DB_URL_LOCAL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

module.exports = connect;