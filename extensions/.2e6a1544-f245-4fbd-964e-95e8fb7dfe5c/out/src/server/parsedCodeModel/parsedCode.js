"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCode = exports.FindTypeReferenceLocationResult = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
class FindTypeReferenceLocationResult {
    static create(isSelected, location = null, reference = null) {
        const result = new FindTypeReferenceLocationResult();
        result.location = location;
        result.isCurrentElementSelected = isSelected;
        result.reference = reference;
        return result;
    }
    static filterFoundResults(results) {
        const foundResult = results.filter(x => x.isCurrentElementSelected === true);
        if (foundResult.length > 0) {
            const foundLocations = foundResult.filter(x => x.location !== null);
            if (foundLocations.length > 0) {
                return foundLocations;
            }
            else {
                return [FindTypeReferenceLocationResult.create(true)];
            }
        }
        else {
            return [];
        }
    }
}
exports.FindTypeReferenceLocationResult = FindTypeReferenceLocationResult;
class ParsedCode {
    constructor() {
        this.name = '';
        this.contract = null;
        this.supportsNatSpec = true;
        this.comment = null;
    }
    initialise(element, document, contract = null, isGlobal = false) {
        this.contract = contract;
        this.element = element;
        this.name = element.name;
        this.document = document;
        this.isGlobal = isGlobal; // need to remove is global
        if (contract !== null && isGlobal === false) {
            this.isGlobal = true;
        }
    }
    getHover() {
        const doc = this.getMarkupInfo();
        return {
            contents: doc,
        };
    }
    getMarkupInfo() {
        return {
            kind: vscode_languageserver_1.MarkupKind.Markdown,
            value: this.getInfo(),
        };
    }
    getInfo() {
        return '### ' + this.name + '\n' + this.getComment();
    }
    getSelectedItem(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            return this;
        }
        return null;
    }
    generateNatSpec() {
        return null;
    }
    isCommentLine(document, line) {
        if (line === 0) {
            return false;
        }
        const txt = document.getText(this.getLineRange(line)).trimStart();
        if (!txt.startsWith('///') && !txt.startsWith('*') &&
            !txt.startsWith('/**') && !txt.startsWith('/*!') && !txt.startsWith('*/')) {
            return false;
        }
        else {
            return true;
        }
    }
    extractContractName(text) {
        const pattern = /@inheritdoc\s+(\w+)/;
        const matches = text.match(pattern);
        if (matches && matches.length > 1) {
            // The second element in the array will be the contract/interface name
            return matches[1];
        }
        return null;
    }
    getLineRange(lineNumber) {
        return vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(lineNumber, 0), vscode_languageserver_1.Position.create(lineNumber + 1, 0));
    }
    getContractNameOrGlobal() {
        if (this.contract != null) {
            return this.contract.getContractTypeName(this.contract.contractType) + ': ' + this.contract.name;
        }
        else {
            return 'Global';
        }
    }
    getComment() {
        if (this.comment === null && this.supportsNatSpec) {
            const uri = vscode_uri_1.URI.file(this.document.sourceDocument.absolutePath).toString();
            const document = vscode_languageserver_textdocument_1.TextDocument.create(uri, null, null, this.document.sourceDocument.unformattedCode);
            const position = document.positionAt(this.element.start);
            let comment = '';
            let currentLine = position.line - 1;
            while (this.isCommentLine(document, currentLine)) {
                let lineText = document.getText(this.getLineRange(currentLine)).trimStart();
                currentLine = currentLine - 1;
                let contractName = this.extractContractName(lineText);
                if (contractName && this.contract !== null) {
                    comment = '\t' + lineText + this.contract.getInheritedComment(this.name, contractName) + comment;
                }
                else {
                    comment = '\t' + lineText + comment;
                }
            }
            this.comment = comment;
        }
        return this.comment;
    }
    createFoundReferenceLocationResult() {
        return FindTypeReferenceLocationResult.create(true, this.getLocation(), this);
    }
    createNotFoundReferenceLocationResult() {
        return FindTypeReferenceLocationResult.create(false);
    }
    createFoundReferenceLocationResultNoLocation() {
        return FindTypeReferenceLocationResult.create(true, null, this);
    }
    isTheSame(parsedCode) {
        try {
            const sameObject = parsedCode === this;
            const sameDocReference = (this.document.sourceDocument.absolutePath === parsedCode.document.sourceDocument.absolutePath
                && this.name === parsedCode.name && this.element.start === parsedCode.element.start && this.element.end === parsedCode.element.end);
            return sameObject || sameDocReference;
        }
        catch (error) {
            // console.log(error);
        }
    }
    getAllReferencesToObject(parsedCode) {
        if (this.isTheSame(parsedCode)) {
            return [this.createFoundReferenceLocationResult()];
        }
        return [];
    }
    findElementByOffset(elements, offset) {
        return elements.find(element => element.start <= offset && offset <= element.end);
    }
    isElementedSelected(element, offset) {
        if (element !== undefined && element !== null) {
            if (element.start <= offset && offset <= element.end) {
                return true;
            }
        }
        return false;
    }
    createCompletionItem() {
        return null;
    }
    isCurrentElementedSelected(offset) {
        return this.isElementedSelected(this.element, offset);
    }
    getLocation() {
        const uri = vscode_uri_1.URI.file(this.document.sourceDocument.absolutePath).toString();
        const document = vscode_languageserver_textdocument_1.TextDocument.create(uri, null, null, this.document.sourceDocument.unformattedCode);
        return vscode_languageserver_1.Location.create(document.uri, vscode_languageserver_1.Range.create(document.positionAt(this.element.start), document.positionAt(this.element.end)));
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            return [FindTypeReferenceLocationResult.create(true)];
        }
        return [FindTypeReferenceLocationResult.create(false)];
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            return this.getAllReferencesToThis(documents);
        }
        return [];
    }
    getAllReferencesToThis(documents) {
        let results = [];
        results.push(this.createFoundReferenceLocationResult());
        let documentsToSearch = [];
        documents.forEach(x => {
            documentsToSearch.push(...x.getDocumentsThatReference(this.document));
        });
        documentsToSearch = [...new Set(documentsToSearch)];
        documentsToSearch.forEach(x => {
            results.push(...x.getAllReferencesToObject(this));
        });
        return results;
    }
    findTypeInScope(name) {
        if (this.contract === null) {
            return this.document.findType(name);
        }
        else {
            return this.contract.findType(name);
        }
    }
    findMethodsInScope(name) {
        if (this.contract === null) {
            return this.document.findMethodCalls(name);
        }
        else {
            return this.contract.findMethodCalls(name);
        }
    }
    findMembersInScope(name) {
        if (this.contract === null) {
            return this.document.findMembersInScope(name);
        }
        else {
            return this.contract.findMembersInScope(name);
        }
    }
    getInnerCompletionItems() {
        return [];
    }
    getInnerMembers() {
        return [];
    }
    getInnerMethodCalls() {
        return [];
    }
    getParsedObjectType() {
        return '';
    }
    mergeArrays(first, second) {
        for (let i = 0; i < second.length; i++) {
            if (first.indexOf(second[i]) === -1) {
                first.push(second[i]);
            }
        }
        return first;
    }
}
exports.ParsedCode = ParsedCode;
//# sourceMappingURL=parsedCode.js.map