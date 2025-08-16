import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("python", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			print:
				"Built-in function that prints values to stdout. Accepts multiple arguments and sep, end parameters",
			len: "Built-in function that returns the number of items in a container (string, list, tuple, dict, set)",
			range:
				"Built-in function that generates arithmetic progressions. range(start, stop, step)",
			input:
				"Built-in function that reads a line from stdin and returns it as string (without newline)",
			int: "Built-in function that converts value to integer. Can specify base for string conversion",
			str: "Built-in function that converts value to string representation",
			float: "Built-in function that converts value to floating point number",
			bool: "Built-in function that converts value to boolean (True/False)",
			list: "Built-in function that creates a list from an iterable",
			tuple: "Built-in function that creates a tuple from an iterable",
			dict: "Built-in function that creates a dictionary from keyword args or mapping",
			set: "Built-in function that creates a set from an iterable",
			type: "Built-in function that returns the type of an object",
			isinstance:
				"Built-in function that checks if object is instance of specified class(es)",
			hasattr:
				"Built-in function that checks if object has specified attribute",
			getattr:
				"Built-in function that gets attribute value from object with optional default",
			setattr: "Built-in function that sets attribute value on object",
			enumerate:
				"Built-in function that returns iterator with index-value pairs",
			zip: "Built-in function that aggregates elements from multiple iterables",
			map: "Built-in function that applies function to every item in iterable",
			filter:
				"Built-in function that constructs iterator from elements for which function returns true",
			sorted: "Built-in function that returns sorted list from iterable",
			reversed: "Built-in function that returns reverse iterator",
			sum: "Built-in function that sums all items in iterable with optional start value",
			max: "Built-in function that returns largest item in iterable or largest of arguments",
			min: "Built-in function that returns smallest item in iterable or smallest of arguments",
			abs: "Built-in function that returns absolute value of a number",
			round:
				"Built-in function that rounds number to given precision in decimal digits",
			pow: "Built-in function that returns base raised to power exp, optionally modulo mod",
			any: "Built-in function that returns True if any element in iterable is true",
			all: "Built-in function that returns True if all elements in iterable are true (or empty)",
			open: "Built-in function that opens file and returns file object",
			chr: "Built-in function that returns string representing character whose Unicode code point is integer",
			ord: "Built-in function that returns Unicode code point of one-character string",
			def: "Keyword used to define a function or method",
			class: "Keyword used to define a class",
			if: "Conditional statement - executes code block if condition is true",
			elif: "Short for 'else if' - additional condition in if statement",
			else: "Alternative branch executed when if/elif conditions are false",
			for: "Loop statement that iterates over sequence or iterable",
			while: "Loop statement that repeats while condition is true",
			break: "Statement to exit the nearest enclosing loop",
			continue: "Statement to skip rest of current loop iteration",
			pass: "Null operation - syntactic placeholder that does nothing",
			return: "Statement to exit function and optionally return value",
			yield: "Statement to produce value in generator function",
			try: "Statement to define block of code to test for exceptions",
			except: "Statement to handle specific exceptions in try block",
			finally: "Statement to execute cleanup code regardless of exceptions",
			raise: "Statement to explicitly raise an exception",
			assert: "Statement to test condition and raise AssertionError if false",
			with: "Statement for context management - ensures cleanup operations",
			import: "Statement to import modules or specific names from modules",
			from: "Keyword used with import to import specific names from module",
			as: "Keyword to create alias when importing or in except/with statements",
			global: "Keyword to declare that variable refers to global scope",
			nonlocal: "Keyword to declare that variable refers to enclosing scope",
			lambda: "Keyword to create anonymous function (lambda expression)",
			and: "Boolean operator that returns True if both operands are true",
			or: "Boolean operator that returns True if at least one operand is true",
			not: "Boolean operator that returns opposite of operand's truth value",
			in: "Membership operator that tests if value is in sequence",
			is: "Identity operator that tests if two variables refer to same object",
			None: "Constant representing absence of value or null value",
			True: "Boolean constant representing logical truth",
			False: "Boolean constant representing logical falsehood",
			self: "Convention for first parameter of instance methods - refers to instance",
			cls: "Convention for first parameter of class methods - refers to class",
			super:
				"Built-in function that returns proxy object for accessing parent class methods",
		};

		if (hoverInfo[word.word]) {
			return {
				range: new monaco.Range(
					position.lineNumber,
					word.startColumn,
					position.lineNumber,
					word.endColumn,
				),
				contents: [
					{ value: `**${word.word}**` },
					{ value: hoverInfo[word.word] },
				],
			};
		}
	},
});
