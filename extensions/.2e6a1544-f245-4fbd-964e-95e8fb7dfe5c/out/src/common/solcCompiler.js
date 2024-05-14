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
exports.SolcCompiler = exports.RemoteCompilerLoader = exports.RemoteReleases = exports.RemoteCompilerDownloader = exports.LocalPathCompilerLoader = exports.NpmModuleCompilerLoader = exports.EmbeddedCompilerLoader = exports.SolcCompilerLoader = exports.compilerType = void 0;
const solErrorsToDiagnostics_1 = require("../server/solErrorsToDiagnostics");
const solc = __importStar(require("solc"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const https = __importStar(require("https"));
const sourceDocumentCollection_1 = require("./model/sourceDocumentCollection");
const projectService_1 = require("./projectService");
var compilerType;
(function (compilerType) {
    compilerType[compilerType["localNodeModule"] = 0] = "localNodeModule";
    compilerType[compilerType["remote"] = 1] = "remote";
    compilerType[compilerType["localFile"] = 2] = "localFile";
    compilerType[compilerType["embedded"] = 3] = "embedded";
})(compilerType = exports.compilerType || (exports.compilerType = {}));
class SolcCompilerLoader {
    getVersion() {
        return this.localSolc.version();
    }
    isInitialisedAlready(configuration = null) {
        if (this.localSolc === null) {
            return false;
        }
        return this.matchesConfiguration(configuration);
    }
}
exports.SolcCompilerLoader = SolcCompilerLoader;
class EmbeddedCompilerLoader extends SolcCompilerLoader {
    matchesConfiguration(configuration) {
        return true;
    }
    getConfiguration() {
        return '';
    }
    constructor() {
        super();
        this.compilerType = compilerType.embedded;
    }
    init() {
        this.localSolc = null;
    }
    canCompilerBeLoaded() {
        return true;
    }
    initialiseCompiler() {
        return new Promise((resolve, reject) => {
            this.localSolc = require('solc');
            resolve();
        });
    }
}
exports.EmbeddedCompilerLoader = EmbeddedCompilerLoader;
class NpmModuleCompilerLoader extends SolcCompilerLoader {
    matchesConfiguration(configuration) {
        return configuration === this.npmModule;
    }
    getConfiguration() {
        return this.npmModule;
    }
    constructor() {
        super();
        this.npmModule = 'solc';
        this.compilerType = compilerType.localNodeModule;
    }
    init(rootPath, npmModule = 'solc') {
        if (rootPath !== this.rootPath) {
            this.localSolc = null;
            this.rootPath = rootPath;
        }
        if (!this.matchesConfiguration(npmModule)) {
            this.npmModule = npmModule;
            this.localSolc = null;
        }
    }
    canCompilerBeLoaded() {
        return this.isInstalledSolcUsingNode(this.rootPath);
    }
    getLocalSolcNodeInstallation() {
        return path.join(this.rootPath, 'node_modules', this.npmModule, 'soljson.js');
    }
    isInstalledSolcUsingNode(rootPath) {
        return fs.existsSync(this.getLocalSolcNodeInstallation());
    }
    initialiseCompiler() {
        return new Promise((resolve, reject) => {
            if (this.isInitialisedAlready(this.npmModule)) {
                resolve();
            }
            if (this.canCompilerBeLoaded()) {
                try {
                    const solidityfile = require(this.getLocalSolcNodeInstallation());
                    this.localSolc = solc.setupMethods(solidityfile);
                    resolve();
                }
                catch (e) {
                    this.localSolc = null;
                    reject('An error has ocurred, loading the compiler from Node Modules, located at:' + this.getLocalSolcNodeInstallation() + ', ' + e);
                }
            }
            else {
                this.localSolc = null;
                reject('Compiler cannot be loaded from: ' + this.getLocalSolcNodeInstallation());
            }
        });
    }
}
exports.NpmModuleCompilerLoader = NpmModuleCompilerLoader;
class LocalPathCompilerLoader extends SolcCompilerLoader {
    matchesConfiguration(configuration) {
        return configuration === this.localPath;
    }
    getConfiguration() {
        return this.localPath;
    }
    constructor() {
        super();
        this.compilerType = compilerType.localFile;
    }
    init(localPath) {
        if (!this.matchesConfiguration(localPath)) {
            this.localPath = localPath;
            this.localSolc = null;
        }
    }
    canCompilerBeLoaded() {
        if (typeof this.localPath !== 'undefined' && this.localPath !== null && this.localPath !== '') {
            return this.compilerExistsAtPath(this.localPath);
        }
        return false;
    }
    compilerExistsAtPath(localPath) {
        return fs.existsSync(localPath);
    }
    initialiseCompiler() {
        return new Promise((resolve, reject) => {
            if (this.isInitialisedAlready(this.localPath)) {
                resolve();
            }
            if (this.canCompilerBeLoaded()) {
                try {
                    const solidityfile = require(this.localPath);
                    this.localSolc = solc.setupMethods(solidityfile);
                    resolve();
                }
                catch (e) {
                    this.localSolc = null;
                    reject('An error has ocurred, loading the compiler located at:' + this.localPath + ', ' + e);
                }
            }
            else {
                this.localSolc = null;
                reject('Compiler cannot be loaded from: ' + this.localPath);
            }
        });
    }
}
exports.LocalPathCompilerLoader = LocalPathCompilerLoader;
class RemoteCompilerDownloader {
    downloadCompilationFile(version, savePath) {
        const file = fs.createWriteStream(savePath);
        const url = 'https://binaries.soliditylang.org/bin/soljson-' + version + '.js';
        return new Promise((resolve, reject) => {
            const request = https.get(url, function (response) {
                if (response.statusCode !== 200) {
                    reject('Error retrieving solidity compiler: ' + response.statusMessage);
                }
                else {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        resolve();
                    });
                }
            }).on('error', function (error) {
                reject(error);
            });
            request.end();
        });
    }
}
exports.RemoteCompilerDownloader = RemoteCompilerDownloader;
class RemoteReleases {
    getSolcReleases() {
        const url = 'https://binaries.soliditylang.org/bin/list.json';
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        const binList = JSON.parse(body);
                        resolve(binList.releases);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                });
            }).on('error', (error) => {
                reject(error.message);
            });
        });
    }
    getFullVersionFromFileName(fileName) {
        let version = '';
        const value = fileName;
        if (value !== 'undefined') {
            version = value.replace('soljson-', '');
            version = version.replace('.js', '');
        }
        else {
            throw ('Remote version: Invalid file name');
        }
        return version;
    }
    resolveRelease(version) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (version === 'latest') {
                    resolve(version);
                }
                try {
                    const releases = yield this.getSolcReleases();
                    // tslint:disable-next-line:forin
                    for (const release in releases) {
                        const fullVersion = this.getFullVersionFromFileName(releases[release]);
                        if (version === fullVersion) {
                            resolve(fullVersion);
                        }
                        if (version === release) {
                            resolve(fullVersion);
                        }
                        if (version === releases[release]) {
                            resolve(fullVersion);
                        }
                        if ('v' + release === version) {
                            resolve(fullVersion);
                        }
                        if (version.startsWith('v' + release + '+commit')) {
                            resolve(fullVersion);
                        }
                    }
                    reject('Remote version: invalid version');
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.RemoteReleases = RemoteReleases;
class RemoteCompilerLoader extends SolcCompilerLoader {
    getConfiguration() {
        return this.configuredVersion;
    }
    matchesConfiguration(configuration) {
        if (typeof this.configuredVersion !== 'undefined' && this.configuredVersion !== null && this.configuredVersion !== '') {
            if (this.localSolc !== null) {
                return this.getVersion().startsWith(configuration.substring(1)) && this.configuredVersion === configuration;
            }
            return this.configuredVersion === configuration;
        }
        return false;
    }
    setSolcCache(solcCachePath) {
        this.solcCachePath = solcCachePath;
    }
    constructor() {
        super();
        this.compilerType = compilerType.remote;
    }
    initVersion(version) {
        console.log('initVersion');
        console.log(version);
        if (!this.matchesConfiguration(version)) {
            this.configuredVersion = version;
            this.localSolc = null;
        }
    }
    canCompilerBeLoaded() {
        // this should check if the string version is valid
        if (typeof this.configuredVersion !== 'undefined' && this.configuredVersion !== null && this.configuredVersion !== '') {
            return true;
        }
        return false;
    }
    initialiseCompiler() {
        return new Promise((resolve, reject) => {
            if (this.isInitialisedAlready(this.configuredVersion)) {
                resolve();
            }
            if (this.canCompilerBeLoaded()) {
                const solcService = this;
                new RemoteReleases().resolveRelease(this.configuredVersion).then(resolvedVersion => this.loadRemoteVersionRetry(resolvedVersion, 1, 3).then((solcSnapshot) => {
                    solcService.localSolc = solcSnapshot;
                    resolve();
                }).catch((error) => {
                    reject('There was an error loading the remote version: ' + this.configuredVersion + ',' + error);
                })).catch((error) => {
                    reject('There was an error loading the remote version: ' + this.configuredVersion + ',' + error);
                });
            }
            else {
                this.localSolc = null;
                reject('Compiler cannot load remote version:' + this.configuredVersion);
            }
        });
    }
    loadRemoteVersionRetry(versionString, retryNumber, maxRetries) {
        return new Promise((resolve, reject) => {
            this.loadRemoteVersion(versionString).then((solcConfigured) => resolve(solcConfigured)).catch((reason) => {
                if (retryNumber <= maxRetries) {
                    return this.loadRemoteVersionRetry(versionString, retryNumber + 1, maxRetries);
                }
                else {
                    reject(reason);
                }
            });
        });
    }
    loadRemoteVersion(versionString) {
        const pathVersion = path.resolve(path.join(this.solcCachePath, 'soljson-' + versionString + '.js'));
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(pathVersion) && versionString !== 'latest') {
                    const solidityfile = require(pathVersion);
                    const solcConfigured = solc.setupMethods(solidityfile);
                    resolve(solcConfigured);
                }
                else {
                    new RemoteCompilerDownloader().downloadCompilationFile(versionString, pathVersion).then(() => {
                        const solidityfile = require(pathVersion);
                        const solcConfigured = solc.setupMethods(solidityfile);
                        resolve(solcConfigured);
                    }).catch((reason) => reject(reason));
                }
            }
            catch (error) {
                if (fs.existsSync(pathVersion)) {
                    fs.unlinkSync(pathVersion);
                    return this.loadRemoteVersion(versionString);
                }
                else {
                    reject(error);
                }
            }
        });
    }
}
exports.RemoteCompilerLoader = RemoteCompilerLoader;
class SolcCompiler {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.nodeCompiler = new NpmModuleCompilerLoader();
        this.localCompiler = new LocalPathCompilerLoader();
        this.remoteCompiler = new RemoteCompilerLoader();
        this.embeddedCompiler = new EmbeddedCompilerLoader();
        this.selectedCompiler = compilerType.embedded;
    }
    setSolcCache(solcCachePath) {
        this.remoteCompiler.setSolcCache(solcCachePath);
    }
    isRootPathSet() {
        return typeof this.rootPath !== 'undefined' && this.rootPath !== null;
    }
    initialisedAlready(setting, compiler) {
        if (compiler === compilerType.remote) {
            return this.remoteCompiler.isInitialisedAlready(setting);
        }
        if (compiler === compilerType.localFile) {
            return this.localCompiler.isInitialisedAlready(setting);
        }
        if (compiler === compilerType.localNodeModule) {
            return this.nodeCompiler.isInitialisedAlready(setting);
        }
        if (compiler === compilerType.embedded) {
            return this.embeddedCompiler.isInitialisedAlready();
        }
    }
    initialiseAllCompilerSettings(remoteVersionSetting, localPathSetting, nodeModuleSetting, selectedCompiler) {
        this.nodeCompiler.init(this.rootPath, nodeModuleSetting);
        this.remoteCompiler.initVersion(remoteVersionSetting);
        this.localCompiler.init(localPathSetting);
        this.embeddedCompiler.init();
        this.selectedCompiler = selectedCompiler;
    }
    initialiseSelectedCompiler() {
        return this.getCompiler().initialiseCompiler();
    }
    initialiseCompiler(selectedCompiler) {
        return this.getCompiler(selectedCompiler).initialiseCompiler();
    }
    compile(contracts, selectedCompiler = null) {
        const compiler = this.getCompiler(selectedCompiler);
        return compiler.localSolc.compile(contracts);
    }
    getLoadedVersion() {
        var _a;
        const compiler = this.getCompiler();
        return (_a = compiler.localSolc) === null || _a === void 0 ? void 0 : _a.version();
    }
    getLoadedCompilerType() {
        const compiler = this.getCompiler();
        return compilerType[compiler.compilerType];
    }
    getSelectedVersion() {
        const compiler = this.getCompiler();
        return compiler.getConfiguration();
    }
    getCompiler(selectedCompiler = null) {
        if (selectedCompiler == null) {
            selectedCompiler = this.selectedCompiler;
        }
        switch (selectedCompiler) {
            case compilerType.embedded:
                return this.embeddedCompiler;
            case compilerType.localNodeModule:
                return this.nodeCompiler;
            case compilerType.localFile:
                return this.localCompiler;
            case compilerType.remote:
                return this.remoteCompiler;
            default:
                throw new Error('Invalid compiler');
        }
    }
    compileSolidityDocumentAndGetDiagnosticErrors(filePath, documentText, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings, selectedCompiler = null, evmVersion = '') {
        if (selectedCompiler == null) {
            selectedCompiler = this.selectedCompiler;
        }
        if (this.isRootPathSet()) {
            const contracts = new sourceDocumentCollection_1.SourceDocumentCollection();
            contracts.addSourceDocumentAndResolveImports(filePath, documentText, (0, projectService_1.initialiseProject)(this.rootPath, packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings));
            const contractsForCompilation = contracts.getDefaultSourceDocumentsForCompilationDiagnostics(evmVersion);
            contractsForCompilation.settings.optimizer = null;
            contractsForCompilation.settings.outputSelection = null;
            const outputString = this.compile(JSON.stringify(contractsForCompilation), selectedCompiler);
            const output = JSON.parse(outputString);
            if (output.errors) {
                return output
                    .errors
                    .map(error => (0, solErrorsToDiagnostics_1.errorToDiagnostic)(error));
            }
        }
        else {
            const contract = {};
            contract[filePath] = documentText;
            const output = this.compile({ sources: contract });
            if (output.errors) {
                return output.errors.map((error) => (0, solErrorsToDiagnostics_1.errorToDiagnostic)(error));
            }
        }
        return [];
    }
}
exports.SolcCompiler = SolcCompiler;
//# sourceMappingURL=solcCompiler.js.map