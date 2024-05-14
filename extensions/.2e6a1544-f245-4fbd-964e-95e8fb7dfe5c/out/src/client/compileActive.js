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
exports.compileActiveContract = exports.initDiagnosticCollection = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const sourceDocumentCollection_1 = require("../common/model/sourceDocumentCollection");
const projectService_1 = require("../common/projectService");
const util_1 = require("../common/util");
const workspaceUtil = __importStar(require("./workspaceUtil"));
const settingsService_1 = require("./settingsService");
let diagnosticCollection;
function initDiagnosticCollection(diagnostics) {
    diagnosticCollection = diagnostics;
}
exports.initDiagnosticCollection = initDiagnosticCollection;
function compileActiveContract(compiler, overrideDefaultCompiler = null) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // We need something open
    }
    if (path.extname(editor.document.fileName) !== '.sol') {
        vscode.window.showWarningMessage('This not a solidity file (*.sol)');
        return;
    }
    // Check if is folder, if not stop we need to output to a bin folder on rootPath
    if (workspaceUtil.getCurrentWorkspaceRootFolder() === undefined) {
        vscode.window.showWarningMessage('Please open a folder in Visual Studio Code as a workspace');
        return;
    }
    const contractsCollection = new sourceDocumentCollection_1.SourceDocumentCollection();
    const contractCode = editor.document.getText();
    const contractPath = editor.document.fileName;
    const packageDefaultDependenciesDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesDirectories();
    const packageDefaultDependenciesContractsDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesContractsDirectory();
    const compilationOptimisation = settingsService_1.SettingsService.getCompilerOptimisation();
    const evmVersion = settingsService_1.SettingsService.getEVMVersion();
    const remappings = workspaceUtil.getSolidityRemappings();
    const project = (0, projectService_1.initialiseProject)(workspaceUtil.getCurrentProjectInWorkspaceRootFsPath(), packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    const contract = contractsCollection.addSourceDocumentAndResolveImports(contractPath, contractCode, project);
    const packagesPath = [];
    if (project.packagesDir != null) {
        project.packagesDir.forEach(x => packagesPath.push((0, util_1.formatPath)(x)));
    }
    return compiler.compile(contractsCollection.getDefaultSourceDocumentsForCompilation(compilationOptimisation, evmVersion), diagnosticCollection, project.projectPackage.build_dir, project.projectPackage.absoluletPath, null, packagesPath, contract.absolutePath, overrideDefaultCompiler);
}
exports.compileActiveContract = compileActiveContract;
//# sourceMappingURL=compileActive.js.map