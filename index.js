const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Cache setup
const cache = new NodeCache({ stdTTL: 3600 }); // Cache results for 1 hour

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per window
});

app.use(limiter);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Currency Exchange API',
      version: '1.0.0',
      description: 'API for Currency Exchange',
    },
  },
  apis: ['index.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/exchange:
 *   post:
 *     summary: Convert currency to multiple target currencies
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - source
 *             - targets
 *           properties:
 *             source:
 *               type: string
 *             targets:
 *               type: array
 *               items:
 *                 type: string
 *             date:
 *               type: string
 *               description: Date in yyyy-mm-dd format (optional)
 *     responses:
 *       200:
 *         description: Conversion rates for multiple currencies
 */
app.post('/api/exchange', async (req, res) => {
  const { source, targets, date } = req.body;
  const cacheKey = `${source}_${Array.isArray(targets) ? targets.join('_') : ''}_${date || 'latest'}`;

  if (!source || !targets || !Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ error: 'Invalid input: source and targets are required.' });
  }

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.post(
      'https://api.apyhub.com/data/convert/currency/multiple',
      { source, targets, date },
      { headers: { 'apy-token': process.env.APY_TOKEN } }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Unexpected error occurred';
    res.status(statusCode).json({ error: errorMessage });
  }
});

const server = app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = server; 
