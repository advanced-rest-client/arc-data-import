import { assert } from '@open-wc/testing';
import { DataTestHelper } from '../test-helper.js';
import { PostmanBackupTransformer } from '../../transformers/postman-backup-transformer.js';
suite('Postman backup transformer', function() {
  let jsonData;
  let result;
  suiteSetup(function() {
    return DataTestHelper.getFile('postman/postman-data.json')
    .then((response) => {
      jsonData = JSON.parse(response);
    });
  });

  setup(function() {
    const transformer = new PostmanBackupTransformer(jsonData);
    return transformer.transform()
    .then((data) => result = data);
  });

  test('Normalizes the data', function() {
    assert.typeOf(result, 'object');
  });

  test('Contains export object properties', function() {
    assert.typeOf(result.createdAt, 'string');
    assert.equal(result.version, 'postman-backup');
    assert.equal(result.kind, 'ARC#Import');
    assert.typeOf(result.projects, 'array');
    assert.typeOf(result.requests, 'array');
    assert.typeOf(result.variables, 'array');
    assert.typeOf(result['headers-sets'], 'array');
  });

  test('Data are accounted for', function() {
    assert.lengthOf(result.projects, 2);
    assert.lengthOf(result.requests, 46);
    assert.lengthOf(result.variables, 5);
    assert.lengthOf(result['headers-sets'], 1);
  });

  test('Request objects are valid', function() {
    for (let i = 0; i < result.requests.length; i++) {
      DataTestHelper.assertRequestObject(result.requests[i]);
    }
  });

  test('Project data is set', function() {
    for (let i = 0; i < result.requests.length; i++) {
      assert.typeOf(result.requests[i].projects, 'array');
    }
  });

  function findProject(projects, projectId) {
    return projects.find((item) => item._id === projectId);
  }

  test('Project exists in the projects list', function() {
    for (let i = 0; i < result.requests.length; i++) {
      const id = result.requests[i].projects[0];
      const project = findProject(result.projects, id);
      assert.ok(project);
    }
  });

  test('Projects have request data', function() {
    const project = result.projects[0];
    assert.typeOf(project.requests, 'array');
    assert.lengthOf(project.requests, 9);
  });

  test('Project objects are valid', function() {
    DataTestHelper.assertProjectObject(result.projects[0]);
    DataTestHelper.assertProjectObject(result.projects[1]);
  });

  test('headers-sets object has the `_id` property', function() {
    assert.typeOf(result['headers-sets'][0]._id, 'string');
  });

  test('headers-sets values are set', function() {
    const value = result['headers-sets'][0];
    assert.strictEqual(value.headers, 'x-key: value\nother-key: other value');
    assert.strictEqual(value.name, 'headers-preset');
  });

  test('Variables are computed', function() {
    assert.equal(result.variables[3].value, 'test ${host}', 'Variable is transformed');
    assert.equal(result.requests[5].headers,
      'Content-Type: application/json\nx-var: ${var}',
      'Header is transformed');
    assert.equal(result.requests[5].url,
      'https://httpbin.org/anything/${param}',
      'URL is transformed');

    assert.equal(result.requests[2].multipart[0].value, '${bodyValue}', 'multipart is transformed');
    assert.equal(result.requests[3].payload,
      'url encoded key=url encoded value&other key=${otherValue}',
      'payload url encoded is transformed');
  });
});
