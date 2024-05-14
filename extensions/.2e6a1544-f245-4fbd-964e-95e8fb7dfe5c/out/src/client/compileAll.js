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
exports.compileAllContracts = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sourceDocumentCollection_1 = require("../common/model/sourceDocumentCollection");
const projectService_1 = require("../common/projectService");
const util_1 = require("../common/util");
const workspaceUtil = __importStar(require("./workspaceUtil"));
const settingsService_1 = require("./settingsService");
function compileAllContracts(compiler, diagnosticCollection) {
    // Check if is folder, if not stop we need to output to a bin folder on rootPath
    if (workspaceUtil.getCurrentWorkspaceRootFolder() === undefined) {
        vscode.window.showWarningMessage('Please open a folder in Visual Studio Code as a workspace');
        return;
    }
    const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
    const packageDefaultDependenciesDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesDirectories();
    const packageDefaultDependenciesContractsDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesContractsDirectory();
    const compilationOptimisation = settingsService_1.SettingsService.getCompilerOptimisation();
    const evmVersion = settingsService_1.SettingsService.getEVMVersion();
    const remappings = workspaceUtil.getSolidityRemappings();
    const contractsCollection = new sourceDocumentCollection_1.SourceDocumentCollection();
    const project = (0, projectService_1.initialiseProject)(rootPath, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    // Process open Text Documents first as it is faster (We might need to save them all first? Is this assumed?)
    vscode.workspace.textDocuments.forEach(document => {
        if ((0, util_1.isPathSubdirectory)(rootPath, document.fileName)) {
            if (path.extname(document.fileName) === '.sol') {
                const contractPath = document.fileName;
                const contractCode = document.getText();
                contractsCollection.addSourceDocumentAndResolveImports(contractPath, contractCode, project);
            }
        }
    });
    const documents = project.getAllSolFilesIgnoringDependencyFolders();
    documents.forEach(document => {
        const contractPath = document;
        if (!contractsCollection.containsSourceDocument(contractPath)) {
            const contractCode = fs.readFileSync(contractPath, 'utf8');
            contractsCollection.addSourceDocumentAndResolveImports(contractPath, contractCode, project);
        }
    });
    const sourceDirPath = (0, util_1.formatPath)(project.projectPackage.getSolSourcesAbsolutePath());
    const packagesPath = [];
    if (project.packagesDir != null) {
        project.packagesDir.forEach(x => packagesPath.push((0, util_1.formatPath)(x)));
    }
    compiler.compile(contractsCollection.getDefaultSourceDocumentsForCompilation(compilationOptimisation, evmVersion), diagnosticCollection, project.projectPackage.build_dir, project.projectPackage.absoluletPath, sourceDirPath, packagesPath);
}
exports.compileAllContracts = compileAllContracts;
//# sourceMappingURL=compileAll.js.map