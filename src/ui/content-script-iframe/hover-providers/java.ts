import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("java", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			System:
				"Final class that contains several useful class fields and methods including out, in, err streams",
			String:
				"Immutable class representing character strings. Provides methods for string manipulation",
			ArrayList:
				"Resizable array implementation of the List interface. Provides fast random access",
			LinkedList:
				"Doubly-linked list implementation of List and Deque interfaces",
			HashMap:
				"Hash table based implementation of the Map interface. Allows null values and null key",
			HashSet:
				"Hash table based implementation of the Set interface. No duplicate elements allowed",
			TreeMap:
				"Red-Black tree based NavigableMap implementation. Keys are sorted",
			TreeSet:
				"NavigableSet implementation based on TreeMap. Elements are sorted",
			Stack: "LIFO (last-in-first-out) stack of objects extending Vector class",
			Queue:
				"Interface for collections designed for holding elements prior to processing",
			PriorityQueue: "Unbounded priority queue based on priority heap",
			Scanner:
				"Simple text scanner for parsing primitive types and strings using regular expressions",
			StringBuilder:
				"Mutable sequence of characters. More efficient than String for concatenation",
			Collections:
				"Utility class containing static methods for operating on collections",
			Arrays: "Utility class containing static methods for manipulating arrays",
			Math: "Class containing methods for performing basic numeric operations",
			Random: "Instance of this class is used to generate random numbers",
			Date: "Class representing specific instant in time with millisecond precision",
			Calendar:
				"Abstract class for converting between Date object and calendar fields",
			public: "Access modifier - accessible from anywhere in the program",
			private: "Access modifier - accessible only within the same class",
			protected: "Access modifier - accessible within package and subclasses",
			static:
				"Belongs to the class rather than instance. Can be called without creating object",
			final:
				"Cannot be overridden (methods) or extended (classes) or reassigned (variables)",
			abstract:
				"Must be implemented by subclasses. Cannot be instantiated directly",
			void: "Method returns no value",
			int: "32-bit signed integer primitive type (-2^31 to 2^31-1)",
			long: "64-bit signed integer primitive type",
			double: "64-bit floating point primitive type",
			float: "32-bit floating point primitive type",
			boolean: "Primitive type with only two possible values: true and false",
			char: "16-bit Unicode character primitive type",
			byte: "8-bit signed integer primitive type (-128 to 127)",
			short: "16-bit signed integer primitive type",
			new: "Operator used to create new objects and allocate memory",
			this: "Reference to the current object instance",
			super: "Reference to the parent class object",
			null: "Literal representing null reference - no object",
			true: "Boolean literal representing logical true",
			false: "Boolean literal representing logical false",
			if: "Conditional statement - executes code block if condition is true",
			else: "Alternative branch of if statement - executes when if condition is false",
			for: "Loop statement - repeats code block for specified number of iterations",
			while: "Loop statement - repeats code block while condition is true",
			do: "Loop statement - executes code block once, then repeats while condition is true",
			switch:
				"Multi-way branch statement - selects one of many code blocks to execute",
			case: "Label in switch statement representing a possible value",
			default: "Default case in switch statement when no other cases match",
			break: "Statement to exit from loop or switch statement",
			continue: "Statement to skip rest of current loop iteration",
			return: "Statement to exit method and optionally return a value",
			try: "Statement to define block of code to test for errors",
			catch: "Statement to handle exceptions thrown in try block",
			finally: "Statement to execute code regardless of try/catch result",
			throw: "Statement to manually throw an exception",
			throws:
				"Keyword in method declaration to specify which exceptions method can throw",
			extends: "Keyword to inherit from another class (single inheritance)",
			implements: "Keyword to implement one or more interfaces",
			interface:
				"Contract defining methods that implementing classes must provide",
			package: "Namespace for organizing related classes and interfaces",
			import: "Statement to use classes from other packages",
			instanceof:
				"Operator to test whether object is instance of specific class",
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
