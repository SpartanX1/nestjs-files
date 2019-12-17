import { window, Uri, workspace, WorkspaceEdit, Position } from 'vscode';
import { render } from 'mustache';
import * as fs from 'fs-extra';
import { join } from 'path';
import { TextEncoder, TextDecoder } from 'util';
import { getPascalCase, getRelativePathForImport, getArraySchematics, getLineNoFromString, getClassName } from './utils';
import { NestFile } from './nest';

export async function createFile(file: NestFile): Promise<boolean | undefined | string> {

    if (fs.existsSync(join(file.uri.fsPath, file.name.toLowerCase() + `.${file.type}.ts`))) {
        return window.showErrorMessage('A file already exists with given name');
    }
    else {
        file.uri = Uri.parse(file.uri.path + '/' + file.fullName);

        return getFileTemplate(file)
            .then((data) => {
                return workspace.fs.writeFile(file.uri, new TextEncoder().encode(data));
            })
            .then(() => {
                if (file.associatedArray !== undefined) {
                    return addFilesToAppModule(file);
                }
                return true;
            })
            .catch(err =>  { return window.showErrorMessage(err); });
    }
}

export async function addFilesToAppModule(file: NestFile): Promise<boolean> {
    let moduleFile: Uri[] = [];

    if (file.type === 'service' || file.type === 'controller') {
        moduleFile = await workspace.findFiles(`**/${file.name}.module.ts`, '**/node_modules/**', 1);
    }

    if (moduleFile.length === 0 && file.name !== 'app') {
        moduleFile = await workspace.findFiles('**/app.module.ts', '**/node_modules/**', 1);
    }
    
    if (moduleFile.length !== 0) {
        workspace.saveAll()
        .then(() => {
            return workspace.fs.readFile(moduleFile[0]);
        })
        .then((data) => {
            return addToArray(data, file, moduleFile[0]);  
        });
    }

    return false;
}

export async function getFileTemplate(file: NestFile): Promise<string> {
    return fs.readFile(join(__dirname, `/templates/${file.type}.mustache`), 'utf8')
        .then((data) => {
            let view = {
                Name: getClassName(file.name)
            };
            return render(data, view);
        });
}

export async function getImportTemplate(file: NestFile, appModule: Uri): Promise<string> {
    return fs.readFile(join(__dirname, `/templates/import.mustache`), 'utf8')
        .then((data) => {
            let view = {
                Name: getClassName(file.name) + getPascalCase(file.type),
                Path: getRelativePathForImport(appModule, file.uri)
            };
            return render(data, view);
        });
}

export async function addToArray(data: Uint8Array, file: NestFile, modulePath: Uri): Promise<boolean> {
    
    if (file.associatedArray !== undefined) {
        const pattern = getArraySchematics(file.associatedArray);
        let match;
        let pos: Position;
        let tempStrData = new TextDecoder().decode(data);
    
        if (match = pattern.exec(tempStrData)){
            pos = getLineNoFromString(tempStrData, match);
            const toInsert = '\n        ' + getClassName(file.name) + getPascalCase(file.type) + ', ';
            let edit = new WorkspaceEdit();
            edit.insert(modulePath, pos, toInsert);
            const importPath = await getImportTemplate(file, modulePath);
            edit.insert(modulePath, new Position(0, 0), importPath + '\n');
    
            return workspace.applyEdit(edit);
        }

        return false;
    }

    return false;
}
