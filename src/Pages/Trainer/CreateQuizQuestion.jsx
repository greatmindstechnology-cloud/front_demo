import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const CreateQuizQuestion = () => {
  const [topicId, setTopicId] = useState(null);
  const [questions, setQuestions] = useState([
    {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_option: '',
      explanation: '',
      marks: 1,
      difficulty: 'medium',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { topicId: paramTopicId } = useParams();

  // Fetch topic_id
  useEffect(() => {
    const id = paramTopicId || localStorage.getItem('topicId');
    console.log('Topic ID:', id); // Debug
    if (!id) {
      setError('Topic ID not found.');
      navigate('/dashboard/trainer', { replace: true });
    } else {
      setTopicId(id);
    }
  }, [paramTopicId, navigate]);

  // Handle input changes for a specific question
  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_option: '',
        explanation: '',
        marks: 1,
        difficulty: 'medium',
      },
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError('At least one question is required.');
      return;
    }
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate required fields
    const requiredFields = ['question', 'option1', 'option2', 'option3', 'option4', 'correct_option'];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      for (const field of requiredFields) {
        if (!question[field]) {
          setError(`Question ${i + 1}: ${field.replace('_', ' ')} is required.`);
          setIsLoading(false);
          return;
        }
      }
      if (question.marks <= 0) {
        setError(`Question ${i + 1}: Marks must be greater than 0.`);
        setIsLoading(false);
        return;
      }
    }

    // Prepare data for backend (ensure correct_option is an integer)
    const data = questions.map((question) => ({
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct_option: parseInt(question.correct_option),
      explanation: question.explanation,
      marks: question.marks,
      difficulty: question.difficulty,
    }));

    // Debug: Log data
    console.log('Request Data:', data);

    try {
      const response = await fetch(`https://backend-demo-esqk.onrender.com/trainer_gmt/create/quiz-question/?topic_id=${topicId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Debug: Log raw response
      console.log('Create Quiz Question Response Status:', response.status);
      const responseText = await response.text();
      console.log('Create Quiz Question Raw Response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log('Create Quiz Question Parsed Response:', responseData); // Debug

      if (response.status === 500) {
        throw new Error(responseData.error || 'Server error occurred.');
      }

      const { created_questions, errors } = responseData;

      if (errors && errors.length > 0) {
        const errorMessages = errors.map((err) => `Question ${err.index + 1}: ${err.error}`).join('; ');
        setError(errorMessages);
      }

      if (created_questions && created_questions.length > 0) {
        const successMessages = created_questions.map((q) => `Question ${q.index + 1} created with ID ${q.question_id}`).join('; ');
        setSuccess(successMessages);
        setQuestions([
          {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correct_option: '',
            explanation: '',
            marks: 1,
            difficulty: 'medium',
          },
        ]);
      }
    } catch (err) {
      console.error('Create Quiz Question API Error:', err.message); // Debug
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Quiz Questions</h1>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
          {success}
        </div>
      )}

      {/* Quiz Questions Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="border-b border-gray-300 dark:border-gray-600 pb-4">
              <h2 className="text-xl font-semibold mb-4">Question {index + 1}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Question</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Option 1</label>
                <input
                  type="text"
                  value={question.option1}
                  onChange={(e) => handleInputChange(index, 'option1', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Option 2</label>
                <input
                  type="text"
                  value={question.option2}
                  onChange={(e) => handleInputChange(index, 'option2', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Option 3</label>
                <input
                  type="text"
                  value={question.option3}
                  onChange={(e) => handleInputChange(index, 'option3', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Option 4</label>
                <input
                  type="text"
                  value={question.option4}
                  onChange={(e) => handleInputChange(index, 'option4', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Correct Option</label>
                <select
                  value={question.correct_option}
                  onChange={(e) => handleInputChange(index, 'correct_option', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Correct Option
                  </option>
                  <option value="1">{question.option1 || 'Option 1'}</option>
                  <option value="2">{question.option2 || 'Option 2'}</option>
                  <option value="3">{question.option3 || 'Option 3'}</option>
                  <option value="4">{question.option4 || 'Option 4'}</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Explanation</label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => handleInputChange(index, 'explanation', e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  value={question.marks}
                  onChange={(e) => handleInputChange(index, 'marks', parseInt(e.target.value))}
                  required
                  min="1"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={question.difficulty}
                  onChange={(e) => handleInputChange(index, 'difficulty', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(index)}
                disabled={questions.length === 1}
                className={`text-red-500 hover:text-red-700 ${questions.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RemoveCircleOutlineIcon />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition mb-4"
          >
            <AddCircleOutlineIcon className="mr-2" />
            Add Another Question
          </button>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/trainer')}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Questions...' : 'Save Questions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizQuestion;