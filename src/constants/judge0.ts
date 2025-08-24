export const JUDGE0_LANGUAGE_MAP: Record<string, number> = {
	// Assembly
	asm: 45, // Assembly (NASM 2.14.02)

	// Bash
	bash: 46, // Bash (5.0.0)

	// C
	c: 50, // C (GCC 9.2.0)

	// C++
	cpp: 54, // C++ (GCC 9.2.0)
	"c++": 54, // C++ (GCC 9.2.0)

	// C#
	csharp: 51, // C# (Mono 6.6.0.161)
	cs: 51,

	// Go
	go: 60, // Go (1.13.5)

	// Java
	java: 62, // Java (OpenJDK 13.0.1)

	// JavaScript
	javascript: 63, // JavaScript (Node.js 12.14.0)
	js: 63,

	// Python
	python: 71, // Python (3.8.1)
	py: 71,
	python2: 70, // Python (2.7.17)
	py2: 70,

	// Ruby
	ruby: 72, // Ruby (2.7.0)
	rb: 72,

	// Rust
	rust: 73, // Rust (1.40.0)
	rs: 73,

	// TypeScript
	typescript: 74, // TypeScript (3.7.4)
	ts: 74,

	// PHP
	php: 68, // PHP (7.4.1)

	// Lua
	lua: 64, // Lua (5.3.5)

	// Other popular languages
	haskell: 61, // Haskell (GHC 8.8.1)
	hs: 61,
	pascal: 67, // Pascal (FPC 3.0.4)
	pas: 67,
	fortran: 59, // Fortran (GFortran 9.2.0)
	f90: 59,
	erlang: 58, // Erlang (OTP 22.2)
	elixir: 57, // Elixir (1.9.4)
	ocaml: 65, // OCaml (4.09.0)
	octave: 66, // Octave (5.1.0)
	prolog: 69, // Prolog (GNU Prolog 1.4.5)
	commonlisp: 55, // Common Lisp (SBCL 2.0.0)
	lisp: 55,
	d: 56, // D (DMD 2.089.1)
	basic: 47, // Basic (FBC 1.07.1)
	plaintext: 43, // Plain Text
};

export const JUDGE0_STATUS_MAP: Record<
	number,
	{ name: string; color: string }
> = {
	1: { name: "In Queue", color: "blue" },
	2: { name: "Processing", color: "yellow" },
	3: { name: "Accepted", color: "green" },
	4: { name: "Wrong Answer", color: "red" },
	5: { name: "Time Limit Exceeded", color: "orange" },
	6: { name: "Compilation Error", color: "red" },
	7: { name: "Runtime Error (SIGSEGV)", color: "red" },
	8: { name: "Runtime Error (SIGXFSZ)", color: "red" },
	9: { name: "Runtime Error (SIGFPE)", color: "red" },
	10: { name: "Runtime Error (SIGABRT)", color: "red" },
	11: { name: "Runtime Error (NZEC)", color: "red" },
	12: { name: "Runtime Error (Other)", color: "red" },
	13: { name: "Internal Error", color: "gray" },
	14: { name: "Exec Format Error", color: "red" },
};

export const JUDGE0_BASE_URL = "https://judge0-ce.p.rapidapi.com";

export const DEFAULT_JUDGE0_CONFIG = {
	baseUrl: JUDGE0_BASE_URL,
	apiKey: "",
};
