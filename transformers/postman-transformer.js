import { BaseTransformer } from './base-transformer.js';
/**
 * Base class for all Postman transformers
 */
export class PostmanTransformer extends BaseTransformer {
  /**
   * @constructor
   * @param {Object} data Import data object
   */
  constructor(data) {
    super(data);
    this._postamVarRegex = /\{\{(.*?)\}\}/gim;
  }
  /**
   * Computes body value for Postman's v1 body definition.
   *
   * @param {Object} item Postam v1 model.
   * @return {String} Body value
   */
  computeBodyOld(item) {
    if (typeof item.data === 'string') {
      return this.ensureVariablesSyntax(item.data);
    }
    if (item.data instanceof Array && !item.data.length) {
      return '';
    }
    switch (item.dataMode) {
      case 'params': return this._computeFormDataBody(item);
      case 'urlencoded': return this._computeUrlEncodedBody(item);
      case 'binary': return '';
    }
  }
  /**
   * Computes body as a FormData data model.
   * This function sets `multipart` property on the item.
   *
   * @param {Object} item Postam v1 model.
   * @return {String} Body value. Always empty string.
   */
  _computeFormDataBody(item) {
    if (!item.data || !item.data.length) {
      return '';
    }
    const multipart = [];
    item.data = this.ensureVarsRecursevily(item.data);
    item.data.forEach((item) => {
      const obj = {
        enabled: item.enabled,
        name: item.key,
        isFile: item.type === 'file',
        value: item.type === 'file' ? '' : item.value
      };
      multipart.push(obj);
    });
    item.multipart = multipart;
    return '';
  }
  /**
   * Computes body as a URL encoded data model.
   *
   * @param {Object} item Postam v1 model.
   * @return {String} Body value.
   */
  _computeUrlEncodedBody(item) {
    if (!item.data || !item.data.length) {
      return '';
    }
    item.data = this.ensureVarsRecursevily(item.data);
    return item.data.map((item) => {
      const name = this._paramValue(item.key);
      const value = this._paramValue(item.value);
      return name + '=' + value;
    }).join('&');
  }

  /**
   * Parse input string as a payload param key or value.
   *
   * @param {String} input An input to parse.
   * @return {String} Trimmed string
   */
  _paramValue(input) {
    if (!input) {
      return String();
    }
    input = String(input);
    input = input.trim();
    return input;
  }
  /**
   * Replacer function for regex replace to be used to replace variables
   * notation to ARC's
   *
   * @param {String} match
   * @param {String} value
   * @return {String} Value to be replaced in the string.
   */
  _variablesReplacerFunction(match, value) {
    switch (value) {
      case '$randomInt': value = 'random()'; break;
      case '$guid': value = 'uuid()'; break;
      case '$timestamp': value = 'now()'; break;
    }
    return '${' + value + '}';
  }
  /**
   * Replaces any occurence of {{STRING}} with ARC's variables syntax.
   *
   * @param {String} str A string value to check for variables.
   * @return {String} The same string with ARC's variables syntax
   */
  ensureVariablesSyntax(str) {
    if (!str || !str.indexOf) {
      return str;
    }
    // https://jsperf.com/regex-replace-with-test-conditions
    if (str.indexOf('{{') !== -1) {
      str = str.replace(this._postamVarRegex, this._variablesReplacerFunction);
    }
    return str;
  }

  ensureVarsRecursevily(obj) {
    if (obj instanceof Array) {
      for (let i = 0, len = obj.length; i < len; i++) {
        obj[i] = this.ensureVarsRecursevily(obj[i]);
      }
      return obj;
    }
    if (obj === Object(obj)) {
      Object.keys(obj).forEach((index) => {
        obj[index] = this.ensureVarsRecursevily(obj[index]);
      });
      return obj;
    }
    if (typeof obj === 'string') {
      return this.ensureVariablesSyntax(obj);
    }
    return obj;
  }
}
