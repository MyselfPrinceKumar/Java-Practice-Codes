'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCurrentProjectInWorkspaceRootFsPath = void 0;
const solcCompiler_1 = require("./common/solcCompiler");
const solhint_1 = __importDefault(require("./server/linter/solhint"));
const solium_1 = __importDefault(require("./server/linter/solium"));
const completionService_1 = require("./server/completionService");
const SolidityDefinitionProvider_1 = require("./server/SolidityDefinitionProvider");
const SolidityReferencesProvider_1 = require("./server/SolidityReferencesProvider");
const SolidityHoverProvider_1 = require("./server/SolidityHoverProvider");
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
const codeWalkerService_1 = require("./server/parsedCodeModel/codeWalkerService");
const util_1 = require("./common/util");
const projectService_1 = require("./common/projectService");
const package_json_1 = __importDefault(require("../package.json"));
const standAloneServerSide = false; // put this in the package json .. use this setting to build
const defaultSoliditySettings = {};
Object.entries(package_json_1.default.contributes.configuration.properties)
    .forEach(([key, value]) => {
    const keys = key.split('.');
    if (keys.length === 2 && keys[0] === 'solidity') {
        defaultSoliditySettings[keys[1]] = value.default;
    }
});
// import * as path from 'path';
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let rootPath;
let solcCompiler;
let linter = null;
let enabledAsYouTypeErrorCheck = false;
let compileUsingRemoteVersion = '';
let compileUsingLocalVersion = '';
let nodeModulePackage = '';
let defaultCompiler = solcCompiler_1.compilerType.embedded;
let solhintDefaultRules = {};
let soliumDefaultRules = {};
let validationDelay = 1500;
let solcCachePath = '';
let hasWorkspaceFolderCapability = false;
let monoRepoSupport = false;
let evmVersion = '';
// flags to avoid trigger concurrent validations (compiling is slow)
let validatingDocument = false;
let validatingAllDocuments = false;
let packageDefaultDependenciesDirectory = ['lib', 'node_modules'];
let packageDefaultDependenciesContractsDirectory = ['src', 'contracts', ''];
let workspaceFolders;
let remappings = [];
let selectedDocument = null;
let selectedProjectFolder = null;
let codeWalkerService = null;
function getCodeWalkerService() {
    if (codeWalkerService !== null) {
        if (codeWalkerService.rootPath === selectedProjectFolder &&
            (codeWalkerService.packageDefaultDependenciesContractsDirectory !== undefined &&
                packageDefaultDependenciesDirectory !== undefined &&
                codeWalkerService.packageDefaultDependenciesDirectory.sort().join('')
                    === packageDefaultDependenciesDirectory.sort().join('')) &&
            (codeWalkerService.packageDefaultDependenciesContractsDirectory !== undefined &&
                packageDefaultDependenciesContractsDirectory !== undefined &&
                codeWalkerService.packageDefaultDependenciesContractsDirectory.sort().join('')
                    === packageDefaultDependenciesContractsDirectory.sort().join('')) &&
            (codeWalkerService.remappings !== undefined && remappings !== undefined &&
                codeWalkerService.remappings.sort().join('') === remappings.sort().join(''))) {
            return codeWalkerService;
        }
    }
    codeWalkerService = new codeWalkerService_1.CodeWalkerService(selectedProjectFolder, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    codeWalkerService.initialiseAllDocuments();
    return codeWalkerService;
}
function initWorkspaceRootFolder(uri) {
    if (rootPath !== 'undefined') {
        const fullUri = vscode_uri_1.URI.parse(uri);
        if (!fullUri.fsPath.startsWith(rootPath)) {
            if (workspaceFolders) {
                const newRootFolder = workspaceFolders.find(x => uri.startsWith(x.uri));
                if (newRootFolder !== undefined) {
                    rootPath = vscode_uri_1.URI.parse(newRootFolder.uri).fsPath;
                    solcCompiler.rootPath = rootPath;
                    if (linter !== null) {
                        linter.loadFileConfig(rootPath);
                    }
                }
            }
        }
    }
}
function initCurrentProjectInWorkspaceRootFsPath(currentDocument) {
    if (monoRepoSupport) {
        if (selectedDocument === currentDocument && selectedProjectFolder != null) {
            return selectedProjectFolder;
        }
        const projectFolder = (0, projectService_1.findFirstRootProjectFile)(rootPath, vscode_uri_1.URI.parse(currentDocument).fsPath);
        if (projectFolder == null) {
            selectedProjectFolder = rootPath;
            selectedDocument = currentDocument;
            return rootPath;
        }
        else {
            selectedProjectFolder = projectFolder;
            selectedDocument = currentDocument;
            solcCompiler.rootPath = projectFolder;
            if (linter !== null) {
                linter.loadFileConfig(projectFolder);
            }
            return projectFolder;
        }
    }
    else {
        // we might have changed settings
        solcCompiler.rootPath = rootPath;
        selectedProjectFolder = rootPath;
        selectedDocument = currentDocument;
        return rootPath;
    }
}
exports.initCurrentProjectInWorkspaceRootFsPath = initCurrentProjectInWorkspaceRootFsPath;
function validate(document) {
    try {
        initWorkspaceRootFolder(document.uri);
        initCurrentProjectInWorkspaceRootFsPath(document.uri);
        validatingDocument = true;
        const uri = document.uri;
        const filePath = vscode_uri_1.URI.parse(uri).fsPath;
        const documentText = document.getText();
        let linterDiagnostics = [];
        const compileErrorDiagnostics = [];
        try {
            if (linter !== null) {
                linterDiagnostics = linter.validate(filePath, documentText);
            }
        }
        catch (_a) {
            // gracefull catch
        }
        try {
            if (enabledAsYouTypeErrorCheck) {
                connection.console.info('Validating using the compiler selected: ' + solcCompiler.getLoadedCompilerType());
                connection.console.info('Validating using compiler version: ' + solcCompiler.getLoadedVersion());
                connection.console.info('Validating using compiler selected version: ' + solcCompiler.getSelectedVersion());
                // connection.console.info('remappings: ' +  remappings.join(','));
                // connection.console.info(packageDefaultDependenciesDirectory.join(','));
                // connection.console.info(packageDefaultDependenciesContractsDirectory.join(','));
                // connection.console.info('Validating using compiler configured version: ' +  compileUsingRemoteVersion);
                const errors = solcCompiler
                    .compileSolidityDocumentAndGetDiagnosticErrors(filePath, documentText, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings, null, evmVersion);
                errors.forEach(errorItem => {
                    const uriCompileError = vscode_uri_1.URI.file(errorItem.fileName);
                    if (uriCompileError.toString() === uri) {
                        compileErrorDiagnostics.push(errorItem.diagnostic);
                    }
                });
            }
        }
        catch (e) {
            connection.console.info(e.message);
        }
        const diagnostics = linterDiagnostics.concat(compileErrorDiagnostics);
        connection.sendDiagnostics({ uri: document.uri, diagnostics });
    }
    finally {
        validatingDocument = false;
    }
}
function updateSoliditySettings(soliditySettings) {
    enabledAsYouTypeErrorCheck = soliditySettings.enabledAsYouTypeCompilationErrorCheck;
    compileUsingLocalVersion = soliditySettings.compileUsingLocalVersion;
    compileUsingRemoteVersion = soliditySettings.compileUsingRemoteVersion;
    solhintDefaultRules = soliditySettings.solhintRules;
    soliumDefaultRules = soliditySettings.soliumRules;
    validationDelay = soliditySettings.validationDelay;
    nodeModulePackage = soliditySettings.nodemodulespackage;
    defaultCompiler = solcCompiler_1.compilerType[soliditySettings.defaultCompiler];
    evmVersion = soliditySettings.evmVersion;
    // connection.console.info('changing settings: ' +  soliditySettings.compileUsingRemoteVersion);
    // connection.console.info('changing settings: ' +  compileUsingRemoteVersion);
    connection.console.info(defaultCompiler.toString());
    if (typeof soliditySettings.packageDefaultDependenciesDirectory === 'string') {
        packageDefaultDependenciesDirectory = [soliditySettings.packageDefaultDependenciesDirectory];
    }
    else {
        packageDefaultDependenciesDirectory = soliditySettings.packageDefaultDependenciesDirectory;
    }
    if (typeof soliditySettings.packageDefaultDependenciesContractsDirectory === 'string') {
        packageDefaultDependenciesContractsDirectory = [soliditySettings.packageDefaultDependenciesContractsDirectory];
    }
    else {
        packageDefaultDependenciesContractsDirectory = soliditySettings.packageDefaultDependenciesContractsDirectory;
    }
    remappings = soliditySettings.remappings;
    monoRepoSupport = soliditySettings.monoRepoSupport;
    if (process.platform === 'win32') {
        remappings = (0, util_1.replaceRemappings)(remappings, soliditySettings.remappingsWindows);
    }
    else {
        remappings = (0, util_1.replaceRemappings)(remappings, soliditySettings.remappingsUnix);
    }
    switch (linterName(soliditySettings)) {
        case 'solhint': {
            linter = new solhint_1.default(rootPath, solhintDefaultRules);
            break;
        }
        case 'solium': {
            linter = new solium_1.default(rootPath, soliumDefaultRules, connection);
            break;
        }
        default: {
            linter = null;
        }
    }
    if (linter !== null) {
        linter.setIdeRules(linterRules(soliditySettings));
    }
    startValidation();
}
connection.onSignatureHelp(() => {
    return null;
});
connection.onCompletion((textDocumentPosition) => {
    let completionItems = [];
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const projectRootPath = initCurrentProjectInWorkspaceRootFsPath(document.uri);
    const service = new completionService_1.CompletionService(projectRootPath);
    completionItems = completionItems.concat(service.getAllCompletionItems(document, textDocumentPosition.position, getCodeWalkerService()));
    return [...new Set(completionItems)];
});
connection.onReferences((handler) => {
    initWorkspaceRootFolder(handler.textDocument.uri);
    initCurrentProjectInWorkspaceRootFsPath(handler.textDocument.uri);
    const provider = new SolidityReferencesProvider_1.SolidityReferencesProvider();
    return provider.provideReferences(documents.get(handler.textDocument.uri), handler.position, getCodeWalkerService());
});
connection.onDefinition((handler) => {
    initWorkspaceRootFolder(handler.textDocument.uri);
    initCurrentProjectInWorkspaceRootFsPath(handler.textDocument.uri);
    const provider = new SolidityDefinitionProvider_1.SolidityDefinitionProvider();
    return provider.provideDefinition(documents.get(handler.textDocument.uri), handler.position, getCodeWalkerService());
});
connection.onHover((handler) => {
    initWorkspaceRootFolder(handler.textDocument.uri);
    initCurrentProjectInWorkspaceRootFsPath(handler.textDocument.uri);
    const provider = new SolidityHoverProvider_1.SolidityHoverProvider();
    return provider.provideHover(documents.get(handler.textDocument.uri), handler.position, getCodeWalkerService());
});
// This handler resolve additional information for the item selected in
// the completion list.
// connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
//   item.
// });
function validateAllDocuments() {
    if (!validatingAllDocuments) {
        try {
            validatingAllDocuments = true;
            documents.all().forEach(document => validate(document));
        }
        finally {
            validatingAllDocuments = false;
        }
    }
}
function startValidation() {
    if (enabledAsYouTypeErrorCheck) {
        // connection.console.info('changing settings: ' +  compileUsingRemoteVersion);
        solcCompiler.initialiseAllCompilerSettings(compileUsingRemoteVersion, compileUsingLocalVersion, nodeModulePackage, defaultCompiler);
        solcCompiler.initialiseSelectedCompiler().then(() => {
            connection.console.info('Validating using the compiler selected: ' + solcCompiler_1.compilerType[defaultCompiler]);
            connection.console.info('Validating using compiler version: ' + solcCompiler.getLoadedVersion());
            validateAllDocuments();
        }).catch(reason => {
            connection.console.error('An error has occurred initialising the compiler selected ' + solcCompiler_1.compilerType[defaultCompiler] + ', please check your settings, reverting to the embedded compiler. Error: ' + reason);
            solcCompiler.initialiseAllCompilerSettings(compileUsingRemoteVersion, compileUsingLocalVersion, nodeModulePackage, solcCompiler_1.compilerType.embedded);
            solcCompiler.initialiseSelectedCompiler().then(() => {
                validateAllDocuments();
                // tslint:disable-next-line:no-empty
            }).catch(() => { });
        });
    }
    else {
        validateAllDocuments();
    }
}
documents.onDidChangeContent(event => {
    const document = event.document;
    if (!validatingDocument && !validatingAllDocuments) {
        validatingDocument = true; // control the flag at a higher level
        // slow down, give enough time to type (1.5 seconds?)
        setTimeout(() => solcCompiler.initialiseSelectedCompiler().then(() => {
            validate(document);
        }), validationDelay);
    }
});
// remove diagnostics from the Problems panel when we close the file
documents.onDidClose(event => connection.sendDiagnostics({
    diagnostics: [],
    uri: event.document.uri,
}));
documents.listen(connection);
connection.onInitialize((params) => {
    rootPath = params.rootPath;
    const capabilities = params.capabilities;
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    if (params.workspaceFolders) {
        workspaceFolders = params.workspaceFolders;
    }
    solcCachePath = params.initializationOptions;
    solcCompiler = new solcCompiler_1.SolcCompiler(rootPath);
    solcCompiler.setSolcCache(solcCachePath);
    const result = {
        capabilities: {
            completionProvider: {
                resolveProvider: false,
                triggerCharacters: ['.'],
            },
            definitionProvider: true,
            referencesProvider: true,
            hoverProvider: true,
            textDocumentSync: node_1.TextDocumentSyncKind.Full,
        },
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true,
            },
        };
    }
    if (standAloneServerSide) {
        updateSoliditySettings(defaultSoliditySettings);
    }
    return result;
});
connection.onInitialized(() => {
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            if (connection.workspace !== undefined) {
                connection.workspace.onDidChangeWorkspaceFolders((event) => {
                    event.removed.forEach(workspaceFolder => {
                        const index = workspaceFolders.findIndex((folder) => folder.uri === workspaceFolder.uri);
                        if (index !== -1) {
                            workspaceFolders.splice(index, 1);
                        }
                    });
                    event.added.forEach(workspaceFolder => {
                        workspaceFolders.push(workspaceFolder);
                    });
                });
            }
        });
    }
});
connection.onDidChangeWatchedFiles(_change => {
    if (linter !== null) {
        linter.loadFileConfig(rootPath);
    }
    validateAllDocuments();
});
connection.onDidChangeConfiguration((change) => {
    var _a, _b;
    if (standAloneServerSide) {
        updateSoliditySettings(Object.assign(Object.assign({}, defaultSoliditySettings), (((_a = change.settings) === null || _a === void 0 ? void 0 : _a.solidity) || {})));
    }
    else {
        updateSoliditySettings((_b = change.settings) === null || _b === void 0 ? void 0 : _b.solidity);
    }
});
function linterName(settings) {
    return settings.linter;
}
function linterRules(settings) {
    const _linterName = linterName(settings);
    if (_linterName === 'solium') {
        return settings.soliumRules;
    }
    else {
        return settings.solhintRules;
    }
}
connection.listen();
//# sourceMappingURL=server.js.map