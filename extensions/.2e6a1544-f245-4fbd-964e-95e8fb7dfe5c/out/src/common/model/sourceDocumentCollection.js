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
exports.SourceDocumentCollection = void 0;
const fs = __importStar(require("fs"));
const sourceDocument_1 = require("./sourceDocument");
const util_1 = require("../util");
class SourceDocumentCollection {
    static getAllLibraryImports(codeFiles) {
        let imports = [];
        codeFiles.forEach(x => imports = imports.concat(sourceDocument_1.SourceDocument.getAllLibraryImports(x)));
        return [...new Set(imports)];
    }
    constructor() {
        this.documents = new Array();
    }
    isDocumentPathTheSame(contract, contractPath) {
        return contract.absolutePath === contractPath;
    }
    containsSourceDocument(contractPath) {
        return this.documents.findIndex((contract) => { return contract.absolutePath === contractPath; }) > -1;
    }
    getDefaultSourceDocumentsForCompilation(optimizeCompilationRuns = 200, evmVersion = "") {
        const compilerOutputSelection = {
            '*': {
                '': ['ast'],
                '*': ['abi', 'devdoc', 'userdoc', 'storageLayout', 'metadata', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates'],
            },
        };
        return this.getSourceDocumentsForCompilation(true, optimizeCompilationRuns, evmVersion, compilerOutputSelection);
    }
    getDefaultSourceDocumentsForCompilationDiagnostics(evmVersion = "") {
        const compilerOutputSelection = {
            '*': {
                '': [],
                '*': [],
            },
        };
        return this.getSourceDocumentsForCompilation(false, 0, evmVersion, compilerOutputSelection);
    }
    getSourceDocumentsForCompilation(optimizeCompilation, optimizeCompilationRuns, evmVersion = "", outputSelection) {
        const contractsForCompilation = {};
        this.documents.forEach(contract => {
            contractsForCompilation[contract.absolutePath] = { content: contract.code };
        });
        if (evmVersion === "" || evmVersion === undefined || evmVersion === null) {
            const compilation = {
                language: 'Solidity',
                settings: {
                    optimizer: {
                        enabled: optimizeCompilation,
                        runs: optimizeCompilationRuns,
                    },
                    outputSelection: outputSelection,
                },
                sources: contractsForCompilation,
            };
            return compilation;
        }
        else {
            const compilation = {
                language: 'Solidity',
                settings: {
                    optimizer: {
                        enabled: optimizeCompilation,
                        runs: optimizeCompilationRuns,
                    },
                    outputSelection: outputSelection,
                    evmVersion: evmVersion,
                },
                sources: contractsForCompilation,
            };
            return compilation;
        }
    }
    addSourceDocumentAndResolveImports(contractPath, code, project) {
        const contract = this.addSourceDocument(contractPath, code, project);
        if (contract !== null) {
            contract.resolveImports();
            contract.imports.forEach(foundImport => {
                if (fs.existsSync(foundImport)) {
                    if (!this.containsSourceDocument(foundImport)) {
                        const importContractCode = this.readContractCode(foundImport);
                        if (importContractCode != null) {
                            this.addSourceDocumentAndResolveImports(foundImport, importContractCode, project);
                        }
                    }
                }
                else {
                    this.addSourceDocumentAndResolveDependencyImport(foundImport, contract, project);
                }
            });
        }
        return contract;
    }
    addSourceDocument(contractPath, code, project) {
        if (!this.containsSourceDocument(contractPath)) {
            const contract = new sourceDocument_1.SourceDocument(contractPath, code, project);
            this.documents.push(contract);
            return contract;
        }
        return null;
    }
    formatContractPath(contractPath) {
        return (0, util_1.formatPath)(contractPath);
    }
    getAllImportFromPackages() {
        const importsFromPackages = new Array();
        this.documents.forEach(contract => {
            const contractImports = contract.getAllImportFromPackages();
            contractImports.forEach(contractImport => {
                if (importsFromPackages.indexOf(contractImport) < 0) {
                    importsFromPackages.push(contractImport);
                }
            });
        });
        return importsFromPackages;
    }
    readContractCode(contractPath) {
        if (fs.existsSync(contractPath)) {
            return fs.readFileSync(contractPath, 'utf8');
        }
        return null;
    }
    addSourceDocumentAndResolveDependencyImport(dependencyImport, contract, project) {
        // find re-mapping
        const remapping = project.findImportRemapping(dependencyImport);
        if (remapping !== undefined && remapping !== null) {
            const importPath = this.formatContractPath(remapping.resolveImport(dependencyImport));
            this.addSourceDocumentAndResolveDependencyImportFromContractFullPath(importPath, project, contract, dependencyImport);
        }
        else {
            const depPack = project.findDependencyPackage(dependencyImport);
            if (depPack !== undefined) {
                const depImportPath = this.formatContractPath(depPack.resolveImport(dependencyImport));
                this.addSourceDocumentAndResolveDependencyImportFromContractFullPath(depImportPath, project, contract, dependencyImport);
            }
        }
    }
    addSourceDocumentAndResolveDependencyImportFromContractFullPath(importPath, project, contract, dependencyImport) {
        if (!this.containsSourceDocument(importPath)) {
            const importContractCode = this.readContractCode(importPath);
            if (importContractCode != null) {
                this.addSourceDocumentAndResolveImports(importPath, importContractCode, project);
                contract.replaceDependencyPath(dependencyImport, importPath);
            }
        }
        else {
            contract.replaceDependencyPath(dependencyImport, importPath);
        }
    }
}
exports.SourceDocumentCollection = SourceDocumentCollection;
//# sourceMappingURL=sourceDocumentCollection.js.map