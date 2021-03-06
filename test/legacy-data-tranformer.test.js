import { assert } from '@open-wc/testing';
import { DataTestHelper } from './test-helper.js';
import { ArcLegacyTransformer } from '../transformers/arc-legacy-transformer.js';
suite('Single request import', function() {
  let jsonData;
  let result;
  suiteSetup(function() {
    return DataTestHelper.getFile('legacy-request-import.json')
    .then((response) => {
      jsonData = JSON.parse(response);
    });
  });
  setup(function() {
    const transformer = new ArcLegacyTransformer(jsonData);
    return transformer.transform()
    .then((data) => result = data);
  });

  test('Normalizes the data', function() {
    assert.typeOf(result, 'object');
  });

  test('Contains export object properties', function() {
    assert.typeOf(result.createdAt, 'string');
    assert.equal(result.version, 'unknown');
    assert.equal(result.kind, 'ARC#Import');
    assert.typeOf(result.projects, 'array');
    assert.typeOf(result.requests, 'array');
  });

  test('Projects is empty', function() {
    assert.lengthOf(result.projects, 0);
  });

  test('Requests contains a single entry', function() {
    assert.lengthOf(result.requests, 1);
  });

  test('Request object is valid', function() {
    DataTestHelper.assertRequestObject(result.requests[0]);
  });

  test('Default name is set', function() {
    assert.equal(result.requests[0].name, 'unnamed');
  });

  test('Request values are set', function() {
    const request = result.requests[0];
    assert.equal(request.url, 'http://mulesoft.com');
    assert.equal(request.method, 'GET');
    assert.equal(request.headers, '');
    assert.equal(request.payload, '');
    assert.equal(request.created, 1450675637093);
  });

  test('Google Drive information is present', function() {
    const request = result.requests[0];
    assert.equal(request.driveId, '0Bzpy9PK_RiBOeWRYUEo0TmRyTzA');
  });
});

suite('Multiple requests import', function() {
  let jsonData;
  let result;
  suiteSetup(function() {
    return DataTestHelper.getFile('legacy-data-import.json')
    .then((response) => {
      jsonData = JSON.parse(response);
    });
  });
  setup(function() {
    const transformer = new ArcLegacyTransformer(jsonData);
    return transformer.transform()
    .then((data) => result = data);
  });

  test('Normalizes the data', function() {
    assert.typeOf(result, 'object');
  });

  test('Contains export object properties', function() {
    assert.typeOf(result.createdAt, 'string');
    assert.equal(result.version, 'unknown');
    assert.equal(result.kind, 'ARC#Import');
    assert.typeOf(result.projects, 'array');
    assert.typeOf(result.requests, 'array');
  });

  test('Projects contains an item', function() {
    assert.lengthOf(result.projects, 1);
  });

  test('Requests contains 2 entries', function() {
    assert.lengthOf(result.requests, 2);
  });

  test('Requests objects are valid', function() {
    DataTestHelper.assertRequestObject(result.requests[0]);
    DataTestHelper.assertRequestObject(result.requests[1]);
  });

  test('Projects object is valid', function() {
    DataTestHelper.assertProjectObject(result.projects[0]);
  });

  test('Project values are set', function() {
    const project = result.projects[0];
    assert.equal(project.name, 'test-project', 'name is set');
    assert.equal(project.created, 1506285256547, 'created is set');
    assert.strictEqual(project.order, 0, 'order is set');
  });

  test('Project information is set on the request', function() {
    assert.equal(result.requests[0].projects[0], result.projects[0]._id,
      'Project ID is set');
    assert.isUndefined(result.requests[1].projects, 'Project id is undefined');
  });

  test('Project has request reference', () => {
    const project = result.projects[0];
    assert.typeOf(project.requests, 'array');
    assert.lengthOf(project.requests, 1);
  });
});
