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
exports.isPathSubdirectory = exports.exitsAnyFileSync = exports.findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync = exports.replaceRemappings = exports.formatPath = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function formatPath(contractPath) {
    if (contractPath !== null) {
        return contractPath.replace(/\\/g, '/');
    }
    return contractPath;
}
exports.formatPath = formatPath;
/**
 * Replaces remappings in the first array with matches from the second array,
 * then it concatenates only the unique strings from the 2 arrays.
 *
 * It splits the strings by '=' and checks the prefix of each element
 * @param remappings first array of remappings strings
 * @param replacer second array of remappings strings
 * @returns an array containing unique remappings
 */
function replaceRemappings(remappings, replacer) {
    remappings.forEach(function (remapping, index) {
        const prefix = remapping.split('=')[0];
        for (const replaceRemapping of replacer) {
            const replacePrefix = replaceRemapping.split('=')[0];
            if (prefix === replacePrefix) {
                remappings[index] = replaceRemapping;
                break;
            }
        }
    });
    return [...new Set([...remappings, ...replacer])];
}
exports.replaceRemappings = replaceRemappings;
function findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync(filenames, currentDocument, rootPath) {
    let currentDir = path.dirname(path.resolve(currentDocument));
    while (currentDir !== rootPath) {
        if (exitsAnyFileSync(filenames, currentDir)) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}
exports.findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync = findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync;
function exitsAnyFileSync(filenames, dir) {
    for (const fileName of filenames) {
        const file = path.join(dir, fileName);
        if (fs.existsSync(file)) {
            return true;
        }
    }
    return false;
}
exports.exitsAnyFileSync = exitsAnyFileSync;
function isPathSubdirectory(parent, dir) {
    const relative = path.relative(parent, dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
exports.isPathSubdirectory = isPathSubdirectory;
//# sourceMappingURL=util.js.map