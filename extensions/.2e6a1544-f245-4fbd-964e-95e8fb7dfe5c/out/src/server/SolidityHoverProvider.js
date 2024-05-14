"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidityHoverProvider = void 0;
class SolidityHoverProvider {
    provideHover(document, position, walker) {
        const offset = document.offsetAt(position);
        const documentContractSelected = walker.getSelectedDocument(document, position);
        if (documentContractSelected !== null) {
            const item = documentContractSelected.getSelectedItem(offset);
            if (item !== null) {
                return item.getHover();
            }
        }
        return undefined;
    }
}
exports.SolidityHoverProvider = SolidityHoverProvider;
//# sourceMappingURL=SolidityHoverProvider.js.map