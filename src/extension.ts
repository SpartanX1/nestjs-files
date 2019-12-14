import { workspace, commands, ExtensionContext, window, Uri } from 'vscode';
import { createFile } from './file-helper';
import { invalidFileNames } from './utils';

export function activate(context: ExtensionContext) {

	let disposableModuleCommand = commands.registerCommand('extension.GenerateModule', (resource: Uri) => {

		if (workspace === undefined)
		{
			window.showErrorMessage('Please select a workspace first');
		}
		else
		{
			window.showInputBox({
				placeHolder: "Please enter module name",
			}).then((input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					createFile({ 
						name: input, 
						type: 'module', 
						associatedArray: 'imports', 
						uri: resource, 
						fullName: input.toLowerCase() + `.module.ts`
					});
				}
				else {
					window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	let disposableServiceCommand = commands.registerCommand('extension.GenerateService', (resource) => {
		if (workspace === undefined)
		{
			window.showErrorMessage('Please select a workspace first');
		}
		else
		{
			window.showInputBox({
				placeHolder: "Please enter Service name",
			}).then((input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					createFile({ 
						name: input, 
						type: 'service', 
						associatedArray: 'providers', 
						uri: resource,
						fullName: input.toLowerCase() + `.service.ts`
					});
				}
				else {
					window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	let disposableControllerCommand = commands.registerCommand('extension.GenerateController', (resource) => {
		if (workspace === undefined)
		{
			window.showErrorMessage('Please select a workspace first');
		}
		else
		{
			window.showInputBox({
				placeHolder: "Please enter Controller name",
			}).then((input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					createFile({ 
						name: input, 
						type: 'controller', 
						associatedArray: 'controllers', 
						uri: resource,
						fullName: input.toLowerCase() + `.controller.ts`
					});
				}
				else {
					window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	let disposableRepositoryCommand = commands.registerCommand('extension.GenerateRepository', (resource: Uri) => {

		if (workspace === undefined)
		{
			window.showErrorMessage('Please select a workspace first');
		}
		else
		{
			window.showInputBox({
				placeHolder: "Please enter repository name",
			}).then((input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					createFile({ 
						name: input, 
						type: 'service', 
						associatedArray: 'providers', 
						uri: resource,
						fullName: input.toLowerCase() + `.repository.ts`
					});
				}
				else {
					window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	context.subscriptions.push(disposableModuleCommand, disposableServiceCommand, disposableControllerCommand, disposableRepositoryCommand);
}

export function deactivate() {}
