require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const databaseController = require('./controllers/databaseController');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/create-database', databaseController.createDatabase);
app.post('/api/check-database', databaseController.checkDatabase);
app.post('/api/migrate-database', databaseController.migrateDatabase);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
