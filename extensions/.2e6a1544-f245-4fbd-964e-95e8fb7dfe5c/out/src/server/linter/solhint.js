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
const fs = __importStar(require("fs"));
const linter = __importStar(require("solhint/lib/index"));
const vscode_languageserver_1 = require("vscode-languageserver");
class SolhintService {
    constructor(rootPath, rules) {
        this.config = new ValidationConfig(rootPath, rules);
    }
    loadFileConfig(rootPath) {
        this.config.loadFileConfig(rootPath);
    }
    setIdeRules(rules) {
        this.config.setIdeRules(rules);
    }
    validate(filePath, documentText) {
        return linter
            .processStr(documentText, this.config.build())
            .messages
            .map(e => this.toDiagnostic(e));
    }
    toDiagnostic(error) {
        return {
            message: `Linter: ${error.message} [${error.ruleId}]`,
            range: this.rangeOf(error),
            severity: this.severity(error),
        };
    }
    severity(error) {
        return (error.severity === 3) ? vscode_languageserver_1.DiagnosticSeverity.Warning : vscode_languageserver_1.DiagnosticSeverity.Error;
    }
    rangeOf(error) {
        const line = error.line - 1;
        const character = error.column - 1;
        return {
            start: { line, character },
            // tslint:disable-next-line:object-literal-sort-keys
            end: { line, character: character + 1 },
        };
    }
}
exports.default = SolhintService;
class ValidationConfig {
    constructor(rootPath, ideRules) {
        this.setIdeRules(ideRules);
        this.loadFileConfig(rootPath);
    }
    setIdeRules(rules) {
        this.ideRules = rules || {};
    }
    build() {
        let extendsConfig = ['solhint:recommended'];
        if (this.fileConfig.extends !== 'undefined' && this.fileConfig.extends !== null) {
            extendsConfig = this.fileConfig.extends;
        }
        return {
            extends: extendsConfig,
            // plugins: ["prettier"], // removed plugins as it crashes the extension until this is fully supported path etc loading in solhint
            rules: Object.assign(ValidationConfig.DEFAULT_RULES, this.ideRules, this.fileConfig.rules),
        };
    }
    isRootPathSet(rootPath) {
        return typeof rootPath !== 'undefined' && rootPath !== null;
    }
    loadFileConfig(rootPath) {
        if (this.isRootPathSet(rootPath)) {
            const filePath = `${rootPath}/.solhint.json`;
            const readConfig = this.readFileConfig.bind(this, filePath);
            readConfig();
            this.currentWatchFile = filePath;
            // fs.watchFile(filePath, {persistent: false}, readConfig);
        }
        else {
            this.fileConfig = ValidationConfig.EMPTY_CONFIG;
        }
    }
    readFileConfig(filePath) {
        this.fileConfig = ValidationConfig.EMPTY_CONFIG;
        if (fs.existsSync(filePath)) {
            this.fileConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    }
}
ValidationConfig.DEFAULT_RULES = { 'func-visibility': false };
ValidationConfig.EMPTY_CONFIG = { rules: {} };
//# sourceMappingURL=solhint.js.map