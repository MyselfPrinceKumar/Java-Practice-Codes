"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidityDefinitionProvider = void 0;
class SolidityDefinitionProvider {
    provideDefinition(document, position, walker) {
        const offset = document.offsetAt(position);
        const documentContractSelected = walker.getSelectedDocument(document, position);
        const references = documentContractSelected.getSelectedTypeReferenceLocation(offset);
        const foundLocations = references.filter(x => x.location !== null).map(x => x.location);
        const keys = ['range', 'uri'];
        const result = this.removeDuplicates(foundLocations, keys);
        return Promise.resolve(result);
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
exports.SolidityDefinitionProvider = SolidityDefinitionProvider;
//# sourceMappingURL=SolidityDefinitionProvider.js.map