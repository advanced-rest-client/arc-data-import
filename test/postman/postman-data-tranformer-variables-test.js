import { assert } from '@open-wc/testing';
import { DataTestHelper } from '../test-helper.js';
import { PostmanEnvTransformer } from '../../transformers/postman-env-transformer.js';
suite('postman-variables-transformer', function() {
  suite('_transformVariables()', function() {
    let transformer;
    let jsonData;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/environment.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      transformer = new PostmanEnvTransformer(jsonData);
    });

    test('Returns an array', function() {
      const result = transformer._transformVariables(jsonData.values);
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 3);
    });

    test('Transforms variables', function() {
      const result = transformer._transformVariables(jsonData.values);
      assert.equal(result[1].value, 'test ${var1}');
    });

    test('Sets `enabled` proeprty', function() {
      const result = transformer._transformVariables(jsonData.values);
      assert.isTrue(result[1].enabled);
      assert.isFalse(result[2].enabled);
    });

    test('Sets environment property', function() {
      const env = 'test-env';
      const result = transformer._transformVariables(jsonData.values, env);
      assert.equal(result[0].environment, env);
      assert.equal(result[1].environment, env);
      assert.equal(result[2].environment, env);
    });

    test('Sets default environment property', function() {
      const env = 'default';
      const result = transformer._transformVariables(jsonData.values);
      assert.equal(result[0].environment, env);
      assert.equal(result[1].environment, env);
      assert.equal(result[2].environment, env);
    });
  });

  suite('transform()', function() {
    let jsonData;
    let transformer;
    suiteSetup(function() {
      return DataTestHelper.getFile('postman/environment.json')
      .then((response) => {
        jsonData = JSON.parse(response);
      });
    });

    setup(function() {
      transformer = new PostmanEnvTransformer(jsonData);
    });

    test('Returns Promise', function() {
      const result = transformer.transform();
      assert.typeOf(result.then, 'function');
    });

    test('Contains export object properties', function() {
      return transformer.transform()
      .then(function(result) {
        assert.typeOf(result.createdAt, 'string');
        assert.equal(result.version, 'postman-environment');
        assert.equal(result.kind, 'ARC#Import');
        assert.typeOf(result.variables, 'array');
        assert.lengthOf(result.variables, 3);
      });
    });
  });
});
