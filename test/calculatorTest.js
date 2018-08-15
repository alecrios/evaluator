const assert = require('chai').assert;
const Calculator = require('../js/calculator/ShuntingYard');

const tests = [
	{expression: '8', expected: 8},
	{expression: '2 + 4', expected: 6},
	{expression: '5 - 2', expected: 3},
	{expression: '45 - 54', expected: -9},
	{expression: '3 * 3', expected: 9},
	{expression: '12 / 4', expected: 3},
	{expression: '24 / 4 + 2', expected: 8},
	{expression: '24 / (4 + 2)', expected: 4},
	{expression: '4^3', expected: 64},
	{expression: '4 + 7 - 6 / 3 * 5', expected: 1},
	// {expression: '-4 + 7 - 6 / 3 * -5', expected: 3},
	// {expression: 'sqrt(144)', expected: 12},
	// {expression: 'min(32, 17, 91, 11, 49, 77, 56)', expected: 11},
	// {expression: 'max(94, 41, 84, 10, 31, 38)', expected: 94},
	// {expression: 'abs(-19)', expected: 19},
	// {expression: 'abs(47 - 110)', expected: 63},
	// {expression: 'ceil(4.1)', expected: 5},
	// {expression: 'ceil(-92.1)', expected: -92},
	// {expression: 'floor(41.3)', expected: 41},
	// {expression: 'floor(1.98)', expected: 1},
	// {expression: 'sin(1)', expected: 0.8414709848078965},
	// {expression: 'asin(1)', expected: 1.5707963267948966},
	// {expression: 'cos(1)', expected: 0.5403023058681398},
	// {expression: 'acos(1)', expected: 0},
	// {expression: 'tan(1)', expected: 1.5574077246549023},
	// {expression: 'atan(1)', expected: 0.7853981633974483},
	// {expression: '8!', expected: 40320},
	// {expression: 'sqrt(4) + min(3, 8, 7) - max(11, 2, 9, 13)', expected: -8},
	// {expression: '16.125 - 8.0625', expected: 8.0625},
	// {expression: '2^8 + 49 / (4 + sqrt(9))', expected: 263},
	// {expression: '0.5 * 24 / 3', expected: 4},
	// {expression: '7! - sqrt(25) + 0.6 / (18 / 3)', expected: 5035.1},
	// {expression: 'max(sqrt(3 + 10 - 4 * 1), sqrt(3^2 + 7))', expected: 4},
];

describe('Calculator', () => {
	tests.forEach((test) => {
		it(`${test.expression} = ${test.expected}`, () => {
			assert.strictEqual(Calculator.calculate(test.expression), test.expected);
		});
	});
});
