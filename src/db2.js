const MongoClient = require('mongodb').MongoClient;

// set up mongoDB connection
// Example URI ---> mongodb+srv://weblab:6jYctMizX5Y5ie6W@catbook-fsjig.mongodb.net?retryWrites=true
const mongoURL = 'mongodb+srv://weblab:6jYctMizX5Y5ie6W@catbook-fsjig.mongodb.net?retryWrites=true';

const client = new MongoClient(mongoURL);

let _db;
module.exports = {
	init: () => {
		return client.connect()
      .then(() => {
				// connect to the db with this name
				_db = client.db('catbook-native');
                console.log("Connected to mongodb!");
				return _db;
			})
      .catch(err => {
				console.log("Failed to connect to mongodb");
				console.log(err);
			});
	},

	// Return a reference to the database
	getDb: () => _db
}
