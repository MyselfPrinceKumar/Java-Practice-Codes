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
exports.activate = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const compileAll_1 = require("./client/compileAll");
const compiler_1 = require("./client/compiler");
const compileActive_1 = require("./client/compileActive");
const codegen_1 = require("./client/codegen");
const vscode_languageclient_1 = require("vscode-languageclient");
const node_1 = require("vscode-languageclient/node");
const soliumClientFixer_1 = require("./server/linter/soliumClientFixer");
// tslint:disable-next-line:no-duplicate-imports
const vscode_1 = require("vscode");
const formatter_1 = require("./client/formatter/formatter");
const solcCompiler_1 = require("./common/solcCompiler");
const workspaceUtil = __importStar(require("./client/workspaceUtil"));
const addressChecksumActionProvider_1 = require("./client/codeActionProviders/addressChecksumActionProvider");
const etherscanSourceCodeDownloader_1 = require("./common/sourceCodeDownloader/etherscanSourceCodeDownloader");
let diagnosticCollection;
let compiler;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const ws = vscode_1.workspace.workspaceFolders;
        diagnosticCollection = vscode.languages.createDiagnosticCollection('solidity');
        compiler = new compiler_1.Compiler(context.extensionPath);
        context.subscriptions.push(diagnosticCollection);
        (0, compileActive_1.initDiagnosticCollection)(diagnosticCollection);
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compile.active', () => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler);
            (0, codegen_1.autoCodeGenerateAfterCompilation)(compiledResults, null, diagnosticCollection);
            return compiledResults;
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compile.activeUsingRemote', () => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler, solcCompiler_1.compilerType.remote);
            (0, codegen_1.autoCodeGenerateAfterCompilation)(compiledResults, null, diagnosticCollection);
            return compiledResults;
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compile.activeUsingLocalFile', () => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler, solcCompiler_1.compilerType.localFile);
            (0, codegen_1.autoCodeGenerateAfterCompilation)(compiledResults, null, diagnosticCollection);
            return compiledResults;
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compile.activeUsingNodeModule', () => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler, solcCompiler_1.compilerType.localNodeModule);
            (0, codegen_1.autoCodeGenerateAfterCompilation)(compiledResults, null, diagnosticCollection);
            return compiledResults;
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compile', () => {
            (0, compileAll_1.compileAllContracts)(compiler, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenCSharpProject', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSCsharp)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compileAndCodegenCSharpProject', (args) => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler);
            compiledResults.forEach(file => {
                (0, codegen_1.codeGenerateCQS)(file, 0, args, diagnosticCollection);
            });
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenNethereumCodeGenSettings', (args) => {
            (0, codegen_1.generateNethereumCodeSettingsFile)();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenVbNetProject', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSVbNet)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compileAndCodegenVbNetProject', (args) => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler);
            compiledResults.forEach(file => {
                (0, codegen_1.codeGenerateCQS)(file, 1, args, diagnosticCollection);
            });
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenFSharpProject', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSFSharp)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compileAndCodegenFSharpProject', (args) => __awaiter(this, void 0, void 0, function* () {
            const compiledResults = yield (0, compileActive_1.compileActiveContract)(compiler);
            compiledResults.forEach(file => {
                (0, codegen_1.codeGenerateCQS)(file, 3, args, diagnosticCollection);
            });
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenCSharpProjectAll', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSCSharpAll)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenVbNetProjectAll', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSVbAll)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenFSharpProjectAll', (args) => {
            (0, codegen_1.codeGenerateNethereumCQSFSharpAll)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenCSharpProjectAllAbiCurrent', (args) => {
            (0, codegen_1.codeGenerateAllFilesFromAbiInCurrentFolder)(0, args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenVbNetProjectAllAbiCurrent', (args) => {
            (0, codegen_1.codeGenerateAllFilesFromAbiInCurrentFolder)(1, args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenFSharpProjectAllAbiCurrent', (args) => {
            (0, codegen_1.codeGenerateAllFilesFromAbiInCurrentFolder)(3, args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.codeGenFromNethereumGenAbisFile', (args) => {
            (0, codegen_1.codeGenerateAllFilesFromNethereumGenAbisFile)(args, diagnosticCollection);
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.fixDocument', () => {
            (0, soliumClientFixer_1.lintAndfixCurrentDocument)();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.compilerInfo', () => __awaiter(this, void 0, void 0, function* () {
            yield compiler.outputCompilerInfoEnsuringInitialised();
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.solcReleases', () => __awaiter(this, void 0, void 0, function* () {
            compiler.outputSolcReleases();
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.selectWorkspaceRemoteSolcVersion', () => __awaiter(this, void 0, void 0, function* () {
            compiler.selectRemoteVersion(vscode.ConfigurationTarget.Workspace);
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.downloadRemoteSolcVersion', () => __awaiter(this, void 0, void 0, function* () {
            const root = workspaceUtil.getCurrentWorkspaceRootFolder();
            compiler.downloadRemoteVersion(root.uri.fsPath);
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.downloadVerifiedSmartContractEtherscan', () => __awaiter(this, void 0, void 0, function* () {
            yield etherscanSourceCodeDownloader_1.EtherscanContractDownloader.downloadContractWithPrompts();
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.downloadRemoteVersionAndSetLocalPathSetting', () => __awaiter(this, void 0, void 0, function* () {
            const root = workspaceUtil.getCurrentWorkspaceRootFolder();
            compiler.downloadRemoteVersionAndSetLocalPathSetting(vscode.ConfigurationTarget.Workspace, root.uri.fsPath);
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.selectGlobalRemoteSolcVersion', () => __awaiter(this, void 0, void 0, function* () {
            compiler.selectRemoteVersion(vscode.ConfigurationTarget.Global);
        })));
        context.subscriptions.push(vscode.commands.registerCommand('solidity.changeDefaultCompilerType', () => __awaiter(this, void 0, void 0, function* () {
            compiler.changeDefaultCompilerType(vscode.ConfigurationTarget.Workspace);
        })));
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('solidity', {
            provideDocumentFormattingEdits(document) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield (0, formatter_1.formatDocument)(document, context);
                });
            },
        }));
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider('solidity', new addressChecksumActionProvider_1.AddressChecksumCodeActionProvider(), {
            providedCodeActionKinds: addressChecksumActionProvider_1.AddressChecksumCodeActionProvider.providedCodeActionKinds,
        }));
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider('solidity', new addressChecksumActionProvider_1.SPDXCodeActionProvider(), {
            providedCodeActionKinds: addressChecksumActionProvider_1.SPDXCodeActionProvider.providedCodeActionKinds,
        }));
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider('solidity', new addressChecksumActionProvider_1.ChangeCompilerVersionActionProvider(), {
            providedCodeActionKinds: addressChecksumActionProvider_1.ChangeCompilerVersionActionProvider.providedCodeActionKinds,
        }));
        const serverModule = path.join(__dirname, 'server.js');
        const serverOptions = {
            debug: {
                module: serverModule,
                options: {
                    execArgv: ['--nolazy', '--inspect=6009'],
                },
                transport: node_1.TransportKind.ipc,
            },
            run: {
                module: serverModule,
                transport: node_1.TransportKind.ipc,
            },
        };
        const clientOptions = {
            documentSelector: [
                { language: 'solidity', scheme: 'file' },
                { language: 'solidity', scheme: 'untitled' },
            ],
            revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
            synchronize: {
                // Synchronize the setting section 'solidity' to the server
                configurationSection: 'solidity',
                // Notify the server about file changes to '.sol.js files contain in the workspace (TODO node, linter)
                fileEvents: vscode.workspace.createFileSystemWatcher('{**/remappings.txt,**/.solhint.json,**/.soliumrc.json,**/brownie-config.yaml}'),
            },
            initializationOptions: context.extensionPath,
        };
        let clientDisposable;
        if (ws) {
            clientDisposable = new node_1.LanguageClient('solidity', 'Solidity Language Server', serverOptions, clientOptions).start();
        }
        // Push the disposable to the context's subscriptions so that the
        // client can be deactivated on extension deactivation
        context.subscriptions.push(clientDisposable);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map