import { assert } from '@open-wc/testing';
import { DataTestHelper } from '../test-helper.js';
import { PostmanV2Transformer } from '../../transformers/postman-v2-transformer.js';
suite('postman-v2-transformer (collection)', function() {
  suite('_readProjectInfo()', function() {
    let transformer;
    let jsonData;
    let result;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v2.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      transformer = new PostmanV2Transformer(jsonData);
      result = transformer._readProjectInfo();
    });

    test('Returns an object', function() {
      assert.typeOf(result, 'object');
    });

    test('Contains _id', function() {
      assert.equal(result._id, 'c0a9562a-e1a3-5ecd-ef63-a4512f4fce44');
    });

    test('name is set', function() {
      assert.equal(result.name, 'TestCollection v2');
    });

    test('description is set', function() {
      assert.equal(result.description, 'V2 description');
    });

    test('created is set', function() {
      assert.typeOf(result.created, 'number');
    });

    test('updated is set', function() {
      assert.typeOf(result.updated, 'number');
    });

    test('order is set', function() {
      assert.equal(result.order, 0);
    });
  });

  suite('Body computation', function() {
    let transformer;
    let jsonData;
    let item;
    suite('FormData - _computeFormDataBody()', function() {
      suiteSetup(function() {
        return DataTestHelper.getFile('postman/collection-v2.json')
        .then((response) => {
          jsonData = JSON.parse(response);
          item = jsonData.item[3];
        });
      });
      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
      });

      test('Returns empty stirng', function() {
        const arcItem = {};
        const result = transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.equal(result, '');
      });

      test('Sets multipart model data', function() {
        const arcItem = {};
        transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.typeOf(arcItem.multipart, 'array');
      });

      test('Model includes all items', function() {
        const arcItem = {};
        transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.lengthOf(arcItem.multipart, 4);
      });

      test('Marks items enabled / disabled', function() {
        const arcItem = {};
        transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.isTrue(arcItem.multipart[0].enabled);
        assert.isFalse(arcItem.multipart[1].enabled);
        assert.isTrue(arcItem.multipart[2].enabled);
        assert.isTrue(arcItem.multipart[3].enabled);
      });

      test('Sets names in the model', function() {
        const arcItem = {};
        transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.equal(arcItem.multipart[0].name, 'fb1');
        assert.equal(arcItem.multipart[1].name, 'fb2');
        assert.equal(arcItem.multipart[2].name, 'fb3');
        assert.equal(arcItem.multipart[3].name, 'fb4');
      });

      test('Sets values in the model', function() {
        const arcItem = {};
        transformer._computeFormDataBody(item.request.body.formdata, arcItem);
        assert.equal(arcItem.multipart[0].value, 'v1');
        assert.equal(arcItem.multipart[1].value, '${v2}');
        assert.equal(arcItem.multipart[2].value, 'v3');
        assert.equal(arcItem.multipart[3].value, '');
      });
    });
    suite('URL encoded - _computeFormDataBody()', function() {
      suiteSetup(function() {
        return DataTestHelper.getFile('postman/collection-v2.json')
        .then((response) => {
          jsonData = JSON.parse(response);
          item = jsonData.item[0].item[0].request.body.urlencoded;
        });
      });
      let shalowCopy;
      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
        shalowCopy = Array.from(item, (i) => Object.assign({}, i));
      });

      test('Computes body value', function() {
        const arcItem = {};
        const result = transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.equal(result, 'fd1=${v1}&${fd3}=3');
      });

      test('Sets model data on passed item', function() {
        const arcItem = {};
        transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.typeOf(arcItem.urlEncodedModel, 'array');
      });

      test('Model includes all items', function() {
        const arcItem = {};
        transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.lengthOf(arcItem.urlEncodedModel, 3);
      });

      test('Marks items enabled / disabled', function() {
        const arcItem = {};
        transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.isTrue(arcItem.urlEncodedModel[0].enabled);
        assert.isFalse(arcItem.urlEncodedModel[1].enabled);
        assert.isTrue(arcItem.urlEncodedModel[2].enabled);
      });

      test('Sets names in the model', function() {
        const arcItem = {};
        transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.equal(arcItem.urlEncodedModel[0].name, 'fd1');
        assert.equal(arcItem.urlEncodedModel[1].name, 'fd2');
        assert.equal(arcItem.urlEncodedModel[2].name, '${fd3}');
      });

      test('Sets values in the model', function() {
        const arcItem = {};
        transformer._computeUrlEncodedBody(shalowCopy, arcItem);
        assert.equal(arcItem.urlEncodedModel[0].value, '${v1}');
        assert.equal(arcItem.urlEncodedModel[1].value, '2');
        assert.equal(arcItem.urlEncodedModel[2].value, '3');
      });
    });

    suite('Binary - _computePayload()', function() {
      suiteSetup(function() {
        return DataTestHelper.getFile('postman/collection-v2.json')
        .then((response) => {
          jsonData = JSON.parse(response);
          item = jsonData.item[1].request.body;
        });
      });

      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
      });

      test('Always returns empty value', function() {
        const result = transformer._computePayload(item);
        assert.equal(result, '');
      });
    });

    suite('Raw - _computePayload()', function() {
      suiteSetup(function() {
        return DataTestHelper.getFile('postman/collection-v2.json')
        .then((response) => {
          jsonData = JSON.parse(response);
          item = jsonData.item[2].request.body;
        });
      });

      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
      });

      test('Returns raw value', function() {
        const result = transformer._computePayload(item);
        assert.equal(result, 'some ${raw} value');
      });
    });
  });

  suite('Headers computation', function() {
    let transformer;
    let jsonData;
    let headers;
    let item;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v2.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        headers = jsonData.item[0].item[1].request.header;
        item = jsonData.item[0].item[1];
      });
    });

    let shalowCopy;
    suite('_computeHeaders()', function() {
      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
        shalowCopy = Array.from(headers, (i) => Object.assign({}, i));
      });

      test('Computes headers value', function() {
        const result = transformer._computeHeaders(shalowCopy);
        let compare = 'Content-Type: application/x-www-form-urlencoded\n';
        compare += 'Content-Length: 2\n';
        compare += 'x-test: {{host}}';
        assert.equal(result, compare);
      });

      test('Computes variables from headers', function() {
        const result = transformer.ensureVarsRecursevily(shalowCopy);
        assert.equal(result[2].value, '${host}');
      });
    });

    suite('_computeArcRequest()', function() {
      setup(function() {
        transformer = new PostmanV2Transformer(jsonData);
        shalowCopy = Object.assign({}, item);
      });

      test('Computes headers value', function() {
        const result = transformer._computeArcRequest(shalowCopy);
        let compare = 'Content-Type: application/x-www-form-urlencoded\n';
        compare += 'Content-Length: 2\n';
        compare += 'x-test: ${host}';
        assert.equal(result.headers, compare);
      });
    });
  });

  suite('URL and query parameters computation', function() {
    let transformer;
    let jsonData;
    let item;
    let shalowCopy;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v2.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        item = jsonData.item[0].item[0];
      });
    });
    setup(function() {
      transformer = new PostmanV2Transformer(jsonData);
      shalowCopy = Object.assign({}, item);
    });

    test('URL is computed', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      const compare = 'https://onet.pl/${random()}?${a}=${bb}&e=ff';
      assert.equal(result.url, compare);
    });
  });

  suite('Generating the request object', function() {
    let transformer;
    let jsonData;
    let item;
    let shalowCopy;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/collection-v2.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        item = jsonData.item[0].item[0];
      });
    });
    setup(function() {
      transformer = new PostmanV2Transformer(jsonData);
      shalowCopy = Object.assign({}, item);
    });

    test('Creates an object', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.typeOf(result, 'object');
    });

    test('Name is set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.name, 'url encoded');
    });

    test('url is set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.url, 'https://onet.pl/${random()}?${a}=${bb}&e=ff');
    });

    test('method is set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.method, 'PUT');
    });

    test('headers is set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.headers, 'Content-Type: application/x-www-form-urlencoded');
    });

    test('payload is set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.payload, 'fd1=${v1}&${fd3}=3');
    });

    test('created and updated are set', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.typeOf(result.created, 'number');
      assert.typeOf(result.updated, 'number');
    });

    test('type is "saved"', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.type, 'saved');
    });

    test('project is set on request', function() {
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result.projects[0], jsonData.info._postman_id);
    });

    test('request is set on project', function() {
      return transformer.transform()
      .then((result) => {
        const project = result.projects[0];
        assert.typeOf(project.requests, 'array');
        assert.lengthOf(project.requests, 5);
      });
    });

    test('_id is set', function() {
      let cmp = 'url%20encoded/https%3A%2F%2Fonet.pl%2F%24%7Brandom()%7D';
      cmp += '%3F%24%7Ba%7D%3D%24%7Bbb%7D%26e%3Dff/put/c0a9562a-e1a3-';
      cmp += '5ecd-ef63-a4512f4fce44';
      const result = transformer._computeArcRequest(shalowCopy);
      assert.equal(result._id, cmp);
    });
  });

  suite('transform()', function() {
    let transformer;
    let jsonData;

    setup(function() {
      return DataTestHelper.getFile('postman/collection-v2.json')
      .then((response) => {
        jsonData = JSON.parse(response);
        transformer = new PostmanV2Transformer(jsonData);
      });
    });

    test('Returns Promise', function() {
      const result = transformer.transform();
      assert.typeOf(result.then, 'function');
    });

    test('Contains export object properties', function() {
      return transformer.transform()
      .then(function(result) {
        assert.typeOf(result.createdAt, 'string');
        assert.equal(result.version, 'postman-collection-v2');
        assert.equal(result.kind, 'ARC#Import');
        assert.typeOf(result.projects, 'array');
        assert.typeOf(result.requests, 'array');
      });
    });

    test('Projects contains 1 entry', function() {
      return transformer.transform()
      .then(function(result) {
        assert.lengthOf(result.projects, 1);
      });
    });

    test('Requests contains 5 entries', function() {
      return transformer.transform()
      .then(function(result) {
        assert.lengthOf(result.requests, 5);
      });
    });
  });
});
