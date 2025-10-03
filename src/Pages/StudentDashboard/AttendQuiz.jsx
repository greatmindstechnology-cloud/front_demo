// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '@mui/material';
// import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Alert, CircularProgress } from '@mui/material';
// import './AttendQuiz.css';

// const AttendQuiz = () => {
//   const [studentId, setStudentId] = useState(null);
//   const [topics, setTopics] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timer, setTimer] = useState(null); // In seconds
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [result, setResult] = useState(null);
//   const navigate = useNavigate();
//   const theme = useTheme();

//   // Fetch student_id
//   useEffect(() => {
//     const id = localStorage.getItem('studentId') || '1'; // Replace with actual student ID logic
//     if (!id) {
//       setError('Student ID not found. Please log in.');
//       navigate('/login', { replace: true });
//     } else {
//       setStudentId(id);
//     }
//   }, [navigate]);

//   // Fetch topics
//   useEffect(() => {
//     if (!studentId) return;
//     const fetchTopics = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`http://localhost:8000/student_gmt/topics/?student_id=${studentId}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Failed to fetch topics');
//         setTopics(data.filter((topic) => topic.is_active));
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTopics();
//   }, [studentId]);

//   // Fetch questions and start timer when a topic is selected
//   const startQuiz = async (topic) => {
//     setSelectedTopic(topic);
//     setIsLoading(true);
//     try {
//       const response = await fetch(`http://localhost:8000/student_gmt/topics/`);
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Failed to fetch questions');
//       setQuestions(data);
//       setCurrentQuestionIndex(0);
//       setAnswers({});
//       setTimer(topic.duration * 60); // Convert minutes to seconds
//       setResult(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Timer countdown
//   useEffect(() => {
//     if (timer === null || timer <= 0) return;
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           submitQuiz(); // Auto-submit when timer expires
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle option selection
//   const handleOptionChange = (questionId, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: selectedOption,
//     }));
//   };

//   // Navigate to previous question
//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   // Navigate to next question
//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   // Submit quiz
//   const submitQuiz = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Prepare answers for submission
//       const answerData = Object.keys(answers).map((questionId) => ({
//         question_id: parseInt(questionId),
//         selected_option: parseInt(answers[questionId]),
//       }));

//       // Submit answers
//       const submitResponse = await fetch(`http://localhost:8000/submit_student_answer/?student_id=${studentId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(answerData),
//       });
//       const submitData = await submitResponse.json();
//       if (!submitResponse.ok) throw new Error(submitData.error || 'Failed to submit answers');

//       // Calculate result
//       const resultResponse = await fetch(
//         `http://localhost:8000/calculate_student_result/?student_id=${studentId}&topic_id=${selectedTopic.id}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({}),
//         }
//       );
//       const resultData = await resultResponse.json();
//       if (!resultResponse.ok) throw new Error(resultData.error || 'Failed to calculate result');

//       setResult(resultData);
//       setTimer(null);
//       setSelectedTopic(null);
//       setQuestions([]);
//       setAnswers({});
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Format timer display
//   const formatTimer = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <Box
//       className="attend-quiz-container"
//       sx={{
//         bgcolor: theme.palette.background.default,
//         color: theme.palette.text.primary,
//       }}
//     >
//       <Typography variant="h4" className="attend-quiz-title">
//         Attend Quiz
//       </Typography>

//       {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {!selectedTopic && !result && (
//         <Box className="topics-list">
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Available Topics
//           </Typography>
//           {topics.length === 0 ? (
//             <Typography>No active topics available.</Typography>
//           ) : (
//             topics.map((topic) => (
//               <Box key={topic.id} className="topic-card" sx={{ bgcolor: theme.palette.background.paper }}>
//                 <Typography variant="h6">{topic.title}</Typography>
//                 <Typography variant="body2" sx={{ mb: 1 }}>
//                   {topic.description}
//                 </Typography>
//                 <Typography variant="body2">Duration: {topic.duration} minutes</Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => startQuiz(topic)}
//                   sx={{ mt: 1 }}
//                 >
//                   Start Quiz
//                 </Button>
//               </Box>
//             ))
//           )}
//         </Box>
//       )}

