import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check



// Keeps track of saved files.
const decks: Map<string, unknown> = new Map<string, unknown>();
const scores: unknown[] = [];

/** Handles request for /save by storing the given deck. 
* @param req the request
* @param res the response
*/
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }


  if (decks.get(name) === undefined){
    decks.set(name, value);
    res.send({deck: value});
  }
  else{
    res.send({exists:true})
  }

}

/** Handles request for /saveScore by storing the given score. 
* @param req the request
* @param res the response
*/
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  
  scores.push(value);
  res.send({saved: value});

}

/** Handles request for /load by returning the deck requested. 
* @param req the request
* @param res the response
*/
export const load = (req: SafeRequest, res: SafeResponse): void => {

  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  const deck = decks.get(name);
  if (deck === undefined){
    res.status(404).send('input a valid saved file');
    return;
  }
  res.send({value: deck});

}

/** Used in tests to set the files map back to empty. */
export const resetFilesForTesting = (): void => {
  decks.clear();
  scores.splice(0, scores.length);
};

/** Returns a list of all the named save decks.
* @param _req the request
* @param res the response
*/
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  let deck:string[] = Array.from(decks.keys());
  res.send({saved: deck});
};

/** Returns a list of all the saved scores. 
* @param _req the request
* @param res the response
*/
export const listScores = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({scores: scores});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
