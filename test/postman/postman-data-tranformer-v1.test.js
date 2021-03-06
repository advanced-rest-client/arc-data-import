import { assert } from '@open-wc/testing';
import { DataTestHelper } from '../test-helper.js';
import { PostmanV1Transformer } from '../../transformers/postman-v1-transformer.js';
suite('postman-v1-transformer (collection)', function() {
  suite('_readProjectInfo()', function() {
    let transformer;
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v1.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      transformer = new PostmanV1Transformer(jsonData);
      result = transformer._readProjectInfo();
    });

    test('Returns an object', function() {
      assert.typeOf(result, 'object');
    });

    test('Contains _id', function() {
      assert.equal(result._id, 'e4638c4e-1a37-9b63-4db3-4ad8c3516706');
    });

    test('name is set', function() {
      assert.equal(result.name, 'TestCollection');
    });

    test('description is set', function() {
      assert.equal(result.description, 'Some description');
    });

    test('created is set', function() {
      assert.equal(result.created, 1518549355798);
    });

    test('updated is set', function() {
      assert.equal(result.updated, 1518549355798);
    });

    test('order is set', function() {
      assert.equal(result.order, 0);
    });
  });

  suite('_computeRequestsInOrder()', function() {
    let transformer;
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v1.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      transformer = new PostmanV1Transformer(jsonData);
      result = transformer._computeRequestsInOrder();
    });

    test('Returns an array', function() {
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 2);
    });

    test('Requests are in order', function() {
      assert.equal(result[0].id, '6995f0d5-4c47-8bbd-de3c-1cd357e6a99d');
      assert.equal(result[1].id, '2246fd9b-169a-7051-c3e2-d2137ab90ede');
    });
  });

  suite('Data processing', function() {
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v1.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      const transformer = new PostmanV1Transformer(jsonData);
      return transformer.transform()
      .then((data) => result = data);
    });

    test('Returns the data', function() {
      assert.typeOf(result, 'object');
    });

    test('Contains export object properties', function() {
      assert.typeOf(result.createdAt, 'string');
      assert.equal(result.version, 'postman-collection-v1');
      assert.equal(result.kind, 'ARC#Import');
      assert.typeOf(result.projects, 'array');
      assert.typeOf(result.requests, 'array');
    });

    test('Data are accounted for', function() {
      assert.lengthOf(result.projects, 1);
      assert.lengthOf(result.requests, 2);
    });

    test('Request objects are valid', function() {
      for (let i = 0; i < result.requests.length; i++) {
        DataTestHelper.assertRequestObject(result.requests[i]);
      }
    });

    test('Project data is set', function() {
      const project = result.projects[0];
      for (let i = 0; i < result.requests.length; i++) {
        assert.equal(result.requests[i].projects[0], project._id);
      }
    });

    test('Projects have request data', function() {
      const project = result.projects[0];
      assert.typeOf(project.requests, 'array');
      assert.lengthOf(project.requests, 2);
    });

    test('Project object is valid', function() {
      DataTestHelper.assertProjectObject(result.projects[0]);
    });

    test('Variables are processed', function() {
      const model = result.requests[0];
      assert.equal(model.url, 'https://domain.com/accounts/${login}');
      assert.equal(model.headers, 'h1: h1v\n//h2: h2v\nh3: ${h3v}');
      const multipart = model.multipart;
      assert.equal(multipart[0].name, '${param}');
      assert.equal(multipart[0].value, '${value}');
      assert.equal(multipart[2].value, '${cloudhubApi}');
    });
  });
});
