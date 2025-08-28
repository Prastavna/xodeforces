import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("cpp", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			std: "Standard namespace containing C++ standard library classes and functions",
			cout: "Standard output stream object for writing to console",
			cin: "Standard input stream object for reading from console",
			cerr: "Standard error stream object for error output",
			clog: "Standard log stream object for log output",
			endl: "Manipulator that inserts newline character and flushes output stream",
			vector: "Dynamic array container that can resize automatically",
			string:
				"Class for handling sequences of characters with many utility methods",
			array: "Fixed-size sequence container that encapsulates arrays",
			list: "Doubly-linked list container",
			deque:
				"Double-ended queue container allowing fast insertion/deletion at both ends",
			set: "Associative container with unique sorted elements",
			multiset:
				"Associative container with sorted elements allowing duplicates",
			map: "Associative container with unique key-value pairs sorted by keys",
			multimap:
				"Associative container with key-value pairs allowing duplicate keys",
			unordered_set: "Hash set container with unique elements",
			unordered_map: "Hash map container with unique key-value pairs",
			stack: "LIFO (last-in-first-out) container adapter",
			queue: "FIFO (first-in-first-out) container adapter",
			priority_queue:
				"Priority queue container adapter with largest element at top",
			pair: "Container holding exactly two elements that can be different types",
			shared_ptr:
				"Smart pointer that shares ownership of dynamically allocated object",
			unique_ptr:
				"Smart pointer that exclusively owns dynamically allocated object",
			weak_ptr:
				"Smart pointer that holds non-owning reference to shared_ptr managed object",
			make_shared: "Function that creates shared_ptr managing new object",
			make_unique: "Function that creates unique_ptr managing new object",
			auto: "Keyword for automatic type deduction",
			const: "Keyword to make variables or functions read-only",
			static: "Keyword for static storage duration or internal linkage",
			extern: "Keyword for external linkage declaration",
			inline: "Keyword suggesting function should be expanded in-place",
			virtual: "Keyword enabling runtime polymorphism",
			override: "Keyword explicitly marking virtual function override",
			final: "Keyword preventing further overriding or inheritance",
			template: "Keyword to define generic classes or functions",
			typename: "Keyword to specify that dependent name is a type",
			namespace: "Keyword to define named scope for organizing code",
			using: "Keyword for namespace using-directives and type aliases",
			typedef: "Keyword to create type aliases",
			sizeof: "Operator that returns size of type or object in bytes",
			new: "Operator for dynamic memory allocation",
			delete: "Operator for dynamic memory deallocation",
			nullptr: "Null pointer literal",
			true: "Boolean literal representing logical truth",
			false: "Boolean literal representing logical falsehood",
			if: "Conditional statement that executes code if condition is true",
			else: "Alternative branch of if statement",
			switch: "Multi-way selection statement",
			case: "Label in switch statement",
			default: "Default case in switch statement",
			for: "Loop statement for controlled iteration",
			while: "Loop statement that continues while condition is true",
			do: "Loop statement that executes once then continues while condition is true",
			break: "Statement to exit from loop or switch",
			continue: "Statement to skip to next iteration of loop",
			return: "Statement to exit function and optionally return value",
			goto: "Statement for unconditional jump to labeled statement",
			try: "Statement to define block that may throw exceptions",
			catch: "Statement to handle exceptions from try block",
			throw: "Statement to raise an exception",
			public: "Access specifier allowing access from anywhere",
			private: "Access specifier allowing access only within same class",
			protected: "Access specifier allowing access within class hierarchy",
			class: "Keyword to define a class",
			struct:
				"Keyword to define a structure (class with public default access)",
			union: "Keyword to define a union type",
			enum: "Keyword to define enumeration type",
			friend: "Keyword to grant access to private/protected members",
			mutable: "Keyword allowing modification of const object members",
			volatile: "Keyword indicating variable may change unexpectedly",
			this: "Pointer to current object instance",
			operator: "Keyword for operator overloading",
			explicit: "Keyword to prevent implicit conversions",
			constexpr: "Keyword for compile-time constant expressions",
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
