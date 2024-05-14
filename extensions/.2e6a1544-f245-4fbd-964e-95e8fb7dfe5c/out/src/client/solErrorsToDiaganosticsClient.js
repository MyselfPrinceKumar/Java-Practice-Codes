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
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsToDiagnostics = void 0;
const vscode = __importStar(require("vscode"));
const solErrorsToDiagnostics_1 = require("../server/solErrorsToDiagnostics");
const vscode_languageserver_1 = require("vscode-languageserver");
function errorsToDiagnostics(diagnosticCollection, errors) {
    const errorWarningCounts = { errors: 0, warnings: 0 };
    const diagnosticMap = new Map();
    errors.forEach(error => {
        const { diagnostic, fileName } = (0, solErrorsToDiagnostics_1.errorToDiagnostic)(error);
        const targetUri = vscode.Uri.file(fileName);
        let diagnostics = diagnosticMap.get(targetUri);
        if (!diagnostics) {
            diagnostics = [];
        }
        diagnostics.push(diagnostic);
        diagnosticMap.set(targetUri, diagnostics);
    });
    const entries = [];
    diagnosticMap.forEach((diags, uri) => {
        errorWarningCounts.errors += diags.filter((diagnostic) => diagnostic.severity === vscode_languageserver_1.DiagnosticSeverity.Error).length;
        errorWarningCounts.warnings += diags.filter((diagnostic) => diagnostic.severity === vscode_languageserver_1.DiagnosticSeverity.Warning).length;
        entries.push([uri, diags]);
    });
    diagnosticCollection.set(entries);
    return errorWarningCounts;
}
exports.errorsToDiagnostics = errorsToDiagnostics;
//# sourceMappingURL=solErrorsToDiaganosticsClient.js.map