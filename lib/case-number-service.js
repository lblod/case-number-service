import {
  CASE_NUMBER_ID_LENGTH,
  CASE_NUMBER_MAX_RETRY,
  CASE_NUMBER_PREDICATE,
  COMMON_GRAPHS
} from '../env';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import { update, sparqlEscapeString, sparqlEscapeUri } from 'mu';
import crypto from 'crypto';

export class CaseNumberService {

  /**
   * Generates a set amount of case-numbers enhanced with the provided prefix.
   *
   * @param prefix
   * @param amount
   *
   * @returns {Promise<[string]>}
   */
  async generate({prefix, amount}) {
    if(amount > 500)
      throw 'Amount off numbers to generate can not be higher then 500'
    const numbers = [];
    while (amount > 0) {
      amount--;
      numbers.push((await generate({prefix})));
    }
    return numbers;
  }

  /**
   * Locks a given set off numbers onto the given node .
   *
   * @param numbers
   * @param node
   *
   * @returns {Promise<[string]>}
   */
  async lock(numbers, {node}) {
    if(numbers.length > 500)
      throw 'Amount off numbers to lock can not be higher then 500'
    const unique_numbers = numbers.filter(number => isUnique(number));
    await update(`INSERT DATA {
    GRAPH <${COMMON_GRAPHS.application}> {
      ${unique_numbers.map(number =>
        `${sparqlEscapeUri(node)} ${sparqlEscapeUri(CASE_NUMBER_PREDICATE)} ${sparqlEscapeString(number)} .`
      ).join('\n')}
    }
}`);
    return unique_numbers;
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
    ?s ${sparqlEscapeUri(CASE_NUMBER_PREDICATE)} ${sparqlEscapeString(number)} .
  }
}`);
  } catch (e) {
    console.warn(e);
    throw 'Couldn\'t check the uniqueness of the generated case-number, is the database running?';
  }
  return response && response.results && response.results.bindings.length <= 0;
}
