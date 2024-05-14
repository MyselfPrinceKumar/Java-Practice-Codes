"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeWalkerService = void 0;
const vscode_uri_1 = require("vscode-uri");
const sourceDocumentCollection_1 = require("../../common/model/sourceDocumentCollection");
const projectService_1 = require("../../common/projectService");
const solparse = __importStar(require("solparse-exp-jb"));
const parsedContract_1 = require("./parsedContract");
const ParsedDocument_1 = require("./ParsedDocument");
const fs = __importStar(require("fs"));
class CodeWalkerService {
    constructor(rootPath, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings) {
        this.parsedDocumentsCache = [];
        this.rootPath = rootPath;
        this.packageDefaultDependenciesDirectory = packageDefaultDependenciesDirectory;
        this.packageDefaultDependenciesContractsDirectory = packageDefaultDependenciesContractsDirectory;
        this.remappings = remappings;
        if (this.rootPath !== 'undefined' && this.rootPath !== null) {
            this.project = (0, projectService_1.initialiseProject)(this.rootPath, this.packageDefaultDependenciesDirectory, this.packageDefaultDependenciesContractsDirectory, this.remappings);
        }
    }
    initialiseAllDocuments() {
        const sourceDocuments = new sourceDocumentCollection_1.SourceDocumentCollection();
        const files = this.project.getAllSolFilesIgnoringDependencyFolders();
        files.forEach(contractPath => {
            if (!sourceDocuments.containsSourceDocument(contractPath)) {
                const contractCode = fs.readFileSync(contractPath, 'utf8');
                sourceDocuments.addSourceDocumentAndResolveImports(contractPath, contractCode, this.project);
            }
        });
        sourceDocuments.documents.forEach(sourceDocumentItem => {
            this.parseDocument(sourceDocumentItem.unformattedCode, false, sourceDocumentItem);
        });
        this.parsedDocumentsCache.forEach(element => {
            element.imports.forEach(importItem => {
                importItem.initialiseDocumentReference(this.parsedDocumentsCache);
            });
        });
    }
    initialiseChangedDocuments() {
        const sourceDocuments = new sourceDocumentCollection_1.SourceDocumentCollection();
        const files = this.project.getAllSolFilesIgnoringDependencyFolders();
        files.forEach(contractPath => {
            if (!sourceDocuments.containsSourceDocument(contractPath)) {
                const contractCode = fs.readFileSync(contractPath, 'utf8');
                sourceDocuments.addSourceDocumentAndResolveImports(contractPath, contractCode, this.project);
            }
        });
        sourceDocuments.documents.forEach(sourceDocumentItem => {
            this.parseDocumentChanged(sourceDocumentItem.unformattedCode, false, sourceDocumentItem);
        });
    }
    getSelectedDocument(document, position) {
        let selectedDocument = new ParsedDocument_1.ParsedDocument();
        const documentText = document.getText();
        const documentPath = vscode_uri_1.URI.parse(document.uri).fsPath;
        const sourceDocuments = new sourceDocumentCollection_1.SourceDocumentCollection();
        if (this.project !== undefined) {
            sourceDocuments.addSourceDocumentAndResolveImports(documentPath, documentText, this.project);
        }
        const selectedSourceDocument = sourceDocuments.documents[0];
        const offset = document.offsetAt(position);
        selectedDocument = this.parseSelectedDocument(documentText, offset, position.line, false, selectedSourceDocument);
        sourceDocuments.documents.forEach(sourceDocumentItem => {
            if (sourceDocumentItem !== selectedSourceDocument) {
                const documentImport = this.parseDocumentChanged(sourceDocumentItem.unformattedCode, false, sourceDocumentItem);
            }
        });
        this.parsedDocumentsCache.forEach(element => {
            element.initialiseDocumentReferences(this.parsedDocumentsCache);
        });
        return selectedDocument;
    }
    parseSelectedDocument(documentText, offset, line, fixedSource, sourceDocument) {
        const foundDocument = this.parsedDocumentsCache.find(x => x.sourceDocument.absolutePath === sourceDocument.absolutePath);
        const newDocument = new ParsedDocument_1.ParsedDocument();
        if (foundDocument !== undefined && foundDocument !== null) {
            if (!fixedSource && foundDocument.sourceDocument.code === sourceDocument.code) {
                const selectedElement = this.findElementByOffset(foundDocument.element.body, offset);
                newDocument.initialiseDocument(foundDocument.element, selectedElement, foundDocument.sourceDocument, foundDocument.fixedSource);
                this.parsedDocumentsCache.push(newDocument);
                this.parsedDocumentsCache = this.parsedDocumentsCache.filter(x => x !== foundDocument);
                return foundDocument;
            }
            this.parsedDocumentsCache = this.parsedDocumentsCache.filter(x => x !== foundDocument);
        }
        try {
            const result = solparse.parse(documentText);
            const selectedElement = this.findElementByOffset(result.body, offset);
            if (fixedSource) {
                newDocument.initialiseDocument(result, selectedElement, sourceDocument, documentText);
            }
            else {
                newDocument.initialiseDocument(result, selectedElement, sourceDocument, null);
            }
            this.parsedDocumentsCache.push(newDocument);
        }
        catch (error) {
            const lines = documentText.split(/\r?\n/g);
            if (lines[line].trim() !== '') { // have we done it already?
                lines[line] = ''.padStart(lines[line].length, ' '); // adding the same number of characters so the position matches where we are at the moment
                const code = lines.join('\r\n');
                return this.parseSelectedDocument(code, offset, line, true, sourceDocument);
            }
        }
        return newDocument;
    }
    parseDocumentChanged(documentText, fixedSource, sourceDocument) {
        const foundDocument = this.parsedDocumentsCache.find(x => x.sourceDocument.absolutePath === sourceDocument.absolutePath);
        const newDocument = new ParsedDocument_1.ParsedDocument();
        if (foundDocument !== undefined && foundDocument !== null) {
            if (foundDocument.sourceDocument.unformattedCode === sourceDocument.unformattedCode) {
                return foundDocument;
            }
            this.parsedDocumentsCache = this.parsedDocumentsCache.filter(x => x !== foundDocument);
        }
        try {
            const result = solparse.parse(documentText);
            if (fixedSource) {
                newDocument.initialiseDocument(result, null, sourceDocument, documentText);
            }
            else {
                newDocument.initialiseDocument(result, null, sourceDocument, null);
            }
            this.parsedDocumentsCache.push(newDocument);
        }
        catch (error) {
            /*
            // if we error parsing (cannot cater for all combos) we fix by removing current line.
            const lines = documentText.split(/\r?\n/g);
            if (lines[line].trim() !== '') { // have we done it already?
                lines[line] = ''.padStart(lines[line].length, ' '); // adding the same number of characters so the position matches where we are at the moment
                const code = lines.join('\r\n');
                return this.parseDocument(code, true, sourceDocument);
            }*/
        }
        return newDocument;
    }
    parseDocument(documentText, fixedSource, sourceDocument) {
        const foundDocument = this.parsedDocumentsCache.find(x => x.sourceDocument.absolutePath === sourceDocument.absolutePath);
        const newDocument = new ParsedDocument_1.ParsedDocument();
        if (foundDocument !== undefined && foundDocument !== null) {
            if (foundDocument.sourceDocument.unformattedCode === sourceDocument.unformattedCode) {
                newDocument.initialiseDocument(foundDocument.element, null, sourceDocument, foundDocument.fixedSource);
                this.parsedDocumentsCache.push(newDocument);
                this.parsedDocumentsCache = this.parsedDocumentsCache.filter(x => x !== foundDocument);
                return newDocument;
            }
            this.parsedDocumentsCache = this.parsedDocumentsCache.filter(x => x !== foundDocument);
        }
        try {
            const result = solparse.parse(documentText);
            if (fixedSource) {
                newDocument.initialiseDocument(result, null, sourceDocument, documentText);
            }
            else {
                newDocument.initialiseDocument(result, null, sourceDocument, null);
            }
            this.parsedDocumentsCache.push(newDocument);
        }
        catch (error) {
            /*
            // if we error parsing (cannot cater for all combos) we fix by removing current line.
            const lines = documentText.split(/\r?\n/g);
            if (lines[line].trim() !== '') { // have we done it already?
                lines[line] = ''.padStart(lines[line].length, ' '); // adding the same number of characters so the position matches where we are at the moment
                const code = lines.join('\r\n');
                return this.parseDocument(code, true, sourceDocument);
            }*/
        }
        return newDocument;
    }
    getContracts(documentText, document) {
        const contracts = [];
        try {
            const result = solparse.parse(documentText);
            result.body.forEach(element => {
                if (element.type === 'ContractStatement' || element.type === 'LibraryStatement' || element.type === 'InterfaceStatement') {
                    const contract = new parsedContract_1.ParsedContract();
                    contract.initialise(element, document);
                    contracts.push(contract);
                }
            });
        }
        catch (error) {
            // gracefule catch
            // console.log(error.message);
        }
        return contracts;
    }
    findElementByOffset(elements, offset) {
        return elements.find(element => element.start <= offset && offset <= element.end);
    }
}
exports.CodeWalkerService = CodeWalkerService;
//# sourceMappingURL=codeWalkerService.js.map