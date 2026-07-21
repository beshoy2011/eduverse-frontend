from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
import json

def seed_database():
    # 1. Drop and recreate all tables for a clean seeding run
    print("Dropping all existing database tables for a fresh sync...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
    
    db = SessionLocal()
    try:

        print("Seeding database...")

        # =====================================================================
        # 1. PYTHON BASICS COURSE
        # =====================================================================
        python_course = models.Course(
            title="Python Basics",
            description="Learn Python, the most popular and versatile programming language in the world. Perfect for beginners who want to build scripts, analyze data, or get started with web backend programming.",
            skills="Python,Variables,Loops,Functions,Data Structures,Basic Projects",
            duration="10 hours",
            difficulty="Beginner",
            theme_style="cosmic"
        )
        db.add(python_course)
        db.flush()  # gets the ID

        python_lessons = [
            {
                "title": "Introduction to Python",
                "sequence_order": 1,
                "content": """# Introduction to Python

Welcome to Python Basics! Python is a high-level, interpreted programming language known for its clean syntax and readability. It was created by Guido van Rossum and released in 1991.

### Why Python?
1. **Easy to Learn**: Python's syntax is very close to English.
2. **Versatile**: Used in AI, Web Development, Data Science, Automation, and more.
3. **Huge Community**: Millions of developers use Python, meaning lots of packages and help online.

### Your First Program: "Hello, World!"
In Python, writing code is simple. To print something to the screen, we use the `print()` function:
```python
print("Hello, World!")
```
Run the code below in the practice section to see how it works!""",
                "code_template": "# Complete the code to print 'Hello, World!'\nprint(\"____\")",
                "solution": "print(\"Hello, World!\")",
                "test_cases": [{"input": "", "output": "Hello, World!\n"}],
                "practice_questions": [
                    {
                        "question": "Who created the Python programming language?",
                        "options": ["Dennis Ritchie", "Guido van Rossum", "James Gosling", "Bjarne Stroustrup"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Installing Python & Setup",
                "sequence_order": 2,
                "content": """# Installing Python & Setup

To run Python on your computer, you need to install the Python Interpreter.

### Steps to Install:
1. Go to the official website [python.org](https://www.python.org).
2. Download the latest version for your Operating System (Windows, macOS, Linux).
3. **IMPORTANT (Windows)**: During installation, check the box that says **"Add Python to PATH"**. This lets you run Python commands from your terminal!

### Running Python
Open your terminal (Command Prompt or Terminal on Mac) and type:
```bash
python --version
```
To start writing Python interactively, type `python` in your terminal. You can write math expressions or basic statements there.
To write longer files, save your code with a `.py` extension (e.g. `main.py`) and run it using:
```bash
python main.py
```""",
                "code_template": "# Print 'Python is set up!' to check your output\nprint(\"____\")",
                "solution": "print(\"Python is set up!\")",
                "test_cases": [{"input": "", "output": "Python is set up!\n"}],
                "practice_questions": [
                    {
                        "question": "What file extension is used for Python scripts?",
                        "options": [".cpp", ".py", ".html", ".js"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Variables in Python",
                "sequence_order": 3,
                "content": """# Variables in Python

Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the `=` operator.

Unlike languages like C++ or Java, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.

### Example:
```python
x = 5
name = "Beshoy"
print(x)
print(name)
```

### Naming Rules:
- A variable name must start with a letter or the underscore character.
- A variable name cannot start with a number.
- Variable names are case-sensitive (`age`, `Age` and `AGE` are three different variables).""",
                "code_template": "# Declare a variable named age and set it to 25. Then print it.\nage = ___\nprint(age)",
                "solution": "age = 25\nprint(age)",
                "test_cases": [{"input": "", "output": "25\n"}],
                "practice_questions": [
                    {
                        "question": "Which of the following is an invalid variable name in Python?",
                        "options": ["my_var", "_myvar", "2myvar", "myVar"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "Data Types",
                "sequence_order": 4,
                "content": """# Data Types in Python

In programming, data type is an important concept. Variables can store data of different types, and different types can do different things.

Python has the following built-in data types by default:
1. **Text Type**: `str` (String) e.g., `"Hello"`
2. **Numeric Types**: `int` (Integer) e.g., `10`, `float` (Floating point) e.g., `10.5`
3. **Boolean Type**: `bool` (True or False)

### Checking Data Types
You can check the data type of any object by using the `type()` function:
```python
x = 10.5
print(type(x))  # Output: <class 'float'>
```""",
                "code_template": "# Set the variable is_coding to True, and score to 99.5. Print both.\nis_coding = ___\nscore = ___\nprint(is_coding)\nprint(score)",
                "solution": "is_coding = True\nscore = 99.5\nprint(is_coding)\nprint(score)",
                "test_cases": [{"input": "", "output": "True\n99.5\n"}],
                "practice_questions": [
                    {
                        "question": "What is the output of type(123) in Python?",
                        "options": ["<class 'str'>", "<class 'float'>", "<class 'int'>", "<class 'bool'>"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "Input & Output",
                "sequence_order": 5,
                "content": """# Input & Output

To interact with users, program needs to take inputs and display outputs.

### Output
We use the `print()` function to output data to the screen. You can concatenate strings or print multiple items:
```python
name = "Alex"
print("Hello", name)
```

### Input
We use the `input()` function to read a line of text from the user.
**IMPORTANT**: `input()` always returns the input as a **String (str)**. If you need a number, you must cast/convert it using `int()` or `float()`!
```python
age = int(input("Enter your age: "))
```""",
                "code_template": "# Complete the code to take input and print it\nname = ____()\nprint(\"User name is:\", ____)",
                "solution": "name = input()\nprint(\"User name is:\", name)",
                "test_cases": [{"input": "Alice\n", "output": "User name is: Alice\n"}],
                "practice_questions": [
                    {
                        "question": "What data type does the input() function return by default?",
                        "options": ["int", "float", "str", "bool"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "Operators",
                "sequence_order": 6,
                "content": """# Operators in Python

Operators are used to perform operations on variables and values.

### Arithmetic Operators
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `%` Modulus (returns the remainder of division, e.g. `5 % 2` is `1`)
- `**` Exponentiation (e.g. `2 ** 3` is `8`)

### Comparison Operators
These evaluate to `True` or `False`:
- `==` Equal
- `!=` Not equal
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal to
- `<=` Less than or equal to""",
                "code_template": "# Print the remainder of 17 divided by 5 using the modulus operator.\nremainder = 17 ___ 5\nprint(remainder)",
                "solution": "remainder = 17 % 5\nprint(remainder)",
                "test_cases": [{"input": "", "output": "2\n"}],
                "practice_questions": [
                    {
                        "question": "What does 10 % 3 evaluate to?",
                        "options": ["3", "1", "0.33", "2"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Conditions (If-Elif-Else)",
                "sequence_order": 7,
                "content": """# Conditions in Python

Python supports the usual logical conditions from mathematics. These conditions can be used in `if` statements.

Python relies on **indentation** (whitespace at the beginning of a line) to define scope in the code. Other programming languages often use curly brackets `{}`.

### Example:
```python
a = 33
b = 200
if b > a:
    print("b is greater than a")
elif a == b:
    print("a and b are equal")
else:
    print("a is greater than b")
```""",
                "code_template": "# Fill in the condition so it prints 'Access Granted' if age is 18 or older\nage = 20\nif age ___ 18:\n    print(\"Access Granted\")",
                "solution": "age = 20\nif age >= 18:\n    print(\"Access Granted\")",
                "test_cases": [{"input": "", "output": "Access Granted\n"}],
                "practice_questions": [
                    {
                        "question": "How does Python define scopes/blocks of code in conditional statements?",
                        "options": ["Using parentheses ()", "Using curly braces {}", "Using indentation", "Using semicolons ;"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "Loops (While & For)",
                "sequence_order": 8,
                "content": """# Loops in Python

Python has two primitive loop commands:
1. `while` loops
2. `for` loops

### The While Loop
With the `while` loop, we can execute a set of statements as long as a condition is true.
```python
i = 1
while i < 6:
    print(i)
    i += 1
```

### The For Loop
A `for` loop is used for iterating over a sequence (like a list, a dictionary, or a range).
```python
# Iterating over range
for x in range(1, 4):
    print(x)  # prints 1, 2, 3
```""",
                "code_template": "# Write a for loop that prints numbers from 1 to 3\nfor i in range(1, ___):\n    print(i)",
                "solution": "for i in range(1, 4):\n    print(i)",
                "test_cases": [{"input": "", "output": "1\n2\n3\n"}],
                "practice_questions": [
                    {
                        "question": "Which range function call generates the sequence [0, 1, 2, 3, 4]?",
                        "options": ["range(5)", "range(1, 5)", "range(0, 4)", "range(6)"],
                        "answer": 0
                    }
                ]
            },
            {
                "title": "Functions",
                "sequence_order": 9,
                "content": """# Functions in Python

A function is a block of code which only runs when it is called. You can pass data, known as parameters, into a function. A function can return data as a result.

### Creating and Calling a Function
In Python, a function is defined using the `def` keyword:
```python
def my_function(name):
    return "Hello " + name

# Calling it
message = my_function("Beshoy")
print(message)  # Output: Hello Beshoy
```""",
                "code_template": "# Define a function square(x) that returns x multiplied by itself\ndef square(x):\n    return ____\n\nprint(square(4))",
                "solution": "def square(x):\n    return x * x\n\nprint(square(4))",
                "test_cases": [{"input": "", "output": "16\n"}],
                "practice_questions": [
                    {
                        "question": "Which keyword is used to declare a function in Python?",
                        "options": ["function", "def", "func", "void"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Lists",
                "sequence_order": 10,
                "content": """# Lists in Python

Lists are used to store multiple items in a single variable. Lists are ordered, changeable (mutable), and allow duplicate values.

List items are indexed, the first item has index `[0]`, the second item has index `[1]`, etc.

### Example:
```python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # Apple

# Modify
fruits[1] = "blueberry"

# Append
fruits.append("orange")
print(len(fruits))  # Output: 4
```""",
                "code_template": "# Create a list with numbers 1, 2, 3. Append 4, and print the list.\nnums = [1, 2, 3]\nnums.____(4)\nprint(nums)",
                "solution": "nums = [1, 2, 3]\nnums.append(4)\nprint(nums)",
                "test_cases": [{"input": "", "output": "[1, 2, 3, 4]\n"}],
                "practice_questions": [
                    {
                        "question": "How do you add an element to the end of a list in Python?",
                        "options": ["list.add(element)", "list.append(element)", "list.insert(element)", "list.push(element)"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Dictionaries",
                "sequence_order": 11,
                "content": """# Dictionaries in Python

Dictionaries are used to store data values in key:value pairs. A dictionary is a collection which is ordered, changeable, and does not allow duplicates.

### Example:
```python
student = {
    "name": "Beshoy",
    "course": "Python Basics",
    "year": 2026
}
print(student["name"])  # Output: Beshoy

# Add or modify
student["grade"] = "A+"
print(student)
```""",
                "code_template": "# Print the value of the key 'brand'\ncar = {\"brand\": \"Ford\", \"model\": \"Mustang\"}\nprint(car[\"____\"])",
                "solution": "car = {\"brand\": \"Ford\", \"model\": \"Mustang\"}\nprint(car[\"brand\"])",
                "test_cases": [{"input": "", "output": "Ford\n"}],
                "practice_questions": [
                    {
                        "question": "Which bracket is used to define a dictionary in Python?",
                        "options": ["Parentheses ()", "Curly braces {}", "Square brackets []", "Angle brackets <>"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Capstone Mini Project",
                "sequence_order": 12,
                "content": """# Python Mini Project: Calculator

To wrap up your Python basics journey, you will implement a small script that performs basic arithmetic calculations.

### Project details:
You will build a calculator function `calculate(num1, num2, operation)` where operation can be:
- `"add"`
- `"subtract"`
- `"multiply"`
- `"divide"`

Let's put together everything you've learned about parameters, conditions, and calculations!""",
                "code_template": "def calculate(num1, num2, operation):\n    if operation == \"add\":\n        return ____\n    elif operation == \"subtract\":\n        return ____\n    elif operation == \"multiply\":\n        return ____\n    elif operation == \"divide\":\n        return ____\n    return 0\n\nprint(calculate(10, 5, \"multiply\"))",
                "solution": "def calculate(num1, num2, operation):\n    if operation == \"add\":\n        return num1 + num2\n    elif operation == \"subtract\":\n        return num1 - num2\n    elif operation == \"multiply\":\n        return num1 * num2\n    elif operation == \"divide\":\n        return num1 / num2\n    return 0\n\nprint(calculate(10, 5, \"multiply\"))",
                "test_cases": [{"input": "", "output": "50\n"}],
                "practice_questions": [
                    {
                        "question": "Which of these is the correct way to handle conditional logic inside a Python function?",
                        "options": ["Using switch-case statements only", "Using indent-based if/elif/else conditions", "Using curly braces for logic scoping", "All of the above"],
                        "answer": 1
                    }
                ]
            }
        ]

        for lesson in python_lessons:
            db_lesson = models.Lesson(
                course_id=python_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        # Create Exam for Python
        python_exam = models.Exam(course_id=python_course.id, title="Python Basics Final Exam", duration_minutes=20)
        db.add(python_exam)
        db.flush()

        python_questions = [
            {
                "question_text": "Which of the following functions outputs text to the screen in Python?",
                "options": ["std::cout", "print()", "console.log()", "System.out.println()"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What is the value of result after this loop completes?",
                "options": ["10", "15", "6", "9"],
                "correct_option_index": 2,
                "code_snippet": "result = 0\nfor i in range(4):\n    result += i"
            },
            {
                "question_text": "Which collection type in Python is written with curly brackets and stores key:value pairs?",
                "options": ["List", "Tuple", "Set", "Dictionary"],
                "correct_option_index": 3,
                "code_snippet": None
            },
            {
                "question_text": "How do you define a function in Python?",
                "options": ["function myFunc():", "def myFunc():", "void myFunc():", "create myFunc():"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What does a double asterisk (**) operator stand for in Python?",
                "options": ["Multiplication", "Division remainder", "Exponentiation / Power", "Comment"],
                "correct_option_index": 2,
                "code_snippet": "x = 2 ** 3"
            }
        ]

        for q in python_questions:
            db_q = models.Question(
                exam_id=python_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)


        # =====================================================================
        # 2. C++ BASICS COURSE
        # =====================================================================
        cpp_course = models.Course(
            title="C++ Basics",
            description="Explore the foundational concepts of C++, a powerful, high-performance programming language used extensively in systems programming, game development, and high-performance applications.",
            skills="C++,Compilation,Pointers,Memory,Control Flow,Arrays",
            duration="12 hours",
            difficulty="Medium",
            theme_style="cyberpunk"
        )
        db.add(cpp_course)
        db.flush()

        cpp_lessons = [
            {
                "title": "Introduction to C++",
                "sequence_order": 1,
                "content": """# Introduction to C++

C++ is a cross-platform language that can be used to create high-performance applications. It was developed by Bjarne Stroustrup at Bell Labs in 1979, as an extension to the C language.

### Compilation
Unlike Python, which is interpreted line-by-line, C++ is a **compiled** language. This means that your source code is translated by a compiler into machine code (binary) that your CPU can execute directly. This makes C++ extremely fast!

### Your First C++ Code
Every C++ program has a main entrance point: the `main()` function.
```cpp
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}
```
- `#include <iostream>`: imports the input-output stream library.
- `std::cout`: stands for "character output", print to screen.
- `;`: Semicolons are mandatory at the end of statements in C++!""",
                "code_template": "#include <iostream>\n\nint main() {\n    // Complete the code to print 'Hello World!'\n    std::cout << \"____\";\n    return 0;\n}",
                "solution": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World!\";\n    return 0;\n}",
                "test_cases": [{"input": "", "output": "Hello World!"}],
                "practice_questions": [
                    {
                        "question": "Who created C++?",
                        "options": ["Dennis Ritchie", "Bjarne Stroustrup", "Linus Torvalds", "Steve Jobs"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Variables & Static Typing",
                "sequence_order": 2,
                "content": """# Variables & Static Typing

In C++, every variable must have a declared type. This is called **static typing**. Once a variable is declared with a type, it cannot hold data of any other type.

### Standard Types:
- `int`: stores integers (whole numbers), e.g., `45`
- `double`: stores floating point numbers, e.g., `19.99`
- `char`: stores single characters, e.g., `'a'`
- `string`: stores text, e.g., `"Hello"` (requires `#include <string>`)
- `bool`: stores booleans (`true` or `false`)

### Syntax:
```cpp
int age = 16;
double height = 1.75;
bool likesCoding = true;
```""",
                "code_template": "#include <iostream>\n\nint main() {\n    // Declare an integer variable 'score' and set it to 100\n    int score = ___;\n    std::cout << score;\n    return 0;\n}",
                "solution": "#include <iostream>\n\nint main() {\n    int score = 100;\n    std::cout << score;\n    return 0;\n}",
                "test_cases": [{"input": "", "output": "100"}],
                "practice_questions": [
                    {
                        "question": "Which of these is a correct variable declaration in C++?",
                        "options": ["val x = 10;", "int x = 10;", "x = 10;", "declare int x = 10;"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Input & Output",
                "sequence_order": 3,
                "content": """# Input & Output in C++

In C++, output is handled by `std::cout` (using the insertion operator `<<`), and input is handled by `std::cin` (using the extraction operator `>>`).

### Example:
```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter name: ";
    std::cin >> name; // Reads word from console
    std::cout << "Hello " << name << "!";
    return 0;
}
```""",
                "code_template": "#include <iostream>\n\nint main() {\n    int x;\n    // Read input into x, then print double of x\n    std::cin >> x;\n    std::cout << x * ___;\n    return 0;\n}",
                "solution": "#include <iostream>\n\nint main() {\n    int x;\n    std::cin >> x;\n    std::cout << x * 2;\n    return 0;\n}",
                "test_cases": [{"input": "5\n", "output": "10"}],
                "practice_questions": [
                    {
                        "question": "Which operator is used with std::cin?",
                        "options": ["<<", ">>", "::", "->"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Pointers Basics",
                "sequence_order": 4,
                "content": """# Pointers Basics in C++

Pointers are one of the most powerful and unique features of C++. A **pointer** is a variable that stores the memory address of another variable.

### Syntax:
- `&` operator: returns the memory address of a variable (address-of operator).
- `*` operator: declares a pointer, or **dereferences** a pointer (gets the value at that address).

```cpp
int var = 20;
int* ptr = &var; // ptr stores the address of var

std::cout << ptr;  # Prints address (e.g. 0x7ffd58)
std::cout << *ptr; # Prints value: 20
```""",
                "code_template": "#include <iostream>\n\nint main() {\n    int num = 42;\n    // Create a pointer to num\n    int* p = ____;\n    std::cout << *p;\n    return 0;\n}",
                "solution": "#include <iostream>\n\nint main() {\n    int num = 42;\n    int* p = &num;\n    std::cout << *p;\n    return 0;\n}",
                "test_cases": [{"input": "", "output": "42"}],
                "practice_questions": [
                    {
                        "question": "What is stored in a pointer variable?",
                        "options": ["A duplicate value", "A reference to a function", "A memory address", "A boolean flag"],
                        "answer": 2
                    }
                ]
            }
        ]

        for lesson in cpp_lessons:
            db_lesson = models.Lesson(
                course_id=cpp_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        # Create Exam for C++
        cpp_exam = models.Exam(course_id=cpp_course.id, title="C++ Basics Final Exam", duration_minutes=25)
        db.add(cpp_exam)
        db.flush()

        cpp_questions = [
            {
                "question_text": "What character is used to terminate statements in C++?",
                "options": [". (Dot)", ", (Comma)", "; (Semicolon)", ": (Colon)"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "Which of the following retrieves the memory address of variable 'x'?",
                "options": ["*x", "&x", "address(x)", "ptr(x)"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What does a pointer dereference using the * operator do?",
                "options": ["Deletes the pointer", "Finds the size of the variable", "Accesses the value at the address the pointer points to", "Multiplies the address"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "Which library must be included to write text output using std::cout?",
                "options": ["<string>", "<vector>", "<iostream>", "<cmath>"],
                "correct_option_index": 2,
                "code_snippet": None
            }
        ]

        for q in cpp_questions:
            db_q = models.Question(
                exam_id=cpp_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)


        # =====================================================================
        # 3. WEB DEVELOPMENT FUNDAMENTALS COURSE
        # =====================================================================
        web_course = models.Course(
            title="Web Development Fundamentals",
            description="Discover how the internet works by building websites using HTML5, CSS3 layout engines like Flexbox and Grid, and interactive JavaScript scripts that control web browsers in real-time.",
            skills="HTML5,CSS3,Flexbox,Grid Layout,Responsive UI,JavaScript,DOM Events",
            duration="15 hours",
            difficulty="Beginner",
            theme_style="creative"
        )
        db.add(web_course)
        db.flush()

        web_lessons = [
            {
                "title": "HTML Basics & Structure",
                "sequence_order": 1,
                "content": """# HTML Basics & Structure

HTML stands for **HyperText Markup Language**. It is the standard markup language for creating Web pages. It defines the structure of a web page using elements (tags).

### Typical HTML Document Structure:
```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>Welcome to EduVerse</h1>
    <p>This is a paragraph.</p>
</body>
</html>
```

### Essential Tags:
- `<html>`: The root element of an HTML page.
- `<head>`: Contains meta-information (like page title).
- `<body>`: Contains visible page content.
- `<h1>` to `<h6>`: Headings (1 is biggest, 6 is smallest).
- `<p>`: Paragraph.
- `<a>`: Link (uses `href` attribute).""",
                "code_template": "<!-- Complete the code to make an h1 heading -->\n<___>Hello, Web World!</___>",
                "solution": "<h1>Hello, Web World!</h1>",
                "test_cases": [{"input": "", "output": "<h1>Hello, Web World!</h1>"}],
                "practice_questions": [
                    {
                        "question": "What does HTML stand for?",
                        "options": ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "HyperText Markup Language", "HyperTech Main Language"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "CSS Layout: Flexbox",
                "sequence_order": 2,
                "content": """# CSS Layout: Flexbox

CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen.

**Flexbox** (Flexible Box Layout) is a 1-dimensional layout model that makes it easy to align items in a row or column, and distribute space dynamically.

### Core Properties:
- `display: flex;`: Turns a container into a flex container.
- `flex-direction: row | column;`: Sets direction of items.
- `justify-content`: Aligns items horizontally (e.g. `center`, `space-between`).
- `align-items`: Aligns items vertically (e.g. `center`, `stretch`).

```css
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```""",
                "code_template": "/* Set display to flex to align items horizontally */\n.nav-bar {\n    ____: flex;\n    justify-content: center;\n}",
                "solution": ".nav-bar {\n    display: flex;\n    justify-content: center;\n}",
                "test_cases": [{"input": "", "output": ".nav-bar {\n    display: flex;\n    justify-content: center;\n}"}],
                "practice_questions": [
                    {
                        "question": "Flexbox is designed for layouts of how many dimensions?",
                        "options": ["1 Dimension", "2 Dimensions", "3 Dimensions", "No Dimensions"],
                        "answer": 0
                    }
                ]
            },
            {
                "title": "JavaScript & DOM Manipulation",
                "sequence_order": 3,
                "content": """# JavaScript & DOM Manipulation

JavaScript is the programming language of the Web. It is used to make web pages interactive.

The **DOM** (Document Object Model) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.

### Selecting & Editing Elements:
```javascript
// Select element with ID 'title'
const heading = document.getElementById("title");

// Change text
heading.textContent = "New Heading Text!";

// Change style
heading.style.color = "blue";
```

### Event Listeners:
```javascript
const button = document.querySelector("button");
button.addEventListener("click", () => {
    alert("Button clicked!");
});
```""",
                "code_template": "// Select button and add event listener for click\nconst btn = document.querySelector('button');\nbtn.addEventListener('____', () => {\n    console.log('Clicked!');\n});",
                "solution": "btn.addEventListener('click', () => {\n    console.log('Clicked!');\n});",
                "test_cases": [{"input": "", "output": "btn.addEventListener('click', () => {\n    console.log('Clicked!');\n});"}],
                "practice_questions": [
                    {
                        "question": "Which method is used to select an element by its ID in JavaScript?",
                        "options": ["document.selectId()", "document.getElementById()", "document.queryID()", "document.find()"],
                        "answer": 1
                    }
                ]
            }
        ]

        for lesson in web_lessons:
            db_lesson = models.Lesson(
                course_id=web_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        # Create Exam for Web
        web_exam = models.Exam(course_id=web_course.id, title="Web Development Fundamentals Final Exam", duration_minutes=30)
        db.add(web_exam)
        db.flush()

        web_questions = [
            {
                "question_text": "Which HTML tag is used to display a paragraph?",
                "options": ["<h1 >", "<a>", "<p>", "<br>"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "Which CSS property makes a container behave like a 1-dimensional flex container?",
                "options": ["display: grid;", "display: block;", "display: flex;", "float: left;"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "How do you listen to a click event on a button element 'btn' in JavaScript?",
                "options": ["btn.onclick = listener;", "btn.addEventListener('click', listener);", "btn.listen('click', listener);", "Both A and B"],
                "correct_option_index": 3,
                "code_snippet": None
            }
        ]

        for q in web_questions:
            db_q = models.Question(
                exam_id=web_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 4. MEDIUM PYTHON COURSE
        # =====================================================================
        medium_python = models.Course(
            title="Medium Python",
            description="Take your Python skills to the next level. Learn file handling, exception handling, JSON serialization, and using native and external libraries.",
            skills="File handling,Exception Handling,JSON,Modules,Libraries",
            duration="12 hours",
            difficulty="Medium",
            theme_style="cosmic"
        )
        db.add(medium_python)
        db.flush()

        medium_lessons = [
            {
                "title": "File Manipulation in Python",
                "sequence_order": 1,
                "content": """# File Manipulation in Python

Reading and writing files is a fundamental skill. Python makes it very easy to work with files using the built-in `open()` function.

### Writing to a File:
We use the `"w"` parameter to open a file for writing. This will overwrite any existing file!
```python
f = open("data.txt", "w")
f.write("Hello, EduVerse!")
f.close()
```

### Reading from a File:
We use the `"r"` parameter to read content:
```python
f = open("data.txt", "r")
content = f.read()
print(content)
f.close()
```""",
                "code_template": "# Write 'Python' to a file named 'output.txt' and close it\nf = open(\"output.txt\", \"w\")\nf.write(\"____\")\nf.close()",
                "solution": "f = open(\"output.txt\", \"w\")\nf.write(\"Python\")\nf.close()",
                "test_cases": [{"input": "", "output": ""}],
                "practice_questions": [
                    {
                        "question": "Which mode is used to open a file for reading in Python?",
                        "options": ["'w'", "'r'", "'a'", "'x'"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Exception Handling (Try/Except)",
                "sequence_order": 2,
                "content": """# Exception Handling (Try/Except)

When an error occurs, Python will normally stop and generate an error message. We call this raising an exception.
We can handle exceptions gracefully using `try` and `except` blocks!

### Example:
```python
try:
    print(x)  # x is not defined!
except NameError:
    print("Variable x is not defined")
except:
    print("Something else went wrong")
```""",
                "code_template": "# Handle a division by zero error using try and except\ntry:\n    result = 10 / 0\nexcept ____:\n    print(\"Error\")",
                "solution": "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Error\")",
                "test_cases": [{"input": "", "output": "Error\n"}],
                "practice_questions": [
                    {
                        "question": "Which block is used to catch and handle exceptions in Python?",
                        "options": ["catch", "except", "error", "throw"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Modules and Packages",
                "sequence_order": 3,
                "content": """# Modules and Packages

In Python, a module is a file containing Python code (functions, classes, variables) that you can include in your project. You use modules to break down large programs into smaller, manageable files.

### Standard Library Modules:
Python comes with a rich set of built-in modules that you can import using the `import` keyword.
```python
import math
print(math.sqrt(64))  # Output: 8.0
```

### Importing Specific Items:
You can choose to import only parts of a module using `from ... import`:
```python
from datetime import datetime
print(datetime.now())
```""",
                "code_template": "# Import the math module and print the square root of 16 using math.sqrt\nimport ____\nprint(math.sqrt(16))",
                "solution": "import math\nprint(math.sqrt(16))",
                "test_cases": [{"input": "", "output": "4.0\n"}],
                "practice_questions": [
                    {
                        "question": "Which keyword is used to import a module in Python?",
                        "options": ["include", "require", "import", "using"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "JSON Serialization",
                "sequence_order": 4,
                "content": """# JSON Serialization

JSON (JavaScript Object Notation) is a popular, lightweight data format used for storing and exchanging data, especially between a web server and client applications.

Python has a built-in package called `json` to work with JSON data.

### Converting Dictionary to JSON String (dumps):
```python
import json
person = {"name": "Beshoy", "age": 20}
json_string = json.dumps(person)
print(json_string)  # Output: '{"name": "Beshoy", "age": 20}'
```

### Converting JSON String to Dictionary (loads):
```python
import json
json_string = '{"name": "Beshoy", "age": 20}'
person_dict = json.loads(json_string)
print(person_dict["name"])  # Output: Beshoy
```""",
                "code_template": "# Import json, then convert the data dict into a JSON string using json.dumps\nimport ____\ndata = {\"name\": \"Alice\", \"age\": 30}\njson_str = json.____(data)\nprint(type(json_str))",
                "solution": "import json\ndata = {\"name\": \"Alice\", \"age\": 30}\njson_str = json.dumps(data)\nprint(type(json_str))",
                "test_cases": [{"input": "", "output": "<class 'str'>\n"}],
                "practice_questions": [
                    {
                        "question": "Which function converts a Python dictionary into a JSON string?",
                        "options": ["json.loads()", "json.dumps()", "json.parse()", "json.stringify()"],
                        "answer": 1
                    }
                ]
            }
        ]

        for lesson in medium_lessons:
            db_lesson = models.Lesson(
                course_id=medium_python.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        # Create Exam for Medium Python
        med_exam = models.Exam(course_id=medium_python.id, title="Medium Python Final Exam", duration_minutes=25)
        db.add(med_exam)
        db.flush()

        med_questions = [
            {
                "question_text": "What does opening a file with 'a' mode stand for in Python?",
                "options": ["Append", "Access", "Archive", "Add"],
                "correct_option_index": 0,
                "code_snippet": None
            },
            {
                "question_text": "Which exception is raised when dividing a number by zero?",
                "options": ["ArithmeticError", "ZeroDivisionError", "ValueError", "DivideError"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which module in Python is used to read and write JSON data?",
                "options": ["json", "math", "os", "random"],
                "correct_option_index": 0,
                "code_snippet": None
            },
            {
                "question_text": "How do you import only the 'sqrt' function from the 'math' module?",
                "options": ["import math.sqrt", "from math import sqrt", "import sqrt from math", "load math(sqrt)"],
                "correct_option_index": 1,
                "code_snippet": None
            }
        ]
        for q in med_questions:
            db_q = models.Question(
                exam_id=med_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 5. PRO PYTHON COURSE
        # =====================================================================
        pro_python = models.Course(
            title="Pro Python",
            description="Master Object-Oriented Programming (OOP) in Python. Understand Classes, Objects, Inheritance, Polymorphism, and encapsulation like a professional developer.",
            skills="OOP,Classes,Objects,Inheritance,Methods,Polymorphism",
            duration="15 hours",
            difficulty="Medium",
            theme_style="cosmic"
        )
        db.add(pro_python)
        db.flush()

        pro_lessons = [
            {
                "title": "Classes and Objects",
                "sequence_order": 1,
                "content": """# Classes and Objects in Python

Python is an object-oriented programming language. Almost everything in Python is an object, with its properties and methods.
A **Class** is like an object constructor, or a "blueprint" for creating objects.

### Creating a Class:
```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Creating an Object
s1 = Student("Beshoy", 20)
print(s1.name)
```""",
                "code_template": "# Create a class named Car with a brand property in __init__\nclass Car:\n    def __init__(self, brand):\n        self.brand = ____\n\nc1 = Car(\"Tesla\")\nprint(c1.brand)",
                "solution": "class Car:\n    def __init__(self, brand):\n        self.brand = brand\n\nc1 = Car(\"Tesla\")\nprint(c1.brand)",
                "test_cases": [{"input": "", "output": "Tesla\n"}],
                "practice_questions": [
                    {
                        "question": "Which method is the constructor in a Python class?",
                        "options": ["__init__", "__main__", "new", "class"],
                        "answer": 0
                    }
                ]
            },
            {
                "title": "Methods & Self",
                "sequence_order": 2,
                "content": """# Methods & Self in Python

Methods are functions defined inside the body of a class. They are used to define the behaviors of an object.

The `self` parameter is a reference to the current instance of the class, and is used to access variables that belong to the class. It does not have to be named `self`, but it is a strong Python convention.

### Adding Methods:
```python
class Dog:
    def __init__(self, name):
        self.name = name
        
    def bark(self):
        return self.name + " says Woof!"

my_dog = Dog("Rex")
print(my_dog.bark())  # Output: Rex says Woof!
```""",
                "code_template": "# Add a method greet() to the Person class that prints 'Hello ' + name\nclass Person:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        print(\"Hello \" + self.____)\n\np1 = Person(\"Alice\")\np1.greet()",
                "solution": "class Person:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        print(\"Hello \" + self.name)\n\np1 = Person(\"Alice\")\np1.greet()",
                "test_cases": [{"input": "", "output": "Hello Alice\n"}],
                "practice_questions": [
                    {
                        "question": "What does the first parameter of a class method represent by convention?",
                        "options": ["The class itself", "The parent class", "The object instance (self)", "The global state"],
                        "answer": 2
                    }
                ]
            },
            {
                "title": "Inheritance and Polymorphism",
                "sequence_order": 3,
                "content": """# Inheritance and Polymorphism

Inheritance allows us to define a class that inherits all the methods and properties from another class.
- **Parent Class** (Base class) is the class being inherited from.
- **Child Class** (Derived class) is the class that inherits from another class.

### Overriding and super():
A child class can override methods from the parent class to implement custom behaviors (Polymorphism).
```python
class Animal:
    def speak(self):
        print("Animal sound")

class Cat(Animal):
    def speak(self):
        print("Meow")
```""",
                "code_template": "# Make ElectricCar inherit from Car, overriding drive() to print 'Electric drive'\nclass Car:\n    def drive(self):\n        print(\"Engine vroom\")\nclass ElectricCar(Car):\n    def ____(self):\n        print(\"Electric drive\")\n\nec = ElectricCar()\nec.drive()",
                "solution": "class Car:\n    def drive(self):\n        print(\"Engine vroom\")\nclass ElectricCar(Car):\n    def drive(self):\n        print(\"Electric drive\")\n\nec = ElectricCar()\nec.drive()",
                "test_cases": [{"input": "", "output": "Electric drive\n"}],
                "practice_questions": [
                    {
                        "question": "Which built-in function is used to call a method from the parent class?",
                        "options": ["parent()", "super()", "base()", "ancestor()"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Encapsulation & Private Members",
                "sequence_order": 4,
                "content": """# Encapsulation & Private Members

Encapsulation restricts direct access to some of an object's components. This is crucial for data security and integrity.

In Python, we denote private variables or methods by prefixing their names with double underscores, e.g., `__balance`.

### Example:
```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.__balance = balance  # Private variable
        
    def get_balance(self):
        return self.__balance  # Getter
```""",
                "code_template": "# Declare a private variable __balance inside BankAccount\nclass BankAccount:\n    def __init__(self, balance):\n        self.____balance = balance\n    def get_balance(self):\n        return self.____balance\n\naccount = BankAccount(1000)\nprint(account.get_balance())",
                "solution": "class BankAccount:\n    def __init__(self, balance):\n        self.__balance = balance\n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount(1000)\nprint(account.get_balance())",
                "test_cases": [{"input": "", "output": "1000\n"}],
                "practice_questions": [
                    {
                        "question": "How do you declare a private variable inside a Python class?",
                        "options": ["private balance = 100", "self.private_balance = 100", "self.__balance = 100", "self.balance_private = 100"],
                        "answer": 2
                    }
                ]
            }
        ]

        for lesson in pro_lessons:
            db_lesson = models.Lesson(
                course_id=pro_python.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        pro_exam = models.Exam(course_id=pro_python.id, title="Pro Python Final Exam", duration_minutes=25)
        db.add(pro_exam)
        db.flush()

        pro_questions = [
            {
                "question_text": "What does 'self' represent inside a Python class method?",
                "options": ["The parent class", "The constructor function", "The current instance of the class", "The global scope"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "How does a class inherit from another class in Python?",
                "options": ["class SubClass inherits ParentClass:", "class SubClass(ParentClass):", "class SubClass extends ParentClass:", "class SubClass: ParentClass"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which keyword is used to create a class in Python?",
                "options": ["object", "struct", "class", "prototype"],
                "correct_option_index": 2,
                "code_snippet": None
            }
        ]
        for q in pro_questions:
            db_q = models.Question(
                exam_id=pro_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 6. ADVANCED PYTHON COURSE
        # =====================================================================
        advanced_python = models.Course(
            title="Advanced Python",
            description="Deep dive into Python's advanced mechanics: Decorators, Generators, Iterators, Context Managers, and Multithreading.",
            skills="Generators,Decorators,Context Managers,Concurrency,Multithreading",
            duration="18 hours",
            difficulty="Hard",
            theme_style="cosmic"
        )
        db.add(advanced_python)
        db.flush()

        adv_lessons = [
            {
                "title": "Decorators in Python",
                "sequence_order": 1,
                "content": """# Decorators in Python

Decorators are a very powerful tool in Python. They allow programmers to modify or extend the behavior of a function or class without permanently modifying it.

### Example:
```python
def my_decorator(func):
    def wrapper():
        print("Before function.")
        func()
        print("After function.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
```""",
                "code_template": "# Complete the decorator syntax for the function greet\ndef upper_dec(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@____\ndef greet():\n    return \"hello\"\n\nprint(greet())",
                "solution": "def upper_dec(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@upper_dec\ndef greet():\n    return \"hello\"\n\nprint(greet())",
                "test_cases": [{"input": "", "output": "HELLO\n"}],
                "practice_questions": [
                    {
                        "question": "What symbol is used to apply a decorator to a function in Python?",
                        "options": ["#", "@", "$", "&"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Generators & Yield",
                "sequence_order": 2,
                "content": """# Generators & Yield in Python

Generator functions allow you to declare a function that behaves like an iterator, i.e. it can be used in a `for` loop.

Generators use the `yield` statement instead of `return`. When Python encounters `yield`, it pauses function execution and saves its state, returning the value to the caller. When called again, it resumes exactly where it left off!

### Example:
```python
def simple_generator():
    yield 1
    yield 2
    yield 3

for val in simple_generator():
    print(val)
```""",
                "code_template": "# Complete the count_up generator function that yields numbers up to n\ndef count_up(n):\n    i = 1\n    while i <= n:\n        ____ i\n        i += 1\n\nfor val in count_up(3):\n    print(val)",
                "solution": "def count_up(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nfor val in count_up(3):\n    print(val)",
                "test_cases": [{"input": "", "output": "1\n2\n3\n"}],
                "practice_questions": [
                    {
                        "question": "What is the key difference between a generator function and a standard function?",
                        "options": ["Generators return all items in a list", "Generators use yield to produce values one by one and remember their state", "Generators can only run once ever", "Generators do not take arguments"],
                        "answer": 1
                    }
                ]
            },
            {
                "title": "Concurrency & Multithreading",
                "sequence_order": 3,
                "content": """# Concurrency & Multithreading

Multithreading allows a program to run multiple threads concurrently, sharing the same memory space. This is highly useful for I/O-bound tasks (like fetching data from URLs or database operations).

In Python, we use the built-in `threading` module to create threads.

### Example:
```python
import threading
import time

def print_numbers():
    for i in range(3):
        time.sleep(0.5)
        print(i)

thread = threading.Thread(target=print_numbers)
thread.start()  # Start the thread execution
thread.join()   # Wait for the thread to finish
```""",
                "code_template": "# Complete the creation of a Thread targetting work function\nimport threading\ndef work():\n    print(\"Working\")\n\nt = threading.Thread(target=____)\nt.start()\nt.join()",
                "solution": "import threading\ndef work():\n    print(\"Working\")\n\nt = threading.Thread(target=work)\nt.start()\nt.join()",
                "test_cases": [{"input": "", "output": "Working\n"}],
                "practice_questions": [
                    {
                        "question": "What is the role of the GIL (Global Interpreter Lock) in CPython?",
                        "options": ["Speeds up network requests", "Prevents multiple native threads from executing Python bytecodes at once", "Allows easy multithreading across multiple CPU cores", "Secures variable memory from hackers"],
                        "answer": 1
                    }
                ]
            }
        ]

        for lesson in adv_lessons:
            db_lesson = models.Lesson(
                course_id=advanced_python.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            )
            db.add(db_lesson)

        adv_exam = models.Exam(course_id=advanced_python.id, title="Advanced Python Final Exam", duration_minutes=30)
        db.add(adv_exam)
        db.flush()

        adv_questions = [
            {
                "question_text": "Which keyword is used to create a Generator function in Python?",
                "options": ["return", "generate", "yield", "next"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "How do you wait for a thread 't' to finish executing in Python?",
                "options": ["t.wait()", "t.join()", "t.stop()", "t.pause()"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which library is built-in for launching threads in Python?",
                "options": ["multiprocessing", "threading", "concurrency", "asyncio"],
                "correct_option_index": 1,
                "code_snippet": None
            }
        ]
        for q in adv_questions:
            db_q = models.Question(
                exam_id=adv_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 7. ADD JAVA BASICS COURSE (VOLCANO THEME)
        # =====================================================================
        java_course = models.Course(
            title="Java Basics",
            description="Discover the power of Java, a robust, class-based object-oriented programming language. Learn the Java Virtual Machine (JVM), compile safety, classes, and structures designed for massive scalability.",
            skills="Java,JVM,Class-Path,Interfaces,Static Arrays,Object Models",
            duration="14 hours",
            difficulty="Medium",
            theme_style="volcano"
        )
        db.add(java_course)
        db.flush()

        java_lessons = [
            {
                "title": "Introduction to Java & JVM",
                "sequence_order": 1,
                "content": "# Introduction to Java & JVM\nJava is a class-based, object-oriented language designed to have as few implementation dependencies as possible. The key is 'Write Once, Run Anywhere' (WORA) thanks to the JVM!",
                "code_template": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"____\");\n    }\n}",
                "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java!\");\n    }\n}",
                "test_cases": [{"input": "", "output": "Hello Java!\n"}],
                "practice_questions": [{"question": "What compiles Java code into bytecodes?", "options": ["JVM", "JDK Compiler (javac)", "JRE", "CPU"], "answer": 1}]
            }
        ]
        for lesson in java_lessons:
            db.add(models.Lesson(
                course_id=java_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            ))

        # Create Exam for Java
        java_exam = models.Exam(course_id=java_course.id, title="Java Basics Final Exam", duration_minutes=20)
        db.add(java_exam)
        db.flush()

        java_questions = [
            {
                "question_text": "Which component of the Java platform is responsible for running the compiled bytecode?",
                "options": ["JDK", "JVM (Java Virtual Machine)", "Javac Compiler", "Garbage Collector"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which of these is the correct main method signature in Java?",
                "options": ["public void main(String args[])", "public static void main(String[] args)", "static public void main(args)", "void public static main(String[] args)"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What keyword is used to create a subclass or inherit a class in Java?",
                "options": ["implements", "inherits", "extends", "super"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "Does Java support multiple inheritance of classes?",
                "options": ["Yes, using the extends keyword with comma", "No, a class can only extend one superclass", "Yes, but only for abstract classes", "Only when running on Windows"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which class is the superclass of all classes in Java?",
                "options": ["String", "Object", "System", "Class"],
                "correct_option_index": 1,
                "code_snippet": None
            }
        ]

        for q in java_questions:
            db_q = models.Question(
                exam_id=java_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 8. ADD JAVASCRIPT MAGIC COURSE (ELECTRIC THEME)
        # =====================================================================
        js_course = models.Course(
            title="JavaScript Magic",
            description="Power up static website layouts with the energy of JavaScript! Master async/await functions, promise structures, dynamic DOM operations, and beautiful UI events.",
            skills="JavaScript,ES6,Promises,Callbacks,Fetch API,Async Eventing",
            duration="11 hours",
            difficulty="Beginner",
            theme_style="electric"
        )
        db.add(js_course)
        db.flush()

        js_lessons = [
            {
                "title": "DOM Event Listeners",
                "sequence_order": 1,
                "content": "# DOM Event Listeners\nJavaScript makes web pages alive! We listen to events (like a button click) to execute dynamic interactions.",
                "code_template": "const btn = document.querySelector('button');\nbtn.addEventListener('____', () => {\n    console.log('Fired!');\n});",
                "solution": "btn.addEventListener('click', () => {\n    console.log('Fired!');\n});",
                "test_cases": [{"input": "", "output": ""}],
                "practice_questions": [{"question": "Which method selects an element?", "options": ["querySelector", "select", "find", "grab"], "answer": 0}]
            }
        ]
        for lesson in js_lessons:
            db.add(models.Lesson(
                course_id=js_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            ))

        # Create Exam for JS
        js_exam = models.Exam(course_id=js_course.id, title="JavaScript Magic Final Exam", duration_minutes=20)
        db.add(js_exam)
        db.flush()

        js_questions = [
            {
                "question_text": "How do you declare a block-scoped variable that cannot be reassigned in JavaScript?",
                "options": ["var", "let", "const", "fixed"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "What does the '===' operator check in JavaScript?",
                "options": ["Checks value equality only", "Checks both value and type equality", "Assigns a value", "Checks memory address reference"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What is the output of 'typeof null' in JavaScript?",
                "options": ["'null'", "'undefined'", "'object'", "'number'"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "Which array method is used to add an element at the end of an array?",
                "options": ["push()", "pop()", "shift()", "unshift()"],
                "correct_option_index": 0,
                "code_snippet": None
            },
            {
                "question_text": "How do you write an arrow function that returns the sum of a and b?",
                "options": ["(a, b) => { sum(a, b) }", "(a, b) => a + b", "function(a, b) => a + b", "(a, b) -> a + b"],
                "correct_option_index": 1,
                "code_snippet": None
            }
        ]

        for q in js_questions:
            db_q = models.Question(
                exam_id=js_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 9. ADD FUTURISTIC AI LABORATORY (LABORATORY THEME)
        # =====================================================================
        ai_lab_course = models.Course(
            title="Futuristic AI Laboratory",
            description="Step inside the AI laboratory. Explore the mathematics and architecture of neural layers, weights, backpropagation, generative models, and transformers.",
            skills="Machine Learning,Deep Learning,Neurons,Weights,NLP,Transformers",
            duration="16 hours",
            difficulty="Hard",
            theme_style="laboratory"
        )
        db.add(ai_lab_course)
        db.flush()

        ai_lessons = [
            {
                "title": "Neurons and Activation Functions",
                "sequence_order": 1,
                "content": "# Neurons and Activation Functions\nIn artificial networks, a neuron computes a weighted sum of inputs and applies a non-linear activation (like ReLU or Sigmoid) to decide output signals.",
                "code_template": "def relu(x):\n    return max(0, ____)",
                "solution": "def relu(x):\n    return max(0, x)",
                "test_cases": [{"input": "", "output": ""}],
                "practice_questions": [{"question": "What does ReLU stand for?", "options": ["Rectified Linear Unit", "Random Linear Unit", "Ratio Energy Logic", "Recurrent Layer Unit"], "answer": 0}]
            }
        ]
        for lesson in ai_lessons:
            db.add(models.Lesson(
                course_id=ai_lab_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            ))

        # Create Exam for AI Lab
        ai_exam = models.Exam(course_id=ai_lab_course.id, title="Futuristic AI Laboratory Final Exam", duration_minutes=20)
        db.add(ai_exam)
        db.flush()

        ai_questions = [
            {
                "question_text": "Which activation function scales its output values between the range [0, 1]?",
                "options": ["ReLU", "Sigmoid", "Tanh", "Softmax"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What is the core purpose of backpropagation in deep neural networks?",
                "options": ["To forward-propagate inputs to outputs", "To compute gradients of the loss function and update model weights", "To calculate test accuracy", "To initialize weights randomly"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What does a Rectified Linear Unit (ReLU) function do to negative inputs?",
                "options": ["Multiplies them by -1", "Clogs them to 0", "Returns their absolute value", "Scales them between -1 and 1"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which layer type is typically used in CNNs to reduce spatial dimensions (downsample)?",
                "options": ["Dense layer", "Pooling layer (e.g. Max Pooling)", "Dropout layer", "Convolutional layer"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What is the fundamental attention block introduced in the Transformer architecture?",
                "options": ["Recurrent Attention", "Convolutional Attention", "Self-Attention (Multi-Head)", "Sigmoid Attention"],
                "correct_option_index": 2,
                "code_snippet": None
            }
        ]

        for q in ai_questions:
            db_q = models.Question(
                exam_id=ai_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # 10. ADD ETHICAL HACKING & SECURITY (CYBERPUNK THEME)
        # =====================================================================
        hacking_course = models.Course(
            title="Ethical Hacking & Security",
            description="Explore cyber battlefields in absolute safety. Learn system vulnerability indexing, network sniffing protocols, sql injection bypass blockades, and defensive firewalls.",
            skills="Penetration,SQLi,XSS,Network Sniffing,Defensive Firewalls",
            duration="18 hours",
            difficulty="Hard",
            theme_style="cyberpunk"
        )
        db.add(hacking_course)
        db.flush()

        hacking_lessons = [
            {
                "title": "Vulnerability Mapping",
                "sequence_order": 1,
                "content": "# Vulnerability Mapping\nEthical hacking begins with intelligence mapping. We scan network ports to catalog open entryways.",
                "code_template": "# Scan port 80 simulation\nport = 80\nif port == ____:\n    print(\"HTTP Open\")",
                "solution": "port = 80\nif port == 80:\n    print(\"HTTP Open\")",
                "test_cases": [{"input": "", "output": "HTTP Open\n"}],
                "practice_questions": [{"question": "What protocol works over port 80 by default?", "options": ["SSH", "HTTPS", "HTTP", "FTP"], "answer": 2}]
            }
        ]
        for lesson in hacking_lessons:
            db.add(models.Lesson(
                course_id=hacking_course.id,
                title=lesson["title"],
                sequence_order=lesson["sequence_order"],
                content=lesson["content"],
                code_template=lesson["code_template"],
                solution=lesson["solution"],
                test_cases=lesson["test_cases"],
                practice_questions=lesson["practice_questions"]
            ))

        # Create Exam for Ethical Hacking
        hacking_exam = models.Exam(course_id=hacking_course.id, title="Ethical Hacking Final Exam", duration_minutes=20)
        db.add(hacking_exam)
        db.flush()

        hacking_questions = [
            {
                "question_text": "What port does the secure HTTPS protocol use by default?",
                "options": ["80", "22", "443", "8080"],
                "correct_option_index": 2,
                "code_snippet": None
            },
            {
                "question_text": "What does SQL Injection (SQLi) do?",
                "options": ["Injects malicious executable files into a server directory", "Injects malicious SQL queries into inputs to manipulate the database", "Floods a server with network traffic", "Intercepts browser traffic via proxy"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "What type of attack aims to exhaust system resources, making a service unavailable to legitimate users?",
                "options": ["DDoS (Distributed Denial of Service)", "Phishing", "Man-in-the-Middle", "SQL Injection"],
                "correct_option_index": 0,
                "code_snippet": None
            },
            {
                "question_text": "What does XSS stand for in cybersecurity?",
                "options": ["eXtensible Security Standard", "Cross-Site Scripting", "XML Script Security", "X-axis Port Scanning"],
                "correct_option_index": 1,
                "code_snippet": None
            },
            {
                "question_text": "Which cryptographic protocol is widely used to encrypt browser-to-server HTTP communications?",
                "options": ["FTP", "SMTP", "TLS / SSL", "DNSSEC"],
                "correct_option_index": 2,
                "code_snippet": None
            }
        ]

        for q in hacking_questions:
            db_q = models.Question(
                exam_id=hacking_exam.id,
                question_text=q["question_text"],
                options=q["options"],
                correct_option_index=q["correct_option_index"],
                code_snippet=q["code_snippet"]
            )
            db.add(db_q)

        # =====================================================================
        # SEED ELITE LEADERBOARD CODERS (COMPETITIVE ROSTER)
        # =====================================================================
        import auth as auth_utils
        mock_password = auth_utils.get_password_hash("eduverse_coder_123_456")
        
        elite_coders = [
            {
                "name": "Alan Turing",
                "email": "turing@eduverse.org",
                "xp": 55000,
                "level": 56,
                "rank": "EduVerse Champion",
                "certs": 18,
                "courses": 18,
                "ach": ["first_steps", "first_cert", "perfect_score", "polyglot_coder", "ai_specialist"]
            },
            {
                "name": "Ada Lovelace",
                "email": "ada@eduverse.org",
                "xp": 45000,
                "level": 46,
                "rank": "Grand Master",
                "certs": 15,
                "courses": 15,
                "ach": ["first_steps", "first_cert", "polyglot_coder", "web_master"]
            },
            {
                "name": "Grace Hopper",
                "email": "grace@eduverse.org",
                "xp": 38000,
                "level": 39,
                "rank": "Grand Master",
                "certs": 16,
                "courses": 16,
                "ach": ["first_steps", "first_cert", "polyglot_coder"]
            },
            {
                "name": "Linus Torvalds",
                "email": "linus@eduverse.org",
                "xp": 32000,
                "level": 33,
                "rank": "Legend",
                "certs": 12,
                "courses": 12,
                "ach": ["first_steps", "first_cert", "cpp_master", "polyglot_coder"]
            },
            {
                "name": "Guido van Rossum",
                "email": "guido@eduverse.org",
                "xp": 25000,
                "level": 26,
                "rank": "Master",
                "certs": 10,
                "courses": 10,
                "ach": ["first_steps", "first_cert", "python_master", "polyglot_coder"]
            },
            {
                "name": "Bjarne Stroustrup",
                "email": "bjarne@eduverse.org",
                "xp": 18500,
                "level": 19,
                "rank": "Master",
                "certs": 8,
                "courses": 8,
                "ach": ["first_steps", "first_cert", "cpp_master", "polyglot_coder"]
            }
        ]

        for coder in elite_coders:
            # Randomize some custom shop values for mock elite coders
            active_frame = "default"
            active_theme = "default"
            unlocked = ["item_streak_freeze"]
            if coder["name"] == "Alan Turing":
                active_frame = "frame_rainbow"
                active_theme = "theme_matrix"
                unlocked += ["frame_rainbow", "theme_matrix"]
            elif coder["name"] == "Ada Lovelace":
                active_frame = "frame_neon"
                active_theme = "theme_cyberpunk"
                unlocked += ["frame_neon", "theme_cyberpunk"]
            elif coder["name"] == "Grace Hopper":
                active_frame = "frame_gold"
                unlocked += ["frame_gold"]
            elif coder["name"] == "Linus Torvalds":
                active_theme = "theme_matrix"
                unlocked += ["theme_matrix"]

            db_coder = models.User(
                name=coder["name"],
                email=coder["email"],
                hashed_password=mock_password,
                is_admin=False,
                xp=coder["xp"],
                level=coder["level"],
                rank=coder["rank"],
                completed_courses_count=coder["courses"],
                certificates_count=coder["certs"],
                achievements=coder["ach"],
                streak_days=7,
                unlocked_items=unlocked,
                streak_freezes=1,
                active_frame=active_frame,
                active_theme=active_theme
            )
            db.add(db_coder)
            db.flush() # get user id for posting

            # Add a mock post for each coder
            lounge_messages = {
                "Alan Turing": "Finally built a simulation of the Enigma machine in JavaScript! 💻🔓 Let's see if we can optimize the search pathways.",
                "Ada Lovelace": "Who else thinks that variables are the most elegant concept? 🙋‍♀️✨ Writing loops in the new Java course is so satisfying!",
                "Grace Hopper": "Found a real moth in the relay today. The first actual case of a bug being debugged! 🐞🚫 Keep writing clean code, everyone!",
                "Linus Torvalds": "Talk is cheap. Show me the code. Just finished the Ethical Hacking course exam, the security firewalls lesson was decent. 🐧",
                "Guido van Rossum": "Spaces over tabs, always. No argument. 🐍 Working on some data structures in the advanced Python arena.",
                "Bjarne Stroustrup": "C++ is still the king of performance. ⚡ Glad to see C++ Basics course in the EduVerse arena. Let me know if you need any logic hints!"
            }

            if coder["name"] in lounge_messages:
                db_post = models.LoungePost(
                    user_id=db_coder.id,
                    username=db_coder.name,
                    avatar=db_coder.name.lower().replace(" ", "_"), # e.g. alan_turing
                    message=lounge_messages[coder["name"]],
                    likes=coder["level"] + 5,
                    liked_by=[]
                )
                db.add(db_post)

        db.commit()
        print("Database seeded successfully with shop details and lounge posts!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
