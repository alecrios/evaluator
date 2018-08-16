class ShuntingYard {
	constructor() {
		this.numbers = [0,1,2,3,4,5,6,7,8,9]; // temp
		this.operators = {
			'^': {
				associativity: 'right',
				precedence: 4,
				parameters: 2,
				method: (a, b) => Math.pow(a, b),
			},
			'*': {
				associativity: 'left',
				precedence: 3,
				parameters: 2,
				method: (a, b) => a * b,
			},
			'/': {
				associativity: 'left',
				precedence: 3,
				parameters: 2,
				method: (a, b) => a / b,
			},
			'+': {
				associativity: 'left',
				precedence: 2,
				parameters: 2,
				method: (a, b) => a + b,
			},
			'-': {
				associativity: 'left',
				precedence: 2,
				parameters: 2,
				method: (a, b) => a - b,
			},
		}
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

	hasGreaterPrecedence(operatorA, operatorB) {
		// Change this to a method within the Operator class
		if (!operatorA) return false;
		return this.operators[operatorA].precedence > this.operators[operatorB].precedence;
	}

	hasEqualPrecedence(operatorA, operatorB) {
		// Change this to a method within the Operator class
		if (!operatorA) return false;
		return this.operators[operatorA].precedence === this.operators[operatorB].precedence;
	}

	isLeftAssociative(operator) {
		// Change this to a method within the Operator class
		return this.operators[operator].associativity === 'left';
	}

	getTopToken(stack) {
		return stack[stack.length - 1];
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
				while (!this.isOpenParenthesis(this.getTopToken(operatorStack)) &&
					(this.hasGreaterPrecedence(this.getTopToken(operatorStack), token) ||
					(this.hasEqualPrecedence(this.getTopToken(operatorStack), token) &&
					this.isLeftAssociative(this.getTopToken(operatorStack))))) {
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
		console.log('rpn:', rpnArray);
		for (let token of rpnArray) {
			const operator = this.operators[token];

			if (operator) {
				console.log('a');
				stack.push(operator.method.apply(this, stack.splice(-operator.parameters)));
			} else {
				console.log('b');
				stack.push(parseFloat(token));
			}

			console.log('stack:', stack);
		}

		return stack[0];
	}

	calculate(expression) {
		return this.resolveRpn(this.parseExpression(expression));
	}
}

module.exports = new ShuntingYard();
