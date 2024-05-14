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
const { Worker } = require('worker_threads');
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function formatDocument(document, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const source = document.getText();
        const documentPath = document.uri.fsPath;
        const pluginPathFile = path.join(context.extensionPath, 'node_modules', 'prettier-plugin-solidity', 'dist', 'standalone.cjs');
        const prettierPathFile = path.join(context.extensionPath, 'node_modules', 'prettier');
        const pluginPath = pluginPathFile;
        const prettierPath = prettierPathFile;
        const options = {
            parser: 'solidity-parse',
            pluginSearchDirs: [context.extensionPath],
        };
        return new Promise((resolve, reject) => {
            const workerPath = path.join(__dirname, 'formatterPrettierWorker.js');
            let uri = vscode.Uri.file(workerPath).fsPath;
            const worker = new Worker(uri.toString());
            worker.on('message', (response) => {
                worker.terminate();
                if (response.success) {
                    const firstLine = document.lineAt(0);
                    const lastLine = document.lineAt(document.lineCount - 1);
                    const fullTextRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                    resolve([vscode.TextEdit.replace(fullTextRange, response.formatted)]);
                }
                else {
                    console.error(response.error);
                    resolve([]);
                }
            });
            worker.on('error', (err) => {
                worker.terminate();
                console.error(err);
                resolve([]);
            });
            worker.postMessage({ source, options, documentPath, prettierPath, pluginPath });
        });
    });
}
exports.formatDocument = formatDocument;
//# sourceMappingURL=prettierFormatter.js.map