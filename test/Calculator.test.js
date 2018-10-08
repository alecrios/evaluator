const expect = require('chai').expect;
const Calculator = require('../js/calculator/Calculator');

describe('Calculator.parse()', () => {
	it('throw error for empty expression string', () => {
		expect(() => Calculator.parse('')).to.throw(Error, 'No input');
	});
	it('return empty array for expression string with only whitespace', () => {
		expect(Calculator.parse(' 	')).to.eql([]);
	});
	it('ignore whitespace characters', () => {
		expect(Calculator.parse('0 0	0  0		0')).to.eql(['0', '0', '0', '0', '0']);
	});
	it('identify single-digit numbers', () => {
		expect(Calculator.parse('0 1 2 3 4 5 6 7 8 9')).to.eql(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
	});
	it('identify multiple-digit numbers', () => {
		expect(Calculator.parse('10 100 1000 10000')).to.eql(['10', '100', '1000', '10000']);
	});
	it('identify decimal numbers', () => {
		expect(Calculator.parse('.0 0. 0.0 0.00 00.0 00.00')).to.eql(['.0', '0.', '0.0', '0.00', '00.0', '00.00']);
	});
	it('identify symbols', () => {
		expect(Calculator.parse('`~!@#$%^&*()-=_+[]{};\':\",.<>/?\\|')).to.eql(['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '_', '+', '[', ']', '{', '}', ';', '\'', ':', '\"', ',', '.', '<', '>', '/', '?', '\\', '|']);
	});
	it('identify words', () => {
		expect(Calculator.parse('a A aa AA aA Aa')).to.eql(['A', 'A', 'AA', 'AA', 'AA', 'AA']);
	});
	it('distinguish numbers from symbols with whitespace', () => {
		expect(Calculator.parse('0 + 12 - .3 * 4. / 5.6 % 7.89 ^ 01.2 + ( 34.56 )')).to.eql(['0', '+', '12', '-', '.3', '*', '4.', '/', '5.6', '%', '7.89', '^', '01.2', '+', '(', '34.56', ')']);
	});
	it('distinguish numbers from symbols without whitespace', () => {
		expect(Calculator.parse('0+12-.3*4./5.6%7.89^01.2+(34.56)')).to.eql(['0', '+', '12', '-', '.3', '*', '4.', '/', '5.6', '%', '7.89', '^', '01.2', '+', '(', '34.56', ')']);
	});
	it('distinguish symbols from words with whitespace', () => {
		expect(Calculator.parse('a + Bc - DeF * gHiJ / kLmNo % PqRsTu ^ VwXyZaB + ( cDeFgHiJ )')).to.eql(['A', '+', 'BC', '-', 'DEF', '*', 'GHIJ', '/', 'KLMNO', '%', 'PQRSTU', '^', 'VWXYZAB', '+', '(', 'CDEFGHIJ', ')']);
	});
	it('distinguish symbols from words without whitespace', () => {
		expect(Calculator.parse('a+Bc-DeF*gHiJ/kLmNo%PqRsTu^VwXyZaB+(cDeFgHiJ)')).to.eql(['A', '+', 'BC', '-', 'DEF', '*', 'GHIJ', '/', 'KLMNO', '%', 'PQRSTU', '^', 'VWXYZAB', '+', '(', 'CDEFGHIJ', ')']);
	});
	it('distinguish words from numbers with whitespace', () => {
		expect(Calculator.parse('a 0 Bc 12 DeF .3 gHiJ 4. kLmNo 5.6 PqRsTu 7.89 VwXyZaB 01.2 cDeFgHiJ 45.67')).to.eql(['A', '0', 'BC', '12', 'DEF', '.3', 'GHIJ', '4.', 'KLMNO', '5.6', 'PQRSTU', '7.89', 'VWXYZAB', '01.2', 'CDEFGHIJ', '45.67']);
	});
	it('distinguish words from numbers without whitespace', () => {
		expect(Calculator.parse('a0Bc12DeF.3gHiJ4.kLmNo5.6PqRsTu7.89VwXyZaB01.2cDeFgHiJ45.67')).to.eql(['A', '0', 'BC', '12', 'DEF', '.3', 'GHIJ', '4.', 'KLMNO', '5.6', 'PQRSTU', '7.89', 'VWXYZAB', '01.2', 'CDEFGHIJ', '45.67']);
	});
});

describe('Calculator.convert()', () => {
	it('throw error for empty tokens array', () => {
		expect(() => Calculator.convert([])).to.throw(Error, 'No valid tokens');
	});
	it('throw error for a misused operator', () => {
		expect(() => Calculator.convert(['^'])).to.throw(Error, 'Misused operator: "^"');
		expect(() => Calculator.convert(['*'])).to.throw(Error, 'Misused operator: "*"');
		expect(() => Calculator.convert(['/'])).to.throw(Error, 'Misused operator: "/"');
		expect(() => Calculator.convert(['%'])).to.throw(Error, 'Misused operator: "%"');
		expect(() => Calculator.convert(['2', '-', '^'])).to.throw(Error, 'Misused operator: "^"');
		expect(() => Calculator.convert(['2', '-', '*'])).to.throw(Error, 'Misused operator: "*"');
		expect(() => Calculator.convert(['2', '-', '/'])).to.throw(Error, 'Misused operator: "/"');
		expect(() => Calculator.convert(['2', '-', '%'])).to.throw(Error, 'Misused operator: "%"');
	});
	it('throw error for an invalid token', () => {
		expect(() => Calculator.convert(['~'])).to.throw(Error, 'Invalid token: "~"');
		expect(() => Calculator.convert(['.'])).to.throw(Error, 'Invalid token: "."');
		expect(() => Calculator.convert(['ABC'])).to.throw(Error, 'Invalid token: "ABC"');
		expect(() => Calculator.convert(['191', '3', '&'])).to.throw(Error, 'Invalid token: "&"');
		expect(() => Calculator.convert(['33', '#', '-', '12'])).to.throw(Error, 'Invalid token: "#"');
		expect(() => Calculator.convert(['41', ',', '000'])).to.throw(Error, 'Invalid token: ","');
		expect(() => Calculator.convert(['19.12', '-', '2', '_', '11'])).to.throw(Error, 'Invalid token: "_"');
		expect(() => Calculator.convert(['2', '+', 'XYZ'])).to.throw(Error, 'Invalid token: "XYZ"');
	});
	it('throw error for invalid grouping', () => {
		expect(() => Calculator.convert(['('])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert(['(', '('])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert([')'])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert([')', ')'])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert(['4', '+', '(', '3'])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert(['4', '+', '(', '3', ')', ')'])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert(['2', '*', '3', '('])).to.throw(Error, 'Invalid grouping');
		expect(() => Calculator.convert(['(', '4', '-', '1', ')', ')'])).to.throw(Error, 'Invalid grouping');
	});
	it('process numbers', () => {
		expect(Calculator.convert(['3'])).to.eql([3]);
		expect(Calculator.convert(['42', '144.90', '8'])).to.eql([42, 144.9, 8]);
		expect(Calculator.convert(['10', '1', '01', '001', '0.01', '0.001'])).to.eql([10, 1, 1, 1, 0.01, 0.001]);
		expect(Calculator.convert(['01.', '0.2', '3.4', '.01', '.003', '0.01', '.223', '0001'])).to.eql([1, 0.2, 3.4, 0.01, 0.003, 0.01, 0.223, 1]);
		expect(Calculator.convert(['0', '12', '.3', '4.', '5.6', '7.89', '01.2', '34.56'])).to.eql([0, 12, 0.3, 4, 5.6, 7.89, 1.2, 34.56]);
		expect(Calculator.convert(['0', '00', '000', '1', '11', '111'])).to.eql([0, 0, 0, 1, 11, 111]);
		expect(Calculator.convert(['.01', '.001', '.0001'])).to.eql([0.01, 0.001, 0.0001]);
		expect(Calculator.convert(['1000', '10000'])).to.eql([1000, 10000]);
	});
	it('process constants', () => {
		expect(Calculator.convert(['PI'])).to.eql(['PI']);
		expect(Calculator.convert(['E'])).to.eql(['E']);
		expect(Calculator.convert(['PI', 'E'])).to.eql(['PI', 'E']);
		expect(Calculator.convert(['E', 'PI'])).to.eql(['E', 'PI']);
	});
	it('process infix operators', () => {
		expect(Calculator.convert(['32', '^', '10'])).to.eql([32, 10, 'EXP']);
		expect(Calculator.convert(['21', '*', '7'])).to.eql([21, 7, 'MUL']);
		expect(Calculator.convert(['8', '/', '2'])).to.eql([8, 2, 'DIV']);
		expect(Calculator.convert(['903', '%', '7'])).to.eql([903, 7, 'MOD']);
		expect(Calculator.convert(['5', '+', '54'])).to.eql([5, 54, 'ADD']);
		expect(Calculator.convert(['40', '-', '0'])).to.eql([40, 0, 'SUB']);
		expect(Calculator.convert(['1', '+', '15', '/', '2'])).to.eql([1, 15, 2, 'DIV', 'ADD']);
		expect(Calculator.convert(['23', '*', '3', '-', '212'])).to.eql([23, 3, 'MUL', 212, 'SUB']);
	});
	it('process prefix operators', () => {
		expect(Calculator.convert(['+'])).to.eql(['POS']);
		expect(Calculator.convert(['+', '2'])).to.eql([2, 'POS']);
		expect(Calculator.convert(['3', '-', '+', '2'])).to.eql([3, 2, 'POS', 'SUB']);
		expect(Calculator.convert(['2', '-', '+', '+', '2'])).to.eql([2, 2, 'POS', 'POS', 'SUB']);
		expect(Calculator.convert(['-'])).to.eql(['NEG']);
		expect(Calculator.convert(['-', '4'])).to.eql([4, 'NEG']);
		expect(Calculator.convert(['1', '+', '-', '7'])).to.eql([1, 7, 'NEG', 'ADD']);
		expect(Calculator.convert(['5', '+', '-', '-', '0'])).to.eql([5, 0, 'NEG', 'NEG', 'ADD']);
	});
});

describe('Calculator.resolve()', () => {
	it('throw error for empty rpn array', () => {
		expect(() => Calculator.resolve([])).to.throw(Error, 'No operations');
	});
	it('throw error for missing arguments', () => {
		expect(() => Calculator.resolve([2, 'EXP'])).to.throw(Error, 'Missing argument(s) for: "EXP"');
		expect(() => Calculator.resolve([41, 'MUL'])).to.throw(Error, 'Missing argument(s) for: "MUL"');
		expect(() => Calculator.resolve([1.7, 'DIV'])).to.throw(Error, 'Missing argument(s) for: "DIV"');
		expect(() => Calculator.resolve([7, 'MOD'])).to.throw(Error, 'Missing argument(s) for: "MOD"');
		expect(() => Calculator.resolve([3, 'ADD'])).to.throw(Error, 'Missing argument(s) for: "ADD"');
		expect(() => Calculator.resolve([13, 'SUB'])).to.throw(Error, 'Missing argument(s) for: "SUB"');
		expect(() => Calculator.resolve([3, 4, 'SUB', 'EXP'])).to.throw(Error, 'Missing argument(s) for: "EXP"');
		expect(() => Calculator.resolve([13, 76, 'EXP', 'MUL'])).to.throw(Error, 'Missing argument(s) for: "MUL"');
		expect(() => Calculator.resolve([0, 215, 'ADD', 'DIV'])).to.throw(Error, 'Missing argument(s) for: "DIV"');
		expect(() => Calculator.resolve([43, 4, 'ADD', 'MOD'])).to.throw(Error, 'Missing argument(s) for: "MOD"');
		expect(() => Calculator.resolve([67, 1, 'MOD', 'ADD'])).to.throw(Error, 'Missing argument(s) for: "ADD"');
		expect(() => Calculator.resolve([7, 79, 'MUL', 'SUB'])).to.throw(Error, 'Missing argument(s) for: "SUB"');
	});
	it('throw error for missing operation(s)', () => {
		expect(() => Calculator.resolve([2, 4])).to.throw(Error, 'Missing operation(s)');
		expect(() => Calculator.resolve([5, 87, 12])).to.throw(Error, 'Missing operation(s)');
		expect(() => Calculator.resolve([1, 2, 2, 'DIV'])).to.throw(Error, 'Missing operation(s)');
		expect(() => Calculator.resolve([7, 1, 2, 'EXP'])).to.throw(Error, 'Missing operation(s)');
	});
	it('return result for rpn with single operation', () => {
		expect(Calculator.resolve([2, 3, 'EXP'])).to.eql(8);
		expect(Calculator.resolve([7, 6, 'MUL'])).to.eql(42);
		expect(Calculator.resolve([16, 4, 'DIV'])).to.eql(4);
		expect(Calculator.resolve([4, 5, 'ADD'])).to.eql(9);
		expect(Calculator.resolve([1, 5, 'SUB'])).to.eql(-4);
		expect(Calculator.resolve([7, 'NEG'])).to.eql(-7);
		expect(Calculator.resolve([6, 'POS'])).to.eql(6);
	});
	it('return result for rpn with multiple operations', () => {
		expect(Calculator.resolve([7, 3, 2, 'ADD', 'MUL'])).to.eql(35);
		expect(Calculator.resolve([3, 'NEG', 9, 'NEG', 'SUB'])).to.eql(6);
		expect(Calculator.resolve([5, 8, 'MUL', 6, 'ADD'])).to.eql(46);
		expect(Calculator.resolve([3, 3, 'EXP', 'NEG'])).to.eql(-27);
		expect(Calculator.resolve([16, 'NEG', 9, 'POS', 'POS', 'POS', 'ADD'])).to.eql(-7);
		expect(Calculator.resolve([2, 4, 5, 'EXP', 'MUL', 3, 'ADD'])).to.eql(2051);
		expect(Calculator.resolve([3, 12, 4, 'DIV', 'DIV', 5, 'MUL', 1, 'DIV'])).to.eql(5);
		expect(Calculator.resolve([10, 4, 'MOD', 8, 'ADD'])).to.eql(10);
	});
});

describe('Calculator.evaluate()', () => {
	const tests = [
		{expression: '3', result: 3},
		{expression: '562370', result: 562370},
		{expression: '2 + 3', result: 5},
		{expression: '937 - 264', result: 673},
		{expression: '492 + 117', result: 609},
		{expression: '9 * 5 + 7', result: 52},
		{expression: '4 + 1 * 8', result: 12},
		{expression: '8 * (2 + 1)', result: 24},
		{expression: '2 + (3 * 6) - 4', result: 16},
		{expression: '7 - 1 + 6', result: 12},
		{expression: '83 - 0 + 8', result: 91},
		{expression: '2 ^ 5', result: 32},
		{expression: '4 ^ 0', result: 1},
		{expression: '0 ^ 32', result: 0},
		{expression: '3 * 8 ^ 9 + 3', result: 402653187},
		{expression: '712 * 2 ^ 3 + 40', result: 5736},
		{expression: '1 * (7 + 8 * 4) + 8', result: 47},
		{expression: '655 * (1 + 3 * 53) + 4', result: 104804},
		{expression: '3 + 4 * (2 - 1)', result: 7},
		{expression: '141 + 3 * (231 - 198)', result: 240},
		{expression: '55+ 13*( 6-0 )', result: 133},
		{expression: '3 + 4 * 2 / (1 - 0) ^ 2 ^ 2', result: 11},
		{expression: '4 + 8 / (9 - 32)', result: 3.65217391},
		{expression: '0 + 241 / (643 - 501)', result: 1.6971831},
		{expression: '128.4383', result: 128.4383},
		{expression: '11.10 + 17.50', result: 28.6},
		{expression: '34.1 + 12.98 * 8.003', result: 137.97894},
		{expression: '0.25 * 2 ^ 3 + 2.500', result: 4.5},
		{expression: '.125 - .0625 + .500', result: 0.5625},
		{expression: '0.419 - 0.001', result: 0.418},
		{expression: '12.5 * (21.1154 + 1.0)', result: 276.4425},
		{expression: '-12', result: -12},
		{expression: '3 + -6', result: -3},
		{expression: '-5 - -7', result: 2},
		{expression: '4 ^ - 2', result: 0.0625},
		{expression: '-4 ^ 2', result: -16},
		{expression: '1 ^ -2 - -7 - 9 + -2', result: -3},
		{expression: '2 / (30 / 3) * 4 / 1', result: 0.8},
		{expression: '7---15+3-9', result: -14},
		{expression: '12 % 5', result: 2},
		{expression: '92 % 5 + 12', result: 14},
		{expression: '2 + 12 % (9 - 4)', result: 4},
		{expression: '12 % 20 ^ 3 + 50', result: 62},
		{expression: '23 - - - - - 60', result: -37},
		{expression: '-1 + -2 ^ 3 + 1', result: -8},
		{expression: '+12', result: 12},
		{expression: '3 + +10', result: 13},
		{expression: '-17 + + + + 10', result: -7},
		{expression: '10 - +4', result: 6},
		{expression: '4 + 8 / (16 * (2 + 2))', result: 4.125},
		{expression: '(100 / (4 - 2) * ((6) + 2))', result: 400},
		{expression: '.5 + 2.5 - 0.5 / (8 / 2)', result: 2.875},
		{expression: '4^-3 + 40 / 16', result: 2.515625},
		{expression: '00.001 * 3000 / .2', result: 15},
		{expression: '4. + 1.6 - 2.24 + 07.4 - 19.53', result: -8.77},
		{expression: '-4 - -6 - -2 - 3', result: 1},
		{expression: '3 + +4 - +2 + 3 + +1', result: 9},
		{expression: '- 4 + 6', result: 2},
		{expression: '+ 4 - 6', result: -2},
		{expression: '.1 + .2', result: 0.3},
		{expression: '24.1 * 510.51 / 4.29 * (18.3 / 16.98)', result: 3090.84628975},
		{expression: '1.43 / 566.32 * (232.1 / 10.98)', result: 0.05337611},
		{expression: '3.34 ^ (18.221 / 2.9551)', result: 1695.87848994},
		{expression: '(1.89 + 0.13 * 17.44) / (3 ^ 2)', result: 0.46191111},
		{expression: '401.2 + 108.1', result: 509.3},
		{expression: '2 / 4 % 8 * 3', result: 1.5},
		{expression: '4.1 * 18.2 + (12.8 / 16.3)', result: 75.40527607},
		{expression: '.211 * 0.343 * 00.984 * 4.', result: 0.28486013},
		{expression: 'pi', result: 3.14159265},
		{expression: '2 * PI * 10', result: 62.83185307},
		{expression: 'PI * 10 ^ 2', result: 314.15926536},
		{expression: 'e', result: 2.71828183},
		{expression: 'E * 4.31 / 1.2', result: 9.76316223},
		{expression: '(9.121 - E) * 1.981', result: 12.6837847},
		{expression: 'pi * 4 / e + 2', result: 6.6229094},
	];

	tests.forEach((test) => {
		it(`${test.expression} = ${test.result}`, () => {
			expect(Calculator.evaluate(test.expression)).to.eql(test.result);
		});
	});
});
