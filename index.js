const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
// models must be defined before passport is set up
require('./models/User');
// requiring passport to set it up; nothing is exported from it
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000
// environment variables injected by Heroku if deployed
app.listen(PORT);

