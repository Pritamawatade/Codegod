import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testCases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testCases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value) => {
    console.log("value", value);
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      console.log(res.data);
      toast.success(res.data.message || "Problem Created successfully⚡");
      navigation("/");
    } catch (error) {
      console.log(error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;

    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestCases(sampleData.testCases.map((tc) => tc));

    // Reset the form with sample data
    reset(sampleData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
  <div className="container mx-auto max-w-6xl">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div className="p-8 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
              Create Problem
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Design and configure your coding challenge</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
            <div className="join shadow-md">
              <button
                type="button"
                className={`btn join-item px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  sampleType === "DP" 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSampleType("array")}
              >
                DP Problem
              </button>
              <button
                type="button"
                className={`btn join-item px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  sampleType === "string" 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSampleType("string")}
              >
                String Problem
              </button>
            </div>
            <button
              type="button"
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 px-6 py-3 shadow-md transition-all duration-200 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              onClick={loadSampleData}
            >
              <Download className="w-4 h-4 mr-2" />
              Load Sample
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Information Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-lg font-medium text-gray-900 dark:text-white">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-lg w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg transition-colors duration-200"
                    {...register("title")}
                    placeholder="Enter a compelling problem title"
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                        {errors.title.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-lg font-medium text-gray-900 dark:text-white">
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-lg min-h-40 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                    {...register("description")}
                    placeholder="Provide a detailed problem description..."
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text text-lg font-medium text-gray-900 dark:text-white">
                    Difficulty Level
                  </span>
                </label>
                <select
                  className="select select-lg w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                  {...register("difficulty")}
                >
                  <option value="EASY" className="text-emerald-600">🟢 Easy</option>
                  <option value="MEDIUM" className="text-yellow-600">🟡 Medium</option>
                  <option value="HARD" className="text-red-600">🔴 Hard</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Tags & Categories
              </h2>
              <button
                type="button"
                className="btn bg-purple-600 hover:bg-purple-700 text-white border-purple-600 px-4 py-2 rounded-lg shadow-md transition-all duration-200 dark:bg-purple-500 dark:hover:bg-purple-600"
                onClick={() => appendTag("")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Tag
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-center">
                  <input
                    type="text"
                    className="input flex-1 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg transition-colors duration-200"
                    {...register(`tags.${index}`)}
                    placeholder="e.g., array, dynamic-programming"
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm w-10 h-10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                    onClick={() => removeTag(index)}
                    disabled={tagFields.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            {errors.tags && (
              <div className="mt-3">
                <span className="text-red-500 dark:text-red-400 text-sm font-medium">
                  {errors.tags.message}
                </span>
              </div>
            )}
          </div>

          {/* Test Cases Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Test Cases
              </h2>
              <button
                type="button"
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 px-4 py-2 rounded-lg shadow-md transition-all duration-200 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                onClick={() => appendTestCase({ input: "", output: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Test Case
              </button>
            </div>
            <div className="space-y-6">
              {testCaseFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">{index + 1}</span>
                      </div>
                      Test Case #{index + 1}
                    </h3>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 px-3 py-2 rounded-lg transition-colors duration-200"
                      onClick={() => removeTestCase(index)}
                      disabled={testCaseFields.length === 1}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text font-medium text-gray-900 dark:text-white">
                          Input
                        </span>
                      </label>
                      <textarea
                        className="textarea min-h-32 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                        {...register(`testCases.${index}.input`)}
                        placeholder="Enter test case input data..."
                      />
                      {errors.testCases?.[index]?.input && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                            {errors.testCases[index].input.message}
                          </span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text font-medium text-gray-900 dark:text-white">
                          Expected Output
                        </span>
                      </label>
                      <textarea
                        className="textarea min-h-32 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                        {...register(`testCases.${index}.output`)}
                        placeholder="Enter expected output..."
                      />
                      {errors.testCases?.[index]?.output && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                            {errors.testCases[index].output.message}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.testCases && !Array.isArray(errors.testCases) && (
              <div className="mt-3">
                <span className="text-red-500 dark:text-red-400 text-sm font-medium">
                  {errors.testCases.message}
                </span>
              </div>
            )}
          </div>

          {/* Code Editor Sections */}
          <div className="space-y-8">
            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language, langIndex) => (
              <div
                key={language}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                  <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full text-indigo-800 dark:text-indigo-200 text-sm font-medium">
                    {language}
                  </span>
                </h2>

                <div className="space-y-8">
                  {/* Starter Code */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                      Starter Code Template
                    </h3>
                    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <Controller
                        name={`codeSnippets.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="350px"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 15,
                              lineNumbers: "on",
                              roundedSelection: false,
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              padding: { top: 16, bottom: 16 },
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.codeSnippets?.[language] && (
                      <div className="mt-3">
                        <span className="text-red-500 dark:text-red-400 text-sm font-medium">
                          {errors.codeSnippets[language].message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reference Solution */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Reference Solution
                    </h3>
                    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <Controller
                        name={`referenceSolutions.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="350px"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 15,
                              lineNumbers: "on",
                              roundedSelection: false,
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              padding: { top: 16, bottom: 16 },
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.referenceSolutions?.[language] && (
                      <div className="mt-3">
                        <span className="text-red-500 dark:text-red-400 text-sm font-medium">
                          {errors.referenceSolutions[language].message}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                      Example
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text font-medium text-gray-900 dark:text-white">
                            Input
                          </span>
                        </label>
                        <textarea
                          className="textarea min-h-24 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                          {...register(`examples.${language}.input`)}
                          placeholder="Example input..."
                        />
                        {errors.examples?.[language]?.input && (
                          <label className="label">
                            <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                              {errors.examples[language].input.message}
                            </span>
                          </label>
                        )}
                      </div>
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text font-medium text-gray-900 dark:text-white">
                            Output
                          </span>
                        </label>
                        <textarea
                          className="textarea min-h-24 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                          {...register(`examples.${language}.output`)}
                          placeholder="Example output..."
                        />
                        {errors.examples?.[language]?.output && (
                          <label className="label">
                            <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                              {errors.examples[language].output.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text font-medium text-gray-900 dark:text-white">
                          Explanation
                        </span>
                      </label>
                      <textarea
                        className="textarea min-h-32 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                        {...register(`examples.${language}.explanation`)}
                        placeholder="Explain how the input produces the output..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              Additional Information
            </h2>
            <div className="space-y-6">
              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text font-medium text-gray-900 dark:text-white text-lg">
                    Constraints
                  </span>
                </label>
                <textarea
                  className="textarea textarea-lg min-h-32 w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                  {...register("constraints")}
                  placeholder="e.g., 1 ≤ n ≤ 10^5, -10^9 ≤ arr[i] ≤ 10^9"
                />
                {errors.constraints && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 dark:text-red-400 font-medium">
                      {errors.constraints.message}
                    </span>
                  </label>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text font-medium text-gray-900 dark:text-white text-lg">
                      Hints (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-lg min-h-32 w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                    {...register("hints")}
                    placeholder="Provide helpful hints to guide users..."
                  />
                </div>
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text font-medium text-gray-900 dark:text-white text-lg">
                      Editorial (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-lg min-h-32 w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-y transition-colors duration-200"
                    {...register("editorial")}
                    placeholder="Detailed solution explanation and approaches..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-8 border-t-2 border-gray-200 dark:border-gray-700">
            <button 
              type="submit" 
              className="btn btn-lg bg-blue-600 hover:bg-blue-700 text-white border-blue-600 px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600 min-w-48"
            >
              {isLoading ? (
                <span className="loading loading-spinner text-white w-5 h-5"></span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Create Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default CreateProblemForm;
