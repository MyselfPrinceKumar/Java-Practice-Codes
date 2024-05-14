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
exports.importRemappingArray = exports.importRemappings = exports.Remapping = void 0;
const path = __importStar(require("path"));
const util_1 = require("../util");
class Remapping {
    isImportForThis(contractDependencyImport) {
        if (this.context !== undefined) {
            return contractDependencyImport.startsWith(this.context + ':' + this.prefix);
        }
        return contractDependencyImport.startsWith(this.prefix);
    }
    getLibraryPathIfRelative(projectPath) {
        if (!path.isAbsolute(this.target)) {
            const fullPath = path.join(this.basePath, this.target);
            if ((0, util_1.isPathSubdirectory)(projectPath, fullPath)) {
                return path.dirname(this.target).split(path.sep)[0];
            }
        }
        return null;
    }
    createImportFromFile(filePath) {
        if (this.isFileForThis(filePath)) {
            if (path.isAbsolute(this.target)) {
                if (this.context === undefined) {
                    return path.join(this.prefix, filePath.substring(this.target.length));
                }
                if (this.context !== undefined) {
                    return path.join(this.context + ':' + this.prefix, filePath.substring(this.target.length));
                }
            }
            else {
                if (this.context === undefined) {
                    return path.join(this.prefix, filePath.substring(path.join(this.basePath, this.target).length));
                }
                if (this.context !== undefined) {
                    return path.join(this.context + ':' + this.prefix, filePath.substring(path.join(this.basePath, this.target).length));
                }
            }
        }
    }
    isFileForThis(filePath) {
        if (path.isAbsolute(this.target)) {
            return filePath.startsWith(this.target);
        }
        else {
            return filePath.startsWith(path.join(this.basePath, this.target));
        }
    }
    resolveImport(contractDependencyImport) {
        if (contractDependencyImport === null || contractDependencyImport === undefined) {
            return null;
        }
        const validImport = this.isImportForThis(contractDependencyImport);
        if (path.isAbsolute(this.target)) {
            if (validImport && this.context === undefined) {
                return path.join(this.target, contractDependencyImport.substring(this.prefix.length));
            }
            if (validImport && this.context !== undefined) {
                return path.join(this.target, contractDependencyImport.substring((this.context + ':' + this.prefix).length));
            }
        }
        else {
            if (validImport && this.context === undefined) {
                return path.join(this.basePath, this.target, contractDependencyImport.substring(this.prefix.length));
            }
            if (validImport && this.context !== undefined) {
                return path.join(this.basePath, this.target, contractDependencyImport.substring((this.context + ':' + this.prefix).length));
            }
        }
        return null;
    }
}
exports.Remapping = Remapping;
function importRemappings(remappings, project) {
    const remappingArray = remappings.split(/\r\n|\r|\n/); // split lines
    return importRemappingArray(remappingArray, project);
}
exports.importRemappings = importRemappings;
function importRemappingArray(remappings, project) {
    const remappingsList = new Array();
    if (remappings !== undefined && remappings.length > 0) {
        remappings.forEach(remappingElement => {
            const remapping = new Remapping();
            remapping.basePath = project.projectPackage.absoluletPath;
            const regex = /((?<context>[\S]+)\:)?(?<prefix>[\S]+)=(?<target>.+)/g;
            const match = regex.exec(remappingElement);
            if (match) {
                if (match.groups['context']) {
                    remapping.context = match.groups['context'];
                }
                if (match.groups['prefix']) {
                    remapping.prefix = match.groups['prefix'];
                    remapping.target = match.groups['target'];
                    remappingsList.push(remapping);
                }
            }
        });
    }
    return remappingsList;
}
exports.importRemappingArray = importRemappingArray;
//# sourceMappingURL=remapping.js.map