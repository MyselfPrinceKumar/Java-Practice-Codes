"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedFunctionVariable = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const ParsedCodeTypeHelper_1 = require("./ParsedCodeTypeHelper");
const ParsedVariable_1 = require("./ParsedVariable");
const ParsedParameter_1 = require("./ParsedParameter");
class ParsedFunctionVariable extends ParsedVariable_1.ParsedVariable {
    constructor() {
        super(...arguments);
        this.completionItem = null;
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Field;
            let name = '';
            if (this.function.isGlobal) {
                name = this.document.getGlobalPathInfo();
            }
            else {
                name = this.function.contract.name;
            }
            const typeString = ParsedCodeTypeHelper_1.ParsedCodeTypeHelper.getTypeString(this.element.literal);
            completionItem.detail = '(Function variable in ' + this.function.name + ') '
                + typeString + ' ' + name;
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getAllReferencesToThis() {
        const results = [];
        results.push(this.createFoundReferenceLocationResult());
        return results.concat(this.function.getAllReferencesToObject(this));
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            if (this.type.isCurrentElementedSelected(offset)) {
                return this.type.getAllReferencesToSelected(offset, documents);
            }
            else {
                return this.getAllReferencesToThis();
            }
        }
        return [];
    }
    getParsedObjectType() {
        return 'Function Variable';
    }
    getInfo() {
        return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
            '#### ' + this.function.getParsedObjectType() + ': ' + this.function.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            '### Type Info: \n' +
            this.type.getInfo() + '\n';
    }
    getSignature() {
        return ParsedParameter_1.ParsedParameter.getParamInfo(this.element);
    }
}
exports.ParsedFunctionVariable = ParsedFunctionVariable;
//# sourceMappingURL=ParsedFunctionVariable.js.map