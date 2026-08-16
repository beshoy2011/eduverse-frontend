import os
from typing import List, Optional
from openai import OpenAI
import schemas
import urllib.request
import json
from dotenv import load_dotenv

# Load environment variables on startup
load_dotenv()

SYSTEM_PROMPT = """You are the EduVerse Personal Mentor, an expert AI tutor helping beginners learn programming from absolute zero.
Your target users are students, self-learners, and teenagers with no coding experience. Keep your language simple, clean, and engaging.

Your core mission is to:
1. Teach step-by-step. Break complex ideas into bite-sized analogies.
2. Explain concepts in a friendly, conversational tone.
3. Generate practical, real-world examples.
4. Give smart, progressive hints rather than giving away the answers immediately.
5. Create small check-for-understanding quizzes (e.g. multiple choice or line completion) if the user asks.
6. Support Markdown code blocks with syntax highlighting (e.g. ```python, ```cpp, ```html, ```css, ```javascript).
7. Adapt your explanations based on the student's questions.

When answering, reference the context of the lesson if provided. If they paste an error message, explain the error simply and show how to fix it."""

MOCK_ANSWERS = {
    "default": "Hello! I am your EduVerse AI Tutor. I'm here to help you master programming. Ask me any questions about the current lesson, request a hint, or ask for a mini quiz! (Note: Running in simulator mode. Configure `GEMINI_API_KEY` (Free) or `OPENAI_API_KEY` in backend environment for live AI responses).",
    "python": "In Python, variables are like named storage boxes. You can put values inside them using the `=` operator. For example: `x = 5`. Unlike some other languages, you don't need to specify what kind of data goes into the box; Python figures it out automatically! Do you want to write a script that stores your name?",
    "cpp": "In C++, every variable must have a declared type, and every statement must end with a semicolon (`;`). For example: `int age = 15;`. C++ is statically typed, meaning you can't put a string inside an `int` box. This prevents bugs early! What would you like to build in C++?",
    "html": "HTML (HyperText Markup Language) is the skeleton of a website. It uses tags like `<h1>` for headings, `<p>` for paragraphs, and `<a>` for links. Every opening tag usually has a closing tag, like `<h1>Hello World</h1>`. What website are you planning to build?"
}

SIMULATED_LESSON_DATA = {
    "Introduction to Python": {
        "analogy": "Writing a program is like writing a recipe. The computer is a very fast but literal chef. The `print()` function is the chef shouting 'Hello, World!' to the dining room.",
        "hint": "To write your first program, use the `print()` function with parentheses and quotes around your message, like this: `print(\"Hello, World!\")`.",
        "quiz": "Which of these prints a message in Python?\n1) `console.log('Hi')`\n2) `print('Hi')`\n3) `cout << 'Hi'`\n\n*Hint: The correct option is 2!*"
    },
    "Variables in Python": {
        "analogy": "Variables are like labeled storage boxes. You create a box by writing `box_name = value`. For example, `age = 25` creates a box named 'age' and stores the number 25 inside it.",
        "hint": "Make sure you use the assignment operator `=` to store the value in the variable. For example: `age = 25`.",
        "quiz": "What is the correct way to store the number 10 in a variable named `score`?\n1) `score = 10`\n2) `10 = score`\n3) `var score := 10`\n\n*Hint: Option 1 is correct!*"
    },
    "Data Types": {
        "analogy": "Data types are like sorting recycling. Plastic bottles go in one bin (Strings like `\"hello\"`), paper goes in another (Integers like `42`), and compost goes in a third (Floats like `3.14`). Booleans are like light switches—either `True` (ON) or `False` (OFF).",
        "hint": "Remember that a floating point number (float) has a decimal point (like `99.5`), while an integer (int) is a whole number (like `99`). Booleans must start with capital letters: `True` or `False`.",
        "quiz": "What type of data is `99.5` in Python?\n1) `int`\n2) `float`\n3) `str`\n\n*Hint: Option 2 is correct!*"
    },
    "Operators": {
        "analogy": "Operators are like buttons on a calculator. `+` adds, `-` subtracts, and `%` (modulus) is like checking the remainder of slices left over when dividing a pizza equally.",
        "hint": "Use `/` for division, `%` for modulus (remainder), and `**` for exponents (raising to a power).",
        "quiz": "What does `5 % 2` evaluate to in Python?\n1) `2.5`\n2) `2`\n3) `1`\n\n*Hint: Modulus returns the remainder, so `5 % 2` is `1` (Option 3).*"
    }
}

