"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedParameter = void 0;
const parsedDeclarationType_1 = require("./parsedDeclarationType");
const ParsedVariable_1 = require("./ParsedVariable");
const ParsedCodeTypeHelper_1 = require("./ParsedCodeTypeHelper");
const vscode_languageserver_1 = require("vscode-languageserver");
class ParsedParameter extends ParsedVariable_1.ParsedVariable {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    static extractParameters(params, contract, document, parent) {
        const parameters = [];
        if (typeof params !== 'undefined' && params !== null) {
            if (params.hasOwnProperty('params')) {
                params = params.params;
            }
            params.forEach(parameterElement => {
                const parameter = new ParsedParameter();
                parameter.initialiseParameter(parameterElement, contract, document, parent);
                parameters.push(parameter);
            });
        }
        return parameters;
    }
    static createParamsInfo(params) {
        let paramsInfo = '';
        if (typeof params !== 'undefined' && params !== null) {
            if (params.hasOwnProperty('params')) {
                params = params.params;
            }
            params.forEach(parameterElement => {
                const currentParamInfo = ParsedParameter.getParamInfo(parameterElement);
                if (paramsInfo === '') {
                    paramsInfo = currentParamInfo;
                }
                else {
                    paramsInfo = paramsInfo + ',\n\t\t\t\t' + currentParamInfo;
                }
            });
        }
        return paramsInfo;
    }
    static getParamInfo(parameterElement) {
        const typeString = ParsedCodeTypeHelper_1.ParsedCodeTypeHelper.getTypeString(parameterElement.literal);
        let currentParamInfo = '';
        if (typeof parameterElement.id !== 'undefined' && parameterElement.id !== null) { // no name on return parameters
            currentParamInfo = typeString + ' ' + parameterElement.id;
        }
        else {
            currentParamInfo = typeString;
        }
        return currentParamInfo;
    }
    static createFunctionParamsSnippet(params, skipFirst = false) {
        let paramsSnippet = '';
        let counter = 0;
        if (typeof params !== 'undefined' && params !== null) {
            params.forEach(parameterElement => {
                if (skipFirst && counter === 0) {
                    skipFirst = false;
                }
                else {
                    const typeString = ParsedCodeTypeHelper_1.ParsedCodeTypeHelper.getTypeString(parameterElement.literal);
                    counter = counter + 1;
                    const currentParamSnippet = '${' + counter + ':' + parameterElement.id + '}';
                    if (paramsSnippet === '') {
                        paramsSnippet = currentParamSnippet;
                    }
                    else {
                        paramsSnippet = paramsSnippet + ', ' + currentParamSnippet;
                    }
                }
            });
        }
        return paramsSnippet;
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            if (this.type.isCurrentElementedSelected(offset)) {
                return this.type.getAllReferencesToSelected(offset, documents);
            }
            else {
                return this.getAllReferencesToThis(documents);
            }
        }
        return [];
    }
    getAllReferencesToObject(parsedCode) {
        if (this.isTheSame(parsedCode)) {
            return [this.createFoundReferenceLocationResult()];
        }
        else {
            return this.type.getAllReferencesToObject(parsedCode);
        }
    }
    getAllReferencesToThis(documents) {
        const results = [];
        results.push(this.createFoundReferenceLocationResult());
        return results.concat(this.parent.getAllReferencesToObject(this));
    }
    initialiseParameter(element, contract, document, parent) {
        this.element = element;
        this.name = element.name;
        this.document = document;
        this.contract = contract;
        this.parent = parent;
        const type = parsedDeclarationType_1.ParsedDeclarationType.create(element.literal, contract, document);
        this.element = element;
        this.type = type;
        if (typeof element.id !== 'undefined' && element.id !== null) { // no name on return parameters
            this.name = element.id;
        }
    }
    createParamCompletionItem(type, contractName) {
        if (this.completionItem === null) {
            let id = '[parameter name not set]';
            if (this.element.id !== null) {
                id = this.element.id;
            }
            const completionItem = vscode_languageserver_1.CompletionItem.create(id);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Variable;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getParsedObjectType() {
        return 'Parameter';
    }
    getInfo() {
        let name = 'Name not set';
        if (this.name !== undefined) {
            name = this.name;
        }
        return '### ' + this.getParsedObjectType() + ': ' + name + '\n' +
            '#### ' + this.parent.getParsedObjectType() + ': ' + this.parent.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            '### Type Info: \n' +
            this.type.getInfo() + '\n';
    }
    getSignature() {
        return ParsedParameter.getParamInfo(this.element);
    }
}
exports.ParsedParameter = ParsedParameter;
//# sourceMappingURL=ParsedParameter.js.map