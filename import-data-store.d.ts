/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   import-data-store.html
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

/// <reference path="../polymer/types/polymer-element.d.ts" />

declare namespace LogicElements {

  /**
   * An element that offers access to the datastore for ARC objects.
   */
  class ImportDataStore extends Polymer.Element {
    readonly _savedDb: any;
    readonly _historyDb: any;
    readonly _projectsDb: any;
    readonly _socketUrlDb: any;
    readonly _urlDb: any;
    readonly _variablesDb: any;
    readonly _variablesEnvsDb: any;
    readonly _headersSetsDb: any;
    readonly _cookiesDb: any;
    readonly _authDataDb: any;
    readonly _hostRulesDb: any;

    /**
     * Imports data into the data store.
     *
     * @param exportObj Normalized export object
     * @returns Promise resolved to list of error messages, if any.
     */
    importData(exportObj: object|null): Promise<any>|null;
    importRequests(requests: any): any;
    importProjects(projects: any): any;
    importHistory(history: any): any;
    importWebsocketUrls(urls: any): any;
    importUrls(urls: any): any;
    importCookies(data: any): any;
    importAuthData(data: any): any;
    importHeaders(data: any): any;
    importHostRules(data: any): any;
    importVariables(data: any): any;
    importEnvironments(data: any): any;
    _importEnvironments(variables: any): any;
    _handleInsertResponse(result: any, items: any, db: any): any;
    _handleConflictedInserts(db: any, conflicted: any): any;
  }
}

interface HTMLElementTagNameMap {
  "import-data-store": LogicElements.ImportDataStore;
}
