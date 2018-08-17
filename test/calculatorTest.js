const assert = require('chai').assert;
const Calculator = require('../js/calculator/ShuntingYard');

const tests = [
	{expression: '3', expected: [3]},
	{expression: '562370', expected: [562370]},
	{expression: '2 + 3', expected: [2, 3, '+']},
	{expression: '937 - 264', expected: [937, 264, '-']},
	{expression: '4 9 2 + 11 7 ', expected: [492, 117, '+']},
	{expression: '9 * 5 + 7', expected: [9, 5, '*', 7, '+']},
	{expression: '4 + 1 * 8', expected: [4, 1, 8, '*', '+']},
	{expression: '6096 + 12 * 11', expected: [6096, 12, 11, '*', '+']},
	{expression: '8 * (2 + 1)', expected: [8, 2, 1, '+', '*']},
	{expression: '7 - 1 + 6', expected: [7, 1, '-', 6, '+']},
	{expression: '83 - 0 + 8', expected: [83, 0, '-', 8, '+']},
	{expression: '3 * 8 ^ 9 + 3', expected: [3, 8, 9, '^', '*', 3, '+']},
	{expression: '14 * 6 ^ 2 + 331', expected: [14, 6, 2, '^', '*', 331, '+']},
	{expression: '7 12*2^33+4 0', expected: [712, 2, 33, '^', '*', 40, '+']},
	{expression: '1 * (7 + 8 * 4) + 8', expected: [1, 7, 8, 4, '*', '+', '*', 8, '+']},
	{expression: '655 * (1 + 3 * 53) + 4', expected: [655, 1, 3, 53, '*', '+', '*', 4, '+']},
	{expression: '3 + 4 * (2 - 1)', expected: [3, 4, 2, 1, '-', '*', '+']},
	{expression: '141 + 3 * (231 - 198)', expected: [141, 3, 231, 198, '-', '*', '+']},
	{expression: ' 55+ 13*( 6-0 ) ', expected: [55, 13, 6, 0, '-', '*', '+']},
	{expression: '3 + 4 * 2 / (1 - 5) ^ 2 ^ 3', expected: [3, 4, 2, '*', 1, 5, '-', 2, 3, '^', '^', '/', '+']},
	{expression: '4 + 8 / (9 - 33)', expected: [4, 8, 9, 33, '-', '/', '+']},
	{expression: '0 + 2 4 1 / ( 6 4 3 - 5 0 1 )', expected: [0, 241, 643, 501, '-', '/', '+']},
	// {expression: '8', expected: 8},
	// {expression: '2 + 4', expected: 6},
	// {expression: '5 - 2', expected: 3},
	// {expression: '45 - 54', expected: -9},
	// {expression: '3 * 3', expected: 9},
	// {expression: '12 / 4', expected: 3},
	// {expression: '24 / 4 + 2', expected: 8},
	// {expression: '24 / (4 + 2)', expected: 4},
	// {expression: '4^3', expected: 64},
	// {expression: '4 + 7 - 6 / 3 * 5', expected: 1},
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
			assert.deepEqual(Calculator.parseExpression(test.expression), test.expected);
		});
	});
});
