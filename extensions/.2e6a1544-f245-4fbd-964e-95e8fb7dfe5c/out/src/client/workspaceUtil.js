"use strict";
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
exports.getSolidityRemappings = exports.getCurrentWorkspaceRootFolder = exports.getCurrentWorkspaceRootFsPath = exports.getCurrentProjectInWorkspaceRootFsPath = void 0;
const vscode = __importStar(require("vscode"));
const util_1 = require("../common/util");
const projectService_1 = require("../common/projectService");
const settingsService_1 = require("./settingsService");
function getCurrentProjectInWorkspaceRootFsPath() {
    const monoreposupport = settingsService_1.SettingsService.getMonoRepoSupport();
    const currentRootPath = getCurrentWorkspaceRootFsPath();
    if (monoreposupport) {
        const editor = vscode.window.activeTextEditor;
        const currentDocument = editor.document.uri;
        const projectFolder = (0, projectService_1.findFirstRootProjectFile)(currentRootPath, currentDocument.fsPath);
        if (projectFolder == null) {
            return currentRootPath;
        }
        else {
            return projectFolder;
        }
    }
    else {
        return currentRootPath;
    }
}
exports.getCurrentProjectInWorkspaceRootFsPath = getCurrentProjectInWorkspaceRootFsPath;
function getCurrentWorkspaceRootFsPath() {
    return getCurrentWorkspaceRootFolder().uri.fsPath;
}
exports.getCurrentWorkspaceRootFsPath = getCurrentWorkspaceRootFsPath;
function getCurrentWorkspaceRootFolder() {
    const editor = vscode.window.activeTextEditor;
    const currentDocument = editor.document.uri;
    return vscode.workspace.getWorkspaceFolder(currentDocument);
}
exports.getCurrentWorkspaceRootFolder = getCurrentWorkspaceRootFolder;
function getSolidityRemappings() {
    const remappings = settingsService_1.SettingsService.getRemappings();
    if (process.platform === 'win32') {
        return (0, util_1.replaceRemappings)(remappings, settingsService_1.SettingsService.getRemappingsWindows());
    }
    else {
        return (0, util_1.replaceRemappings)(remappings, settingsService_1.SettingsService.getRemappingsUnix());
    }
}
exports.getSolidityRemappings = getSolidityRemappings;
//# sourceMappingURL=workspaceUtil.js.map