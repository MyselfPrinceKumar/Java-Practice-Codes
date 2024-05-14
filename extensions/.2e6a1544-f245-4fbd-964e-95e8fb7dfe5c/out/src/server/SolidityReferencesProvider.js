"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidityReferencesProvider = void 0;
class SolidityReferencesProvider {
    provideReferences(document, position, walker) {
        const offset = document.offsetAt(position);
        walker.initialiseChangedDocuments();
        const documentContractSelected = walker.getSelectedDocument(document, position);
        const references = documentContractSelected.getAllReferencesToSelected(offset, [].concat(documentContractSelected, walker.parsedDocumentsCache));
        const foundLocations = references.filter(x => x != null && x.location !== null).map(x => x.location);
        return foundLocations;
    }
    removeDuplicates(foundLocations, keys) {
        return Object.values(foundLocations.reduce((r, o) => {
            const key = keys.map(k => o[k]).join('|');
            // tslint:disable-next-line:curly
            if (r[key])
                r[key].condition = [].concat(r[key].condition, o.condition);
            // tslint:disable-next-line:curly
            else
                r[key] = Object.assign({}, o);
            return r;
        }, {}));
    }
}
exports.SolidityReferencesProvider = SolidityReferencesProvider;
//# sourceMappingURL=SolidityReferencesProvider.js.map