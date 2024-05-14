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
exports.Package = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class Package {
    appendToSolSourcesAternativeDirectories(extraSolSourcesAlternativeDirectories) {
        this.sol_sources_alternative_directories = [...new Set(this.sol_sources_alternative_directories.concat(extraSolSourcesAlternativeDirectories))];
    }
    constructor(solidityDirectory) {
        this.sol_sources_alternative_directories = [];
        this.build_dir = 'bin';
        if (solidityDirectory !== null && solidityDirectory.length > 0) {
            this.sol_sources = solidityDirectory[0];
            this.sol_sources_alternative_directories = solidityDirectory;
        }
        else {
            this.sol_sources = '';
        }
    }
    getSolSourcesAbsolutePath() {
        if (this.sol_sources !== undefined || this.sol_sources === '') {
            return path.join(this.absoluletPath, this.sol_sources);
        }
        return this.absoluletPath;
    }
    isImportForThis(contractDependencyImport) {
        const splitDirectories = contractDependencyImport.split('/');
        if (splitDirectories.length === 1) {
            return false;
        }
        return splitDirectories[0] === this.name;
    }
    resolveImport(contractDependencyImport) {
        if (this.isImportForThis(contractDependencyImport)) {
            const defaultPath = path.join(this.getSolSourcesAbsolutePath(), contractDependencyImport.substring(this.name.length));
            if (fs.existsSync(defaultPath)) {
                return defaultPath;
            }
            else {
                for (let index = 0; index < this.sol_sources_alternative_directories.length; index++) {
                    const directory = this.sol_sources_alternative_directories[index];
                    if (directory !== undefined || directory === '') {
                        const fullpath = path.join(this.absoluletPath, directory, contractDependencyImport.substring(this.name.length));
                        if (fs.existsSync(fullpath)) {
                            return fullpath;
                        }
                    }
                }
            }
        }
        return null;
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map