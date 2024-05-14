"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedStruct = void 0;
const parsedCode_1 = require("./parsedCode");
const ParsedStructVariable_1 = require("./ParsedStructVariable");
const vscode_languageserver_1 = require("vscode-languageserver");
class ParsedStruct extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.properties = [];
        this.completionItem = null;
    }
    initialise(element, document, contract, isGlobal) {
        this.contract = contract;
        this.element = element;
        this.id = element.id;
        this.name = element.name;
        this.document = document;
        this.isGlobal = isGlobal;
        if (this.element.body !== 'undefined') {
            this.element.body.forEach(structBodyElement => {
                if (structBodyElement.type === 'DeclarativeExpression') {
                    const variable = new ParsedStructVariable_1.ParsedStructVariable();
                    variable.initialiseStructVariable(structBodyElement, this.contract, this.document, this);
                    this.properties.push(variable);
                }
            });
        }
    }
    getInnerMembers() {
        return this.properties;
    }
    getVariableSelected(offset) {
        return this.properties.find(x => {
            return x.isCurrentElementedSelected(offset);
        });
    }
    getSelectedItem(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            const variableSelected = this.getVariableSelected(offset);
            if (variableSelected !== undefined) {
                return variableSelected;
            }
            else {
                return this;
            }
        }
        return null;
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            const variableSelected = this.getVariableSelected(offset);
            if (variableSelected !== undefined) {
                return variableSelected.getSelectedTypeReferenceLocation(offset);
            }
            else {
                return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
            }
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Struct;
            completionItem.insertText = this.name;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getInnerCompletionItems() {
        const completionItems = [];
        this.properties.forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            const selectedProperty = this.getSelectedProperty(offset);
            if (selectedProperty !== undefined) {
                return selectedProperty.getAllReferencesToThis(documents);
            }
            else {
                return this.getAllReferencesToThis(documents);
            }
        }
        return [];
    }
    getSelectedProperty(offset) {
        return this.properties.find(x => x.isCurrentElementedSelected(offset));
    }
    getParsedObjectType() {
        return 'Struct';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            this.getComment();
    }
}
exports.ParsedStruct = ParsedStruct;
//# sourceMappingURL=ParsedStruct.js.map