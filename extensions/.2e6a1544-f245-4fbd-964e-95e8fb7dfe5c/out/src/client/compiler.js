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
exports.Compiler = void 0;
const vscode = __importStar(require("vscode"));
const workspaceUtil = __importStar(require("./workspaceUtil"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fsex = __importStar(require("fs-extra"));
const solcCompiler_1 = require("../common/solcCompiler");
const solErrorsToDiaganosticsClient_1 = require("./solErrorsToDiaganosticsClient");
class Compiler {
    constructor(solcCachePath) {
        this.solcCachePath = solcCachePath;
        this.outputChannel = vscode.window.createOutputChannel('Solidity compiler');
    }
    outputCompilerInfoEnsuringInitialised() {
        // initialise compiler outputs the information and validates existing settings
        this.initialiseCompiler();
    }
    changeDefaultCompilerType(target) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // tslint:disable-next-line:max-line-length
                const compilers = [solcCompiler_1.compilerType[solcCompiler_1.compilerType.remote], solcCompiler_1.compilerType[solcCompiler_1.compilerType.localFile], solcCompiler_1.compilerType[solcCompiler_1.compilerType.localNodeModule], solcCompiler_1.compilerType[solcCompiler_1.compilerType.embedded]];
                const selectedCompiler = yield vscode.window.showQuickPick(compilers);
                vscode.workspace.getConfiguration('solidity').update('defaultCompiler', selectedCompiler, target);
                vscode.window.showInformationMessage('Compiler changed to: ' + selectedCompiler);
            }
            catch (e) {
                vscode.window.showErrorMessage('Error changing default compiler: ' + e);
            }
        });
    }
    downloadRemoteVersionAndSetLocalPathSetting(target, folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadPath = yield this.downloadRemoteVersion(folderPath);
            vscode.workspace.getConfiguration('solidity').update('compileUsingLocalVersion', downloadPath, target);
        });
    }
    downloadRemoteVersion(folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const releases = yield this.getSolcReleases();
                const releasesToSelect = [];
                // tslint:disable-next-line: forin
                for (const release in releases) {
                    releasesToSelect.push(release);
                }
                const selectedVersion = yield vscode.window.showQuickPick(releasesToSelect);
                let version = '';
                const value = releases[selectedVersion];
                if (value !== 'undefined') {
                    version = value.replace('soljson-', '');
                    version = version.replace('.js', '');
                }
                const pathVersion = path.resolve(path.join(folderPath, 'soljson-' + version + '.js'));
                yield new solcCompiler_1.RemoteCompilerDownloader().downloadCompilationFile(version, pathVersion);
                vscode.window.showInformationMessage('Compiler downloaded: ' + pathVersion);
                return pathVersion;
            }
            catch (e) {
                vscode.window.showErrorMessage('Error downloading compiler: ' + e);
            }
        });
    }
    selectRemoteVersion(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const releases = yield this.getSolcReleases();
            const releasesToSelect = ['none', 'latest'];
            // tslint:disable-next-line: forin
            for (const release in releases) {
                releasesToSelect.push(release);
            }
            vscode.window.showQuickPick(releasesToSelect).then((selected) => {
                let updateValue = '';
                if (selected !== 'none') {
                    if (selected === 'latest') {
                        updateValue = selected;
                    }
                    else {
                        const value = releases[selected];
                        if (value !== 'undefined') {
                            updateValue = value.replace('soljson-', '');
                            updateValue = updateValue.replace('.js', '');
                        }
                    }
                }
                vscode.workspace.getConfiguration('solidity').update('compileUsingRemoteVersion', updateValue, target);
            });
        });
    }
    getSolcReleases() {
        return new solcCompiler_1.RemoteReleases().getSolcReleases();
    }
    outputSolcReleases() {
        return __awaiter(this, void 0, void 0, function* () {
            this.outputChannel.clear();
            this.outputChannel.appendLine('Retrieving solc versions ..');
            try {
                const releases = yield this.getSolcReleases();
                // tslint:disable-next-line: forin
                for (const release in releases) {
                    this.outputChannel.appendLine(release + ': ' + releases[release]);
                }
            }
            catch (error) {
                this.outputChannel.appendLine('Error:' + error);
            }
        });
    }
    compile(contracts, diagnosticCollection, buildDir, rootDir, sourceDir, excludePath, singleContractFilePath, overrideDefaultCompiler = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // Did we find any sol files after all?
            if (Object.keys(contracts).length === 0) {
                vscode.window.showWarningMessage('No solidity files (*.sol) found');
                return;
            }
            return new Promise((resolve, reject) => {
                this.initialiseCompiler(overrideDefaultCompiler).then(() => {
                    try {
                        const output = this.solc.compile(JSON.stringify(contracts), overrideDefaultCompiler);
                        resolve(this.processCompilationOutput(output, this.outputChannel, diagnosticCollection, buildDir, sourceDir, excludePath, singleContractFilePath));
                    }
                    catch (reason) {
                        vscode.window.showWarningMessage(reason);
                        reject(reason);
                    }
                });
            });
        });
    }
    outputErrorsToChannel(outputChannel, errors) {
        errors.forEach(error => {
            outputChannel.appendLine(error.formattedMessage);
        });
        outputChannel.show();
    }
    outputCompilerInfo(overrideDefaultCompiler = null) {
        this.outputChannel.clear();
        this.outputChannel.show();
        this.outputChannel.appendLine('Retrieving compiler information:');
        const compiler = this.solc.getCompiler(overrideDefaultCompiler);
        if (compiler.compilerType === solcCompiler_1.compilerType.localFile) {
            this.outputChannel.appendLine("Compiler using local file: '" + compiler.getConfiguration() + "', solidity version: " + compiler.getVersion());
        }
        if (compiler.compilerType === solcCompiler_1.compilerType.localNodeModule) {
            this.outputChannel.appendLine('Compiler using solidity from node_module: ' + compiler.getConfiguration() + ' solidity version: ' + compiler.getVersion());
        }
        if (compiler.compilerType === solcCompiler_1.compilerType.remote) {
            this.outputChannel.appendLine("Compiler using remote version: '" + compiler.getConfiguration() + "', solidity version: " + compiler.getVersion());
        }
        if (compiler.compilerType === solcCompiler_1.compilerType.embedded) {
            this.outputChannel.appendLine('Compiler using default compiler (embedded on extension), solidity version: ' + compiler.getVersion());
        }
    }
    initialiseCompiler(overrideDefaultCompiler = null) {
        const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
        if (typeof this.solc === 'undefined' || this.solc === null) {
            this.solc = new solcCompiler_1.SolcCompiler(rootPath);
            this.solc.setSolcCache(this.solcCachePath);
        }
        this.outputChannel.appendLine(this.solcCachePath);
        this.outputChannel.clear();
        this.outputChannel.show();
        const remoteCompiler = vscode.workspace.getConfiguration('solidity').get('compileUsingRemoteVersion');
        const localCompiler = vscode.workspace.getConfiguration('solidity').get('compileUsingLocalVersion');
        const nodeModulePackage = vscode.workspace.getConfiguration('solidity').get('nodemodulespackage');
        const compilerSetting = vscode.workspace.getConfiguration('solidity').get('defaultCompiler');
        const defaultCompiler = solcCompiler_1.compilerType[compilerSetting];
        this.outputChannel.appendLine('Initialising compiler with settings:');
        this.outputChannel.appendLine('Remote compiler: ' + remoteCompiler);
        this.outputChannel.appendLine('Local compiler: ' + localCompiler);
        this.outputChannel.appendLine('Node compiler module: ' + nodeModulePackage);
        this.outputChannel.appendLine('Default compiler: ' + compilerSetting);
        if (overrideDefaultCompiler != null) {
            this.outputChannel.appendLine('Compiling with compiler: ' + solcCompiler_1.compilerType[overrideDefaultCompiler]);
        }
        this.outputChannel.appendLine('This may take a couple of seconds as we may need to download the solc binaries...');
        return new Promise((resolve, reject) => {
            this.solc.initialiseAllCompilerSettings(remoteCompiler, localCompiler, nodeModulePackage, defaultCompiler);
            if (overrideDefaultCompiler == null) {
                this.solc.initialiseSelectedCompiler().then(() => {
                    this.outputCompilerInfo();
                    resolve();
                }).catch((reason) => {
                    vscode.window.showWarningMessage(reason);
                    reject(reason);
                });
            }
            else {
                this.solc.initialiseCompiler(overrideDefaultCompiler).then(() => {
                    this.outputCompilerInfo(overrideDefaultCompiler);
                    resolve();
                }).catch((reason) => {
                    vscode.window.showWarningMessage(reason);
                    reject(reason);
                });
            }
        });
    }
    processCompilationOutput(outputString, outputChannel, diagnosticCollection, buildDir, sourceDir, excludePath, singleContractFilePath) {
        const output = JSON.parse(outputString);
        if (Object.keys(output).length === 0) {
            const noOutputMessage = `No output by the compiler`;
            vscode.window.showWarningMessage(noOutputMessage);
            vscode.window.setStatusBarMessage(noOutputMessage);
            outputChannel.appendLine(noOutputMessage);
            return;
        }
        diagnosticCollection.clear();
        if (output.errors) {
            const errorWarningCounts = (0, solErrorsToDiaganosticsClient_1.errorsToDiagnostics)(diagnosticCollection, output.errors);
            this.outputErrorsToChannel(outputChannel, output.errors);
            if (errorWarningCounts.errors > 0) {
                const compilationWithErrorsMessage = `Compilation failed with ${errorWarningCounts.errors} errors`;
                vscode.window.showErrorMessage(compilationWithErrorsMessage);
                vscode.window.setStatusBarMessage(compilationWithErrorsMessage);
                outputChannel.appendLine(compilationWithErrorsMessage);
                if (errorWarningCounts.warnings > 0) {
                    vscode.window.showWarningMessage(`Compilation had ${errorWarningCounts.warnings} warnings`);
                }
            }
            else if (errorWarningCounts.warnings > 0) {
                const files = this.writeCompilationOutputToBuildDirectory(output, buildDir, sourceDir, excludePath, singleContractFilePath);
                const compilationWithWarningsMessage = `Compilation completed successfully!, with ${errorWarningCounts.warnings} warnings`;
                vscode.window.showWarningMessage(compilationWithWarningsMessage);
                vscode.window.setStatusBarMessage(compilationWithWarningsMessage);
                outputChannel.appendLine(compilationWithWarningsMessage);
                return files;
            }
        }
        else {
            const files = this.writeCompilationOutputToBuildDirectory(output, buildDir, sourceDir, excludePath, singleContractFilePath);
            const compilationSuccessMessage = `Compilation completed successfully!`;
            vscode.window.showInformationMessage(compilationSuccessMessage);
            vscode.window.setStatusBarMessage(compilationSuccessMessage);
            outputChannel.appendLine(compilationSuccessMessage);
            return files;
        }
    }
    ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }
    writeCompilationOutputToBuildDirectory(output, buildDir, sourceDir, excludePath, singleContractFilePath) {
        const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
        const binPath = path.join(rootPath, buildDir);
        const compiledFiles = new Array();
        if (!fs.existsSync(binPath)) {
            fs.mkdirSync(binPath);
        }
        if (typeof singleContractFilePath !== 'undefined' && singleContractFilePath !== null) {
            const relativePath = path.relative(rootPath, singleContractFilePath);
            const dirName = path.dirname(path.join(binPath, relativePath));
            const outputCompilationPath = path.join(dirName, path.basename(singleContractFilePath, '.sol') + '-solc-output' + '.json');
            this.ensureDirectoryExistence(outputCompilationPath);
            fs.writeFileSync(outputCompilationPath, JSON.stringify(output, null, 4));
        }
        else {
            const dirName = binPath;
            const outputCompilationPath = path.join(dirName, 'solc-output-compile-all' + '.json');
            this.ensureDirectoryExistence(outputCompilationPath);
            if (fs.existsSync(outputCompilationPath)) {
                fs.unlinkSync(outputCompilationPath);
            }
            fs.writeFileSync(outputCompilationPath, JSON.stringify(output, null, 4));
        }
        // iterate through all the sources,
        // find contracts and output them into the same folder structure to avoid collisions, named as the contract
        for (const source in output.contracts) {
            // TODO: ALL this validation to a method
            // Output only single contract compilation or all
            if (!singleContractFilePath || source === singleContractFilePath) {
                if (!excludePath || !excludePath.some(x => source.startsWith(x))) {
                    // Output only source directory compilation or all (this will exclude external references)
                    if (!sourceDir || source.startsWith(sourceDir)) {
                        for (const contractName in output.contracts[source]) {
                            if (output.contracts[source].hasOwnProperty(contractName)) {
                                const contract = output.contracts[source][contractName];
                                const relativePath = path.relative(rootPath, source);
                                const dirName = path.dirname(path.join(binPath, relativePath));
                                if (!fs.existsSync(dirName)) {
                                    fsex.mkdirsSync(dirName);
                                }
                                const contractAbiPath = path.join(dirName, contractName + '.abi');
                                const contractBinPath = path.join(dirName, contractName + '.bin');
                                const contractJsonPath = path.join(dirName, contractName + '.json');
                                if (fs.existsSync(contractAbiPath)) {
                                    fs.unlinkSync(contractAbiPath);
                                }
                                if (fs.existsSync(contractBinPath)) {
                                    fs.unlinkSync(contractBinPath);
                                }
                                if (fs.existsSync(contractJsonPath)) {
                                    fs.unlinkSync(contractJsonPath);
                                }
                                fs.writeFileSync(contractBinPath, contract.evm.bytecode.object);
                                fs.writeFileSync(contractAbiPath, JSON.stringify(contract.abi));
                                let version = '';
                                try {
                                    version = JSON.parse(contract.metadata).compiler.version;
                                    // tslint:disable-next-line: no-empty
                                }
                                catch (_a) { } // i could do a check for string.empty but this catches (literally :) ) all scenarios
                                const shortJsonOutput = {
                                    contractName: contractName,
                                    // tslint:disable-next-line:object-literal-sort-keys
                                    abi: contract.abi,
                                    metadata: contract.metadata,
                                    bytecode: contract.evm.bytecode.object,
                                    deployedBytecode: contract.evm.deployedBytecode.object,
                                    sourceMap: contract.evm.bytecode.sourceMap,
                                    deployedSourceMap: contract.evm.deployedBytecode.sourceMap,
                                    sourcePath: source,
                                    compiler: {
                                        name: 'solc',
                                        version: version,
                                    },
                                    ast: output.sources[source].ast,
                                    functionHashes: contract.evm.methodIdentifiers,
                                    gasEstimates: contract.evm.gasEstimates,
                                };
                                fs.writeFileSync(contractJsonPath, JSON.stringify(shortJsonOutput, null, 4));
                                compiledFiles.push(contractJsonPath);
                            }
                        }
                    }
                }
            }
        }
        return compiledFiles;
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map