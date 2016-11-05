const fs = require('fs.extra');
const path = require('path');
const getSourceDirectory = require('./source');

class generate {
	/**
	 * create component file with fs
	 * @param {string} re - regular expresssion
	 * @param {string} componentName - component name
	 * @param {string} answersInner - options provided when creating component
	 */
	createComponentFile(re, componentName, answersInner) {
		const _modFile = file.replace(re, componentName);
		const __modFile = this.createModFile(_modFile, answersInner, componentName);
		console.log(__modFile);
		fs.writeFileSync(path.join(process.cwd(), 'src/components', module, componentName + '.react.js'), __modFile, 'utf-8');
	}

	/**
	 * createComponentFacade
 	 * @param {string} module - module name to create a component
	 * @param {string} componentName - component name
	 * @param {string} asnwers - options provided when creating component
	 * @param {string} answersInner - options provided when creating component
	 * @param {function} cb - callback for status return
	 */
	generateComponent(type, module, componentName, answers, answersInner, cb) {
		try {
			let exists;
			if (componentName !== undefined) {
				exists = fs.accessSync(path.join(process.cwd(), getSourceDirectory(), 'components', module, componentName), fs.F_OK);
			} else {
				exists = fs.accessSync(path.join(process.cwd(), getSourceDirectory(), 'components', module + '.react.js'), fs.F_OK);
			}
			cb(`${componentName}.react.js already exists`);
			return;
		} catch (e) {
			const file = fs.readFileSync(path.join(__dirname, '..', `templates/components/${type}-component.react.js`), 'utf-8');
			const re = /<name>/gi;
			if (componentName !== undefined) {
				try {
					fs.mkdirSync(path.join(process.cwd(), getSourceDirectory(), 'components', module), 755);
					const _modFile = file.replace(re, componentName);
					if (answers.propTypes === 'no') {
						fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), 'components', module, componentName + '.react.js'), _modFile, 'utf-8');
					} else {
						const __modFile = this.createModFile(_modFile, answersInner, componentName);
						fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), 'components', module, componentName + '.react.js'), __modFile, 'utf-8');				
					}
					cb(true);
				} catch (ex) {
					if (ex.syscall == 'open') {
						cb('module doesn\'t exist');
					} else {
						const _modFile = file.replace(re, componentName);
						const __modFile = this.createModFile(_modFile, answersInner, componentName);
						fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), 'components', module, componentName + '.react.js'), __modFile, 'utf-8');
						cb(true);
					}
				}
			} else {
				try {
					const _modFile = file.replace(re, module);
					const __modFile = this.createModFile(_modFile, answersInner, module);
					fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), 'components', module + '.react.js'), __modFile, 'utf-8');
					cb(true);
				} catch (ex) {
					cb('error');
				}
			}
		}
	}

	/**
	 * create modified file
	 * @param {string} _modFile - modified file
	 * @param {string} answersInner - options provided when creating component
	 * @param {string} componentName - component name
	 */
	createModFile(_modFile, answersInner, componentName) {
		let modFileIndex = Number(_modFile.indexOf('export')) - 1;
		return _modFile.slice(0, modFileIndex) + this.generatePropTypesSet(answersInner, componentName) + _modFile.slice(modFileIndex);
	}

	/**
	 * generate propType set
	 * @param {string} answersInner
	 * @param {string} componentName - component name
	 */
	generatePropTypesSet(answersInner, componentName) {
		let __propTypes = {};
	
		for (let propName in answersInner) {
			__propTypes[propName] = `React.PropTypes.${answersInner[propName]}`;
		}

		const _answersInner = JSON.stringify(__propTypes, null, 2);
		const propTypes = `\n${componentName}.propTypes = ${_answersInner};\n`;
		//converting "" => non quotes
		const dynamicPropTypes = propTypes.replace(/"/g, '');
		return dynamicPropTypes;
	}

	/**
	 * createComponentFacade
	 * @param {string} module - module name to create a component
	 * @param {string} componentName - component name
	 * @param {string} asnwers - options provided when creating component
	 * @param {string} answersInner - options provided when creating component
	 * @param {function} cb - callback for status return
	 */
	createComponent(module, componentName, answers, answersInner, cb) {
		this.generateComponent(answers.componentType, module, componentName, answers, answersInner, cb);
	}
	
	/**
	 * create test file
	 * @param {string} module - module name to create a component
 	 * @param {string} testName - test file name
	 * @param {function} cb - callback for status return
 	 */
	createTest(module, testName, cb) {
		try {
			let exists;
			if (testName !== undefined) {
				exists = fs.accessSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module, testName), fs.F_OK);
			} else {
				exists = fs.accessSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module + '.js'), fs.F_OK);
			}
			cb(`${componentName}.js test file already exists`);
			return;
		} catch (e) {
			const file = fs.readFileSync(path.join(__dirname, '..', `templates/src/__tests__/app.js`), 'utf-8');
			if (testName !== undefined) {
				try {
					fs.mkdirSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module), 755);
					fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module, testName + '.js'), file, 'utf-8');
					cb(true);
				} catch (ex) {
					if (ex.syscall == 'open') {
						cb('module doesn\'t exist');
					} else {
						fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module, testName + '.js'), file, 'utf-8');
						cb(true);
					}
				}
			} else {
				try {
					fs.writeFileSync(path.join(process.cwd(), getSourceDirectory(), '__tests__', module + '.js'), file, 'utf-8');
					cb(true);
				} catch(ex) {
					if (ex.syscall == 'open') {
						cb('file doesn\'t exist');
					} else {
						cb(ex);
					}
				}
			}
		}
	}
}

module.exports = generate;