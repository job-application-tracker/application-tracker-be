const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://127.0.0.1:7891',
      'http://localhost:7891',
      'https://job-application-tracker-dev.netlify.app',
      'https://job-goal-tracker.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/trackers', require('./controllers/trackers'));
app.use('/api/v1/achievements', require('./controllers/achievements'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
