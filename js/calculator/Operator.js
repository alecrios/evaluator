module.exports = function Operator(name, precedence, associativity, numParams, method) {
	return {
		name: name,
		precedence: precedence,
		params: numParams,
		method: method,
		hasPrecedenceGreaterThan: (operator) => precedence > operator.precedence,
		hasPrecedenceGreaterThanOrEqualTo: (operator) => precedence >= operator.precedence,
		hasPrecedenceEqualTo: (operator) => precedence === operator.precedence,
		hasPrecedenceLessThan: (operator) => precedence < operator.precedence,
		hasPrecedenceLessThanOrEqualTo: (operator) => precedence <= operator.precedence,
		isLeftAssociative: () => associativity === 'left',
		isRightAssociative: () => associativity === 'right',
	};
}
