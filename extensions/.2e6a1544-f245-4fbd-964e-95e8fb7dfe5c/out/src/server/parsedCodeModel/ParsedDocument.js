"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedDocument = void 0;
const ParsedEnum_1 = require("./ParsedEnum");
const ParsedEvent_1 = require("./ParsedEvent");
const ParsedFunction_1 = require("./ParsedFunction");
const ParsedStruct_1 = require("./ParsedStruct");
const parsedContract_1 = require("./parsedContract");
const parsedUsing_1 = require("./parsedUsing");
const ParsedImport_1 = require("./ParsedImport");
const ParsedError_1 = require("./ParsedError");
const ParsedConstant_1 = require("./ParsedConstant");
const ParsedCustomType_1 = require("./ParsedCustomType");
const vscode_uri_1 = require("vscode-uri");
const vscode_languageserver_1 = require("vscode-languageserver");
const parsedCode_1 = require("./parsedCode");
const ParsedExpression_1 = require("./ParsedExpression");
class ParsedDocument extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.innerContracts = [];
        this.functions = [];
        this.events = [];
        this.enums = [];
        this.usings = [];
        this.structs = [];
        this.importedDocuments = [];
        this.imports = [];
        this.errors = [];
        this.constants = [];
        this.customTypes = [];
        this.expressions = [];
        this.fixedSource = null;
    }
    getDocumentsThatReference(document, processedDocuments = new Set()) {
        let returnItems = [];
        // Check if this document has already been processed
        if (processedDocuments.has(this.sourceDocument.absolutePath)) {
            return returnItems;
        }
        // Add the current document to the processed set
        processedDocuments.add(this.sourceDocument.absolutePath);
        if (this.isTheSame(document) || this.sourceDocument.absolutePath === document.sourceDocument.absolutePath) {
            returnItems.push(this);
        }
        else {
            this.imports.forEach(importedDoc => {
                returnItems = returnItems.concat(importedDoc.getDocumentsThatReference(document, processedDocuments));
            });
            if (returnItems.length > 0) {
                returnItems.push(this);
            }
        }
        return returnItems;
    }
    addImportedDocument(document) {
        if (!this.importedDocuments.includes(document) && this !== document) {
            this.importedDocuments.push(document);
        }
    }
    getAllContracts() {
        let returnItems = [];
        returnItems = returnItems.concat(this.innerContracts);
        this.importedDocuments.forEach(document => {
            returnItems = returnItems.concat(document.innerContracts);
        });
        return returnItems;
    }
    getAllGlobalFunctions() {
        let returnItems = [];
        returnItems = returnItems.concat(this.functions);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.functions);
        });
        return returnItems;
    }
    getAllGlobalErrors() {
        let returnItems = [];
        returnItems = returnItems.concat(this.errors);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.errors);
        });
        return returnItems;
    }
    getAllGlobalStructs() {
        let returnItems = [];
        returnItems = returnItems.concat(this.structs);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.structs);
        });
        return returnItems;
    }
    getAllGlobalEnums() {
        let returnItems = [];
        returnItems = returnItems.concat(this.enums);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.enums);
        });
        return returnItems;
    }
    getAllGlobalConstants() {
        let returnItems = [];
        returnItems = returnItems.concat(this.constants);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.constants);
        });
        return returnItems;
    }
    getAllGlobalEvents() {
        let returnItems = [];
        returnItems = returnItems.concat(this.events);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.events);
        });
        return returnItems;
    }
    getAllGlobalCustomTypes() {
        let returnItems = [];
        returnItems = returnItems.concat(this.customTypes);
        this.importedDocuments.forEach(document => {
            returnItems = this.mergeArrays(returnItems, document.customTypes);
        });
        return returnItems;
    }
    getAllGlobalUsing(type, processedDocuments = new Set()) {
        var _a;
        let returnItems = [];
        // Add the current document to the processed set
        processedDocuments.add((_a = this.sourceDocument) === null || _a === void 0 ? void 0 : _a.absolutePath);
        // Filter the 'using' declarations based on the specified type
        returnItems = returnItems.concat(this.usings.filter(x => {
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
        // Process each imported document if not already processed
        this.importedDocuments.forEach(document => {
            var _a;
            if (!processedDocuments.has((_a = document.sourceDocument) === null || _a === void 0 ? void 0 : _a.absolutePath)) {
                returnItems = this.mergeArrays(returnItems, document.getAllGlobalUsing(type, processedDocuments));
            }
        });
        // Remove duplicate 'using' declarations
        return returnItems.filter((v, i, self) => {
            return self.findIndex(item => item.name === v.name) === i;
        });
    }
    initialiseDocumentReferences(documents) {
        this.importedDocuments = [];
        this.imports.forEach(x => x.initialiseDocumentReference(documents));
        this.innerContracts.forEach(x => x.initialiseExtendContracts());
    }
    initialiseDocument(documentElement, selectedElement = null, sourceDocument, fixedSource = null) {
        this.element = documentElement;
        this.sourceDocument = sourceDocument;
        this.document = this;
        this.fixedSource = fixedSource;
        this.selectedElement = selectedElement;
        if (this.element !== undefined && this.element !== null) {
            this.initialiseVariablesMembersEtc(this.element, null, null);
        }
        documentElement.body.forEach(element => {
            if (element.type === 'ContractStatement' || element.type === 'LibraryStatement' || element.type === 'InterfaceStatement') {
                const contract = new parsedContract_1.ParsedContract();
                contract.initialise(element, this);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedContract = contract;
                }
                this.innerContracts.push(contract);
            }
            if (element.type === 'FileLevelConstant') {
                const constant = new ParsedConstant_1.ParsedConstant();
                constant.initialise(element, this);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedConstant = constant;
                }
                this.constants.push(constant);
            }
            if (element.type === 'ImportStatement') {
                const importDocument = new ParsedImport_1.ParsedImport();
                importDocument.initialise(element, this);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedImport = importDocument;
                }
                this.imports.push(importDocument);
            }
            if (element.type === 'FunctionDeclaration') {
                const functionDocument = new ParsedFunction_1.ParsedFunction();
                functionDocument.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedFunction = functionDocument;
                }
                this.functions.push(functionDocument);
            }
            if (element.type === 'ModifierDeclaration') {
                const functionDocument = new ParsedFunction_1.ParsedFunction();
                functionDocument.initialise(element, this, null, true);
                functionDocument.isModifier = true;
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedFunction = functionDocument;
                }
                this.functions.push(functionDocument);
            }
            if (element.type === 'EventDeclaration') {
                const eventDocument = new ParsedEvent_1.ParsedEvent();
                eventDocument.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedEvent = eventDocument;
                }
                this.events.push(eventDocument);
            }
            if (element.type === 'EnumDeclaration') {
                const enumDocument = new ParsedEnum_1.ParsedEnum();
                enumDocument.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedEnum = enumDocument;
                }
                this.enums.push(enumDocument);
            }
            if (element.type === 'StructDeclaration') {
                const struct = new ParsedStruct_1.ParsedStruct();
                struct.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedStruct = struct;
                }
                this.structs.push(struct);
            }
            if (element.type === 'TypeDeclaration') {
                const customType = new ParsedCustomType_1.ParsedCustomType();
                customType.initialise(element, this, null, true);
                this.customTypes.push(customType);
            }
            if (element.type === 'ErrorDeclaration') {
                const documentError = new ParsedError_1.ParsedError();
                documentError.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedError = documentError;
                }
                this.errors.push(documentError);
            }
            if (element.type === 'UsingStatement') {
                const using = new parsedUsing_1.ParsedUsing();
                using.initialise(element, this, null, true);
                if (this.matchesElement(selectedElement, element)) {
                    this.selectedUsing = using;
                }
                this.usings.push(using);
            }
        });
    }
    findContractByName(name) {
        for (const contract of this.getAllContracts()) {
            if (contract.name === name) {
                return contract;
            }
        }
        return null;
    }
    getAllReferencesToSelected(offset, documents) {
        let results = [];
        if (this.isCurrentElementedSelected(offset)) {
            this.functions.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.innerContracts.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.errors.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.events.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.structs.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.usings.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.customTypes.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.constants.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.imports.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
            this.expressions.forEach(x => results = results.concat(x.getAllReferencesToSelected(offset, documents)));
        }
        return results;
    }
    getHover() {
        return null;
    }
    getSelectedItem(offset) {
        let selectedItem = null;
        if (this.isCurrentElementedSelected(offset)) {
            let allItems = [];
            allItems = allItems.concat(this.functions)
                .concat(this.innerContracts)
                .concat(this.errors)
                .concat(this.events)
                .concat(this.structs)
                .concat(this.usings)
                .concat(this.customTypes)
                .concat(this.constants)
                .concat(this.imports)
                .concat(this.expressions);
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
        this.functions.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.errors.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.events.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.innerContracts.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.structs.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.usings.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.customTypes.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.constants.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.imports.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        this.expressions.forEach(x => results = this.mergeArrays(results, x.getAllReferencesToObject(parsedCode)));
        return results;
    }
    getSelectedTypeReferenceLocation(offset) {
        let results = [];
        this.functions.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.errors.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.events.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.innerContracts.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.structs.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.usings.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.customTypes.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.constants.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.imports.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        this.expressions.forEach(x => results = this.mergeArrays(results, x.getSelectedTypeReferenceLocation(offset)));
        const foundResult = parsedCode_1.FindTypeReferenceLocationResult.filterFoundResults(results);
        if (foundResult.length > 0) {
            return foundResult;
        }
        else {
            return [parsedCode_1.FindTypeReferenceLocationResult.create(true)];
        }
    }
    findType(name) {
        let typesParsed = [];
        typesParsed = typesParsed.concat(this.getAllGlobalConstants())
            .concat(this.getAllGlobalCustomTypes())
            .concat(this.getAllGlobalStructs())
            .concat(this.getAllGlobalEnums())
            .concat(this.getAllContracts());
        return typesParsed.find(x => x.name === name);
    }
    getInnerMembers() {
        let typesParsed = [];
        typesParsed = typesParsed.concat(this.getAllGlobalConstants()).concat(this.getAllGlobalEnums()).concat(this.getAllGlobalCustomTypes());
        return typesParsed;
    }
    findMembersInScope(name) {
        return this.getInnerMembers().filter(x => x.name === name);
    }
    findMethodCalls(name) {
        let typesParsed = [];
        typesParsed = typesParsed.concat(this.getAllGlobalFunctions()).concat(this.getAllGlobalErrors()).concat((this.getAllContracts()));
        return typesParsed.filter(x => x.name === name);
    }
    getLocation() {
        const uri = vscode_uri_1.URI.file(this.sourceDocument.absolutePath).toString();
        const document = vscode_languageserver_1.TextDocument.create(uri, null, null, this.sourceDocument.code);
        return vscode_languageserver_1.Location.create(document.uri, vscode_languageserver_1.Range.create(document.positionAt(this.element.start), document.positionAt(this.element.end)));
    }
    getGlobalPathInfo() {
        return this.sourceDocument.absolutePath + ' global';
    }
    getAllGlobalFunctionCompletionItems() {
        const completionItems = [];
        this.getAllGlobalFunctions().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalEventsCompletionItems() {
        const completionItems = [];
        this.getAllGlobalEvents().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalErrorsCompletionItems() {
        const completionItems = [];
        this.getAllGlobalErrors().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalStructsCompletionItems() {
        const completionItems = [];
        this.getAllGlobalStructs().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalEnumsCompletionItems() {
        const completionItems = [];
        this.getAllGlobalEnums().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalCustomTypesCompletionItems() {
        const completionItems = [];
        this.getAllGlobalCustomTypes().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalConstantCompletionItems() {
        const completionItems = [];
        this.getAllGlobalConstants().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getAllGlobalContractsCompletionItems() {
        const completionItems = [];
        this.getAllContracts().forEach(x => completionItems.push(x.createCompletionItem()));
        return completionItems;
    }
    getSelectedDocumentCompletionItems(offset) {
        let completionItems = [];
        completionItems = completionItems.concat(this.getAllGlobalFunctionCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalEventsCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalStructsCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalEnumsCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalCustomTypesCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalConstantCompletionItems());
        completionItems = completionItems.concat(this.getAllGlobalContractsCompletionItems());
        if (this.selectedFunction !== undefined) {
            const variablesInScope = this.selectedFunction.findVariableDeclarationsInScope(offset);
            this.selectedFunction.input.forEach(parameter => {
                completionItems.push(parameter.createParamCompletionItem('function parameter', this.getGlobalPathInfo()));
            });
            this.selectedFunction.output.forEach(parameter => {
                completionItems.push(parameter.createParamCompletionItem('return parameter', this.getGlobalPathInfo()));
            });
            variablesInScope.forEach(variable => {
                completionItems.push(variable.createCompletionItem());
            });
        }
        return completionItems;
    }
    initialiseVariablesMembersEtc(statement, parentStatement, child) {
        try {
            if (statement !== undefined && statement !== null && statement.type !== undefined && statement.type !== null) {
                switch (statement.type) {
                    case 'CallExpression': // e.g. Func(x, y)
                        const callExpression = ParsedExpression_1.ParsedExpression.createFromElement(statement, this, null, child, this);
                        this.expressions.push(callExpression);
                        break;
                    case 'MemberExpression': // e.g. x.y x.f(y) arr[1] map['1'] arr[i] map[k]
                        const memberCreated = ParsedExpression_1.ParsedExpression.createFromMemberExpression(statement, this, null, child, this);
                        if (memberCreated !== undefined) {
                            this.expressions.push(memberCreated);
                        }
                        else {
                            console.log(statement);
                        }
                        break;
                    case 'Identifier':
                        const identifier = ParsedExpression_1.ParsedExpression.createFromElement(statement, this, null, child, this);
                        this.expressions.push(identifier);
                        break;
                    case 'FunctionDeclaration':
                        break;
                    case 'ContractStatement':
                        break;
                    case 'LibraryStatement':
                        break;
                    case 'InterfaceStatement':
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
    matchesElement(selectedElement, element) {
        return selectedElement !== null && selectedElement === element;
    }
}
exports.ParsedDocument = ParsedDocument;
//# sourceMappingURL=ParsedDocument.js.map