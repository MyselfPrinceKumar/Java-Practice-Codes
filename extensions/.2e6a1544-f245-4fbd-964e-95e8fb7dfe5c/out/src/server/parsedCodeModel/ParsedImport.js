"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedImport = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const parsedCode_1 = require("./parsedCode");
const vscode_uri_1 = require("vscode-uri");
class ParsedImport extends parsedCode_1.ParsedCode {
    constructor() {
        super(...arguments);
        this.documentReference = null;
    }
    initialise(element, document) {
        this.document = document;
        this.element = element;
        this.from = element.from;
    }
    getSelectedTypeReferenceLocation(offset) {
        if (this.isCurrentElementedSelected(offset)) {
            return [parsedCode_1.FindTypeReferenceLocationResult.create(true, this.getReferenceLocation())];
        }
        return [parsedCode_1.FindTypeReferenceLocationResult.create(false)];
    }
    initialiseDocumentReference(parsedDocuments) {
        for (let index = 0; index < parsedDocuments.length; index++) {
            const element = parsedDocuments[index];
            if (element.sourceDocument.absolutePath === this.document.sourceDocument.resolveImportPath(this.from)) {
                this.documentReference = element;
                if (this.document.importedDocuments.indexOf(element) < 0) {
                    this.document.addImportedDocument(element);
                }
            }
        }
    }
    getDocumentsThatReference(document, processedDocuments = new Set()) {
        if (this.documentReference !== null) {
            return this.documentReference.getDocumentsThatReference(document, processedDocuments);
        }
        return [];
    }
    getAllReferencesToSelected(offset, documents) {
        if (this.isCurrentElementedSelected(offset)) {
            return this.getAllReferencesToObject(this.documentReference);
        }
        return [];
    }
    getReferenceLocation() {
        const path = this.document.sourceDocument.resolveImportPath(this.from);
        // note: we can use the path to find the referenced source document too.
        return vscode_languageserver_1.Location.create(vscode_uri_1.URI.file(path).toString(), vscode_languageserver_1.Range.create(0, 0, 0, 0));
    }
}
exports.ParsedImport = ParsedImport;
//# sourceMappingURL=ParsedImport.js.map