def generate_tutor_response(
    message: str, 
    lesson_title: Optional[str] = None, 
    lesson_content: Optional[str] = None,
    history: Optional[List[schemas.ChatMessage]] = None
) -> str:
    # Load dotenv to ensure environment variables are fresh
    load_dotenv()
    
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # 1. Primary Option: Google Gemini (100% Free Tier)
    if gemini_api_key:
        system_intro = f"{SYSTEM_PROMPT}\n\n"
        if lesson_title and lesson_content:
            system_intro += f"CURRENT LESSON CONTEXT:\nTitle: {lesson_title}\nContent:\n{lesson_content}\n\nPlease help the user specifically in the context of this lesson if applicable."
            
        req_data = {
            "contents": [],
            "systemInstruction": {
                "parts": [{"text": system_intro}]
            },
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 800
            }
        }
        
        # Compile contents from history
        if history:
            for msg in history:
                role = "user" if msg.role == "user" else "model"
                req_data["contents"].append({
                    "role": role,
                    "parts": [{"text": msg.content}]
                })
        
        # Append current user query
        req_data["contents"].append({
            "role": "user",
            "parts": [{"text": message}]
        })
        
        # Prepare list of models to try
        models_to_try = [gemini_model]
        for fallback_model in ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"]:
            if fallback_model not in models_to_try:
                models_to_try.append(fallback_model)

        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_api_key}"
                headers = {"Content-Type": "application/json"}
                req_body = json.dumps(req_data).encode("utf-8")
                
                req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    reply = res_data["candidates"][0]["content"]["parts"][0]["text"]
                    return reply
            except Exception as e:
                err_msg = str(e)
                if hasattr(e, 'read'):
                    try:
                        err_detail = e.read().decode('utf-8')
                        err_msg += f" - Response: {err_detail}"
                    except Exception:
                        pass
                print(f"Gemini API Error with model {model}: {err_msg}. Trying next model...")

    # 2. Secondary Option: OpenAI GPT-4o-mini (Paid Tier)
    if openai_api_key:
        try:
            client = OpenAI(api_key=openai_api_key)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            
            # Add lesson context if available
            context = ""
            if lesson_title and lesson_content:
                context = f"CURRENT LESSON CONTEXT:\nTitle: {lesson_title}\nContent:\n{lesson_content}\n\nPlease help the user specifically in the context of this lesson if applicable."
                messages.append({"role": "system", "content": context})
                
            # Append history
            if history:
                for msg in history:
                    messages.append({"role": msg.role, "content": msg.content})
                    
            # Append current message
            messages.append({"role": "user", "content": message})
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API Error: {e}. Falling back to mocks...")

    # 3. Fallback Option: Rich simulated responses
    msg_lower = message.lower()
    title = lesson_title or "Programming"
    
    is_analogy = any(w in msg_lower for w in ["analogy", "explain", "concept", "simple terms", "understand"])
    is_hint = any(w in msg_lower for w in ["hint", "practice", "help", "clue", "stuck"])
    is_quiz = any(w in msg_lower for w in ["quiz", "question", "test", "ask me"])
    
    if lesson_title and lesson_title in SIMULATED_LESSON_DATA:
        data = SIMULATED_LESSON_DATA[lesson_title]
        if is_analogy:
            return f"### Analogy for **{title}** 💡\n\n{data['analogy']}\n\n*(Note: Running in simulator fallback mode)*"
        elif is_hint:
            return f"### Lesson Hint 🔍\n\n{data['hint']}\n\n*(Note: Running in simulator fallback mode)*"
        elif is_quiz:
            return f"### Mini Quiz 📝\n\n{data['quiz']}\n\n*(Note: Running in simulator fallback mode)*"
            
    if is_analogy:
        return f"""### Analogy for **{title}** 💡

Think of **{title}** like an everyday task:
Imagine you are building a Lego set. The concepts in this lesson are like the fundamental brick designs. They provide the structure and connectors that allow you to build complex shapes.

In programming terms, this concept helps you structure your instructions so the computer knows exactly what path to execute step-by-step.

*(Note: Running in simulator fallback mode)*"""

    if is_hint:
        return f"""### Coding Hint 🔍

For the **{title}** challenge:
1. Review the code template provided. Look at what inputs or variables are expected.
2. Double-check your syntax (parentheses, quotes, indentation, or semicolons).
3. If you need to produce a specific print statement, ensure the casing matches the instructions exactly (e.g. `"Hello, World!"` vs `"hello world"`).

Give it another shot!

*(Note: Running in simulator fallback mode)*"""

    if is_quiz:
        return f"""### Mini Quiz for **{title}** 📝

Here is a quick question to test your knowledge of **{title}**:

**True or False:** The programming syntax and constraints presented in this lesson must be followed exactly, otherwise the code execution engine will return a compilation or run error.

Reply with **True** or **False** and I will tell you if you got it right!

*(Note: Running in simulator fallback mode)*"""

    # General chat matching
    if "python" in msg_lower:
        return f"{MOCK_ANSWERS['python']}\n\n*(Note: Running in simulator fallback mode)*"
    elif "c++" in msg_lower or "cpp" in msg_lower:
        return f"{MOCK_ANSWERS['cpp']}\n\n*(Note: Running in simulator fallback mode)*"
    elif "html" in msg_lower or "web" in msg_lower or "css" in msg_lower:
        return f"{MOCK_ANSWERS['html']}\n\n*(Note: Running in simulator fallback mode)*"
        
    return f"Regarding your question about **{title}**: {MOCK_ANSWERS['default']}\n\n*Your query was*: \"{message}\""


