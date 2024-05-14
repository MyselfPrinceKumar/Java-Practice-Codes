"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCodeTypeHelper = void 0;
class ParsedCodeTypeHelper {
    static getTypeString(literal) {
        const isArray = literal.array_parts.length > 0;
        let isMapping = false;
        let literalType;
        let parentType = null;
        if (literal.members !== undefined && literal.members.length > 0) {
            literalType = literal.members[0];
            parentType = literal.literal;
        }
        else {
            literalType = literal.literal;
        }
        let suffixType = '';
        if (typeof literalType.type !== 'undefined') {
            isMapping = literalType.type === 'MappingExpression';
            if (isMapping) {
                suffixType = '(' + this.getTypeString(literalType.from) + ' => ' + this.getTypeString(literalType.to) + ')';
            }
        }
        if (isArray) {
            suffixType = suffixType + '[]';
        }
        if (isMapping) {
            return 'mapping' + suffixType;
        }
        if (parentType !== null) {
            return parentType + '.' + literalType + suffixType;
        }
        return literalType + suffixType;
    }
}
exports.ParsedCodeTypeHelper = ParsedCodeTypeHelper;
//# sourceMappingURL=ParsedCodeTypeHelper.js.map