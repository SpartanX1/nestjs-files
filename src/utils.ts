import { dirname, relative }  from 'path';
import { Uri, Position } from 'vscode';

export function getPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getRelativePathForImport(appModule: Uri, importFile: Uri) {
    return './' + relative(dirname(appModule.path), importFile.path).replace(/\\/g, '/').replace('.ts', '');
}

export function getArraySchematics(arrayType: string): RegExp {
    return new RegExp(`${arrayType}(\\s+)?:(\\s+)?\\[`);
}

export function getLineNoFromString(str: string, match: RegExpExecArray): Position {
    const array = str.substring(0, match.index).split('\n');
    const charPosition = str.split('\n')[array.length - 1].indexOf('[');
    return new Position(array.length - 1, charPosition + 1);
}

export const invalidFileNames = /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export function getClassName(fileName: string): string
{
    const specialCharIndex = fileName.indexOf('-');
    if (specialCharIndex !== -1) {
        return getPascalCase(fileName.substring(0, specialCharIndex))
                    .concat(getPascalCase(fileName.substring(specialCharIndex + 1, fileName.length)));
    } 
    else
    {
        return getPascalCase(fileName);
    }
}