//       {selectedTopic && questions.length > 0 && !result && (
//         <Box className="quiz-section">
//           <Box className="timer" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
//             <Typography variant="h6">Time Remaining: {formatTimer(timer)}</Typography>
//           </Box>
//           <Typography variant="h5" sx={{ mb: 2 }}>
//             {selectedTopic.title} - Question {currentQuestionIndex + 1} of {questions.length}
//           </Typography>
//           <Box className="question-card" sx={{ bgcolor: theme.palette.background.paper }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               {questions[currentQuestionIndex].question}
//             </Typography>
//             <RadioGroup
//               value={answers[questions[currentQuestionIndex].id] || ''}
//               onChange={(e) => handleOptionChange(questions[currentQuestionIndex].id, e.target.value)}
//             >
//               <FormControlLabel
//                 value="1"
//                 control={<Radio />}
//                 label={questions[currentQuestionIndex].option1}
//               />
//               <FormControlLabel
//                 value="2"
//                 control={<Radio />}
//                 label={questions[currentQuestionIndex].option2}
//               />
//               <FormControlLabel
//                 value="3"
//                 control={<Radio />}
//                 label={questions[currentQuestionIndex].option3}
//               />
//               <FormControlLabel
//                 value="4"
//                 control={<Radio />}
//                 label={questions[currentQuestionIndex].option4}
//               />
//             </RadioGroup>
//           </Box>
//           <Box className="navigation-buttons">
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handlePrevious}
//               disabled={currentQuestionIndex === 0}
//               sx={{ mr: 1 }}
//             >
//               Previous
//             </Button>
//             {currentQuestionIndex < questions.length - 1 ? (
//               <Button variant="contained" color="primary" onClick={handleNext}>
//                 Next
//               </Button>
//             ) : (
//               <Button variant="contained" color="primary" onClick={submitQuiz}>
//                 Submit Quiz
//               </Button>
//             )}
//           </Box>
//         </Box>
//       )}

//       {result && (
//         <Box className="result-section" sx={{ bgcolor: theme.palette.background.paper }}>
//           <Typography variant="h5" sx={{ mb: 2 }}>
//             Quiz Completed!
//           </Typography>
//           <Typography variant="body1">Total Marks Obtained: {result.total_score}</Typography>
//           <Typography variant="body1">Total Possible Marks: {result.total_possible_marks}</Typography>
//           <Typography variant="body1">Percentage: {result.percentage}%</Typography>
//           <Typography variant="body1">Grade: {result.grade}</Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setResult(null)}
//             sx={{ mt: 2 }}
//           >
//             Back to Topics
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AttendQuiz;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import './AttendQuiz.css';

