import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import {postFeedback} from '../../services/CourseService';


const CourseFeedbackForm = ({ courseTitle = 'React Basics', studentName = 'John Doe', courseId }) => {
  console.log(courseId, courseTitle, studentName);  
  const [formData, setFormData] = useState({
    overall_rating: 0,
    content_quality_rating: 0,
    trainer_rating: 0,
    platform_rating: 0,
    course_difficulty: '',
    what_do_you_like_most: '',
    what_do_you_like_least: '',
    suggestions: '',
  });

  const handleChange = (field) => (event, value) => {
    const val = event && event.target ? event.target.value : value;
    setFormData({ ...formData, [field]: val });
  };

  const handleSubmit = async () => {
    const feedbackData = {
      course: courseId,
      ...formData,
    };
    try {
      await postFeedback(feedbackData);
      alert('Thank you for your feedback!');
    } catch (error) {
      alert('Failed to submit feedback.');
    }
  };

  return (
    <Box
        sx={{
            maxWidth: 600,
            mx: 'auto',
            p: 4,
            boxShadow: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            mt: 5,
        }}
    >
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
                Course Feedback
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
                <b>Course:</b> {courseTitle} <br /> <b>Student:</b> {studentName}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box>
                <Typography gutterBottom fontWeight={500}>
                    Overall Rating
                </Typography>
                <Rating
                    value={formData.overall_rating}
                    onChange={handleChange('overall_rating')}
                    size="large"
                    sx={{ fontSize: 36 }}
                />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Box flex={1}>
                    <Typography gutterBottom fontWeight={500}>
                        Content Quality
                    </Typography>
                    <Rating
                        value={formData.content_quality_rating}
                        onChange={handleChange('content_quality_rating')}
                        size="medium"
                    />
                </Box>
                <Box flex={1}>
                    <Typography gutterBottom fontWeight={500}>
                        Trainer
                    </Typography>
                    <Rating
                        value={formData.trainer_rating}
                        onChange={handleChange('trainer_rating')}
                        size="medium"
                    />
                </Box>
                <Box flex={1}>
                    <Typography gutterBottom fontWeight={500}>
                        Platform
                    </Typography>
                    <Rating
                        value={formData.platform_rating}
                        onChange={handleChange('platform_rating')}
                        size="medium"
                    />
                </Box>
            </Stack>

            <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                <InputLabel id="course-difficulty-label">Course Difficulty</InputLabel>
                <Select
                    labelId="course-difficulty-label"
                    id="course-difficulty-select"
                    value={formData.course_difficulty}
                    onChange={handleChange('course_difficulty')}
                    label="Course Difficulty"
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                multiline
                minRows={2}
                label="What did you like most?"
                margin="normal"
                value={formData.what_do_you_like_most}
                onChange={handleChange('what_do_you_like_most')}
                variant="outlined"
            />

            <TextField
                fullWidth
                multiline
                minRows={2}
                label="What did you like least?"
                margin="normal"
                value={formData.what_do_you_like_least}
                onChange={handleChange('what_do_you_like_least')}
                variant="outlined"
            />

            <TextField
                fullWidth
                multiline
                minRows={2}
                label="Any suggestions for improvement?"
                margin="normal"
                value={formData.suggestions}
                onChange={handleChange('suggestions')}
                variant="outlined"
            />

            <Button
                variant="contained"
                color="primary"
                sx={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                }}
                onClick={handleSubmit}
            >
                Submit
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                    if (typeof window !== 'undefined' && window.history.length > 1) {   
                        window.history.back();
                    }
                }}
            >
                Close
            </Button>
        </Stack>
    </Box>
);
};

export default CourseFeedbackForm;
