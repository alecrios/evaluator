const Operator = require('./Operator');

class ShuntingYard {
	constructor() {
		this.operators = {
			'+': new Operator('+', 2, 'left', 2, (a, b) => a + b),
			'-': new Operator('-', 2, 'left', 2, (a, b) => a - b),
			'*': new Operator('*', 3, 'left', 2, (a, b) => a * b),
			'/': new Operator('/', 3, 'left', 2, (a, b) => a / b),
			'^': new Operator('^', 4, 'right', 2, (a, b) => Math.pow(a, b)),
			// 'sqrt': new Operator('sqrt', 0, 'left', 1, (a) => Math.sqrt(a)),
		};

		this.functions = {};
	}

	parseExpression(expressionString) {
		let output = [];
		let stack = [];
		let sign;
		let lastToken;
		let token;

		for (let index = 0; index < expressionString.length; index++) {
			token = expressionString[index];

			if (token === ' ') continue;

			if (sign) {
				token = sign += token;
				sign = null;
			}

			if (this.isOpenParenthesis(token) || this.isFunction(token)) {
				stack.push(token);
			} else if (this.isCloseParenthesis(token)) {
				let operator;

				while ((operator = stack.pop()) && !this.isOpenParenthesis(operator)) {
					if (!this.isFunction(operator)) {
						output.push(operator);
					}
				}

				if (typeof operator === 'undefined') {
					return null;
				}
			} else if (this.isOperator(token)) {
				if (!lastToken || lastToken === '(') {
					sign = token;
					continue;
				}

				while (stack.length) {
					const thisOperator = this.operators[token];
					const operator = this.operators[stack[stack.length - 1]];

					if (!operator || !thisOperator) break;

					if ((thisOperator.isLeftAssociative() && thisOperator.hasPrecedenceLessThanOrEqualTo(operator)) || thisOperator.hasPrecedenceLessThan(operator)) {
						output.push(stack.pop());
					} else {
						break;
					}
				}

				stack.push(token);
			} else {
				if (!lastToken || this.isOpenParenthesis(lastToken) || this.isOperator(lastToken)) {
					output.push(token);
				} else {
					output[output.length - 1] += token;
				}
			}

			lastToken = token;
		}

		while (stack.length) {
			token = stack.pop();

			if (this.isOpenParenthesis(token)) {
				return null;
			}

			output.push(token);
		}

		console.log(output);
		return output;
	}

	resolveRpn(rpnArray) {
		let stack = [];

		for (let index = 0; index < rpnArray.length; index++) {
			const operator = this.operators[rpnArray[index]] || this.functions[rpnArray[index]];

			if (operator) {
				console.log('stack:', stack);
				stack.push(operator.method.apply(this, stack.splice(-operator.params)));
			} else {
				stack.push(parseFloat(rpnArray[index]));
			}
		}

		return stack[0];
	}

	calculate(expressionString) {
		return this.resolveRpn(this.parseExpression(expressionString));
	}

	isOpenParenthesis(token) {
		return token === '(';
	}

	isCloseParenthesis(token) {
		return token === ')';
	}

	isOperator(token) {
		return Object.keys(this.operators).includes(token);
	}

	isFunction(token) {
		return Object.keys(this.functions).includes(token);
	}
}

module.exports = new ShuntingYard();
