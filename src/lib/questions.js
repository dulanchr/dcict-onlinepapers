/**
 * Question Object Structure
 * @typedef {Object} Question
 * @property {number} id - Unique question identifier
 * @property {string} question - The question text
 * @property {string[]} options - Array of 4 answer options
 * @property {string} correctAnswer - Correct answer (A, B, C, or D)
 */

/**
 * Array of multiple choice questions covering programming, web development, and JavaScript
 * @type {Question[]}
 */
export const questions = [
    {
        id: 1,
        question: "පහත කොටසෙන් JavaScript හි අරය කුමක්ද?",
        options: [
            "A) String",
            "B) Number", 
            "C) Array",
            "D) Boolean"
        ],
        correctAnswer: "C"
    },
    {
        id: 2,
        question: "What does HTML stand for?",
        options: [
            "A) Hypertext Markup Language",
            "B) High Tech Modern Language",
            "C) Home Tool Markup Language", 
            "D) Hyperlink and Text Markup Language"
        ],
        correctAnswer: "A"
    },
    {
        id: 3,
        question: "Which CSS property is used to change the text color of an element?",
        options: [
            "A) font-color",
            "B) text-color",
            "C) color",
            "D) background-color"
        ],
        correctAnswer: "C"
    },
    {
        id: 4,
        question: "What is the correct way to declare a variable in JavaScript using ES6+?",
        options: [
            "A) var myVariable = 5;",
            "B) let myVariable = 5;",
            "C) const myVariable = 5;",
            "D) Both B and C are correct"
        ],
        correctAnswer: "D"
    },
    {
        id: 5,
        question: "Which of the following is used to add comments in JavaScript?",
        options: [
            "A) <!-- This is a comment -->",
            "B) // This is a comment",
            "C) /* This is a comment */",
            "D) Both B and C are correct"
        ],
        correctAnswer: "D"
    },
    {
        id: 6,
        question: "What is the purpose of the 'break' statement in programming?",
        options: [
            "A) To pause the execution for debugging",
            "B) To exit from a loop or switch statement",
            "C) To create a line break in output",
            "D) To interrupt user input"
        ],
        correctAnswer: "B"
    },
    {
        id: 7,
        question: "Which HTTP method is typically used to retrieve data from a server?",
        options: [
            "A) POST",
            "B) PUT",
            "C) GET",
            "D) DELETE"
        ],
        correctAnswer: "C"
    },
    {
        id: 8,
        question: "What does DOM stand for in web development?",
        options: [
            "A) Document Object Model",
            "B) Data Object Management",
            "C) Dynamic Object Method",
            "D) Document Oriented Markup"
        ],
        correctAnswer: "A"
    },
    {
        id: 9,
        question: "Which of the following is the correct syntax for a for loop in JavaScript?",
        options: [
            "A) for (i = 0; i < 10; i++)",
            "B) for (let i = 0; i < 10; i++)",
            "C) for (var i = 0; i < 10; i++)",
            "D) All of the above are correct"
        ],
        correctAnswer: "D"
    },
    {
        id: 10,
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
            "A) No difference, they work the same way",
            "B) '==' checks value only, '===' checks value and type",
            "C) '===' is faster than '=='",
            "D) '==' is for numbers, '===' is for strings"
        ],
        correctAnswer: "B"
    }
];

/**
 * Gets a question by its ID
 * @param {number} questionId - The ID of the question to retrieve
 * @returns {Question|null} - The question object or null if not found
 */
export function getQuestionById(questionId) {
    return questions.find(q => q.id === questionId) || null;
}

/**
 * Gets all questions
 * @returns {Question[]} - Array of all questions
 */
export function getAllQuestions() {
    return questions;
}

/**
 * Gets a random subset of questions
 * @param {number} count - Number of questions to return
 * @returns {Question[]} - Array of randomly selected questions
 */
export function getRandomQuestions(count = 5) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
}
