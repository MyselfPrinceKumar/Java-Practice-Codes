"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedModifierArgument = void 0;
const parsedCode_1 = require("./parsedCode");
const ParsedFunction_1 = require("./ParsedFunction");
class ParsedModifierArgument extends parsedCode_1.ParsedCode {
    initialiseModifier(element, functionParent, document) {
        this.functionParent = functionParent;
        this.contract = functionParent.contract;
        this.element = element;
        this.name = element.name;
        this.document = document;
    }
    isPublic() {
        return this.name === 'public';
    }
    isPrivate() {
        return this.name === 'private';
    }
    isExternal() {
        return this.name === 'external';
    }
    isInternal() {
        return this.name === 'internal';
    }
    isView() {
        return this.name === 'pure';
    }
    isPure() {
        return this.name === 'view';
    }
    isPayeable() {
        return this.name === 'payeable';
    }
    IsCustomModifier() {
        return !(this.isPublic() || this.isExternal() || this.isPrivate() || this.isView() || this.isPure() || this.isPayeable() || this.isInternal());
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            const results = [];
            if (this.IsCustomModifier()) {
                const foundResults = this.findMethodsInScope(this.name);
                if (foundResults.length > 0) {
                    foundResults.forEach(x => {
                        results.push(parsedCode_1.FindTypeReferenceLocationResult.create(true, x.getLocation()));
                    });
                }
                return results;
            }
            return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
    getAllReferencesToObject(parsedCode) {
        if (this.IsCustomModifier()) {
            if (parsedCode instanceof ParsedFunction_1.ParsedFunction) {
                const functModifider = parsedCode;
                if (functModifider.isModifier && functModifider.name === this.name) {
                    return [this.createFoundReferenceLocationResult()];
                }
            }
        }
        return [];
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            let results = [];
            if (this.IsCustomModifier()) {
                const foundResults = this.findMethodsInScope(this.name);
                foundResults.forEach(x => results = results.concat(x.getAllReferencesToThis(documents)));
                return results;
            }
        }
        return [];
    }
    getParsedObjectType() {
        return 'Modifier Argument';
    }
    getInfo() {
        if (this.IsCustomModifier()) {
            const foundResults = this.findMethodsInScope(this.name);
            if (foundResults.length > 0) {
                return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
                    '#### ' + this.functionParent.getParsedObjectType() + ': ' + this.functionParent.name + '\n' +
                    '#### ' + this.getContractNameOrGlobal() + '\n' +
                    '### Type Info: \n' +
                    foundResults[0].getInfo() + '\n';
            }
            return '### ' + this.getParsedObjectType() + ': ' + this.name + '\n' +
                '#### ' + this.functionParent.getParsedObjectType() + ': ' + this.functionParent.name + '\n' +
                '#### ' + this.getContractNameOrGlobal() + '\n';
        }
    }
}
exports.ParsedModifierArgument = ParsedModifierArgument;
//# sourceMappingURL=ParsedModifierArgument.js.map