const AttendQuiz = () => {
  const [studentId, setStudentId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(null); // In seconds
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch student_id
  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '0'; // Matches student_id=15 from previous context
    if (!id) {
      setError('Student ID not found. Please log in.');
      navigate('/login', { replace: true });
    } else {
      setStudentId(id);
    }
  }, [navigate]);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/student_gmt/topics/`);
        const data = await response.json();
        console.log('Fetch Topics Response:', data);
        if (!response.ok) throw new Error(data.error || 'Failed to fetch topics');

        let topicsArray = [];
        if (Array.isArray(data)) {
          topicsArray = data;
        } else if (data && Array.isArray(data.topics)) {
          topicsArray = data.topics;
        } else {
          throw new Error('Unexpected response format: Topics data is not an array');
        }

        const activeTopics = topicsArray.filter((topic) => topic.is_active === true);
        setTopics(activeTopics);
      } catch (err) {
        console.error('Fetch Topics Error:', err.message);
        setError(err.message);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // Fetch questions and start timer
  const startQuiz = async (topic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/student_gmt/quiz-questions/?topic_id=${topic.id}`);
      const data = await response.json();
      console.log('Fetch Questions Response:', data);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch questions');

      let questionsArray = [];
      if (Array.isArray(data)) {
        questionsArray = data;
      } else if (data && Array.isArray(data.questions)) {
        questionsArray = data.questions;
      } else {
        throw new Error('Unexpected response format: Questions data is not an array');
      }

      if (questionsArray.length === 0) throw new Error('No questions found for this topic');
      setQuestions(questionsArray);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimer(topic.duration * 60);
      setResult(null);
    } catch (err) {
      console.error('Fetch Questions Error:', err.message);
      setError(err.message);
      setSelectedTopic(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle option selection
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (Object.keys(answers).length === 0) {
      setError('Please answer at least one question before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Prepare answers for submission
      const answerData = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        selected_option: parseInt(answers[questionId]),
      }));

      // Submit answers
      const submitResponse = await fetch(`http://localhost:8000/student_gmt/submit-answer/?student_id=${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData),
      });

      // Check if response is JSON
      const contentType = submitResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await submitResponse.text();
        console.error('Submit Answers Non-JSON Response:', text);
        throw new Error(`Submit Answers: Expected JSON, but received: ${text.slice(0, 100)}...`);
      }

      const submitData = await submitResponse.json();
      if (!submitResponse.ok) throw new Error(submitData.error || 'Failed to submit answers');
      console.log('Submit Answers Response:', submitData);

      // Calculate result
      const resultResponse = await fetch(
        `http://localhost:8000/student_gmt/calculate-result/?student_id=${studentId}&topic_id=${selectedTopic.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      );

      // Check if response is JSON
      const resultContentType = resultResponse.headers.get('content-type');
      if (!resultContentType || !resultContentType.includes('application/json')) {
        const text = await resultResponse.text();
        console.error('Calculate Result Non-JSON Response:', text);
        throw new Error(`Calculate Result: Expected JSON, but received: ${text.slice(0, 100)}...`);
      }

      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error(resultData.error || 'Failed to calculate result');
      console.log('Calculate Result Response:', resultData);

      setResult(resultData);
      setTimer(null);
      setSelectedTopic(null);
      setQuestions([]);
      setAnswers({});
    } catch (err) {
      console.error('Submit Quiz Error:', err.message);
      setError(`Failed to submit quiz: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box
      className="attend-quiz-container"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" className="attend-quiz-title">
        Attend Quiz
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!selectedTopic && !result && (
        <Box className="topics-list">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Courses
          </Typography>
          {topics.length === 0 ? (
            <Typography>No active courses available.</Typography>
          ) : (
            topics.map((topic) => (
              <Box key={topic.id} className="topic-card" sx={{ bgcolor: theme.palette.background.paper }}>
                <Typography variant="h6">{topic.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {topic.description}
                </Typography>
                <Typography variant="body2">Duration: {topic.duration} minutes</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => startQuiz(topic)}
                  sx={{ mt: 1 }}
                >
                  Start Quiz
                </Button>
              </Box>
            ))
          )}
        </Box>
      )}

      {selectedTopic && questions.length > 0 && !result && (
        <Box className="quiz-section">
          <Box className="timer" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            <Typography variant="h6">Time Remaining: {formatTimer(timer)}</Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {selectedTopic.title} - Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Box className="question-card" sx={{ bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {questions[currentQuestionIndex].question}
            </Typography>
            <RadioGroup
              value={answers[questions[currentQuestionIndex].id] || ''}
              onChange={(e) => handleOptionChange(questions[currentQuestionIndex].id, e.target.value)}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={questions[currentQuestionIndex].option1}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label={questions[currentQuestionIndex].option2}
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label={questions[currentQuestionIndex].option3}
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label={questions[currentQuestionIndex].option4}
              />
            </RadioGroup>
          </Box>
          <Box className="navigation-buttons">
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{ mr: 1 }}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={submitQuiz}>
                Submit Quiz
              </Button>
            )}
          </Box>
        </Box>
      )}

      {result && (
        <Box className="result-section" sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Quiz Completed!
          </Typography>
          <Typography variant="body1">Total Marks Obtained: {result.total_score}</Typography>
          <Typography variant="body1">Total Possible Marks: {result.total_possible_marks}</Typography>
          <Typography variant="body1">Percentage: {result.percentage}%</Typography>
          <Typography variant="body1">Grade: {result.grade}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setResult(null)}
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AttendQuiz;