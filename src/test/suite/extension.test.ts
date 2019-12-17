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

		it('should return middleware template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.middleware.ts',
				type: 'middleware',
				uri: vscode.Uri.parse('test'),
				associatedArray: undefined
			}).then((result => {
				expect(result).to.equal(
					`import { Injectable, NestMiddleware } from '@nestjs/common';
					import { Request, Response } from 'express';
					
					@Injectable()
					export class {{ Name }}Middleware implements NestMiddleware {
					  use(req: Request, res: Response, next: Function) {
						console.log('Request...');
						next();
					  }
					}					
					`
				);
			}));
		});

		it('should return exception template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.exception.ts',
				type: 'exception',
				uri: vscode.Uri.parse('test'),
				associatedArray: undefined
			}).then((result => {
				expect(result).to.equal(
					`import { HttpException, HttpStatus } from '@nestjs/common';

					export class {{ Name }}Exception extends HttpException {
					  constructor() {
						super('{{ Name }}', HttpStatus.I_AM_A_TEAPOT);
					  }
					}			
					`
				);
			}));
		});

		it('should return interceptor template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.interceptor.ts',
				type: 'interceptor',
				uri: vscode.Uri.parse('test'),
				associatedArray: undefined
			}).then((result => {
				expect(result).to.equal(
					`import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
					import { Observable } from 'rxjs';
					import { tap } from 'rxjs/operators';
					
					@Injectable()
					export class {{ Name }}Interceptor implements NestInterceptor {
					  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
						console.log('Before...');
						return next
						  .handle()
						  .pipe(
							tap(() => console.log('After...')),
						  );
					  }
					}	
					`
				);
			}));
		});

		it('should return pipe template', () => {
			getFileTemplate({
				name: 'test',
				fullName: 'test.pipe.ts',
				type: 'pipe',
				uri: vscode.Uri.parse('test'),
				associatedArray: undefined
			}).then((result => {
				expect(result).to.equal(
					`import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

					@Injectable()
					export class {{ Name }}Pipe implements PipeTransform {
					  transform(value: any, metadata: ArgumentMetadata) {
						return value;
					  }
					}
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
