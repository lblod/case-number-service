/**
 * JS file containing all env. and env. derived variables.
 */

export const SERVICE_NAME = process.env.SERVICE_NAME || 'case-number-service';

export const CASE_NUMBER_ID_LENGTH = Number(process.env.CASE_NUMBER_ID_LENGTH) || 6;
export const CASE_NUMBER_PREDICATE = process.env.CASE_NUMBER_PREDICATE || 'http://www.semanticdesktop.org/ontologies/2007/01/19/nie#identifier';
export const CASE_NUMBER_MAX_RETRY = Number(process.env.CASE_NUMBER_MAX_RETRY) || 150;