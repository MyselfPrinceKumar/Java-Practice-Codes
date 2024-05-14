"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedStateVariable = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
const ParsedVariable_1 = require("./ParsedVariable");
class ParsedStateVariable extends ParsedVariable_1.ParsedVariable {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    initialise(element, document, contract) {
        super.initialise(element, document, contract);
        this.name = element.name;
        this.type = parsedDeclarationType_1.ParsedDeclarationType.create(element.literal, contract, document);
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Field;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getParsedObjectType() {
        return 'State Variable';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            this.getComment() + '\n' +
            '### Type Info: \n' +
            this.type.getInfo() + '\n';
    }
}
exports.ParsedStateVariable = ParsedStateVariable;
//# sourceMappingURL=ParsedStateVariable.js.map