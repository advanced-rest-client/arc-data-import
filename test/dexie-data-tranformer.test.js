import { assert } from '@open-wc/testing';
import { DataTestHelper } from './test-helper.js';
import { ArcDexieTransformer } from '../transformers/arc-dexie-transformer.js';

suite('ArcDexieTransformer', function() {
  suite('Dexie export', function() {
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('dexie-data-export.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        const transformer = new ArcDexieTransformer(jsonData);
        return transformer.transform();
      })
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
      assert.typeOf(result.history, 'array');
    });

    test('Projects contains 2 entries', function() {
      assert.lengthOf(result.projects, 2);
    });

    test('History is empty', function() {
      assert.lengthOf(result.history, 0);
    });

    test('Requests contains 6 entries', function() {
      assert.lengthOf(result.requests, 6);
    });

    test('Request objects are valid', function() {
      DataTestHelper.assertRequestObject(result.requests[0]);
      DataTestHelper.assertRequestObject(result.requests[3]);
      DataTestHelper.assertRequestObject(result.requests[5]);
    });

    test('Request values are set', function() {
      let request = result.requests[0];
      assert.equal(request.url, 'hrttp://localhost:8080/url2');
      assert.equal(request.method, 'GET');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506365775233);
      assert.equal(request.name, 'test-request');
      assert.equal(request.type, 'saved');

      request = result.requests[3];
      assert.equal(request.url, 'http://onet.pl/test');
      assert.equal(request.method, 'GET');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506365939968);
      assert.equal(request.name, 'Other endpoint');
      assert.equal(request.type, 'saved');

      request = result.requests[5];
      assert.equal(request.url, 'http://second-project.com');
      assert.equal(request.method, 'PUT');
      assert.equal(request.headers, 'x-test: headers');
      assert.equal(request.payload, 'test-payload');
      assert.equal(request.created, 1506367353657);
      assert.equal(request.name, 'second-project-request');
      assert.equal(request.type, 'saved');
    });

    test('Projects object is valid', function() {
      DataTestHelper.assertProjectObject(result.projects[0]);
      DataTestHelper.assertProjectObject(result.projects[1]);
    });

    test('Project values are set', function() {
      let project = result.projects[0];
      assert.equal(project.name, 'Project name', 'name is set');
      assert.equal(project.created, 1506365878724, 'created is set');
      assert.strictEqual(project.order, 0, 'order is set');

      project = result.projects[1];
      assert.equal(project.name, 'second-project', 'name is set');
      assert.equal(project.created, 1506367353678, 'created is set');
      assert.strictEqual(project.order, 0, 'order is set');
    });

    test('Associate requests with porojects', function() {
      assert.isUndefined(result.requests[0].projects);
      assert.isUndefined(result.requests[1].projects);
      assert.typeOf(result.requests[2].projects[0], 'string');
      assert.typeOf(result.requests[3].projects[0], 'string');
      assert.typeOf(result.requests[4].projects[0], 'string');
      assert.typeOf(result.requests[5].projects[0], 'string');
    });

    test('Project ID is set correctly', function() {
      const p1id = result.projects[0]._id;
      const p2id = result.projects[1]._id;
      assert.equal(result.requests[2].projects[0], p1id);
      assert.equal(result.requests[3].projects[0], p1id);
      assert.equal(result.requests[4].projects[0], p1id);
      assert.equal(result.requests[5].projects[0], p2id);
    });

    test('Project has request reference', () => {
      const p1 = result.projects[0];
      const p2 = result.projects[1];
      assert.typeOf(p1.requests, 'array');
      assert.lengthOf(p1.requests, 4);
      assert.typeOf(p2.requests, 'array');
      assert.lengthOf(p2.requests, 1);
    });
  });

  suite('Dexie history', function() {
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('dexie-history-export.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        const transformer = new ArcDexieTransformer(jsonData);
        return transformer.transform();
      })
      .then((data) => result = data);
    });

    test('Normalizes the data', function() {
      assert.typeOf(result, 'object');
    });

    test('History contains 4 entries', function() {
      assert.lengthOf(result.history, 4);
    });

    test('History objects are valid', function() {
      DataTestHelper.assertHistoryObject(result.history[0]);
      DataTestHelper.assertHistoryObject(result.history[1]);
      DataTestHelper.assertHistoryObject(result.history[2]);
      DataTestHelper.assertHistoryObject(result.history[3]);
    });

    test('Request values are set', function() {
      let request = result.history[0];
      assert.equal(request.url, 'http://wp.pl');
      assert.equal(request.method, 'GET');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506366584358);

      request = result.history[2];
      assert.equal(request.url, 'http://google.com');
      assert.equal(request.method, 'PUT');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506365841855);
    });
  });

  suite('Dexie saved export', function() {
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('dexie-saved-export.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        const transformer = new ArcDexieTransformer(jsonData);
        return transformer.transform();
      })
      .then((data) => result = data);
    });

    test('Requests contains 2 entries', function() {
      assert.lengthOf(result.requests, 2);
    });

    test('Request objects are valid', function() {
      DataTestHelper.assertRequestObject(result.requests[0]);
      DataTestHelper.assertRequestObject(result.requests[1]);
    });

    test('Request values are set', function() {
      let request = result.requests[0];
      assert.equal(request.url, 'hrttp://localhost:8080/url2');
      assert.equal(request.method, 'GET');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506365775233);
      assert.equal(request.name, 'Request in project');
      assert.equal(request.type, 'saved');

      request = result.requests[1];
      assert.equal(request.url, 'http://google.com');
      assert.equal(request.method, 'GET');
      assert.equal(request.headers, '');
      assert.equal(request.payload, '');
      assert.equal(request.created, 1506365826194);
      assert.equal(request.name, 'Regular request');
      assert.equal(request.type, 'saved');
    });
  });
});
