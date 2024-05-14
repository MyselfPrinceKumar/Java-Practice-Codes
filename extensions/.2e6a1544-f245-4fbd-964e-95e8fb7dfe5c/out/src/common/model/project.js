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
exports.Project = void 0;
const remapping_1 = require("./remapping");
const path = __importStar(require("path"));
const glob_1 = require("glob");
class Project {
    constructor(projectPackage, dependencies, packagesDir, remappings) {
        this.projectPackage = projectPackage;
        this.dependencies = dependencies;
        this.packagesDir = packagesDir;
        this.remappings = (0, remapping_1.importRemappingArray)(remappings, this);
    }
    // This will need to add the current package as a parameter to resolve version dependencies
    findDependencyPackage(contractDependencyImport) {
        return this.dependencies.find((depPack) => depPack.isImportForThis(contractDependencyImport));
    }
    getAllSolFilesIgnoringDependencyFolders() {
        const solPath = this.projectPackage.getSolSourcesAbsolutePath() + '/**/*.sol';
        const exclusions = [];
        this.packagesDir.forEach(x => {
            exclusions.push(path.join(this.projectPackage.getSolSourcesAbsolutePath(), x, '**'));
        });
        exclusions.push(path.join(this.projectPackage.getSolSourcesAbsolutePath(), this.projectPackage.build_dir, '**'));
        this.getAllRelativeLibrariesAsExclusionsFromRemappings().forEach(x => exclusions.push(x));
        return glob_1.glob.sync(solPath, { ignore: exclusions, nodir: true });
    }
    getAllRelativeLibrariesAsExclusionsFromRemappings() {
        return this.getAllRelativeLibrariesRootDirsFromRemappingsAbsolutePaths().map(x => path.join(x, '**'));
    }
    getAllRelativeLibrariesRootDirsFromRemappings() {
        const results = [];
        this.remappings.forEach(element => {
            const dirLib = element.getLibraryPathIfRelative(this.projectPackage.getSolSourcesAbsolutePath());
            if (dirLib !== null && results.find(x => x === dirLib) === undefined) {
                results.push(dirLib);
            }
        });
        return results;
    }
    getAllRelativeLibrariesRootDirsFromRemappingsAbsolutePaths() {
        return this.getAllRelativeLibrariesRootDirsFromRemappings().map(x => path.resolve(this.projectPackage.getSolSourcesAbsolutePath(), x));
    }
    findImportRemapping(contractDependencyImport) {
        // const remappings = importRemappings("@openzeppelin/=lib/openzeppelin-contracts//\r\nds-test/=lib/ds-test/src/", this);
        const foundRemappings = [];
        this.remappings.forEach(element => {
            if (element.isImportForThis(contractDependencyImport)) {
                foundRemappings.push(element);
            }
        });
        if (foundRemappings.length > 0) {
            return this.sortByLength(foundRemappings)[foundRemappings.length - 1];
        }
        return null;
    }
    findRemappingForFile(filePath) {
        const foundRemappings = [];
        this.remappings.forEach(element => {
            if (element.isFileForThis(filePath)) {
                foundRemappings.push(element);
            }
        });
        if (foundRemappings.length > 0) {
            return this.sortByLength(foundRemappings)[foundRemappings.length - 1];
        }
        return null;
    }
    sortByLength(array) {
        return array.sort(function (a, b) {
            return a.length - b.length;
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map