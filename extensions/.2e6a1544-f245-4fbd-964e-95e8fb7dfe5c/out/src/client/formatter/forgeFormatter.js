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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDocument = void 0;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const workspaceUtil = __importStar(require("../workspaceUtil"));
function formatDocument(document, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const fullTextRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
        const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
        const formatted = yield formatDocumentInternal(document.getText(), rootPath);
        return [vscode.TextEdit.replace(fullTextRange, formatted)];
    });
}
exports.formatDocument = formatDocument;
function formatDocumentInternal(documentText, rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            var _a, _b;
            const forge = cp.execFile('forge', ['fmt', '--raw', '-'], { cwd: rootPath }, (err, stdout) => {
                if (err !== null) {
                    console.error(err);
                    return reject(err);
                }
                resolve(stdout);
            });
            (_a = forge.stdin) === null || _a === void 0 ? void 0 : _a.write(documentText);
            (_b = forge.stdin) === null || _b === void 0 ? void 0 : _b.end();
        });
    });
}
//# sourceMappingURL=forgeFormatter.js.map