import * as vscode from 'vscode';
import { getPascalCase, getArraySchematics, getClassName, getLineNoFromString } from '../../utils';
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { getFileTemplate, createFile } from '../../file-helper';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	describe('Utils', () => {
		it('should capitalize first letter', () => {
			expect(getPascalCase('letter')).to.equal('Letter');
		});

		it('should match valid string to regex', () => {
			const regex = getArraySchematics('imports');
			expect(regex.test('imports: [')).to.be.true;
		});

		it('should not match invalid string to regex', () => {
			const regex = getArraySchematics('imports');
			expect(regex.test('test: [')).to.be.false;
		});

		it('should return class name in pascal case', () => {
			expect(getClassName('file-helper')).to.equal('FileHelper');
		});

		it('should return class name in pascal case', () => {
			expect(getClassName('helper')).to.equal('Helper');
		});
	});

	describe('File template', () => {

		it('should return module template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.module.ts',
				type: 'module',
				uri: vscode.Uri.parse('test'),
				associatedArray: 'imports'
			}).then((result => {
				expect(result).to.equal(
					`import { Module } from '@nestjs/common';
	
					@Module({
						imports: [],
						controllers: [],
						providers: [],
					})
					export class TestModule {}`
				);
			}));
		});

		it('should return service template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.service.ts',
				type: 'service',
				uri: vscode.Uri.parse('test'),
				associatedArray: 'providers'
			}).then((result => {
				expect(result).to.equal(
					`import { Injectable } from '@nestjs/common';

					@Injectable()
					export class TestService {}
					`
				);
			}));
		});

		it('should return controller template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.controller.ts',
				type: 'controller',
				uri: vscode.Uri.parse('test'),
				associatedArray: 'controllers'
			}).then((result => {
				expect(result).to.equal(
					`import { Controller } from '@nestjs/common';

					@Controller()
					export class TestController {}					
					`
				);
			}));
		});
	});

	describe('File creation', () => { 
		it('should create module file', () => {
			createFile(
				{ 
					name: 'test', 
					type: 'module', 
					associatedArray: 'imports', 
					uri: vscode.Uri.parse('test/test.module.ts'), 
					fullName: `test.module.ts`
				}
			).then((result) => {
				expect(result).to.be.true;
			});
		});
	});
});
