"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedConstant = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
const ParsedVariable_1 = require("./ParsedVariable");
const ParsedParameter_1 = require("./ParsedParameter");
class ParsedConstant extends ParsedVariable_1.ParsedVariable {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    initialise(element, document) {
        super.initialise(element, document);
        this.name = element.name;
        this.type = parsedDeclarationType_1.ParsedDeclarationType.create(element.literal, null, document);
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Field;
            const info = this.document.getGlobalPathInfo();
            completionItem.insertText = this.name;
            completionItem.documentation = this.getMarkupInfo();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getParsedObjectType() {
        return 'Constant';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            '\t' + this.getSignature() + ' \n\n' +
            '### Type Info: \n' +
            this.type.getInfo() + '\n';
    }
    getSignature() {
        return ParsedParameter_1.ParsedParameter.getParamInfo(this.element);
    }
}
exports.ParsedConstant = ParsedConstant;
//# sourceMappingURL=ParsedConstant.js.map