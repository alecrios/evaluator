class Calculator {
	constructor() {
		this._symbols = {};
		this.defineOperator("!", this.factorial, "postfix", 6);
		this.defineOperator("^", Math.pow, "infix", 5, true);
		this.defineOperator("*", this.multiplication, "infix", 4);
		this.defineOperator("/", this.division, "infix", 4);
		this.defineOperator("+", this.last, "prefix", 3);
		this.defineOperator("-", this.negation, "prefix", 3);
		this.defineOperator("+", this.addition, "infix", 2);
		this.defineOperator("-", this.subtraction, "infix", 2);
		this.defineOperator(",", Array.of, "infix", 1);
		this.defineOperator("(", this.last, "prefix");
		this.defineOperator(")", null, "postfix");
		this.defineOperator("min", Math.min);
		this.defineOperator("max", Math.max);
		this.defineOperator("sqrt", Math.sqrt);
	}

	defineOperator(symbol, f, notation = "func", precedence = 0, rightToLeft = false) {
		if (notation === "func") precedence = 0;

		this._symbols[symbol] = Object.assign({}, this._symbols[symbol], {
			[notation]: {
				symbol, f, notation, precedence, rightToLeft,
				argCount: 1 + (notation === "infix")
			},
			symbol,
			regSymbol: symbol.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&') + (/\w$/.test(symbol) ? "\\b" : ""),
		});
	}

	last(...a) {
		return a[a.length - 1];
	}

	negation(a) {
		return -a;
	}

	addition(a, b) {
		return a + b;
	}

	subtraction(a, b) {
		return a - b;
	}

	multiplication(a, b) {
		return a * b;
	}

	division(a, b) {
		return a / b;
	}

	factorial(a) {
		if (a % 1 || !(+a >= 0)) return NaN;

		if (a > 170) return Infinity;

		let b = 1;

		while (a > 1) {
			b *= a--;
		}

		return b;
	}

	calculate(expression) {
		let match;
		const values = [],
			operators = [this._symbols["("].prefix],
			exec = _ => {
				let op = operators.pop();
				values.push(op.f(...[].concat(...values.splice(-op.argCount))));
				return op.precedence;
			},
			error = msg => {
				let notation = match ? match.index : expression.length;
				return `${msg} at ${notation}:\n${expression}\n${' '.repeat(notation)}^`;
			},
			pattern = new RegExp(
				"\\d+(?:\\.\\d+)?|"
				+ Object.values(this._symbols)
					.sort((a, b) => b.symbol.length - a.symbol.length)
					.map(val => val.regSymbol).join('|')
				+ "|(\\S)", "g"
			);
		let afterValue = false;
		pattern.lastIndex = 0;
		do {
			match = pattern.exec(expression);

			const [token, bad] = match || [")", undefined],
				notNumber = this._symbols[token],
				notNewValue = notNumber && !notNumber.prefix && !notNumber.func,
				notAfterValue = !notNumber || !notNumber.postfix && !notNumber.infix;

			if (bad || (afterValue ? notAfterValue : notNewValue)) return error("Syntax error");

			if (afterValue) {
				const curr = notNumber.postfix || notNumber.infix;
				do {
					const prev = operators[operators.length - 1];
					if (((curr.precedence - prev.precedence) || prev.rightToLeft) > 0) break;
				} while (exec());
				afterValue = curr.notation === "postfix";
				if (curr.symbol !== ")") {
					operators.push(curr);
					if (afterValue) exec();
				}
			} else if (notNumber) {
				operators.push(notNumber.prefix || notNumber.func);
				if (notNumber.func) {
					match = pattern.exec(expression);
					if (!match || match[0] !== "(") return error("Function needs parentheses")
				}
			} else {
				values.push(+token);
				afterValue = true;
			}
		} while (match && operators.length);
		return operators.length ? error("Missing closing parenthesis")
			: match ? error("Too many closing parentheses")
				: values.pop()
	}
}

module.exports = new Calculator();
