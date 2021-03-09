import { app, errorHandler } from 'mu';
import { SERVICE_NAME } from './env';
import { CaseNumberGenerator } from './lib/case-number-generator';

const generator = new CaseNumberGenerator();

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
    const numbers = await generator.generate({prefix, amount});
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

app.use(errorHandler);