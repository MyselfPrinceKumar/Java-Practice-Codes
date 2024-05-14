'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitErrorToDiagnostic = exports.errorToDiagnostic = exports.getDiagnosticSeverity = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
function getDiagnosticSeverity(severity) {
    switch (severity) {
        case 'error':
            return vscode_languageserver_1.DiagnosticSeverity.Error;
        case 'warning':
            return vscode_languageserver_1.DiagnosticSeverity.Warning;
        case 'info':
            return vscode_languageserver_1.DiagnosticSeverity.Information;
        default:
            return vscode_languageserver_1.DiagnosticSeverity.Error;
    }
}
exports.getDiagnosticSeverity = getDiagnosticSeverity;
function errorToDiagnostic(error) {
    if (error.formattedMessage !== undefined &&
        error.sourceLocation === undefined) {
        return {
            diagnostic: {
                message: error.formattedMessage,
                code: error.errorCode,
                range: {
                    end: {
                        character: 0,
                        line: 0,
                    },
                    start: {
                        character: 0,
                        line: 0,
                    },
                },
                severity: getDiagnosticSeverity(error.severity),
            },
            fileName: '',
        };
    }
    if (error.sourceLocation.file !== undefined && error.sourceLocation.file !== null) {
        const fileName = error.sourceLocation.file;
        const errorSplit = error.formattedMessage.substr(error.formattedMessage.indexOf(fileName)).split(':');
        let index = 1;
        // a full path in windows includes a : for the drive
        if (process.platform === 'win32') {
            index = 2;
        }
        return splitErrorToDiagnostic(error, errorSplit, index, fileName);
    }
    else {
        const errorSplit = error.formattedMessage.split(':');
        let fileName = errorSplit[0];
        let index = 1;
        // a full path in windows includes a : for the drive
        if (process.platform === 'win32') {
            fileName = errorSplit[0] + ':' + errorSplit[1];
            index = 2;
        }
        return splitErrorToDiagnostic(error, errorSplit, index, fileName);
    }
}
exports.errorToDiagnostic = errorToDiagnostic;
function splitErrorToDiagnostic(error, errorSplit, index, fileName) {
    const severity = getDiagnosticSeverity(error.severity);
    const errorMessage = error.message;
    // tslint:disable-next-line:radix
    let line = parseInt(errorSplit[index]);
    if (Number.isNaN(line)) {
        line = 1;
    }
    // tslint:disable-next-line:radix
    let column = parseInt(errorSplit[index + 1]);
    if (Number.isNaN(column)) {
        column = 1;
    }
    let startCharacter = column - 1;
    let endCharacter = column + error.sourceLocation.end - error.sourceLocation.start - 1;
    if (endCharacter < 0) {
        endCharacter = 1;
    }
    let endLine = line - 1;
    let startLine = line - 1;
    if (error.code === '1878') {
        startLine = 0;
        endLine = 2;
        endCharacter = 0;
        startCharacter = 1;
    }
    return {
        diagnostic: {
            message: errorMessage,
            code: error.errorCode,
            range: {
                end: {
                    character: endCharacter,
                    line: endLine,
                },
                start: {
                    character: startCharacter,
                    line: startLine,
                },
            },
            severity: severity,
        },
        fileName: fileName,
    };
}
exports.splitErrorToDiagnostic = splitErrorToDiagnostic;
//# sourceMappingURL=solErrorsToDiagnostics.js.map