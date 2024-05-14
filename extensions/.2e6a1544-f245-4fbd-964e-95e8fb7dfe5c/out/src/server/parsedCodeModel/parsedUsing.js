"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedUsing = void 0;
const parsedCode_1 = require("./parsedCode");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
class ParsedUsing extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.forStar = false;
    }
    initialise(element, document, contract, isGlobal) {
        this.contract = contract;
        this.element = element;
        this.name = element.library.literal;
        this.document = document;
        this.isGlobal = isGlobal;
        if (element.for === '*') {
            this.forStar = true;
            this.for = null;
        }
        else {
            this.for = parsedDeclarationType_1.ParsedDeclarationType.create(element.for, this.contract, this.document);
        }
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            if (this.for !== null) {
                const foundType = this.for.findType();
                if (foundType !== undefined) {
                    return [foundType.createFoundReferenceLocationResult()];
                }
                return [this.createFoundReferenceLocationResultNoLocation()];
            }
        }
        return [this.createNotFoundReferenceLocationResult()];
    }
}
exports.ParsedUsing = ParsedUsing;
//# sourceMappingURL=parsedUsing.js.map