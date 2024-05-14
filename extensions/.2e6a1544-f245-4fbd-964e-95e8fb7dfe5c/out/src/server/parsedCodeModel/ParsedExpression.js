"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedExpressionIdentifier = exports.ParsedExpressionCall = exports.ParsedExpression = exports.ExpressionType = void 0;
const parsedContract_1 = require("./parsedContract");
const parsedCode_1 = require("./parsedCode");
const parsedDeclarationType_1 = require("./parsedDeclarationType");
const ParsedFunction_1 = require("./ParsedFunction");
const ParsedEnum_1 = require("./ParsedEnum");
const ParsedStruct_1 = require("./ParsedStruct");
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["Call"] = 0] = "Call";
    ExpressionType[ExpressionType["Identifier"] = 1] = "Identifier";
})(ExpressionType = exports.ExpressionType || (exports.ExpressionType = {}));
class ParsedExpression extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.parent = null;
        this.child = null;
        this.reference = null;
        this.expressionType = null;
        this.expressionContainer = null;
    }
    static createFromMemberExpression(element, document, contract, child, expressionContainer) {
        if (element.type === 'MemberExpression') {
            if (element.isArray === false) {
                let memberChildObject = null;
                if (element.property !== undefined && element.property !== null) {
                    memberChildObject = this.createFromElement(element.property, document, contract, child, expressionContainer);
                    if (child !== null) {
                        child.parent = memberChildObject;
                    }
                }
                let memberParentProperty = null;
                if (element.object !== undefined && element.object !== null) {
                    memberParentProperty = this.createFromElement(element.object, document, contract, memberChildObject, expressionContainer);
                    if (memberChildObject !== null) {
                        memberChildObject.parent = memberParentProperty;
                    }
                }
                return memberChildObject;
            }
            else {
                let memberChildObject = null;
                if (element.object !== undefined && element.object !== null) {
                    memberChildObject = this.createFromElement(element.object, document, contract, child, expressionContainer);
                    if (child !== null) {
                        child.parent = memberChildObject;
                    }
                }
                if (element.property !== undefined && element.property !== null) {
                    if (Array.isArray(element.property)) {
                        element.array.forEach(item => {
                            expressionContainer.initialiseVariablesMembersEtc(item, element, null);
                        });
                    }
                    else {
                        expressionContainer.initialiseVariablesMembersEtc(element.property, element, null);
                    }
                }
                return memberChildObject;
            }
        }
    }
    static createFromElement(element, document, contract, child, expressionContainer) {
        if (element.type !== undefined && element.type !== null) {
            switch (element.type) {
                case 'CallExpression':
                    const callExpression = new ParsedExpressionCall();
                    callExpression.initialiseExpression(element, document, contract, child, expressionContainer);
                    if (child !== null) {
                        child.parent = callExpression;
                    }
                    return callExpression;
                    break;
                case 'MemberExpression': // e.g. x.y x.f(y) arr[1] map['1'] arr[i] map[k]
                    return this.createFromMemberExpression(element, document, contract, child, expressionContainer);
                    break;
                case 'Identifier':
                    const expressionIdentifier = new ParsedExpressionIdentifier();
                    expressionIdentifier.initialiseExpression(element, document, contract, child, expressionContainer);
                    if (child !== null) {
                        child.parent = expressionIdentifier;
                    }
                    return expressionIdentifier;
                    break;
            }
        }
        return null;
    }
    // tslint:disable-next-line:member-ordering
    initialiseExpression(element, document, contract, parent, expressionContainer) {
        this.name = element.name;
        this.parent = parent;
        this.initialise(element, document, contract);
        this.expressionContainer = expressionContainer;
    }
    initialiseVariablesMembersEtc(statement, parentStatement) {
        if (statement.type !== undefined && statement.type !== null) {
            switch (statement.type) {
                case 'CallExpression': // e.g. Func(x, y)
                    ParsedExpression.createFromElement(statement, this.document, this.contract, this, this.expressionContainer);
                    break;
                case 'MemberExpression': // e.g. x.y x.f(y) arr[1] map['1'] arr[i] map[k]
                    ParsedExpression.createFromElement(statement, this.document, this.contract, this, this.expressionContainer);
                    break;
                case 'Identifier':
                    ParsedExpression.createFromElement(statement, this.document, this.contract, this, this.expressionContainer);
                    break;
                default:
                    for (const key in statement) {
                        if (statement.hasOwnProperty(key)) {
                            const element = statement[key];
                            if (element instanceof Array) {
                                // recursively drill down to collections e.g. statements, params
                                element.forEach(innerElement => {
                                    this.initialiseVariablesMembersEtc(innerElement, statement);
                                });
                            }
                            else if (element instanceof Object) {
                                // recursively drill down to elements with start/end e.g. literal type
                                if (element.hasOwnProperty('start') && element.hasOwnProperty('end')) {
                                    this.initialiseVariablesMembersEtc(element, statement);
                                }
                            }
                        }
                    }
            }
        }
    }
}
exports.ParsedExpression = ParsedExpression;
class ParsedExpressionCall extends ParsedExpression {
    // tslint:disable-next-line:member-ordering
    initialiseExpression(element, document, contract, child, expressionContainer) {
        this.element = element;
        this.child = child;
        this.document = document;
        this.contract = contract;
        this.expressionObjectType = ExpressionType.Call;
        this.expressionContainer = expressionContainer;
        if (this.element.callee.type === 'Identifier') {
            this.name = this.element.callee.name;
        }
        if (this.element.callee.type === 'MemberExpression') {
            if (this.element.callee.property.type === 'Identifier') {
                this.name = this.element.callee.property.name;
            }
            this.initialiseVariablesMembersEtc(this.element.callee.object, this.element);
        }
        if (this.element.arguments !== undefined && this.element.arguments !== null) {
            this.element.arguments.forEach(arg => {
                this.expressionContainer.initialiseVariablesMembersEtc(arg, this.element, null);
            });
        }
    }
    getAllReferencesToSelected(offset, documents) {
        this.initReference();
        this.initExpressionType();
        const results = [];
        if (this.isCurrentElementedSelected(offset)) {
            if (this.isElementedSelected(this.element.callee, offset)) {
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return results.concat(this.parent.getAllReferencesToSelected(offset, documents));
                    }
                }
                if (this.reference !== null) {
                    return results.concat(this.reference.getAllReferencesToThis(documents));
                }
                return results;
            }
        }
        return results;
    }
    getSelectedItem(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            if (this.isElementedSelected(this.element.callee, offset)) {
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedItem(offset);
                    }
                }
                return this;
            }
        }
        return null;
    }
    getAllReferencesToObject(parsedCode) {
        this.initReference();
        this.initExpressionType();
        let results = [];
        if (this.reference !== null && this.reference.isTheSame(parsedCode)) {
            results.push(this.createFoundReferenceLocationResult());
        }
        if (this.parent !== null) {
            results = results.concat(this.parent.getAllReferencesToObject(parsedCode));
        }
        return results;
    }
    getInnerMembers() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMembers();
        }
        return [];
    }
    getInnerCompletionItems() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerCompletionItems();
        }
        return [];
    }
    getInnerMethodCalls() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMethodCalls();
        }
        return [];
    }
    getInfo() {
        this.initReference();
        this.initExpressionType();
        if (this.reference !== null) {
            return this.reference.getInfo();
        }
        return '';
    }
    initReference() {
        if (this.reference == null) {
            if (this.parent === null) {
                const foundResults = this.findMethodsInScope(this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
            else {
                const foundResults = this.parent.getInnerMethodCalls().filter(x => x.name === this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
        }
    }
    initExpressionType() {
        if (this.expressionType === null) {
            if (this.reference !== null) {
                if (this.reference instanceof ParsedFunction_1.ParsedFunction) {
                    const functionReference = this.reference;
                    if (functionReference.output !== undefined && functionReference.output.length > 0) {
                        this.expressionType = functionReference.output[0].type;
                    }
                }
                if (this.reference instanceof parsedContract_1.ParsedContract || this.reference instanceof ParsedStruct_1.ParsedStruct) {
                    const contractExpressionType = new parsedDeclarationType_1.ParsedDeclarationType();
                    contractExpressionType.contract = this.contract;
                    contractExpressionType.document = this.document;
                    contractExpressionType.type = this.reference;
                    this.expressionType = contractExpressionType;
                }
            }
        }
    }
    getSelectedTypeReferenceLocation(offset) {
        this.initReference();
        this.initExpressionType();
        if (this.isCurrentElementedSelected(offset)) {
            if (this.isElementedSelected(this.element.callee, offset)) {
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedTypeReferenceLocation(offset);
                    }
                }
                if (this.reference !== null) {
                    return [parsedCode_1.FindTypeReferenceLocationResult.create(true, this.reference.getLocation())];
                }
                return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
            }
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
}
exports.ParsedExpressionCall = ParsedExpressionCall;
class ParsedExpressionIdentifier extends ParsedExpression {
    // tslint:disable-next-line:member-ordering
    initialiseExpression(element, document, contract, child, expressionContainer) {
        this.element = element;
        this.child = child;
        this.document = document;
        this.contract = contract;
        this.expressionObjectType = ExpressionType.Identifier;
        this.expressionContainer = expressionContainer;
        this.name = this.element.name;
    }
    getAllReferencesToSelected(offset, documents) {
        this.initReference();
        this.initExpressionType();
        const results = [];
        if (this.isCurrentElementedSelected(offset)) {
            if (this.parent !== null) {
                if (this.parent.isCurrentElementedSelected(offset)) {
                    return results.concat(this.parent.getAllReferencesToSelected(offset, documents));
                }
            }
            if (this.reference !== null) {
                return results.concat(this.reference.getAllReferencesToThis(documents));
            }
            return [this.createFoundReferenceLocationResult()];
        }
        else { // in case the parent is a member and not part of the element
            if (this.parent !== null) {
                if (this.parent.isCurrentElementedSelected(offset)) {
                    return results.concat(this.parent.getAllReferencesToSelected(offset, documents));
                }
            }
        }
        return results;
    }
    getSelectedItem(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            if (this.parent !== null) {
                if (this.parent.isCurrentElementedSelected(offset)) {
                    return this.parent.getSelectedItem(offset);
                }
            }
            return this;
        }
        else { // in case the parent is a member and not part of the element
            if (this.parent !== null) {
                if (this.parent.isCurrentElementedSelected(offset)) {
                    return this.parent.getSelectedItem(offset);
                }
            }
        }
        return null;
    }
    getAllReferencesToObject(parsedCode) {
        this.initReference();
        this.initExpressionType();
        let results = [];
        if (this.reference !== null && this.reference.isTheSame(parsedCode)) {
            results.push(this.createFoundReferenceLocationResult());
        }
        if (this.parent !== null) {
            results = results.concat(this.parent.getAllReferencesToObject(parsedCode));
        }
        return results;
    }
    getInnerCompletionItems() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerCompletionItems();
        }
        return [];
    }
    getInnerMembers() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMembers();
        }
        return [];
    }
    getInnerMethodCalls() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMethodCalls();
        }
        return [];
    }
    initReference() {
        if (this.reference == null) {
            if (this.parent === null) {
                let foundResults = this.expressionContainer.findMembersInScope(this.name);
                foundResults = foundResults.concat(this.document.getAllContracts().filter(x => x.name === this.name));
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
            else {
                const foundResults = this.parent.getInnerMembers().filter(x => x.name === this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
        }
    }
    isCurrentElementedSelected(offset) {
        var _a;
        return super.isCurrentElementedSelected(offset) || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isCurrentElementedSelected(offset));
    }
    initExpressionType() {
        if (this.expressionType === null) {
            if (this.reference !== null) {
                const variable = this.reference;
                if (variable.type !== undefined) {
                    this.expressionType = variable.type;
                }
                else {
                    if (this.reference instanceof parsedContract_1.ParsedContract || this.reference instanceof ParsedEnum_1.ParsedEnum) {
                        const contractExpressionType = new parsedDeclarationType_1.ParsedDeclarationType();
                        contractExpressionType.contract = this.contract;
                        contractExpressionType.document = this.document;
                        contractExpressionType.type = this.reference;
                        this.expressionType = contractExpressionType;
                    }
                }
            }
        }
    }
    getInfo() {
        this.initReference();
        this.initExpressionType();
        if (this.reference !== null) {
            return this.reference.getInfo();
        }
        return '';
    }
    getSelectedTypeReferenceLocation(offset) {
        try {
            this.initReference();
            this.initExpressionType();
            if (this.isCurrentElementedSelected(offset)) {
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedTypeReferenceLocation(offset);
                    }
                }
                if (this.reference !== null) {
                    return [parsedCode_1.FindTypeReferenceLocationResult.create(true, this.reference.getLocation())];
                }
                return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
            }
            else { // in case the parent is a member and not part of the element
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedTypeReferenceLocation(offset);
                    }
                }
            }
            return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
        }
        catch (error) {
            return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
        }
    }
}
exports.ParsedExpressionIdentifier = ParsedExpressionIdentifier;
//# sourceMappingURL=ParsedExpression.js.map