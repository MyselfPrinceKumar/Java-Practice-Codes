"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedVariable = void 0;
const parsedCode_1 = require("./parsedCode");
class ParsedVariable extends parsedCode_1.ParsedCode {
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            const foundType = this.type.findType();
            if (foundType !== undefined) {
                return [foundType.createFoundReferenceLocationResult()];
            }
            return [this.createFoundReferenceLocationResultNoLocation()];
        }
        return [this.createNotFoundReferenceLocationResult()];
    }
    getAllReferencesToObject(parsedCode) {
        if (this.isTheSame(parsedCode)) {
            return [this.createFoundReferenceLocationResult()];
        }
        else {
            return this.type.getAllReferencesToObject(parsedCode);
        }
    }
}
exports.ParsedVariable = ParsedVariable;
//# sourceMappingURL=ParsedVariable.js.map