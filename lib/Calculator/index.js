const Operator = require('./Operator');
const Constant = require('./Constant');

module.exports = class Calculator {
	constructor() {
		this.symbols = {
			'^': {infix: 'EXP'},
			'*': {infix: 'MUL'},
			'/': {infix: 'DIV'},
			'%': {infix: 'MOD'},
			'+': {infix: 'ADD', prefix: 'POS'},
			'-': {infix: 'SUB', prefix: 'NEG'},
		};

		this.operators = {
			'EXP': new Operator('EXP', 4, 'right', (a, b) => a ** b),
			'POS': new Operator('POS', 3, 'right', (a) => a),
			'NEG': new Operator('NEG', 3, 'right', (a) => -a),
			'MUL': new Operator('MUL', 2, 'left', (a, b) => a * b),
			'DIV': new Operator('DIV', 2, 'left', (a, b) => a / b),
			'MOD': new Operator('MOD', 2, 'left', (a, b) => a % b),
			'ADD': new Operator('ADD', 1, 'left', (a, b) => a + b),
			'SUB': new Operator('SUB', 1, 'left', (a, b) => a - b),
		};

		this.constants = {
			'E': new Constant('E', Math.E),
			'PI': new Constant('PI', Math.PI),
		};
	}

	isWhitespace(token) {
		return /\s/.test(token);
	}

	isNumber(token) {
		return !isNaN(parseFloat(token)) && isFinite(token);
	}

	isSymbol(token) {
		return this.symbols.hasOwnProperty(token);
	}

	isOperator(token) {
		return this.operators.hasOwnProperty(token);
	}

	isConstant(token) {
		return this.constants.hasOwnProperty(token);
	}

	isOpenParenthesis(token) {
		return token === '(';
	}

	isCloseParenthesis(token) {
		return token === ')';
	}

	round(number, decimalPlaces) {
		if (toString(number).includes('e')) {
			return Number(number.toFixed(decimalPlaces));
		} else {
			return Number(Math.round(`${number}e${decimalPlaces}`) + `e-${decimalPlaces}`);
		}
	}

	topOperatorHasPrecedence(operatorStack, currentOperator) {
		if (!operatorStack.length) return;

		const topToken = operatorStack[operatorStack.length - 1];

		if (!this.isOperator(topToken)) return;

		const topOperator = this.operators[topToken];

		if (currentOperator.method.length === 1 && topOperator.method.length > 1) return;

		return topOperator.hasGreaterPrecedence(currentOperator)
			|| (topOperator.hasEqualPrecedence(currentOperator)
			&& topOperator.isLeftAssociative());
	}

	determineOperator(token, previousToken) {
		let notation;

		if (previousToken === undefined || this.isOpenParenthesis(previousToken) || this.isSymbol(previousToken)) {
			notation = 'prefix';
		} else if (this.isCloseParenthesis(previousToken) || (this.isNumber(previousToken) || this.isConstant(previousToken))) {
			notation = 'infix';
		}

		return this.operators[this.symbols[token][notation]];
	}

	parse(string) {
		if (!string.length) {
			throw new Error(`No input`);
		}

		const pattern = /(\d+\.\d*)|(\d*\.\d+)|(\d+)|([a-zA-Z]+)|(.)/g;
		const infixExpression = (string.match(pattern) || [])
			.filter((token) => !this.isWhitespace(token))
			.map((token) => token.toUpperCase());

		return infixExpression;
	}

	convert(infixExpression) {
		if (!infixExpression.length) {
			throw new Error(`No valid tokens`);
		}

		const operatorStack = [];
		const postfixExpression = [];

		for (const [index, token] of infixExpression.entries()) {
			if (this.isNumber(token)) {
				postfixExpression.push(parseFloat(token));
				continue;
			}

			if (this.isConstant(token)) {
				postfixExpression.push(this.constants[token].name);
				continue;
			}

			if (this.isSymbol(token)) {
				const operator = this.determineOperator(token, infixExpression[index - 1]);

				if (operator === undefined) {
					throw new Error(`Misused operator: "${token}"`);
				}

				while (this.topOperatorHasPrecedence(operatorStack, operator)) {
					postfixExpression.push(operatorStack.pop());
				}

				operatorStack.push(operator.name);
				continue;
			}

			if (this.isOpenParenthesis(token)) {
				operatorStack.push(token);
				continue;
			}

			if (this.isCloseParenthesis(token)) {
				while (!this.isOpenParenthesis(operatorStack[operatorStack.length - 1])) {
					if (!operatorStack.length) {
						throw new Error(`Invalid grouping`);
					}

					postfixExpression.push(operatorStack.pop());
				}

				operatorStack.pop();
				continue;
			}

			throw new Error(`Invalid token: "${token}"`);
		}

		while (operatorStack.length) {
			const operator = operatorStack[operatorStack.length - 1];

			if (this.isOpenParenthesis(operator) || this.isCloseParenthesis(operator)) {
				throw new Error(`Invalid grouping`);
			}

			postfixExpression.push(operatorStack.pop());
		}

		return postfixExpression;
	}

	resolve(postfixExpression) {
		if (!postfixExpression.length) {
			throw new Error(`No operations`);
		}

		const evaluationStack = [];

		for (const token of postfixExpression) {
			if (this.isNumber(token)) {
				evaluationStack.push(token);
				continue;
			}

			if (this.isConstant(token)) {
				evaluationStack.push(this.constants[token].value);
				continue;
			}

			const operator = this.operators[token];

			if (evaluationStack.length < operator.method.length) {
				throw new Error(`Missing argument(s) for: "${token}"`);
			}

			const result = operator.method(...evaluationStack.splice(-operator.method.length));
			evaluationStack.push(result);
		}

		if (evaluationStack.length > 1) {
			throw new Error(`Missing operation(s)`);
		}

		const reduction = evaluationStack[0];
		const result = this.round(reduction, 8);

		return result;
	}

	evaluate(string) {
		try {
			const infixExpression = this.parse(string);
			const postfixExpression = this.convert(infixExpression);
			const result = this.resolve(postfixExpression);
			return result;
		} catch(error) {
			console.error(error.message);
		}
	}
};
