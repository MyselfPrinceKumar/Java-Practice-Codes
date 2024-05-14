"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotCompletionService = exports.AutoCompleteExpression = void 0;
const ParsedExpression_1 = require("../ParsedExpression");
class AutoCompleteExpression {
    constructor() {
        this.isVariable = false;
        this.isMethod = false;
        this.isArray = false;
        this.parent = null; // could be a property or a method
        this.child = null;
        this.name = '';
    }
    getTopParent() {
        if (this.parent != null) {
            return this.parent.getTopParent();
        }
        return this;
    }
}
exports.AutoCompleteExpression = AutoCompleteExpression;
class DotCompletionService {
    static getTriggeredByDotStart(lines, position) {
        let start = 0;
        let triggeredByDot = false;
        for (let i = position.character; i >= 0; i--) {
            if (lines[position.line[i]] === ' ') {
                triggeredByDot = false;
                i = 0;
                start = 0;
            }
            if (lines[position.line][i] === '.') {
                start = i;
                i = 0;
                triggeredByDot = true;
            }
        }
        return start;
    }
    static convertAutoCompleteExpressionToParsedExpression(autocompleteExpression, expressionChild, document, contract, expressionContainer) {
        let expression = null;
        if (autocompleteExpression.isMethod) {
            expression = new ParsedExpression_1.ParsedExpressionCall();
        }
        if (autocompleteExpression.isVariable) {
            expression = new ParsedExpression_1.ParsedExpressionIdentifier();
        }
        expression.name = autocompleteExpression.name;
        expression.document = document;
        expression.contract = contract;
        expression.child = expressionChild;
        expression.expressionContainer = expressionContainer;
        if (autocompleteExpression.parent !== null) {
            expression.parent = this.convertAutoCompleteExpressionToParsedExpression(autocompleteExpression.parent, expression, document, contract, expressionContainer);
        }
        return expression;
    }
    static getSelectedDocumentDotCompletionItems(lines, position, triggeredByDotStart, documentSelected, offset) {
        let contractSelected = null;
        let expressionContainer = null;
        if (documentSelected.selectedContract === null || documentSelected.selectedContract === undefined) {
            expressionContainer = documentSelected;
        }
        else {
            contractSelected = documentSelected.selectedContract;
            const functionSelected = documentSelected.selectedContract.getSelectedFunction(offset);
            if (functionSelected === undefined || functionSelected === null) {
                expressionContainer = contractSelected;
            }
            else {
                expressionContainer = functionSelected;
            }
        }
        const autocompleteByDot = this.buildAutoCompleteExpression(lines[position.line], triggeredByDotStart - 1);
        const expression = this.convertAutoCompleteExpressionToParsedExpression(autocompleteByDot, null, documentSelected, contractSelected, expressionContainer);
        return expression.getInnerCompletionItems();
    }
    static buildAutoCompleteExpression(lineText, wordEndPosition) {
        let searching = true;
        const result = new AutoCompleteExpression();
        // simpler way might be to find the first space or beginning of line
        // and from there split / match (but for now kiss or slowly)
        wordEndPosition = this.getArrayStart(lineText, wordEndPosition, result);
        if (lineText[wordEndPosition] === ')') {
            result.isMethod = true;
            let methodParamBeginFound = false;
            while (!methodParamBeginFound && wordEndPosition >= 0) {
                if (lineText[wordEndPosition] === '(') {
                    methodParamBeginFound = true;
                }
                wordEndPosition = wordEndPosition - 1;
            }
        }
        if (!result.isMethod && !result.isArray) {
            result.isVariable = true;
        }
        while (searching && wordEndPosition >= 0) {
            const currentChar = lineText[wordEndPosition];
            if (this.isAlphaNumeric(currentChar) || currentChar === '_' || currentChar === '$') {
                result.name = currentChar + result.name;
                wordEndPosition = wordEndPosition - 1;
            }
            else {
                if (currentChar === ' ') { // we only want a full word for a variable / method // this cannot be parsed due incomplete statements
                    searching = false;
                    return result;
                }
                else {
                    if (currentChar === '.') {
                        result.parent = this.buildAutoCompleteExpression(lineText, wordEndPosition - 1);
                        result.parent.child = result;
                    }
                }
                searching = false;
                return result;
            }
        }
        return result;
    }
    static getArrayStart(lineText, wordEndPosition, result) {
        if (lineText[wordEndPosition] === ']') {
            result.isArray = true;
            let arrayBeginFound = false;
            while (!arrayBeginFound && wordEndPosition >= 0) {
                if (lineText[wordEndPosition] === '[') {
                    arrayBeginFound = true;
                }
                wordEndPosition = wordEndPosition - 1;
            }
        }
        if (lineText[wordEndPosition] === ']') {
            wordEndPosition = this.getArrayStart(lineText, wordEndPosition, result);
        }
        return wordEndPosition;
    }
    static isAlphaNumeric(str) {
        let code, i, len;
        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    }
}
exports.DotCompletionService = DotCompletionService;
//# sourceMappingURL=dotCompletionService.js.map