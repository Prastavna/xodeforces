import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("c", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			// I/O functions
			printf:
				"**int printf(const char *format, ...)**\nFormatted output function - prints to stdout\nReturns: number of characters printed",
			scanf:
				"**int scanf(const char *format, ...)**\nFormatted input function - reads from stdin\nReturns: number of items successfully read",
			fprintf:
				"**int fprintf(FILE *stream, const char *format, ...)**\nFormatted file output function\nReturns: number of characters written",
			fscanf:
				"**int fscanf(FILE *stream, const char *format, ...)**\nRead formatted data from file\nReturns: number of items successfully read",
			fgets:
				"**char *fgets(char *str, int n, FILE *stream)**\nRead string from file\nReturns: pointer to string on success, NULL on error",
			fputs:
				"**int fputs(const char *str, FILE *stream)**\nWrite string to file\nReturns: non-negative on success, EOF on error",

			// Memory management
			malloc:
				"**void *malloc(size_t size)**\nMemory allocation function - allocates memory dynamically\nReturns: pointer to allocated memory or NULL",
			calloc:
				"**void *calloc(size_t num, size_t size)**\nAllocate and zero-initialize memory\nReturns: pointer to allocated memory or NULL",
			realloc:
				"**void *realloc(void *ptr, size_t new_size)**\nReallocate memory block\nReturns: pointer to reallocated memory or NULL",
			free: "**void free(void *ptr)**\nMemory deallocation function - frees allocated memory\nReturns: void",
			memcpy:
				"**void *memcpy(void *dest, const void *src, size_t n)**\nCopy memory block\nReturns: pointer to destination",
			memset:
				"**void *memset(void *s, int c, size_t n)**\nSet memory block to value\nReturns: pointer to memory area s",

			// String functions
			strlen:
				"**size_t strlen(const char *str)**\nString length function - returns length of string\nReturns: length of string (excluding null terminator)",
			strcpy:
				"**char *strcpy(char *dest, const char *src)**\nString copy function - copies one string to another\nReturns: pointer to destination string",
			strncpy:
				"**char *strncpy(char *dest, const char *src, size_t n)**\nCopy n characters of string\nReturns: pointer to destination string",
			strcmp:
				"**int strcmp(const char *str1, const char *str2)**\nString compare function - compares two strings\nReturns: 0 if equal, <0 if str1 < str2, >0 if str1 > str2",
			strcat:
				"**char *strcat(char *dest, const char *src)**\nConcatenate strings\nReturns: pointer to destination string",
			strstr:
				"**char *strstr(const char *haystack, const char *needle)**\nFind substring in string\nReturns: pointer to first occurrence or NULL",
			strtok:
				"**char *strtok(char *str, const char *delim)**\nSplit string into tokens\nReturns: pointer to next token or NULL",

			// File operations
			FILE: "**FILE**\nFile pointer type for file operations\nUsed to represent file streams",
			fopen:
				'**FILE *fopen(const char *filename, const char *mode)**\nFile open function - opens a file\nModes: "r" (read), "w" (write), "a" (append)\nReturns: file pointer or NULL',
			fclose:
				"**int fclose(FILE *stream)**\nFile close function - closes a file\nReturns: 0 on success, EOF on error",
			fread:
				"**size_t fread(void *ptr, size_t size, size_t count, FILE *stream)**\nRead data from file\nReturns: number of items read",
			fwrite:
				"**size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream)**\nWrite data to file\nReturns: number of items written",

			// Mathematical functions
			sqrt: "**double sqrt(double x)**\nSquare root function\nReturns: square root of x",
			pow: "**double pow(double base, double exp)**\nPower function - base raised to exponent\nReturns: base^exp",
			abs: "**int abs(int x)**\nAbsolute value function for integers\nReturns: absolute value of x",
			sin: "**double sin(double x)**\nSine function (x in radians)\nReturns: sine of x",
			cos: "**double cos(double x)**\nCosine function (x in radians)\nReturns: cosine of x",
			tan: "**double tan(double x)**\nTangent function (x in radians)\nReturns: tangent of x",
			ceil: "**double ceil(double x)**\nCeiling function - smallest integer >= x\nReturns: ceiling of x",
			floor:
				"**double floor(double x)**\nFloor function - largest integer <= x\nReturns: floor of x",

			// Character functions
			isalpha:
				"**int isalpha(int c)**\nCheck if character is alphabetic (a-z, A-Z)\nReturns: non-zero if true, 0 if false",
			isdigit:
				"**int isdigit(int c)**\nCheck if character is digit (0-9)\nReturns: non-zero if true, 0 if false",
			isalnum:
				"**int isalnum(int c)**\nCheck if character is alphanumeric\nReturns: non-zero if true, 0 if false",
			isspace:
				"**int isspace(int c)**\nCheck if character is whitespace\nReturns: non-zero if true, 0 if false",
			toupper:
				"**int toupper(int c)**\nConvert character to uppercase\nReturns: uppercase character or unchanged if not lowercase",
			tolower:
				"**int tolower(int c)**\nConvert character to lowercase\nReturns: lowercase character or unchanged if not uppercase",

			// Time functions
			time: "**time_t time(time_t *timer)**\nGet current time as seconds since epoch\nReturns: current time",
			clock:
				"**clock_t clock(void)**\nGet processor time used by program\nReturns: processor time used",

			// Data types
			int: "**int**\nInteger data type\nRange: typically -2,147,483,648 to 2,147,483,647 (32-bit)\nSize: usually 4 bytes",
			char: "**char**\nCharacter data type\nRange: -128 to 127 (signed) or 0 to 255 (unsigned)\nSize: 1 byte",
			float:
				"**float**\nSingle-precision floating point data type\nRange: ~1.2E-38 to ~3.4E+38\nSize: usually 4 bytes",
			double:
				"**double**\nDouble-precision floating point data type\nRange: ~2.3E-308 to ~1.7E+308\nSize: usually 8 bytes",
			long: "**long**\nLong integer data type\nRange: at least -2,147,483,648 to 2,147,483,647\nSize: usually 4 or 8 bytes",
			short:
				"**short**\nShort integer data type\nRange: typically -32,768 to 32,767\nSize: usually 2 bytes",
			void: "**void**\nVoid type - represents no value\nUsed for functions that don't return a value",
			size_t:
				"**size_t**\nUnsigned integer type for sizes and counts\nUsed for array indices and loop counting",

			// Constants and macros
			NULL: "**NULL**\nNull pointer constant\nValue: typically defined as ((void*)0)\nUsed to indicate a pointer points to nothing",
			TRUE: "**TRUE**\nBoolean true constant\nValue: typically defined as 1",
			FALSE: "**FALSE**\nBoolean false constant\nValue: typically defined as 0",
			EOF: "**EOF**\nEnd-of-file constant\nValue: typically -1\nReturned by functions when end of file is reached",

			// Preprocessor directives
			define:
				"**#define**\nPreprocessor directive to define macros\nSyntax: #define NAME value\nExample: #define PI 3.14159",
			include:
				'**#include**\nPreprocessor directive to include header files\nSyntax: #include <header.h> or #include "header.h"',
			ifdef:
				"**#ifdef**\nConditional compilation directive\nSyntax: #ifdef MACRO ... #endif\nCompiles code only if MACRO is defined",
			ifndef:
				"**#ifndef**\nConditional compilation directive\nSyntax: #ifndef MACRO ... #endif\nCompiles code only if MACRO is NOT defined",
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
