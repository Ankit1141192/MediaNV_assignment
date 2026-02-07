const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const candidateRoutes = require('./routes/candidateRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/candidates', candidateRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
