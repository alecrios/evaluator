const Operator = require('./Operator');

class ShuntingYard {
	constructor() {
		this.operators = {
			'^': new Operator('^', 4, 'right', (a, b) => Math.pow(a, b)),
			'*': new Operator('*', 3, 'left', (a, b) => a * b),
			'/': new Operator('/', 3, 'left', (a, b) => a / b),
			'+': new Operator('+', 2, 'left', (a, b) => a + b),
			'-': new Operator('-', 2, 'left', (a, b) => a - b),
		};

		this.numbers = [0,1,2,3,4,5,6,7,8,9]; // temp
	}

	isNumber(token) {
		return this.numbers.includes(token);
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

		return topOperator.hasGreaterPrecedence(currentOperator) || (topOperator.hasEqualPrecedence(currentOperator) && topOperator.isLeftAssociative());
	}

	parseExpression(expression) {
		const operatorStack = [];
		const outputQueue = [];

		const tokens = expression.replace(/\s/g, '');
		let previousTokenIsNumber = false;

		for (let token of tokens) {
			if (this.isNumber(Number(token))) {
				const number = previousTokenIsNumber ? Number(String(outputQueue.pop()) + token) : Number(token);
				outputQueue.push(number);
				previousTokenIsNumber = true;
				continue;
			}

			previousTokenIsNumber = false;

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
					outputQueue.push(operatorStack.pop());
				}

				if (this.isOpenParenthesis(this.getTopToken(operatorStack))) {
					operatorStack.pop();
					continue;
				}

				console.error('Mismatched parentheses');
				return;
			} 
		}

		while (operatorStack.length) {
			let operator = this.getTopToken(operatorStack);

			if (this.isOpenParenthesis(operator) || this.isCloseParenthesis(operator)) {
				console.error('Mismatched parentheses');
				return;
			}

			outputQueue.push(operatorStack.pop());
		}

		return outputQueue;
	}

	resolveRpn(rpnArray) {
		const stack = [];

		for (let token of rpnArray) {
			const operator = this.operators[token];

			if (operator) {
				stack.push(operator.method.apply(this, stack.splice(-operator.method.length)));
			} else {
				stack.push(parseFloat(token));
			}
		}

		return stack[0];
	}

	calculate(expression) {
		return this.resolveRpn(this.parseExpression(expression));
	}
}

module.exports = new ShuntingYard();
