'use strict';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintAndfixCurrentDocument = void 0;
const solium_1 = __importDefault(require("./solium"));
const vscode = __importStar(require("vscode"));
const workspaceUtil = __importStar(require("../../client/workspaceUtil"));
function lintAndfixCurrentDocument() {
    const linterType = vscode.workspace.getConfiguration('solidity').get('linter');
    if (linterType === 'solium') {
        const soliumRules = vscode.workspace.getConfiguration('solidity').get('soliumRules');
        const linter = new solium_1.default(workspaceUtil.getCurrentProjectInWorkspaceRootFsPath(), soliumRules, null);
        const editor = vscode.window.activeTextEditor;
        const sourceCode = editor.document.getText();
        const fullRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(sourceCode.length));
        const result = linter.lintAndFix(sourceCode);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, fullRange, result.fixedSourceCode);
        return vscode.workspace.applyEdit(edit);
    }
}
exports.lintAndfixCurrentDocument = lintAndfixCurrentDocument;
//# sourceMappingURL=soliumClientFixer.js.map