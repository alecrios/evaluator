const assert = require('chai').assert;
const Calculator = require('../js/calculator/Calculator');

const tests = [
	{expression: '3', rpn: [3], result: 3},
	{expression: '562370', rpn: [562370], result: 562370},
	{expression: '. 3 9 721', rpn: [.39721], result: .39721},
	{expression: '2 + 3', rpn: [2, 3, 'ADD'], result: 5},
	{expression: '937 - 264', rpn: [937, 264, 'SUB'], result: 673},
	{expression: '492 + 117', rpn: [492, 117, 'ADD'], result: 609},
	{expression: '9 * 5 + 7', rpn: [9, 5, 'MUL', 7, 'ADD'], result: 52},
	{expression: '9 20. 1 * 0 . 31 + . 94', rpn: [920.1, 0.31, 'MUL', .94, 'ADD'], result: 286.171},
	{expression: '4 + 1 * 8', rpn: [4, 1, 8, 'MUL', 'ADD'], result: 12},
	{expression: '6 0 9 6 + 1 2 * 1 1', rpn: [6096, 12, 11, 'MUL', 'ADD'], result: 6228},
	{expression: '8 * (2 + 1)', rpn: [8, 2, 1, 'ADD', 'MUL'], result: 24},
	{expression: '2 + (3 * 6) - 4', rpn: [2, 3, 6, 'MUL', 'ADD', 4, 'SUB'], result: 16},
	{expression: '7 - 1 + 6', rpn: [7, 1, 'SUB', 6, 'ADD'], result: 12},
	{expression: '83 - 0 + 8', rpn: [83, 0, 'SUB', 8, 'ADD'], result: 91},
	{expression: '3 * 8 ^ 9 + 3', rpn: [3, 8, 9, 'POW', 'MUL', 3, 'ADD'], result: 402653187},
	{expression: '1 4 * 6 ^ 2 + 3 3 1', rpn: [14, 6, 2, 'POW', 'MUL', 331, 'ADD'], result: 835},
	{expression: '712 * 2 ^ 3 + 40', rpn: [712, 2, 3, 'POW', 'MUL', 40, 'ADD'], result: 5736},
	{expression: '1 * (7 + 8 * 4) + 8', rpn: [1, 7, 8, 4, 'MUL', 'ADD', 'MUL', 8, 'ADD'], result: 47},
	{expression: '655 * (1 + 3 * 53) + 4', rpn: [655, 1, 3, 53, 'MUL', 'ADD', 'MUL', 4, 'ADD'], result: 104804},
	{expression: '3 + 4 * (2 - 1)', rpn: [3, 4, 2, 1, 'SUB', 'MUL', 'ADD'], result: 7},
	{expression: '141 + 3 * (231 - 198)', rpn: [141, 3, 231, 198, 'SUB', 'MUL', 'ADD'], result: 240},
	{expression: '55+ 13*( 6-0 )', rpn: [55, 13, 6, 0, 'SUB', 'MUL', 'ADD'], result: 133},
	{expression: '3 + 4 * 2 / (1 - 0) ^ 2 ^ 2', rpn: [3, 4, 2, 'MUL', 1, 0, 'SUB', 2, 2, 'POW', 'POW', 'DIV', 'ADD'], result: 11},
	{expression: '4 + 8 / (9 - 32)', rpn: [4, 8, 9, 32, 'SUB', 'DIV', 'ADD'], result: 3.6521739130434785},
	{expression: '0 + 241 / (643 - 501)', rpn: [0, 241, 643, 501, 'SUB', 'DIV', 'ADD'], result: 1.6971830985915493},
	{expression: '128.4383', rpn: [128.4383], result: 128.4383},
	{expression: '11.10 + 17.50', rpn: [11.10, 17.50, 'ADD'], result: 28.6},
	{expression: '34.1 + 12.98 * 8.003', rpn: [34.1, 12.98, 8.003, 'MUL', 'ADD'], result: 137.97894},
	{expression: '0 . 2 5 + . 7 5 * 1 . 0 0', rpn: [0.25, .75, 1.00, 'MUL', 'ADD'], result: 1},
	{expression: '0.25 * 2 ^ 3 + 2.500', rpn: [0.25, 2, 3, 'POW', 'MUL', 2.500, 'ADD'], result: 4.5},
	{expression: '.125 - .0625 + .500', rpn: [.125, .0625, 'SUB', .500, 'ADD'], result: 0.5625},
	{expression: '0.419 - 0.001', rpn: [0.419, 0.001, 'SUB'], result: 0.418},
	{expression: '12.5 * (21.1154 + 1.0)', rpn: [12.5, 21.1154, 1.0, 'ADD', 'MUL'], result: 276.4425},
	{expression: '-12', rpn: [12, 'NEG'], result: -12},
	{expression: '3 + -6', rpn: [3, 6, 'NEG', 'ADD'], result: -3},
	{expression: '-5 - -7', rpn: [5, 'NEG', 7, 'NEG', 'SUB'], result: 2},
	{expression: '4 ^ - 2', rpn: [4, 2, 'NEG', 'POW'], result: .0625},
	{expression: '-4 ^ 2', rpn: [4, 2, 'POW', 'NEG'], result: -16},
	{expression: '1 ^ -2 - -7 - 9 + -2', rpn: [1, 2, 'NEG', 'POW', 7, 'NEG', 'SUB', 9, 'SUB', 2, 'NEG', 'ADD'], result: -3},
];

describe('Calculator', () => {
	describe('convert()', () => {
		tests.forEach((test) => {
			it(`${test.expression} = ${test.rpn}`, () => {
				assert.deepEqual(Calculator.convert(test.expression), test.rpn);
			});
		});
	});
	describe('resolve()', () => {
		tests.forEach((test) => {
			it(`${test.rpn} = ${test.result}`, () => {
				assert.deepEqual(Calculator.resolve(test.rpn), test.result);
			});
		});
	});
});