"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedFunction = void 0;
const parsedCode_1 = require("./parsedCode");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
const ParsedParameter_1 = require("./ParsedParameter");
const ParsedFunctionVariable_1 = require("./ParsedFunctionVariable");
const vscode_languageserver_1 = require("vscode-languageserver");
const ParsedModifierArgument_1 = require("./ParsedModifierArgument");
const ParsedExpression_1 = require("./ParsedExpression");
class ParsedFunction extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.input = [];
        this.output = [];
        this.modifiers = [];
        this.variables = [];
        this.expressions = [];
        this.isConstructor = false;
        this.isFallback = false;
        this.isReceive = false;
        this.completionItem = null;
    }
    getAllReferencesToSelected(offset, documents) {
        let results = [];
        if (this.isCurrentElementedSelected(offset)) {
            this.input.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.output.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.expressions.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.variables.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.modifiers.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            if (results.length === 0) {
                if (this.isElementedSelected(this.id, offset)) {
                    return this.getAllReferencesToThis(documents);
                }
            }
        }
        return results;
    }
    getSelectedItem(offset) {
        let selectedItem = null;
        if (this.isCurrentElementedSelected(offset)) {
            let allItems = [];
            allItems = allItems.concat(this.input)
                .concat(this.output)
                .concat(this.expressions)
                .concat(this.variables)
                .concat(this.modifiers);
            for (const item of allItems) {
                if (item === null) {
                    continue;
                }
                selectedItem = item.getSelectedItem(offset);
                if (selectedItem !== null) {
                    return selectedItem;
                }
            }
            return this;
        }
        return selectedItem;
    }
    getAllReferencesToObject(parsedCode) {
        let results = [];
        if (this.isTheSame(parsedCode)) {
            results.push(this.createFoundReferenceLocationResult());
        }
        this.expressions.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.input.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.output.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.variables.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.modifiers.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        return results;
    }
    generateNatSpec() {
        return '/**\n' +
            '* @notice ' + this.name.split(/(?=[A-Z])/).map(x => x.toLowerCase()).join(' ') + ' \n' +
            '* @dev extra info for developers \n';
        /**
       * @dev Clears a ConsiderationItem from storage.
       *
       * @param item the ConsiderationItem to clear.
       */
    }
    generateSelectedNatspec(offset) {
        return this.generateNatSpec();
    }
    initialise(element, document, contract, isGlobal) {
        super.initialise(element, document, contract, isGlobal);
        this.supportsNatSpec = true;
        this.id = element.id;
        if (!this.isConstructor && !this.isReceive && !this.isFallback) {
            this.name = element.name;
        }
        else {
            this.name = '';
        }
        this.initialiseParameters();
        this.initialiseModifiers();
        if (this.element.body !== undefined && this.element.body !== null) {
            this.initialiseVariablesMembersEtc(this.element.body, null, null);
        }
    }
    initialiseParameters() {
        this.input = ParsedParameter_1.ParsedParameter.extractParameters(this.element.params, this.contract, this.document, this);
        this.output = ParsedParameter_1.ParsedParameter.extractParameters(this.element.returnParams, this.contract, this.document, this);
    }
    initialiseModifiers() {
        if (this.element.modifiers !== undefined && this.element.modifiers !== null) {
            this.element.modifiers.forEach(element => {
                const parsedModifier = new ParsedModifierArgument_1.ParsedModifierArgument();
                parsedModifier.initialiseModifier(element, this, this.document);
                this.modifiers.push(parsedModifier);
            });
        }
    }
    findVariableDeclarationsInScope(offset) {
        let result = [];
        if (this.element.is_abstract === false || this.element.is_abstract === undefined) {
            if (this.element.body !== 'undefined' && this.element.body.type === 'BlockStatement') {
                result = result.concat(this.findVariableDeclarationsInInnerScope(offset, this.element.body));
            }
        }
        return result;
    }
    findAllLocalAndGlobalVariablesByName(offset, name) {
        return this.findAllLocalAndGlobalVariables(offset).filter(x => x.name === name);
    }
    findAllLocalAndGlobalVariables(offset) {
        const result = [];
        return result.concat(this.findVariableDeclarationsInScope(offset))
            .concat(this.contract.getInnerMembers());
    }
    getInnerMembers() {
        const result = [];
        if (this.contract !== null) {
            return result.concat(this.variables)
                .concat(this.contract.getInnerMembers()).concat(this.input).concat(this.output);
        }
        else {
            return result.concat(this.variables)
                .concat(this.document.getInnerMembers()).concat(this.input).concat(this.output);
        }
    }
    findMembersInScope(name) {
        return this.getInnerMembers().filter(x => x.name === name);
    }
    findVariableDeclarationsInInnerScope(offset, block) {
        let result = [];
        if (block !== undefined && block !== null) {
            if (this.isElementedSelected(block, offset)) {
                if (block.body !== 'undefined') {
                    block.body.forEach(blockBodyElement => {
                        if (blockBodyElement.type === 'ExpressionStatement') {
                            const expression = blockBodyElement.expression;
                            const foundVar = this.createVariableInScopeFromExpression(expression);
                            if (foundVar !== null) {
                                result.push(foundVar);
                            }
                        }
                        if (blockBodyElement.type === 'ForStatement') {
                            if (this.isElementedSelected(blockBodyElement, offset)) {
                                const foundVar = this.createVariableInScopeFromExpression(blockBodyElement.init);
                                if (foundVar !== null) {
                                    result.push(foundVar);
                                }
                                result = result.concat(this.findVariableDeclarationsInInnerScope(offset, blockBodyElement.body));
                            }
                        }
                        if (blockBodyElement.type === 'IfStatement') {
                            if (this.isElementedSelected(blockBodyElement, offset)) {
                                result = result.concat(this.findVariableDeclarationsInInnerScope(offset, blockBodyElement.consequent));
                                result = result.concat(this.findVariableDeclarationsInInnerScope(offset, blockBodyElement.alternate));
                            }
                        }
                    });
                }
            }
        }
        return result;
    }
    createCompletionItem(skipFirstParamSnipppet = false) {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            completionItem.kind = vscode_languageserver_1.CompletionItemKind.Function;
            const paramsSnippet = ParsedParameter_1.ParsedParameter.createFunctionParamsSnippet(this.element.params, skipFirstParamSnipppet);
            let returnParamsInfo = ParsedParameter_1.ParsedParameter.createParamsInfo(this.element.returnParams);
            if (returnParamsInfo !== '') {
                returnParamsInfo = ' returns (' + returnParamsInfo + ')';
            }
            let contractName = '';
            if (!this.isGlobal) {
                contractName = this.contract.name;
            }
            else {
                contractName = this.document.getGlobalPathInfo();
            }
            completionItem.insertTextFormat = 2;
            let closingSemi = ';';
            if (this.isModifier) {
                closingSemi = '';
            }
            completionItem.insertText = this.name + '(' + paramsSnippet + ')' + closingSemi;
            let functionType = 'Function';
            if (this.isModifier) {
                functionType = 'Modifier';
            }
            completionItem.documentation = this.getMarkupInfo();
            // completionItem.detail = this.getDetail();
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getDetail() {
        let functionType = 'Function';
        if (this.isModifier) {
            functionType = 'Modifier';
        }
        return functionType + ': ' + this.name + '\n' +
            this.getContractNameOrGlobal() + '\n';
    }
    getInfo() {
        const functionType = this.getParsedObjectType();
        return '### ' + functionType + ': ' + this.name + '\n' +
            '#### ' + this.getContractNameOrGlobal() + '\n' +
            '\t' + this.getSignature() + ' \n\n' +
            this.getComment();
    }
    getParsedObjectType() {
        if (this.isModifier) {
            return 'Modifier';
        }
        if (this.isConstructor) {
            return 'Constructor';
        }
        if (this.isReceive) {
            return 'Receive';
        }
        if (this.isFallback) {
            return 'Fallback';
        }
        return 'Function';
    }
    getDeclaration() {
        if (this.isModifier) {
            return 'modifier';
        }
        if (this.isConstructor) {
            return 'constructor';
        }
        if (this.isReceive) {
            return 'receive';
        }
        if (this.isFallback) {
            return 'fallback';
        }
        return 'function';
    }
    getSignature() {
        const paramsInfo = ParsedParameter_1.ParsedParameter.createParamsInfo(this.element.params);
        let returnParamsInfo = ParsedParameter_1.ParsedParameter.createParamsInfo(this.element.returnParams);
        if (returnParamsInfo !== '') {
            returnParamsInfo = ' returns (' + returnParamsInfo + ')';
        }
        return this.getDeclaration() + ' ' + this.name + '(' + paramsInfo + ') \n\t\t\t\t' + this.modifiers.map(x => x.name).join(' ') + returnParamsInfo;
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            let results = [];
            this.input.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.output.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.variables.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.modifiers.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.expressions.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            const foundResult = parsedCode_1.FindTypeReferenceLocationResult.filterFoundResults(results);
            if (foundResult.length > 0) {
                return foundResult;
            }
            else {
                return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
            }
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
    initialiseVariablesMembersEtc(statement, parentStatement, child) {
        try {
            if (statement !== undefined && statement !== null && statement.type !== undefined && statement.type !== null) {
                switch (statement.type) {
                    case 'DeclarativeExpression':
                        const variable = new ParsedFunctionVariable_1.ParsedFunctionVariable();
                        variable.element = statement;
                        variable.name = statement.name;
                        variable.document = this.document;
                        variable.type = parsedDeclarationType_1.ParsedDeclarationType.create(statement.literal, this.contract, this.document);
                        variable.function = this;
                        this.variables.push(variable);
                        break;
                    case 'CallExpression': // e.g. Func(x, y)
                        const callExpression = ParsedExpression_1.ParsedExpression.createFromElement(statement, this.document, this.contract, child, this);
                        this.expressions.push(callExpression);
                        break;
                    case 'MemberExpression': // e.g. x.y x.f(y) arr[1] map['1'] arr[i] map[k]
                        const memberCreated = ParsedExpression_1.ParsedExpression.createFromMemberExpression(statement, this.document, this.contract, child, this);
                        if (memberCreated !== undefined) {
                            this.expressions.push(memberCreated);
                        }
                        else {
                            console.log(statement);
                        }
                        break;
                    case 'Identifier':
                        const identifier = ParsedExpression_1.ParsedExpression.createFromElement(statement, this.document, this.contract, child, this);
                        this.expressions.push(identifier);
                        break;
                    default:
                        for (const key in statement) {
                            if (statement.hasOwnProperty(key)) {
                                const element = statement[key];
                                if (element instanceof Array) {
                                    // recursively drill down to collections e.g. statements, params
                                    element.forEach(innerElement => {
                                        this.initialiseVariablesMembersEtc(innerElement, statement, null);
                                    });
                                }
                                else if (element instanceof Object) {
                                    // recursively drill down to elements with start/end e.g. literal type
                                    if (element.hasOwnProperty('start') && element.hasOwnProperty('end')) {
                                        this.initialiseVariablesMembersEtc(element, statement, null);
                                    }
                                }
                            }
                        }
                }
            }
        }
        catch (error) {
            console.log(error.message);
            console.log(error.stack);
        }
    }
    createVariableInScopeFromExpression(expression) {
        let declarationStatement = null;
        if (expression.type === 'AssignmentExpression') {
            if (expression.left.type === 'DeclarativeExpression') {
                declarationStatement = expression.left;
            }
        }
        if (expression.type === 'DeclarativeExpression') {
            declarationStatement = expression;
        }
        if (declarationStatement !== null) {
            const variable = new ParsedFunctionVariable_1.ParsedFunctionVariable();
            variable.element = declarationStatement;
            variable.name = declarationStatement.name;
            variable.document = this.document;
            variable.type = parsedDeclarationType_1.ParsedDeclarationType.create(declarationStatement.literal, this.contract, this.document);
            variable.function = this;
            return variable;
        }
        return null;
    }
}
exports.ParsedFunction = ParsedFunction;
//# sourceMappingURL=ParsedFunction.js.map