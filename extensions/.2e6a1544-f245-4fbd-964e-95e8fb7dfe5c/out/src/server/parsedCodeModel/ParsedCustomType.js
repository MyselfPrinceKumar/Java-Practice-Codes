"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCustomType = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const parsedCode_1 = require("./parsedCode");
class ParsedCustomType extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    initialise(element, document, contract, isGlobal) {
        super.initialise(element, document, contract, isGlobal);
        this.element = element;
        this.isType = element.isType;
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Field;
            let contractName = '';
            if (!this.isGlobal) {
                contractName = this.contract.name;
            }
            else {
                contractName = this.document.getGlobalPathInfo();
            }
            const typeString = this.isType;
            completionItem.insertText = this.name;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getParsedObjectType() {
        return 'Custom Type';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            '### Type Info: \n' +
            this.isType + '\n';
    }
}
exports.ParsedCustomType = ParsedCustomType;
//# sourceMappingURL=ParsedCustomType.js.map