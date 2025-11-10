'use client';

/**
 * QuestionCard Component
 * Displays a single MCQ question with interactive radio button options
 * @param {Object} props - Component props
 * @param {Object} props.question - Question object with id, question, options, correctAnswer
 * @param {number} props.questionNumber - Display number for the question
 * @param {string|null} props.selectedAnswer - Currently selected answer (A, B, C, or D)
 * @param {Function} props.onAnswerChange - Callback function when answer is selected
 * @returns {JSX.Element} Question card component
 */
export default function QuestionCard({ question, questionNumber, selectedAnswer, onAnswerChange }) {
    const handleAnswerSelect = (answer) => {
        onAnswerChange(question.id, answer);
    };

    return (
        <div className="border border-gray-200 bg-white p-6">
            {/* Question Header */}
            <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-normal text-sm mr-4">
                    {questionNumber}
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-normal text-gray-900 leading-relaxed">
                        {question.question}
                    </h3>
                </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
                {question.options.map((option, index) => {
                    const optionLetter = ['A', 'B', 'C', 'D'][index];
                    const isSelected = selectedAnswer === optionLetter;
                    
                    return (
                        <label
                            key={optionLetter}
                            className={`block cursor-pointer transition-colors border p-3 hover:bg-gray-50 ${
                                isSelected
                                    ? 'border-gray-800 bg-gray-50'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center">
                                {/* Custom Radio Button */}
                                <div className="flex-shrink-0 mr-3">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={optionLetter}
                                        checked={isSelected}
                                        onChange={() => handleAnswerSelect(optionLetter)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                            isSelected
                                                ? 'border-gray-800 bg-gray-800'
                                                : 'border-gray-300 bg-white'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Option Text */}
                                <div className="flex-1">
                                    <span
                                        className={`text-sm font-normal transition-colors ${
                                            isSelected ? 'text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        {option}
                                    </span>
                                </div>

                                {/* Option Letter Badge */}
                                <div
                                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-normal transition-colors ${
                                        isSelected
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {optionLetter}
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* Selection Status */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                {selectedAnswer ? (
                    <div className="text-sm text-gray-600">
                        Answer selected: Option {selectedAnswer}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500">
                        Please select an answer
                    </div>
                )}
            </div>
        </div>
    );
}
