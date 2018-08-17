module.exports = class Operator {
	constructor(symbol, precedence, associativity, method) {
		this.symbol = symbol;
		this.precedence = precedence;
		this.associativity = associativity;
		this.method = method;
	}

	hasEqualPrecedence(operator) {
		return this.precedence === operator.precedence;
	}

	hasGreaterPrecedence(operator) {
		return this.precedence > operator.precedence;
	}

	isLeftAssociative() {
		return this.associativity === 'left';
	}
}
