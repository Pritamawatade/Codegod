const data = `{
    "title": "Add Two Numbers",
    "description": "Given two numbers a and b add them up and return the outout",
    "difficulty": "EASY",
    "tags": [
        "math",
        "operators",
        "addition"
    ],
    "examples": {
        "PYTHON": {
            "input": "3 7",
            "output": "10",
            "explanation": "Adding 3 and 7 gives 10."
        },
        "JAVASCRIPT": {
            "input": "-5 12",
            "output": "7",
            "explanation": "Adding -5 and 12 gives 7."
        }
    },
    "constraints": "-10^9 ≤ a, b ≤ 10^9",
    "testcases": [
        {
            "input": "100 200",
            "output": "300"
        },
        {
            "input": "-500 -600",
            "output": "-1100"
        },
        {
            "input": "0 0",
            "output": "0"
        }
    ],
    "codeSnippets": {
        "JAVASCRIPT": "const readline = require('readline');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n}\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nlet inputLines = [];\n\nrl.on('line', (line) => {\n    inputLines = line.split(' ');\n    rl.close();\n}).on('close', () => {\n    const a = parseInt(inputLines[0], 10);\n    const b = parseInt(inputLines[1], 10);\n    console.log(addTwoNumbers(a, b));\n});",
        "PYTHON": "def add_two_numbers(a, b):\n    # Write your code here\n    # Return the sum of a and b\n    pass\n\nimport sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(add_two_numbers(a, b))",
        "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        // Write your code here\n        // Return the sum of a and b\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}"
    },
    "referenceSolutions": {
        "JAVASCRIPT": "const readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nlet inputLines = [];\n\nrl.on('line', (line) => {\n    inputLines = line.split(' ');\n    rl.close();\n}).on('close', () => {\n    const a = parseInt(inputLines[0], 10);\n    const b = parseInt(inputLines[1], 10);\n    console.log(a + b);\n});",
        "PYTHON": "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
        "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
    }
}
`
// "12 13"
// const input = fs.readFileSync(0, 'utf-8').trim();
// const [a, b] = input.split(' ').map(Number);

`const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n    return a + b;\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b))`

