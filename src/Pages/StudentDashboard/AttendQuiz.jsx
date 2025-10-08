import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { 
  Box, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Alert, 
  CircularProgress,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Grid,
  Stack
} from '@mui/material';
import {
  AccessTime,
  Quiz,
  CheckCircle,
  School,
  NavigateNext,
  NavigateBefore,
  Send,
  Timer,
  Assessment
} from '@mui/icons-material';
import './AttendQuiz.css';

const AttendQuiz = () => {
  const [studentId, setStudentId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch student_id
  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '0';
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
        const response = await fetch(`https://backend-demo-esqk.onrender.com/student_gmt/topics/`);
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
      const response = await fetch(`https://backend-demo-esqk.onrender.com/student_gmt/quiz-questions/?topic_id=${topic.id}`);
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
      const answerData = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        selected_option: parseInt(answers[questionId]),
      }));

      const submitResponse = await fetch(`https://backend-demo-esqk.onrender.com/student_gmt/submit-answer/?student_id=${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData),
      });

      const contentType = submitResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await submitResponse.text();
        console.error('Submit Answers Non-JSON Response:', text);
        throw new Error(`Submit Answers: Expected JSON, but received: ${text.slice(0, 100)}...`);
      }

      const submitData = await submitResponse.json();
      if (!submitResponse.ok) throw new Error(submitData.error || 'Failed to submit answers');
      console.log('Submit Answers Response:', submitData);

      const resultResponse = await fetch(
        `https://backend-demo-esqk.onrender.com/student_gmt/calculate-result/?student_id=${studentId}&topic_id=${selectedTopic.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      );

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

  // Calculate progress percentage
  const getProgress = () => {
    if (questions.length === 0) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (!timer || !selectedTopic) return 'primary';
    const percentage = (timer / (selectedTopic.duration * 60)) * 100;
    if (percentage <= 20) return 'error';
    if (percentage <= 40) return 'warning';
    return 'primary';
  };

  // Get grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': case 'A+': return 'success';
      case 'B': case 'B+': return 'info';
      case 'C': case 'C+': return 'warning';
      default: return 'error';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default 
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <School sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
              letterSpacing: '-0.02em'
            }}
          >
            Assessment Portal
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 400
            }}
          >
            Complete your quiz assessments with confidence
          </Typography>
        </Box>

        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Topic Selection Screen */}
        {!selectedTopic && !result && !isLoading && (
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                textAlign: 'center',
                color: theme.palette.text.primary
              }}
            >
              Available Assessments
            </Typography>
            
            {topics.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Quiz sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No active assessments available at this time
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please check back later or contact your instructor
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {topics.map((topic) => (
                  <Grid item xs={12} md={6} lg={4} key={topic.id}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)',
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Assessment sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {topic.title}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {topic.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTime sx={{ fontSize: 20, color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Duration: {topic.duration} minutes
                          </Typography>
                        </Box>
                        
                        <Chip
                          label="Active"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </CardContent>
                      
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={() => startQuiz(topic)}
                          sx={{ 
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem'
                          }}
                        >
                          Start Assessment
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Quiz Screen */}
        {selectedTopic && questions.length > 0 && !result && (
          <Box>
            {/* Timer and Progress */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Timer sx={{ mr: 1, color: getTimerColor() === 'error' ? theme.palette.error.main : theme.palette.primary.main }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: getTimerColor() === 'error' ? theme.palette.error.main : theme.palette.text.primary
                      }}
                    >
                      Time Remaining: {formatTimer(timer)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(timer / (selectedTopic.duration * 60)) * 100}
                    color={getTimerColor()}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedTopic.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgress()}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Question Stepper */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                overflow: 'auto',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Stepper activeStep={currentQuestionIndex} alternativeLabel>
                {questions.map((_, index) => (
                  <Step key={index}>
                    <StepLabel 
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: answers[questions[index]?.id] ? 600 : 400
                        }
                      }}
                    >
                      Q{index + 1}
                      {answers[questions[index]?.id] && (
                        <CheckCircle 
                          sx={{ 
                            fontSize: 16, 
                            color: theme.palette.success.main, 
                            ml: 0.5 
                          }} 
                        />
                      )}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Question Card */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: theme.palette.text.primary
                }}
              >
                {questions[currentQuestionIndex].question}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <RadioGroup
                value={answers[questions[currentQuestionIndex].id] || ''}
                onChange={(e) => handleOptionChange(questions[currentQuestionIndex].id, e.target.value)}
              >
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((optionNum) => (
                    <Paper
                      key={optionNum}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                          borderColor: theme.palette.primary.main
                        },
                        ...(answers[questions[currentQuestionIndex].id] === optionNum.toString() && {
                          bgcolor: theme.palette.primary.light + '20',
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2
                        })
                      }}
                      onClick={() => handleOptionChange(questions[currentQuestionIndex].id, optionNum.toString())}
                    >
                      <FormControlLabel
                        value={optionNum.toString()}
                        control={<Radio sx={{ mr: 2 }} />}
                        label={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {questions[currentQuestionIndex][`option${optionNum}`]}
                          </Typography>
                        }
                        sx={{ 
                          width: '100%', 
                          ml: 0,
                          '& .MuiFormControlLabel-label': {
                            flex: 1
                          }
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </Paper>

            {/* Navigation */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  startIcon={<NavigateBefore />}
                  sx={{ 
                    minWidth: 120,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Previous
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {Object.keys(answers).length} of {questions.length} answered
                </Typography>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleNext}
                    endIcon={<NavigateNext />}
                    sx={{ 
                      minWidth: 120,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    size="large"
                    color="success"
                    onClick={submitQuiz}
                    endIcon={<Send />}
                    sx={{ 
                      minWidth: 140,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Submit Quiz
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Results Screen */}
        {result && (
          <Box sx={{ textAlign: 'center' }}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <CheckCircle 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.success.main, 
                  mb: 2 
                }} 
              />
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: theme.palette.text.primary
                }}
              >
                Assessment Completed!
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 4 }}
              >
                Congratulations on completing your assessment
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {result.total_score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score Obtained
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
                    {result.total_possible_marks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Marks
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.primary.main, mb: 1 }}>
                  {result.percentage}%
                </Typography>
                <Chip
                  label={`Grade: ${result.grade}`}
                  color={getGradeColor(result.grade)}
                  size="large"
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    px: 2,
                    py: 1
                  }}
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => setResult(null)}
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                Back to Assessments
              </Button>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AttendQuiz;