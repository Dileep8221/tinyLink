// app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const apiLinksRouter = require('./src/routes/apiLinks');
const webRouter = require('./src/routes/web');
const engine = require('ejs-mate');
const app = express();

// Middlewares
app.engine('ejs', engine);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'src/public')));



// Basic rate limit on link creation (optional bonus)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '30'),
  standardHeaders: true,
  legacyHeaders: false,
});

// healthz
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});


app.use('/api/links', limiter);

// Routes
app.use('/api/links', apiLinksRouter);
app.use('/', webRouter);


module.exports = app;
