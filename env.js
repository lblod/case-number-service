/**
 * JS file containing all env. and env. derived variables.
 */

export const SERVICE_NAME = process.env.SERVICE_NAME || 'case-number-service';
export const SERVICE_URI = `http://data.lblod.info/services/${SERVICE_NAME}`;

export const CASE_NUMBER_ID_LENGTH = Number(process.env.CASE_NUMBER_ID_LENGTH) || 6;
export const CASE_NUMBER_PREDICATE = process.env.CASE_NUMBER_PREDICATE || 'http://www.semanticdesktop.org/ontologies/2007/01/19/nie#identifier';
export const CASE_NUMBER_MAX_RETRY = Number(process.env.CASE_NUMBER_MAX_RETRY) || 150;

export const COMMON_GRAPHS = {
  application: 'http://mu.semte.ch/application',
  public: 'http://mu.semte.ch/graphs/public',
};
