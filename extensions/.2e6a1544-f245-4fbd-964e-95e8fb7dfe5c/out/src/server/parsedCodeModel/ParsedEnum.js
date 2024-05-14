"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedEnum = void 0;
const parsedCode_1 = require("./parsedCode");
const vscode_languageserver_1 = require("vscode-languageserver");
class ParsedEnum extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.items = [];
        this.completionItem = null;
    }
    initialise(element, document, contract, isGlobal) {
        super.initialise(element, document, contract, isGlobal);
        this.name = element.name;
        this.id = element.id;
        element.members.forEach(member => { this.items.push(member); });
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Enum;
            let contractName = '';
            if (!this.isGlobal) {
                contractName = this.contract.name;
            }
            else {
                contractName = this.document.getGlobalPathInfo();
            }
            completionItem.insertText = this.name;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getInnerCompletionItems() {
        const completionItems = [];
        this.items.forEach(property => completionItems.push(vscode_languageserver_1.CompletionItem.create(property)));
        return completionItems;
    }
    getParsedObjectType() {
        return 'Enum';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            this.getComment();
    }
}
exports.ParsedEnum = ParsedEnum;
//# sourceMappingURL=ParsedEnum.js.map