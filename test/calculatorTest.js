const assert = require('chai').assert;
const Calculator = require('../js/calculator');
const Calc = new Calculator();

describe('Calculator', () => {
	it('8 = 8', () => {
		assert.strictEqual(Calc.calculate('8'), 8);
	});

	it('2 + 4', () => {
		assert.strictEqual(Calc.calculate('2 + 4'), 6);
	});

	it('5 - 2 = 3', () => {
		assert.strictEqual(Calc.calculate('5 - 2'), 3);
	});

	it('45 - 54 = -9', () => {
		assert.strictEqual(Calc.calculate('45 - 54'), -9);
	});

	it('3 * 3 = 9', () => {
		assert.strictEqual(Calc.calculate('3 * 3'), 9);
	});

	it('12 / 4 = 3', () => {
		assert.strictEqual(Calc.calculate('12 / 4'), 3);
	});

	it('24 / 4 + 2 = 8', () => {
		assert.strictEqual(Calc.calculate('24 / 4 + 2'), 8);
	});

	it('24 / (4 + 2) = 4', () => {
		assert.strictEqual(Calc.calculate('24 / (4 + 2)'), 4);
	});

	it('4^3 = 64', () => {
		assert.strictEqual(Calc.calculate('4^3'), 64);
	});

	it('4 + 7 - 6 / 3 * 5 = 1', () => {
		assert.strictEqual(Calc.calculate('4+7-6/3*5'), 1);
	});

	it('min(32, 17, 91, 11, 49, 77, 56) = 11', () => {
		assert.strictEqual(Calc.calculate('min(32,17,91,11,49,77,56)'), 11);
	});

	it('max(94, 41, 84, 10, 31, 38) = 94', () => {
		assert.strictEqual(Calc.calculate('max(94, 41, 84, 10, 31, 38)'), 94);
	});

	it('sqrt(144) = 12', () => {
		assert.strictEqual(Calc.calculate('sqrt(144)'), 12);
	});

	it('8! = 40320', () => {
		assert.strictEqual(Calc.calculate('8!'), 40320);
	});

	it('sqrt(4) + min(3, 8, 7) - max(11, 2, 9, 13) = -8', () => {
		assert.strictEqual(Calc.calculate('sqrt(4) + min(3, 8, 7) - max(11, 2, 9, 13)'), -8);
	});

	it('16.125 - 8.0625 = 8.0625', () => {
		assert.strictEqual(Calc.calculate('16.125 - 8.0625'), 8.0625);
	});

	it('2^8 + 49 / (4 + sqrt(9)) = 263', () => {
		assert.strictEqual(Calc.calculate('2^8 + 49 / (4 + sqrt(9))'), 263);
	});

	it('0.5 * 24 / 3 = 4', () => {
		assert.strictEqual(Calc.calculate('0.5 * 24 / 3'), 4);
	});

	it('7! - sqrt(25) + 0.6 / (18 / 3) = 5035.1', () => {
		assert.strictEqual(Calc.calculate('7! - sqrt(25) + 0.6 / (18 / 3)'), 5035.1);
	});

	it('max(sqrt(3 + 10 - 4 * 1), sqrt(3^2 + 7)) = 4', () => {
		assert.strictEqual(Calc.calculate('max(sqrt(3 + 10 - 4 * 1), sqrt(3^2 + 7))'), 4);
	});
});