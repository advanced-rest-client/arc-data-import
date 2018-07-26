/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   arc-data-import.html
 *   arc-data-import.js
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="import-data-store.d.ts" />
/// <reference path="transformers-import.d.ts" />

declare namespace LogicElements {

  /**
   * An element that imports data into the ARC datastore.
   *
   * Supported data import types:
   *
   * -   legacy (the first one) ARC data system
   * -   legacy Dexie and HAR based data system
   * -   current ARC export object
   * -   Postman data export
   *
   * To import data it must be first normalized by calling `normalizeImportData`
   * function. It creates datastore objects that are resdy to be inserted into the
   * datastore.
   *
   * Objects that are missing IDs will be assigned a new ID. Because of that data
   * duplication may occur.
   * Request objects will generate the same ID unless the request is assigned to a
   * project and project has new ID generated.
   *
   * Conflicts are resolved by replacing existing data with new one.
   *
   * ### Example
   *
   * ```javascript
   * const importer = document.querySelector('arc-data-import');
   * const data = await getFileContent();
   * data = await importer.normalizeImportData();
   * const errors = await importer.storeData(data);
   * if (errors && errors.length) {
   *    console.log(errors);
   * }
   * ```
   *
   * ## Changes in version 2.x
   * - The component no longer includes PouchDB. Use your own version of the
   * library from Bower, npm, csd etc.
   */
  class ArcDataImport extends Polymer.Element {
    readonly _dataStore: any;
    connectedCallback(): void;
    disconnectedCallback(): void;

    /**
     * Handler for the `import-normalize`cutom event.
     * It sets `result` property on the event's detail object which is the result
     * of calling `normalizeImportData` function call.
     *
     * The event is canceled so it's save to have more than one instance of this
     * element in the DOM.
     */
    _normalizeHandler(e: any): void;

    /**
     * Normalizes import data object to single data model.
     *
     * @param data ARC or Postman data
     * @returns Normalized data.
     */
    normalizeImportData(data: object|null): Promise<any>|null;

    /**
     * Handler for the `import-data` cutom event.
     * It sets `result` property on the event's detail object which is a result
     * of calling `storeData` function.
     *
     * The event is canceled so it's save to have more than one instance of this
     * element in the DOM.
     */
    _importHandler(e: any): void;

    /**
     * Stores import data in the datastore.
     * It must be normalized by `normalizeImportData` first or it returns an
     * error.
     *
     * @param importObject ARC import data
     * @returns Resolved promise to list of errors or `undefined`
     * if error were not reported.
     */
    storeData(importObject: Obejct|null): Promise<any>|null;
  }
}

interface HTMLElementTagNameMap {
  "arc-data-import": LogicElements.ArcDataImport;
}

declare class ArcDataImportLogic {

  /**
   * Transforms any previous ARC export file to current export object.
   *
   * @param data Data from the import file.
   * @returns Normalized data import object.
   */
  normalizeImportData(data: String|object|null): Promise<any>|null;

  /**
   * Parses file data with JSON parser and throws an error if not a JSON.
   * If the passed `data` is JS object it does nothing.
   *
   * @param data File content
   * @returns Parsed data.
   */
  _prepareImportObject(data: String|object|null): object|null;

  /**
   * Normalizes any previous and current ARC file expot data to common model.
   *
   * @param data Imported data.
   * @returns A promise resolved to ARC data export object.
   */
  _normalizeArc(data: object|null): Promise<any>|null;

  /**
   * Normalizes export data from the GWT system.
   */
  _normalizeArcLegacyData(data: any): any;

  /**
   * Normalizes export data from Dexie powered data store.
   */
  _normalizeArcDexieSystem(data: any): any;

  /**
   * Normalizes ARC's data exported in PouchDB system
   */
  _normalizeArcPouchSystem(data: any): any;

  /**
   * Normalizes Postman data into ARC's data model.
   */
  _normalizePostmap(data: any): any;

  /**
   * Checks if passed `object` is the ARC export data.
   *
   * @param object A parsed JSON data.
   * @returns true if the passed object is an ARC file.
   */
  _isArcFile(object: object|null): Boolean|null;

  /**
   * First export / import system had single request data only. This function checks if given
   * file is from this ancient system.
   *
   * @param object Decoded JSON data.
   */
  _isOldImport(object: object|null): any;

  /**
   * Checks if the passed argument is an Object.
   *
   * @param object A value to test.
   */
  _isObject(object: any|null): any;

  /**
   * Tests if data is a Postman data.
   */
  _isPostman(data: any): any;
}
