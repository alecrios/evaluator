const Operator = require('./Operator');

class Calculator {
	constructor() {
		this.operators = {
			'^': new Operator('^', 5, 'right', (a, b) => Math.pow(a, b)),
			'&': new Operator('&', 4, 'right', (a) => -a),
			'*': new Operator('*', 3, 'left', (a, b) => a * b),
			'/': new Operator('/', 3, 'left', (a, b) => a / b),
			'+': new Operator('+', 1, 'left', (a, b) => a + b),
			'-': new Operator('-', 1, 'left', (a, b) => a - b),
		};
	}

	isNumber(token) {
		return !isNaN(parseFloat(token)) && isFinite(token);
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

	topOperatorHasPrecedence(operatorStack, currentToken) {
		if (!operatorStack.length) return;

		const topToken = this.getTopToken(operatorStack);

		if (!this.isOperator(topToken)) return;

		const topOperator = this.operators[topToken];
		const currentOperator = this.operators[currentToken];

		if (currentOperator.method.length === 1 && topOperator.method.length > 1) return;

		return topOperator.hasGreaterPrecedence(currentOperator) || (topOperator.hasEqualPrecedence(currentOperator) && topOperator.isLeftAssociative());
	}

	convert(expression) {
		const operatorStack = [];
		const outputQueue = [];

		const pattern = /[\+\-\*\/\^\(\)\&]|(\d*\.\d+|\d+\.\d*|\d+)/g; // & is temporary
		const tokens = expression.replace(/\s+/g, '').match(pattern);

		for (let token of tokens) {
			if (this.isNumber(token)) {
				outputQueue.push(parseFloat(token));
				continue;
			}

			if (this.isOperator(token)) {
				while (this.topOperatorHasPrecedence(operatorStack, token)) {
					outputQueue.push(operatorStack.pop());
				}

				operatorStack.push(token);
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
			let operator = this.getTopToken(operatorStack);

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

			if (this.isOperator(token)) {
				let operator = this.operators[token];
				evaluationStack.push(operator.method.apply(this, evaluationStack.splice(-operator.method.length)));
				continue;
			}
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
