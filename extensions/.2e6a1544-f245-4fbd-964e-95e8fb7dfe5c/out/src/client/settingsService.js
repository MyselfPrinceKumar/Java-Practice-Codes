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
exports.SettingsService = void 0;
const vscode = __importStar(require("vscode"));
const etherscanSourceCodeDownloader_1 = require("../common/sourceCodeDownloader/etherscanSourceCodeDownloader");
class SettingsService {
    static getPackageDefaultDependenciesDirectories() {
        const packageDefaultDependenciesDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesDirectory');
        if (typeof packageDefaultDependenciesDirectory === 'string') {
            return [packageDefaultDependenciesDirectory];
        }
        return packageDefaultDependenciesDirectory;
    }
    static getPackageDefaultDependenciesContractsDirectory() {
        const packageDefaultDependenciesContractsDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesContractsDirectory');
        if (typeof packageDefaultDependenciesContractsDirectory === 'string') {
            return [packageDefaultDependenciesContractsDirectory];
        }
        return packageDefaultDependenciesContractsDirectory;
    }
    static getCompilerOptimisation() {
        return vscode.workspace.getConfiguration('solidity').get('compilerOptimization');
    }
    static getEVMVersion() {
        return vscode.workspace.getConfiguration('solidity').get('evmVersion');
    }
    static getRemappings() {
        return vscode.workspace.getConfiguration('solidity').get('remappings');
    }
    static getRemappingsWindows() {
        return vscode.workspace.getConfiguration('solidity').get('remappingsWindows');
    }
    static getRemappingsUnix() {
        return vscode.workspace.getConfiguration('solidity').get('remappingsUnix');
    }
    static getMonoRepoSupport() {
        return vscode.workspace.getConfiguration('solidity').get('monoRepoSupport');
    }
    static getExplorerEtherscanBasedApiKey(server) {
        const key = etherscanSourceCodeDownloader_1.EtherscanDomainChainMapper.getApiKeyMappings()[server];
        return vscode.workspace.getConfiguration('solidity').get(key);
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settingsService.js.map