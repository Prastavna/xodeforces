export enum Languages {
  C = 'c',
  'C++' = 'cpp',
  JavaScript = 'javascript',
  Python = 'python',
  'C#' = 'c#',
  Java = 'java',
  Go = 'go',
  Rust = 'rust',
  TypeScript = 'typescript',
  Kotlin = 'kotlin',
  Swift = 'swift',
  Ruby = 'ruby',
  PHP = 'php',
  Perl = 'perl',
  Scala = 'scala',
}
export const samples: Record<Languages, string> = {
  [Languages.C]: `#include <stdio.h>

int main() {
    printf("Hello from Monaco Editor!\n");
    return 0;
}`,

  [Languages['C++']]: `#include <iostream>

int main() {
    std::cout << "Hello from Monaco Editor!" << std::endl;
    return 0;
}`,

  [Languages.JavaScript]: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }`,

  [Languages.Python]: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,

  [Languages['C#']]: `using System;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello from Monaco Editor!");
    }
}`,

  [Languages.Java]: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Monaco Editor!");
    }
}`,

  [Languages.Go]: `package main

import "fmt"

func main() {
    fmt.Println("Hello from Monaco Editor!")
}`,

  [Languages.Rust]: `fn main() {
    println!("Hello from Monaco Editor!");
}`,

  [Languages.TypeScript]: `function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,

  [Languages.Kotlin]: `fun fibonacci(n: Int): Int {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}`,

  [Languages.Swift]: `func fibonacci(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}`,

  [Languages.Ruby]: `def fibonacci(n)
    if n <= 1
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
end`,

  [Languages.PHP]: `function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}`,

  [Languages.Perl]: `sub fibonacci {
    my ($n) = @_;
    return $n if $n <= 1;
    return fibonacci($n - 1) + fibonacci($n - 2);
}`,

  [Languages.Scala]: `def fibonacci(n: Int): Int = {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}`,

}