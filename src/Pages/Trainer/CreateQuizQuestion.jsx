import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Select, MenuItem, Checkbox, FormControlLabel, Button, Alert, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import './CreateQuizQuestion.css';

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
  const theme = useTheme();

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
      const response = await fetch(`http://localhost:8000/trainer_gmt/create/quiz-question/?topic_id=${topicId}`, {
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
    <Box
      className="create-quiz-question-container"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" className="create-quiz-question-title">
        Create Quiz Questions
      </Typography>

      {/* Error and Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Quiz Questions Form */}
      <Box className="form-card" sx={{ bgcolor: theme.palette.background.paper }}>
        <form onSubmit={handleSubmit} className="form-grid">
          {questions.map((question, index) => (
            <Box key={index} className="question-section">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Question {index + 1}
              </Typography>

              <TextField
                label="Question"
                value={question.question}
                onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                label="Option 1"
                value={question.option1}
                onChange={(e) => handleInputChange(index, 'option1', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                label="Option 2"
                value={question.option2}
                onChange={(e) => handleInputChange(index, 'option2', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                label="Option 3"
                value={question.option3}
                onChange={(e) => handleInputChange(index, 'option3', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                label="Option 4"
                value={question.option4}
                onChange={(e) => handleInputChange(index, 'option4', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <Select
                label="Correct Option"
                value={question.correct_option}
                onChange={(e) => handleInputChange(index, 'correct_option', e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Correct Option
                </MenuItem>
                <MenuItem value="1">{question.option1 || 'Option 1'}</MenuItem>
                <MenuItem value="2">{question.option2 || 'Option 2'}</MenuItem>
                <MenuItem value="3">{question.option3 || 'Option 3'}</MenuItem>
                <MenuItem value="4">{question.option4 || 'Option 4'}</MenuItem>
              </Select>

              <TextField
                label="Explanation"
                value={question.explanation}
                onChange={(e) => handleInputChange(index, 'explanation', e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <TextField
                label="Marks"
                type="number"
                value={question.marks}
                onChange={(e) => handleInputChange(index, 'marks', parseInt(e.target.value))}
                required
                fullWidth
                inputProps={{ min: 1 }}
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <Select
                label="Difficulty"
                value={question.difficulty}
                onChange={(e) => handleInputChange(index, 'difficulty', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>

              <IconButton
                onClick={() => removeQuestion(index)}
                color="error"
                sx={{ mt: 1 }}
                disabled={questions.length === 1}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addQuestion}
            sx={{ mb: 2 }}
          >
            Add Another Question
          </Button>

          <Box className="form-actions">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/dashboard/trainer')}
              disabled={isLoading}
              className="btn-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              className="btn-submit"
            >
              {isLoading ? 'Creating Questions...' : 'Save Questions'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateQuizQuestion;