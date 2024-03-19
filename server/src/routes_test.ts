import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, list, load, resetFilesForTesting, saveScore, listScores } from './routes';


describe('routes', function() {

  // TODO: add tests for your routes
  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {deck: "some stuff"});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {exists: true});

    //Fourth branch, testing duplicate name
    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: "some stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {exists: true});

    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: "some stuff"}});
    const res6 = httpMocks.createResponse();
    save(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {exists: true});


    resetFilesForTesting();
  });



  it('load', function() {
  // 1 test for the 404 error code subdomain
    const saveReq5 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp5 = httpMocks.createResponse();
    save(saveReq5, saveResp5);

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: "random"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);

    assert.strictEqual(loadRes5._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes5._getData(), 'input a valid saved file');
    //2 tests for the 400 error code subdomain
    //Testing when name is not a string
    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp3 = httpMocks.createResponse();
    save(saveReq3, saveResp3);

    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: undefined}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);

    assert.strictEqual(loadRes3._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes3._getData(), 'required argument "name" was missing');

    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp4 = httpMocks.createResponse();
    save(saveReq4, saveResp4);

    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: undefined});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);

    assert.strictEqual(loadRes4._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes4._getData(), 'required argument "name" was missing');

    //2 tests for the 200 status code subdomain
    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);

    const loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: "key"}});
    const loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);

    assert.strictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {value: "file value"});

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: "key"}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);

    assert.strictEqual(loadRes2._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes2._getData(), {value: "file value"});


    resetFilesForTesting();
  });



  it('list', function() {
    // Empty case
    const listReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'});
    const listRes = httpMocks.createResponse();
    list(listReq, listRes);

    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {saved: []});

    // 1 file case
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const listReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'});
    const listRes2 = httpMocks.createResponse();
    list(listReq2, listRes2);

    assert.strictEqual(listRes2._getStatusCode(), 200);
    assert.deepStrictEqual(listRes2._getData(), {saved: ["key"]});

    //Multiple files case
    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key2", value: "file value"}});
    const saveResp3 = httpMocks.createResponse();
    save(saveReq3, saveResp3);

    const listReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'});
    const listRes3 = httpMocks.createResponse();
    list(listReq3, listRes3);

    assert.strictEqual(listRes3._getStatusCode(), 200);
    assert.deepStrictEqual(listRes3._getData(), {saved: ["key", "key2"]});

    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key3", value: "file value"}});
    const saveResp4 = httpMocks.createResponse();
    save(saveReq4, saveResp4);

    const listReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'});
    const listRes4 = httpMocks.createResponse();
    list(listReq4, listRes4);

    assert.strictEqual(listRes4._getStatusCode(), 200);
    assert.deepStrictEqual(listRes4._getData(), {saved: ["key", "key2", "key3"]});
  });




  it('saveScore', function() {

    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {}});
    const res1 = httpMocks.createResponse();
    saveScore(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "value" was missing');

    // Second branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/api/saveScore',
        body: {value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    saveScore(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {saved: "some stuff"});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/saveScore',
        body: {value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    saveScore(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: "different stuff"});


    resetFilesForTesting();
  });



  it('listScore', function() {
    // Empty case
    const listReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScore'});
    const listRes = httpMocks.createResponse();
    listScores(listReq, listRes);

    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {scores: []});

    // 1 file case
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/saveScore',
        body: {value: "file1"}});
    const saveResp2 = httpMocks.createResponse();
    saveScore(saveReq2, saveResp2);

    const listReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScore'});
    const listRes2 = httpMocks.createResponse();
    listScores(listReq2, listRes2);

    assert.strictEqual(listRes2._getStatusCode(), 200);
    assert.deepStrictEqual(listRes2._getData(), {scores: ["file1"]});

    //Multiple files case
    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/saveScore',
        body: {value: "file2"}});
    const saveResp3 = httpMocks.createResponse();
    saveScore(saveReq3, saveResp3);

    const listReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScore'});
    const listRes3 = httpMocks.createResponse();
    listScores(listReq3, listRes3);

    assert.strictEqual(listRes3._getStatusCode(), 200);
    assert.deepStrictEqual(listRes3._getData(), {scores: ["file1", "file2"]});

    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/saveScore',
        body: {value: "file3"}});
    const saveResp4 = httpMocks.createResponse();
    saveScore(saveReq4, saveResp4);

    const listReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScore'});
    const listRes4 = httpMocks.createResponse();
    listScores(listReq4, listRes4);

    assert.strictEqual(listRes4._getStatusCode(), 200);
    assert.deepStrictEqual(listRes4._getData(), {scores: ["file1", "file2", "file3"]});
  });
});

