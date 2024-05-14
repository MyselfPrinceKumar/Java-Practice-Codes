"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedStructVariable = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const ParsedVariable_1 = require("./ParsedVariable");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
class ParsedStructVariable extends ParsedVariable_1.ParsedVariable {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    initialiseStructVariable(element, contract, document, struct) {
        this.element = element;
        this.name = element.name;
        this.document = document;
        this.type = parsedDeclarationType_1.ParsedDeclarationType.create(element.literal, contract, document);
        this.struct = struct;
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completitionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completitionItem.documentation = this.getMarkupInfo();
            this.completionItem = completitionItem;
        }
        return this.completionItem;
    }
    getParsedObjectType() {
        return 'Struct Property';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.struct.getParsedObjectType() + ': ' + this.struct.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            // '\t' +  this.getSignature() + ' \n\n' +
            '### Type Info: \n' +
            this.type.getInfo() + '\n';
    }
}
exports.ParsedStructVariable = ParsedStructVariable;
//# sourceMappingURL=ParsedStructVariable.js.map