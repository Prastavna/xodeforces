export const competitiveTemplates = {
	cpp: `#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define vi vector<int>
#define vll vector<long long>
#define pii pair<int, int>
#define pll pair<long long, long long>
#define all(v) v.begin(), v.end()
#define rall(v) v.rbegin(), v.rend()
#define pb push_back
#define mp make_pair
#define fi first
#define se second
#define sz(v) (int)v.size()

const int MOD = 1e9 + 7;
const int INF = 1e9;
const ll LINF = 1e18;

void solve() {
    // Your solution here
    
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t = 1;
    cin >> t;
    
    while (t--) {
        solve();
    }
    
    return 0;
}`,

	python: `import sys
import math
from collections import defaultdict, deque, Counter
from bisect import bisect_left, bisect_right
from heapq import heappush, heappop
from itertools import combinations, permutations

def solve():
    # Your solution here
    pass

def main():
    t = int(input())
    for _ in range(t):
        solve()

if __name__ == "__main__":
    main()`,

	java: `import java.io.*;
import java.util.*;

public class Main {
    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    static PrintWriter out = new PrintWriter(System.out);
    static StringTokenizer st;
    
    public static void main(String[] args) throws IOException {
        int t = nextInt();
        while (t-- > 0) {
            solve();
        }
        out.close();
    }
    
    static void solve() throws IOException {
        // Your solution here
        
    }
    
    static String next() throws IOException {
        while (st == null || !st.hasMoreTokens()) {
            st = new StringTokenizer(br.readLine());
        }
        return st.nextToken();
    }
    
    static int nextInt() throws IOException {
        return Integer.parseInt(next());
    }
    
    static long nextLong() throws IOException {
        return Long.parseLong(next());
    }
    
    static double nextDouble() throws IOException {
        return Double.parseDouble(next());
    }
}`,

	c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define MAX_N 100005
#define MOD 1000000007
#define INF 1000000000

void solve() {
    // Your solution here
    
}

int main() {
    int t;
    scanf("%d", &t);
    
    while (t--) {
        solve();
    }
    
    return 0;
}`,

	go: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

var scanner = bufio.NewScanner(os.Stdin)

func nextInt() int {
    scanner.Scan()
    n, _ := strconv.Atoi(scanner.Text())
    return n
}

func nextString() string {
    scanner.Scan()
    return scanner.Text()
}

func nextInts() []int {
    scanner.Scan()
    strs := strings.Fields(scanner.Text())
    ints := make([]int, len(strs))
    for i, s := range strs {
        ints[i], _ = strconv.Atoi(s)
    }
    return ints
}

func solve() {
    // Your solution here
    
}

func main() {
    t := nextInt()
    for i := 0; i < t; i++ {
        solve()
    }
}`,

	rust: `use std::io::{self, Write};

fn solve() {
    // Your solution here
    
}

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let t: i32 = input.trim().parse().unwrap();
    
    for _ in 0..t {
        solve();
    }
    
    io::stdout().flush().unwrap();
}`,

	csharp: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int t = int.Parse(Console.ReadLine());
        for (int i = 0; i < t; i++)
        {
            Solve();
        }
    }
    
    static void Solve()
    {
        // Your solution here
        
    }
}`,

	javascript: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
let currentLine = 0;

function readLine() {
    return input[currentLine++];
}

function solve() {
    // Your solution here
    
}

rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    const t = parseInt(readLine());
    for (let i = 0; i < t; i++) {
        solve();
    }
});`,
};
