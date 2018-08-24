const Operator = require('./Operator');

class Calculator {
	constructor() {
		this.symbols = {
			'^': {infix: 'EXP'},
			'*': {infix: 'MUL'},
			'/': {infix: 'DIV'},
			'%': {infix: 'MOD'},
			'+': {infix: 'ADD'},
			'-': {infix: 'SUB', prefix: 'NEG'},
		};

		this.operators = {
			'EXP': new Operator('EXP', 4, 'right', (a, b) => Math.pow(a, b)),
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

		return topOperator.hasGreaterPrecedence(currentOperator) || (topOperator.hasEqualPrecedence(currentOperator) && topOperator.isLeftAssociative());
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

		for (let [index, token] of tokens.entries()) {
			if (this.isNumber(token)) {
				outputQueue.push(parseFloat(token));
				continue;
			}
			
			if (this.isSymbol(token)) {
				const operator = this.determineOperator(token, tokens[index - 1]);

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
					if (!operatorStack.length) return;

					outputQueue.push(operatorStack.pop());
				}

				operatorStack.pop();
				continue;
			} 
		}

		while (operatorStack.length) {
			const operator = this.getTopToken(operatorStack);

			if (this.isOpenParenthesis(operator) || this.isCloseParenthesis(operator)) return;

			outputQueue.push(operatorStack.pop());
		}

		return outputQueue;
	}

	resolve(outputQueue) {
		const evaluationStack = [];

		for (let token of outputQueue) {
			if (this.isNumber(token)) {
				evaluationStack.push(token);
				continue;
			}

			const operator = this.operators[token];
			const result = operator.method.apply(this, evaluationStack.splice(-operator.method.length))
			evaluationStack.push(result);
		}

		return evaluationStack[0];
	}

	evaluate(expression) {
		const outputQueue = this.convert(expression);

		if (outputQueue === undefined) return;

		return this.resolve(outputQueue);
	}
}

module.exports = new Calculator();
