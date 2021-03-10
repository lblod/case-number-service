import { app, errorHandler } from 'mu';

import bodyParser from 'body-parser';

import { SERVICE_NAME, SERVICE_URI } from './env';
import { CaseNumberService } from './lib/case-number-service';

const service = new CaseNumberService();

/**
 * Setup and API.
 */

app.use(bodyParser.json({
  type: function(req) {
    return /^application\/json/.test(req.get('content-type'));
  },
}));

/**
 * Hello world (basic is alive).
 */
app.get('/', function(req, res) {
  const message = `Hey there, you have reached ${SERVICE_NAME}! Seems like I\'m doing just fine, have a nice day! :)`;
  res.send(message);
});

/**
 * Generates a set amount of random and unique case-numbers.
 */
app.get('/generate', async function(req, res) {

  const prefix = req.query && req.query.prefix;
  const amount = (req.query && req.query.amount) || 1;

  try {
    const numbers = await service.generate({prefix, amount});
    return res.status(200).set('content-type', 'application/json').send(numbers);
  } catch (e) {
    const response = {
      status: 500,
      message: 'Something unexpected went wrong while trying to generate case-numbers.',
    };
    console.warn(e);
    return res.status(response.status).set('content-type', 'application/json').send(response);
  }
});

/**
 * Generates and locks a set of case-numbers for a given node.
 */
app.post('/generate', async function(req, res) {

  /**
   * TODO: for now the default node doesn't work as it is not saved as a public class.
   */
  const node = (req.query && req.query.node) || SERVICE_URI;
  const prefix = req.query && req.query.prefix;
  const amount = (req.query && req.query.amount) || 1;

  try {
    const numbers = await service.generate({prefix, amount});
    const locked = await service.lock(numbers, {node});
    return res.status(200).set('content-type', 'application/json').send(locked);
  } catch (e) {
    const response = {
      status: 500,
      message: 'Something unexpected went wrong while trying to generate case-numbers.',
    };
    console.warn(e);
    return res.status(response.status).set('content-type', 'application/json').send(response);
  }
});

app.use(errorHandler);