def generate_code_review(
    code: str, 
    lesson_title: str, 
    lesson_content: str
) -> dict:
    load_dotenv()
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    prompt = f"""You are the EduVerse Code Optimizer and Reviewer.
Analyze the student's solution code below for the lesson '{lesson_title}'.
Lesson Content for context:
{lesson_content}

Student's code:
```
{code}
```

Please evaluate the code and return your response in strictly JSON format. Do not return markdown wraps outside the JSON.
Your JSON must match this structure exactly:
{{
  "grade": "A|B|C|D|F",
  "complexity": "Time Complexity and Space Complexity description (e.g. Time: O(N), Space: O(1))",
  "feedback": "Constructive comments on what the student did well and how they can improve.",
  "suggestions": ["List item 1 of suggestions", "List item 2 of suggestions"],
  "improved_code": "Fully optimized, clean version of the code, properly formatted"
}}"""

    # Primary: Gemini
    if gemini_api_key:
        req_data = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1000,
                "responseMimeType": "application/json"
            }
        }
        models_to_try = [gemini_model]
        for fallback_model in ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"]:
            if fallback_model not in models_to_try:
                models_to_try.append(fallback_model)
                
        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_api_key}"
                headers = {"Content-Type": "application/json"}
                req_body = json.dumps(req_data).encode("utf-8")
                
                req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    reply = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if reply.startswith("```json"):
                        reply = reply[7:-3]
                    elif reply.startswith("```"):
                        reply = reply[3:-3]
                    return json.loads(reply.strip())
            except Exception as e:
                # If responseMimeType fails or any other error, try a simple query
                print(f"Gemini Review API Error with model {model}: {e}. Trying simple format...")
                try:
                    req_data_simple = {
                        "contents": [{"role": "user", "parts": [{"text": prompt + "\nRemember, return ONLY the raw JSON object."}]}]
                    }
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_api_key}"
                    req_body = json.dumps(req_data_simple).encode("utf-8")
                    req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
                    with urllib.request.urlopen(req) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        reply = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        if reply.startswith("```json"):
                            reply = reply[7:-3]
                        elif reply.startswith("```"):
                            reply = reply[3:-3]
                        return json.loads(reply.strip())
                except Exception as inner_e:
                    print(f"Gemini Review Simple Fallback Error: {inner_e}")

    # Secondary: OpenAI
    if openai_api_key:
        try:
            client = OpenAI(api_key=openai_api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI Review API Error: {e}")
            
    # Mock fallback
    return {
        "grade": "B",
        "complexity": "Time: O(1), Space: O(1)",
        "feedback": f"Your solution for **{lesson_title}** is functional and structured correctly. (Note: Running in offline mock review mode).",
        "suggestions": [
            "Ensure you clean up unnecessary print statements.",
            "Choose descriptive names for variables instead of abbreviations.",
            "Verify edge cases like empty strings or out of range inputs."
        ],
        "improved_code": code
    }


MOCK_INTERVIEW_QUESTIONS = {
    "Python Developer": [
        "What is the difference between a list and a tuple in Python, and when would you use a tuple over a list?",
        "Explain what decorators are in Python and write/explain a simple decorator that logs function execution.",
        "How does memory management work in Python? What is the role of the global interpreter lock (GIL) and garbage collector?",
        "What are generator functions and how do they differ from normal return-based functions in terms of performance?",
        "What is the difference between __str__ and __repr__ special methods and when should you implement both?"
    ],
    "Frontend Engineer": [
        "What is the difference between Virtual DOM and Real DOM in React, and how does React optimize rendering?",
        "Explain block scoping in ES6. What are the key differences between var, let, and const scope rules?",
        "What is CSS Flexbox and how does it differ from CSS Grid in building responsive page layouts?",
        "What is client-side rendering (CSR) vs server-side rendering (SSR), and how does Next.js handle them?",
        "What is a closure in JavaScript, and what is a practical real-world scenario where closures are useful?"
    ],
    "AI Researcher": [
        "What is the difference between supervised and unsupervised learning, and can you name an algorithm for each?",
        "What is overfitting in neural networks and what are the main techniques you use to prevent it?",
        "How does the ReLU activation function prevent the vanishing gradient problem in deep networks?",
        "Explain the core self-attention mechanism in the Transformer architecture. How does it weigh relationships?",
        "What is the purpose of learning rate schedules (like cosine annealing) during optimization?"
    ],
    "Security Auditor": [
        "Explain the difference between symmetric and asymmetric cryptography. Give a common protocol example of each.",
        "What is SQL Injection (SQLi) and how do prepared statements or parameterization prevent it?",
        "How does Cross-Site Scripting (XSS) work and what are the primary defenses against it in frontend code?",
        "What port does SSH run on, and what steps would you take to secure an SSH server on a public network?",
        "What is a Man-in-the-Middle (MitM) attack and how does TLS/HTTPS successfully mitigate it?"
    ]
}

def generate_interview_start(role: str) -> str:
    load_dotenv()
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    system_prompt = f"You are the EduVerse AI Technical Recruiter. You are starting a job interview with a candidate applying for the '{role}' position. Greet them warmly and ask the first short, focused technical question. Keep it concise."
    
    if gemini_api_key:
        req_data = {
            "contents": [{"role": "user", "parts": [{"text": "Start the interview and ask the first question."}]}],
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 300}
        }
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_api_key}"
            headers = {"Content-Type": "application/json"}
            req_body = json.dumps(req_data).encode("utf-8")
            req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                return res_data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"Gemini Interview Start Error: {e}")

    # Fallback to local questions
    q_list = MOCK_INTERVIEW_QUESTIONS.get(role, MOCK_INTERVIEW_QUESTIONS["Python Developer"])
    return f"Hello! I am your EduVerse AI Technical Interviewer. Welcome to your virtual interview for the **{role}** position. Let's begin with the first question:\n\n**1. {q_list[0]}**"


