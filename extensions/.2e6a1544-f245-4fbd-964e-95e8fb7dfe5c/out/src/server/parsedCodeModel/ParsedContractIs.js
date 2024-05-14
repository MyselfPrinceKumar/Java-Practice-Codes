"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedContractIs = void 0;
const parsedCode_1 = require("./parsedCode");
class ParsedContractIs extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.contractReference = null;
    }
    initialise(element, document, contract, isGlobal) {
        super.initialise(element, document, contract, isGlobal);
        this.name = element.name;
    }
    initialiseContractReference() {
        if (this.contractReference !== null) {
            return this.contractReference;
        }
        this.contractReference = this.document.findContractByName(this.name);
        if (this.contractReference !== undefined && this.contractReference !== null) {
            this.contractReference.initialiseExtendContracts();
        }
        return this.contractReference;
    }
    getContractReference() {
        return this.initialiseContractReference();
    }
    getContractReferenceLocation() {
        return this.getContractReference().getLocation();
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            return [parsedCode_1.FindTypeReferenceLocationResult.create(true, this.getContractReferenceLocation())];
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
    getAllReferencesToThis() {
        const results = [];
        results.push(this.createFoundReferenceLocationResult());
        return results.concat(this.document.getAllReferencesToObject(this.getContractReference()));
    }
    getAllReferencesToObject(parsedCode) {
        if (this.isTheSame(parsedCode)) {
            return [this.createFoundReferenceLocationResult()];
        }
        else {
            const reference = this.getContractReference();
            if (reference !== null && reference.isTheSame(parsedCode)) {
                return [this.createFoundReferenceLocationResult()];
            }
        }
    }
    getInfo() {
        const reference = this.getContractReference();
        if (reference !== null) {
            return reference.getInfo();
        }
        else {
            return '### Contract: ' + this.name;
        }
    }
}
exports.ParsedContractIs = ParsedContractIs;
//# sourceMappingURL=ParsedContractIs.js.map