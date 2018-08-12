const assert = require('chai').assert;
const Calculator = require('../js/calculator');
const Calc = new Calculator();

describe('Calculator', () => {
	it('Addition', () => {
		let actual = Calc.calculate('2 + 2');
		let expected = 4;
		assert.strictEqual(actual, expected);
	});
});
