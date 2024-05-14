"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedContract = exports.ContractType = void 0;
const ParsedStateVariable_1 = require("./ParsedStateVariable");
const ParsedEnum_1 = require("./ParsedEnum");
const ParsedStruct_1 = require("./ParsedStruct");
const ParsedEvent_1 = require("./ParsedEvent");
const ParsedFunction_1 = require("./ParsedFunction");
const parsedCode_1 = require("./parsedCode");
const parsedUsing_1 = require("./parsedUsing");
const ParsedError_1 = require("./ParsedError");
const ParsedCustomType_1 = require("./ParsedCustomType");
const vscode_languageserver_1 = require("vscode-languageserver");
const ParsedContractIs_1 = require("./ParsedContractIs");
const ParsedExpression_1 = require("./ParsedExpression");
var ContractType;
(function (ContractType) {
    ContractType[ContractType["contract"] = 0] = "contract";
    ContractType[ContractType["interface"] = 1] = "interface";
    ContractType[ContractType["library"] = 2] = "library";
})(ContractType = exports.ContractType || (exports.ContractType = {}));
class ParsedContract extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.functions = [];
        this.enums = [];
        this.events = [];
        this.stateVariables = [];
        this.contractIsStatements = [];
        this.errors = [];
        this.structs = [];
        this.using = [];
        this.customTypes = [];
        this.expressions = [];
        this.constructorFunction = null;
        this.fallbackFunction = null;
        this.receiveFunction = null;
        this.contractType = ContractType.contract;
        this.completionItem = null;
    }
    getAllReferencesToSelected(offset, documents) {
        let results = [];
        if (this.isCurrentElementedSelected(offset)) {
            if (this.isElementedSelected(this.id, offset)) {
                return this.getAllReferencesToThis(documents);
            }
            this.functions.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.expressions.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            if (this.constructorFunction !== null) {
                results = this.mergeArrays(results, this.constructorFunction.getAllReferencesToSelected(offset, documents));
            }
            if (this.fallbackFunction !== null) {
                results = this.mergeArrays(results, this.fallbackFunction.getAllReferencesToSelected(offset, documents));
            }
            if (this.receiveFunction !== null) {
                results = this.mergeArrays(results, this.receiveFunction.getAllReferencesToSelected(offset, documents));
            }
            this.stateVariables.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.enums.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.errors.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.structs.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.events.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.contractIsStatements.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
        }
        return results;
    }
    getAllReferencesToObject(parsedCode) {
        let results = [];
        if (this.isTheSame(parsedCode)) {
            results.push(this.createFoundReferenceLocationResult());
        }
        this.expressions.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.functions.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        if (this.constructorFunction !== null) {
            results = this.mergeArrays(results, this.constructorFunction.getAllReferencesToObject(parsedCode));
        }
        if (this.fallbackFunction !== null) {
            results = this.mergeArrays(results, this.fallbackFunction.getAllReferencesToObject(parsedCode));
        }
        if (this.receiveFunction !== null) {
            results = this.mergeArrays(results, this.receiveFunction.getAllReferencesToObject(parsedCode));
        }
        this.stateVariables.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.enums.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.errors.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.structs.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.events.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        this.contractIsStatements.forEach(x => results = results.concat(x.getAllReferencesToObject(parsedCode)));
        return results;
    }
    initialise(element, document) {
        super.initialise(element, document, this);
        this.name = element.name;
        this.id = element.id;
        this.contractElementType = element.type;
        if (this.element.is_abstract !== undefined || this.element.is_abstract !== null) {
            this.isAbstract = this.element.is_abstract;
        }
        else {
            this.isAbstract = false;
        }
        if (element.type === 'ContractStatement') {
            this.contractType = ContractType.contract;
        }
        if (element.type === 'LibraryStatement') {
            this.contractType = ContractType.library;
        }
        if (element.type === 'InterfaceStatement') {
            this.contractType = ContractType.interface;
        }
        this.contract = this;
        this.initialiseChildren();
        if (this.element !== undefined && this.element !== null) {
            this.initialiseVariablesMembersEtc(this.element, null, null);
        }
    }
    getExtendContracts() {
        const result = [];
        if (this.contractIsStatements.length > 0) {
            this.contractIsStatements.forEach(isStatement => {
                const contractReference = isStatement.getContractReference();
                if (contractReference !== undefined && contractReference !== null) {
                    result.push(contractReference);
                }
            });
        }
        return result;
    }
    getInheritedComment(elementName, extendedContractName) {
        let comment = '';
        const contract = this.document.findContractByName(extendedContractName);
        if (contract !== null) {
            const found = contract.findMethodCalls(elementName);
            if (found.length > 0) {
                comment = found[0].getComment();
            }
        }
        return comment;
    }
    initialiseExtendContracts() {
        if (this.contractIsStatements.length > 0) {
            this.contractIsStatements.forEach(isStatement => {
                const contractReference = isStatement.initialiseContractReference();
            });
        }
    }
    isConstructorSelected(offset) {
        if (this.constructorFunction === null) {
            return false;
        }
        const element = this.constructorFunction.element;
        return this.isElementedSelected(element, offset);
    }
    isFallbackSelected(offset) {
        if (this.fallbackFunction === null) {
            return false;
        }
        const element = this.fallbackFunction.element;
        return this.isElementedSelected(element, offset);
    }
    isReceivableSelected(offset) {
        if (this.receiveFunction === null) {
            return false;
        }
        const element = this.receiveFunction.element;
        return this.isElementedSelected(element, offset);
    }
    getSelectedIsStatement(offset) {
        const foundContractIs = this.contractIsStatements.find(x => {
            return x.isCurrentElementedSelected(offset);
        });
        return foundContractIs;
    }
    getSelectedStructDeclaration(offset) {
        const found = this.structs.find(x => {
            return x.isCurrentElementedSelected(offset);
        });
        return found;
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            let results = [];
            this.functions.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.errors.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.events.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.stateVariables.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.structs.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.using.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.customTypes.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.contractIsStatements.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            this.expressions.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
            if (this.constructorFunction !== null) {
                results = this.mergeArrays(results, this.constructorFunction.getSelectedTypeReferenceLocation(offset));
            }
            if (this.fallbackFunction !== null) {
                results = this.mergeArrays(results, this.fallbackFunction.getSelectedTypeReferenceLocation(offset));
            }
            if (this.receiveFunction !== null) {
                results = this.mergeArrays(results, this.receiveFunction.getSelectedTypeReferenceLocation(offset));
            }
            const foundResult = parsedCode_1.FindTypeReferenceLocationResult.filterFoundResults(results);
            if (foundResult.length > 0) {
                return foundResult;
            }
            else {
                return [this.createFoundReferenceLocationResultNoLocation()];
            }
        }
        return [this.createNotFoundReferenceLocationResult()];
    }
    getSelectedItem(offset) {
        let selectedItem = null;
        if (this.isCurrentElementedSelected(offset)) {
            let allItems = [];
            allItems = allItems.concat(this.functions)
                .concat(this.errors)
                .concat(this.events)
                .concat(this.structs)
                .concat(this.stateVariables)
                .concat(this.customTypes)
                .concat(this.using)
                .concat(this.contractIsStatements)
                .concat(this.expressions)
                .concat(this.constructorFunction)
                .concat(this.fallbackFunction)
                .concat(this.receiveFunction);
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
    findType(name) {
        let typesParsed = [];
        typesParsed = typesParsed.concat(this.getAllConstants())
            .concat(this.getAllCustomTypes())
            .concat(this.getAllStructs())
            .concat(this.getAllEnums())
            .concat(this.document.getAllContracts());
        return typesParsed.find(x => x.name === name);
    }
    getInnerMembers() {
        let typesParsed = [];
        typesParsed = typesParsed.concat(this.getAllConstants())
            .concat(this.getAllStateVariables()).concat(this.getAllEnums()).concat(this.getAllCustomTypes());
        return typesParsed;
    }
    findMembersInScope(name) {
        return this.getInnerMembers().filter(x => x.name === name);
    }
    findInnerMember(name) {
        return this.getInnerMembers().filter(x => x.name === name);
    }
    getInnerMethodCalls() {
        let methodCalls = [];
        methodCalls = methodCalls.concat(this.getAllFunctions())
            .concat(this.getAllEvents())
            .concat(this.getAllErrors())
            .concat(this.document.getAllContracts())
            .concat(this.getAllStructs());
        return methodCalls;
    }
    findMethodCalls(name) {
        return this.getInnerMethodCalls().filter(x => x.name === name);
    }
    getSelectedFunction(offset) {
        let selectedFunction = this.functions.find(x => {
            const element = x.element;
            if (element !== undefined || element !== null) {
                if (element.start <= offset && offset <= element.end) {
                    return true;
                }
            }
            return false;
        });
        if (selectedFunction === undefined) { // nothing
            if (this.isConstructorSelected(offset)) {
                selectedFunction = this.constructorFunction;
            }
            else {
                if (this.isFallbackSelected(offset)) {
                    selectedFunction = this.fallbackFunction;
                }
                else {
                    if (this.isReceivableSelected(offset)) {
                        selectedFunction = this.receiveFunction;
                    }
                }
            }
        }
        return selectedFunction;
    }
    getAllFunctions(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.functions);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllFunctions());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalFunctions());
        }
        return returnItems;
    }
    getAllStructs(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.structs);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllStructs());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalStructs());
        }
        return returnItems;
    }
    getAllErrors(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.errors);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllErrors());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalErrors());
        }
        return returnItems;
    }
    getAllEnums(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.enums);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllEnums());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalEnums());
        }
        return returnItems;
    }
    getAllCustomTypes(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.customTypes);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllCustomTypes());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalCustomTypes());
        }
        return returnItems;
    }
    getAllStateVariables() {
        let returnItems = [];
        returnItems = returnItems.concat(this.stateVariables);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllStateVariables());
        });
        return returnItems;
    }
    getAllConstants() {
        return this.document.getAllGlobalConstants();
    }
    getAllEvents(includeGlobal = true) {
        let returnItems = [];
        returnItems = returnItems.concat(this.events);
        this.getExtendContracts().forEach(contract => {
            returnItems = returnItems.concat(contract.getAllEvents());
        });
        if (includeGlobal) {
            returnItems = returnItems.concat(this.document.getAllGlobalEvents());
        }
        return returnItems;
    }
    getAllUsing(type, processedContracts = new Set()) {
        let returnItems = [];
        // Add the current contract to the processed set
        processedContracts.add(this.document.sourceDocument.absolutePath);
        // Filter the 'using' declarations based on the specified type
        returnItems = returnItems.concat(this.using.filter(x => {
            // existing filter logic
            if (x.forStar === true) {
                return true;
            }
            if (x.for !== null) {
                let validTypeName = false;
                if (x.for.name === type.name || (type.name === 'address_payable' && x.for.name === 'address')) {
                    validTypeName = true;
                }
                return x.for.isArray === type.isArray && validTypeName && x.for.isMapping === type.isMapping;
            }
            return false;
        }));
        // Process each extended contract if not already processed
        this.getExtendContracts().forEach(contract => {
            if (!processedContracts.has(contract.document.sourceDocument.absolutePath)) {
                returnItems = returnItems.concat(contract.getAllUsing(type, processedContracts));
            }
        });
        // Process the document's global 'using' declarations if not already processed
        if (!processedContracts.has(this.document.sourceDocument.absolutePath)) {
            returnItems = returnItems.concat(this.document.getAllGlobalUsing(type));
        }
        // Remove duplicate 'using' declarations
        return returnItems.filter((v, i, self) => {
            return self.findIndex(item => item.name === v.name) === i;
        });
    }
    initialiseChildren() {
        if (typeof this.element.is !== 'undefined' && this.element.is !== null) {
            this.element.is.forEach(isElement => {
                const isStatement = new ParsedContractIs_1.ParsedContractIs();
                isStatement.initialise(isElement, this.document, this, false);
                this.contractIsStatements.push(isStatement);
            });
        }
        if (typeof this.element.body !== 'undefined' && this.element.body !== null) {
            this.element.body.forEach(contractElement => {
                if (contractElement.type === 'FunctionDeclaration') {
                    const functionContract = new ParsedFunction_1.ParsedFunction();
                    functionContract.initialise(contractElement, this.document, this, false);
                    if (functionContract.name === functionContract.contract.name) {
                        this.constructorFunction = functionContract;
                    }
                    else {
                        this.functions.push(functionContract);
                    }
                }
                if (contractElement.type === 'ModifierDeclaration') {
                    const functionContract = new ParsedFunction_1.ParsedFunction();
                    functionContract.initialise(contractElement, this.document, this, false);
                    functionContract.isModifier = true;
                    this.functions.push(functionContract);
                }
                if (contractElement.type === 'ConstructorDeclaration') {
                    const functionContract = new ParsedFunction_1.ParsedFunction();
                    functionContract.isConstructor = true;
                    functionContract.initialise(contractElement, this.document, this, false);
                    this.constructorFunction = functionContract;
                }
                if (contractElement.type === 'FallbackDeclaration') {
                    const functionContract = new ParsedFunction_1.ParsedFunction();
                    functionContract.isFallback = true;
                    functionContract.initialise(contractElement, this.document, this, false);
                    this.fallbackFunction = functionContract;
                }
                if (contractElement.type === 'ReceiveDeclaration') {
                    const functionContract = new ParsedFunction_1.ParsedFunction();
                    functionContract.isReceive = true;
                    functionContract.initialise(contractElement, this.document, this, false);
                    this.receiveFunction = functionContract;
                }
                if (contractElement.type === 'EventDeclaration') {
                    const eventContract = new ParsedEvent_1.ParsedEvent();
                    eventContract.initialise(contractElement, this.document, this, false);
                    this.events.push(eventContract);
                }
                if (contractElement.type === 'StateVariableDeclaration') {
                    const stateVariable = new ParsedStateVariable_1.ParsedStateVariable();
                    stateVariable.initialise(contractElement, this.document, this);
                    this.stateVariables.push(stateVariable);
                }
                if (contractElement.type === 'EnumDeclaration') {
                    const enumContract = new ParsedEnum_1.ParsedEnum();
                    enumContract.initialise(contractElement, this.document, this, false);
                    this.enums.push(enumContract);
                }
                if (contractElement.type === 'StructDeclaration') {
                    const struct = new ParsedStruct_1.ParsedStruct();
                    struct.initialise(contractElement, this.document, this, false);
                    this.structs.push(struct);
                }
                if (contractElement.type === 'TypeDeclaration') {
                    const customType = new ParsedCustomType_1.ParsedCustomType();
                    customType.initialise(contractElement, this.document, this, false);
                    this.customTypes.push(customType);
                }
                if (contractElement.type === 'ErrorDeclaration') {
                    const error = new ParsedError_1.ParsedError();
                    error.initialise(contractElement, this.document, this, false);
                    this.errors.push(error);
                }
                if (contractElement.type === 'UsingStatement') {
                    const using = new parsedUsing_1.ParsedUsing();
                    using.initialise(contractElement, this.document, this, false);
                    this.using.push(using);
                }
            });
        }
    }
    createCompletionItem() {
        if (this.completionItem === null) {
            const completionItem = vscode_languageserver_1.CompletionItem.create(this.name);
            if (this.contractType === ContractType.interface) {
                completionItem.kind = vscode_languageserver_1.CompletionItemKind.Interface;
            }
            else {
                completionItem.kind = vscode_languageserver_1.CompletionItemKind.Class;
            }
            completionItem.insertText = this.name;
            completionItem.detail = '(' + this.getContractTypeName(this.contractType) + ' : ' + this.name + ') in ' + this.document.sourceDocument.absolutePath;
            this.completionItem = completionItem;
        }
        return this.completionItem;
    }
    getInfo() {
        var _a;
        const contracType = this.getParsedObjectType();
        return '### ' + contracType + ': ' + this.name + '\n' +
            '##### ' + ((_a = this.document.sourceDocument) === null || _a === void 0 ? void 0 : _a.absolutePath) + '\n' +
            this.getComment();
    }
    getParsedObjectType() {
        return this.contract.getContractTypeName(this.contract.contractType);
    }
    getAllFunctionCompletionItems() {
        const completionItems = [];
        this.getAllFunctions().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllEventsCompletionItems() {
        const completionItems = [];
        this.getAllEvents().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllErrorsCompletionItems() {
        const completionItems = [];
        this.getAllErrors().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllStructsCompletionItems() {
        const completionItems = [];
        this.getAllStructs().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllEnumsCompletionItems() {
        const completionItems = [];
        this.getAllEnums().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllCustomTypesCompletionItems() {
        const completionItems = [];
        this.getAllCustomTypes().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllConstantCompletionItems() {
        const completionItems = [];
        this.getAllConstants().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllStateVariableCompletionItems() {
        const completionItems = [];
        this.getAllStateVariables().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getInnerCompletionItems() {
        let completionItems = [];
        completionItems = completionItems.concat(this.getAllFunctions(false).map(x => x.createCompletionItem()));
        completionItems = completionItems.concat(this.getAllStateVariableCompletionItems());
        completionItems = completionItems.concat(this.getAllErrors(false).map(x => x.createCompletionItem()));
        completionItems = completionItems.concat(this.getAllStructs(false).map(x => x.createCompletionItem()));
        completionItems = completionItems.concat(this.getAllEnums(false).map(x => x.createCompletionItem()));
        return completionItems;
    }
    getSelectedContractCompletionItems(offset) {
        let completionItems = [];
        completionItems = completionItems.concat(this.getAllFunctionCompletionItems());
        completionItems = completionItems.concat(this.getAllEventsCompletionItems());
        completionItems = completionItems.concat(this.getAllStateVariableCompletionItems());
        completionItems = completionItems.concat(this.getAllStructsCompletionItems());
        completionItems = completionItems.concat(this.getAllEnumsCompletionItems());
        completionItems = completionItems.concat(this.getAllCustomTypesCompletionItems());
        completionItems = completionItems.concat(this.getAllConstantCompletionItems());
        completionItems = completionItems.concat(this.document.getAllGlobalContractsCompletionItems());
        const selectedFunction = this.getSelectedFunction(offset);
        if (selectedFunction !== undefined) {
            selectedFunction.input.forEach(parameter => {
                completionItems.push(parameter.createParamCompletionItem('function parameter', selectedFunction.contract.name));
            });
            selectedFunction.output.forEach(parameter => {
                completionItems.push(parameter.createParamCompletionItem('return parameter', selectedFunction.contract.name));
            });
            const variablesInScope = selectedFunction.findVariableDeclarationsInScope(offset);
            variablesInScope.forEach(variable => {
                completionItems.push(variable.createCompletionItem());
            });
        }
        return completionItems;
    }
    getContractTypeName(contractType) {
        switch (contractType) {
            case ContractType.contract:
                return 'Contract';
            case ContractType.interface:
                return 'Interface';
            case ContractType.library:
                return 'Library';
            default:
                break;
        }
    }
    initialiseVariablesMembersEtc(statement, parentStatement, child) {
        try {
            if (statement !== undefined && statement !== null && statement.type !== undefined && statement.type !== null) {
                switch (statement.type) {
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
                    case 'FunctionDeclaration':
                        break;
                    case 'ConstructorDeclaration':
                        break;
                    case 'FallbackDeclaration':
                        break;
                    case 'ReceiveDeclaration':
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
}
exports.ParsedContract = ParsedContract;
//# sourceMappingURL=parsedContract.js.map