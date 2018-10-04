const Operator = require('./Operator');

class Calculator {
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

	isOpenParenthesis(token) {
		return token === '(';
	}

	isCloseParenthesis(token) {
		return token === ')';
	}

	getTopToken(stack) {
		return stack[stack.length - 1];
	}

	topOperatorHasPrecedence(operatorStack, currentOperator) {
		if (!operatorStack.length) return;

		const topToken = this.getTopToken(operatorStack);

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
		} else if (this.isCloseParenthesis(previousToken) || this.isNumber(previousToken)) {
			notation = 'infix';
		}

		return this.operators[this.symbols[token][notation]];
	}

	convert(expression) {
		const operatorStack = [];
		const outputQueue = [];

		const pattern = /[\+\-\*\/\%\^\(\)]|(\d*\.\d+|\d+\.\d*|\d+)/g;
		const tokens = expression.replace(/\s+/g, '').match(pattern);

		if (!tokens) {
			console.error(`Input does not have any valid tokens to process`);
			return;
		};

		for (let [index, token] of tokens.entries()) {
			if (this.isNumber(token)) {
				outputQueue.push(parseFloat(token));
				continue;
			}

			if (this.isSymbol(token)) {
				const operator = this.determineOperator(token, tokens[index - 1]);

				if (operator === undefined) {
					console.error(`"${token}" symbol does not represent a valid operator in the given context`);
					return;
				};

				while (this.topOperatorHasPrecedence(operatorStack, operator)) {
					outputQueue.push(operatorStack.pop());
				}

				operatorStack.push(operator.name);
				continue;
			}

			if (this.isOpenParenthesis(token)) {
				operatorStack.push(token);
				continue;
			}

			if (this.isCloseParenthesis(token)) {
				while (!this.isOpenParenthesis(this.getTopToken(operatorStack))) {
					if (!operatorStack.length) {
						console.error(`Parentheses are not matched properly`);
						return;
					};

					outputQueue.push(operatorStack.pop());
				}

				operatorStack.pop();
				continue;
			}
		}

		while (operatorStack.length) {
			const operator = this.getTopToken(operatorStack);

			if (this.isOpenParenthesis(operator) || this.isCloseParenthesis(operator)) {
				console.error(`Parentheses are not matched properly`);
				return;
			};

			outputQueue.push(operatorStack.pop());
		}

		return outputQueue;
	}

	resolve(outputQueue) {
		if (outputQueue === undefined) return;

		const evaluationStack = [];

		for (let token of outputQueue) {
			if (this.isNumber(token)) {
				evaluationStack.push(token);
				continue;
			}

			const operator = this.operators[token];

			if (evaluationStack.length < operator.method.length) {
				console.error(`"${token}" operator does not have a sufficient number of arguments`);
				return;
			};

			const result = operator.method.apply(this, evaluationStack.splice(-operator.method.length));
			evaluationStack.push(result);
		}

		return evaluationStack[0];
	}

	evaluate(expression) {
		const outputQueue = this.convert(expression);

		return this.resolve(outputQueue);
	}
}

module.exports = new Calculator();