def generate_interview_next(role: str, history: list, candidate_response: str) -> tuple[str, bool]:
    load_dotenv()
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Count questions asked so far by counting candidate replies
    questions_answered = sum(1 for m in history if m.get("role") == "candidate") + 1
    
    if questions_answered >= 5:
        # CONCLUDE AND EVALUATE
        prompt = f"""You are the EduVerse AI Technical Recruiter. You have just completed a 5-question technical interview with a candidate applying for the '{role}' position.
Here is the conversation history of the interview:
{json.dumps(history)}
The candidate's final response: "{candidate_response}"

Please evaluate their interview performance. Write a comprehensive assessment and return it in strictly JSON format. Do not return markdown wraps outside the JSON.
Your JSON must match this structure exactly:
{{
  "score": <integer score between 0 and 100>,
  "grade": "A|B|C|D|F",
  "strengths": "Markdown list of key strengths shown",
  "weaknesses": "Markdown list of improvement areas",
  "detailed_feedback": "Detailed overall critique and recommendations"
}}"""
        if gemini_api_key:
            req_data = {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1000,
                    "responseMimeType": "application/json"
                }
            }
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_api_key}"
                headers = {"Content-Type": "application/json"}
                req_body = json.dumps(req_data).encode("utf-8")
                req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    reply = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if reply.startswith("```json"):
                        reply = reply[7:-3]
                    elif reply.startswith("```"):
                        reply = reply[3:-3]
                    return reply.strip(), True
            except Exception as e:
                print(f"Gemini Interview Evaluation Error: {e}")

        # Fallback simulated evaluation
        grade = "B"
        score = 80
        total_chars = sum(len(m.get("content", "")) for m in history) + len(candidate_response)
        if total_chars > 1000:
            score = 92
            grade = "A"
        elif total_chars < 300:
            score = 65
            grade = "C"
            
        mock_feedback = {
            "score": score,
            "grade": grade,
            "strengths": f"- Strong understanding of fundamental topics in **{role}**.\n- Expressed concepts clearly and structured the answers logically.",
            "weaknesses": "- Could dive deeper into advanced edge cases and real-world system designs.\n- Try formatting sample solutions or code snippets to solidify responses.",
            "detailed_feedback": f"Overall, you performed well in this mock interview for the **{role}** position. Your answers were concise and showed good technical fluency. Continuing practice on coding challenges will help you scale up to senior engineering levels."
        }
        return json.dumps(mock_feedback), True
        
    else:
        # CONTINUE INTERVIEW (ASK NEXT QUESTION)
        prompt = f"""You are the EduVerse AI Technical Recruiter. You are conducting a technical interview for the '{role}' role.
Here is the conversation history so far:
{json.dumps(history)}
The candidate's latest response: "{candidate_response}"

You are on question index {questions_answered + 1} of 5.
Evaluate the user's latest response briefly (1 sentence) and ask the next technical question. Keep it concise, engaging, and professional. Do not evaluate the final score yet."""

        if gemini_api_key:
            req_data = {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 300}
            }
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_api_key}"
                headers = {"Content-Type": "application/json"}
                req_body = json.dumps(req_data).encode("utf-8")
                req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    return res_data["candidates"][0]["content"]["parts"][0]["text"], False
            except Exception as e:
                print(f"Gemini Interview Continue Error: {e}")

        # Fallback local question
        q_list = MOCK_INTERVIEW_QUESTIONS.get(role, MOCK_INTERVIEW_QUESTIONS["Python Developer"])
        next_q = q_list[questions_answered]
        return f"Thanks for that explanation. Let's move on to the next question:\n\n**{questions_answered + 1}. {next_q}**", False

