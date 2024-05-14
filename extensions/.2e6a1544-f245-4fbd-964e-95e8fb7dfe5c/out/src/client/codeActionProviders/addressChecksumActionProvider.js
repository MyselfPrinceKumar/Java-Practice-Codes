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
exports.SPDXCodeActionProvider = exports.ChangeCompilerVersionActionProvider = exports.AddressChecksumCodeActionProvider = void 0;
const vscode = __importStar(require("vscode"));
class AddressChecksumCodeActionProvider {
    static createFix(document, diagnostic) {
        const match = this.regex.exec(diagnostic.message);
        if (match) {
            if (match.groups['address']) {
                const fixedAddress = match.groups['address'];
                const fix = new vscode.CodeAction(`Convert address to checksummed address: 0x${fixedAddress}`, vscode.CodeActionKind.QuickFix);
                fix.edit = new vscode.WorkspaceEdit();
                fix.edit.replace(document.uri, new vscode.Range(diagnostic.range.start, diagnostic.range.start.translate(0, fixedAddress.length + 2)), '0x' + fixedAddress);
                fix.isPreferred = true;
                fix.diagnostics = [diagnostic];
                return fix;
            }
        }
        return null;
    }
    // tslint:disable-next-line:max-line-length
    provideCodeActions(document, range, context, token) {
        // for each diagnostic entry that has the matching `code`, create a code action command
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === AddressChecksumCodeActionProvider.ADDRESS_CHECKSUM_ERRORCODE)
            .map(diagnostic => AddressChecksumCodeActionProvider.createFix(document, diagnostic));
    }
}
AddressChecksumCodeActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.SourceFixAll,
    vscode.CodeActionKind.Empty,
];
AddressChecksumCodeActionProvider.ADDRESS_CHECKSUM_ERRORCODE = '9429';
AddressChecksumCodeActionProvider.regex = /Correct checksummed address: "0x(?<address>[0-9a-fA-F]*)"/gm;
exports.AddressChecksumCodeActionProvider = AddressChecksumCodeActionProvider;
class ChangeCompilerVersionActionProvider {
    static createFix(document, diagnostic) {
        const fix = new vscode.CodeAction(`Change workspace compiler version`, vscode.CodeActionKind.QuickFix);
        fix.command = { command: 'solidity.selectWorkspaceRemoteSolcVersion',
            title: 'Change the workspace remote compiler version',
            tooltip: 'This will open a prompt with the solidity version' };
        fix.diagnostics = [diagnostic];
        return fix;
    }
    // tslint:disable-next-line:max-line-length
    provideCodeActions(document, range, context, token) {
        const results = [];
        const diagnostics = context.diagnostics
            .filter(diagnostic => diagnostic.code === ChangeCompilerVersionActionProvider.COMPILER_ERRORCODE);
        diagnostics.forEach(diagnostic => {
            results.push(ChangeCompilerVersionActionProvider.createFix(document, diagnostic));
        });
        return results;
    }
}
ChangeCompilerVersionActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.Empty,
];
ChangeCompilerVersionActionProvider.COMPILER_ERRORCODE = '5333';
exports.ChangeCompilerVersionActionProvider = ChangeCompilerVersionActionProvider;
class SPDXCodeActionProvider {
    static createFix(document, diagnostic, license, isPreferred = false) {
        const fix = new vscode.CodeAction(`Add SPDX License ` + license, vscode.CodeActionKind.QuickFix);
        const licenseText = '// SPDX-License-Identifier: ' + license + ' \n';
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.insert(document.uri, diagnostic.range.start, licenseText);
        fix.isPreferred = isPreferred;
        fix.diagnostics = [diagnostic];
        return fix;
    }
    // tslint:disable-next-line:max-line-length
    provideCodeActions(document, range, context, token) {
        const results = [];
        const diagnostics = context.diagnostics
            .filter(diagnostic => diagnostic.code === SPDXCodeActionProvider.SPDX_ERRORCODE);
        diagnostics.forEach(diagnostic => {
            results.push(SPDXCodeActionProvider.createFix(document, diagnostic, SPDXCodeActionProvider.preferredLicense, true));
            SPDXCodeActionProvider.licenses.forEach(license => {
                if (license !== SPDXCodeActionProvider.preferredLicense) {
                    results.push(SPDXCodeActionProvider.createFix(document, diagnostic, license, false));
                }
            });
        });
        return results;
    }
}
SPDXCodeActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.Empty,
];
SPDXCodeActionProvider.SPDX_ERRORCODE = '1878';
SPDXCodeActionProvider.licenses = ['MIT', 'UNKNOWN', 'UNLICENSED'];
SPDXCodeActionProvider.preferredLicense = 'MIT';
exports.SPDXCodeActionProvider = SPDXCodeActionProvider;
//# sourceMappingURL=addressChecksumActionProvider.js.map