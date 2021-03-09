import { CASE_NUMBER_ID_LENGTH, CASE_NUMBER_MAX_RETRY, CASE_NUMBER_PREDICATE } from '../env';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import crypto from 'crypto';

export class CaseNumberGenerator {

  async generate({prefix, amount}) {
    const numbers = [];
    while (amount > 0) {
      amount--;
      numbers.push((await generate({prefix})));
    }
    return numbers;
  }
}

/* PRIVATE FUNCTIONS */

async function generate({prefix = '', attempt = 1} = {}) {
  if (attempt > CASE_NUMBER_MAX_RETRY)
    throw 'Couldn\'t find a unique case-number, try again later ...';
  const byteLength = Math.ceil((CASE_NUMBER_ID_LENGTH / 2));
  const id = crypto.randomBytes(byteLength).toString('hex').toUpperCase().substring(0, CASE_NUMBER_ID_LENGTH);
  let number = `${prefix}${id}`;
  if (!(await isUnique(number))) {
    attempt++;
    number = generate({prefix, attempt});
  }
  return number;
}

async function isUnique(number) {
  let response = null;
  try {
    response = await query(`SELECT ?s 
WHERE {
    GRAPH ?g {
        ?s <${CASE_NUMBER_PREDICATE}> """${number}""" .
    }
}`);
  } catch (e) {
    console.warn(e);
    throw 'Couldn\'t check the uniqueness of the generated case-number, try again later ...';
  }
  return response && response.results && response.results.bindings.length <= 0;
}