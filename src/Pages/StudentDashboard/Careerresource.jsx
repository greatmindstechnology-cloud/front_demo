import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Careerresource() {
  const [tabValue, setTabValue] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      alert('Resume uploaded successfully!');
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const resumeTips = [
    "Use action verbs like 'developed,' 'managed,' or 'optimized' to describe achievements.",
    "Tailor your resume to each job by including relevant keywords from the job description.",
    "Keep it concise: aim for 1-2 pages with clear, quantifiable accomplishments.",
  ];

  const jobRoles = [
    { title: 'Software Engineer', description: 'Develop and maintain scalable web applications.', icon: <CodeIcon /> },
    { title: 'Data Analyst', description: 'Analyze datasets to provide actionable insights.', icon: <SchoolIcon /> },
    { title: 'Product Manager', description: 'Lead product development from ideation to launch.', icon: <WorkIcon /> },
  ];

  const interviewTips = [
    'Research the company’s mission, values, and recent projects before the interview.',
    'Practice common behavioral questions using the STAR method (Situation, Task, Action, Result).',
    'Prepare 2-3 questions to ask the interviewer about the role or company culture.',
  ];

  const roadmaps = {
    'Software Engineer': [
      'Month 1: Master core languages (JavaScript, Python); build simple projects.',
      'Month 2-3: Learn frameworks (React, Node.js); contribute to open source.',
      'Month 4-6: Practice algorithms; build portfolio apps; apply to jobs.',
    ],
    'Data Analyst': [
      'Month 1: Learn SQL, Excel; understand statistics basics.',
      'Month 2-3: Master Python/R for data visualization; analyze public datasets.',
      'Month 4-6: Build dashboards (Tableau); gain certifications; network on LinkedIn.',
    ],
    'Product Manager': [
      'Month 1: Study Agile/Scrum; read product books (e.g., Inspired by Marty Cagan).',
      'Month 2-3: Practice user research; create mock product roadmaps.',
      'Month 4-6: Volunteer for projects; pursue PMP certification; apply to entry-level roles.',
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8, bgcolor: theme.palette.background.default }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
          background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: theme.palette.primary.dark,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Career Resource Hub
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 4,
            bgcolor: theme.palette.grey[200],
            borderRadius: 2,
            '& .MuiTab-root': {
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: '1.1rem',
              padding: '12px 24px',
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              bgcolor: 'rgba(33, 150, 243, 0.15)', // light transparent blue
              borderRadius: 2,
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.primary.main,
              height: '4px',
              borderRadius: '4px',
            },
          }}
        >
          <Tab label="Resume Tips" />
          <Tab label="Job Roles" />
          <Tab label="Interview Tips" />
          <Tab label="Roadmap" />
        </Tabs>

        {/* Resume Tips Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardHeader
                  title="Upload Your Resume (PDF)"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                  }}
                />
                <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        '&:hover': { bgcolor: theme.palette.secondary.dark },
                      }}
                    >
                      Choose File
                      <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} />
                    </Button>
                  </Box>
                  {resumeFile && (
                    <Typography
                      sx={{
                        color: theme.palette.success.main,
                        mb: 4,
                        textAlign: 'center',
                        fontWeight: 'medium',
                      }}
                    >
                      File uploaded: {resumeFile.name}
                    </Typography>
                  )}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    AI-Generated Resume Tips
                  </Typography>
                  <List>
                    {resumeTips.map((tip, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          bgcolor: theme.palette.grey[100],
                          mb: 1,
                          borderRadius: 2,
                          '&:hover': { bgcolor: theme.palette.grey[200] },
                        }}
                      >
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Job Roles Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>
            Suggested Job Roles
          </Typography>
          <Grid container spacing={3}>
            {jobRoles.map((role, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' },
                  }}
                >
                  <CardHeader
                    avatar={role.icon}
                    title={role.title}
                    sx={{
                      bgcolor: theme.palette.secondary.light,
                      color: theme.palette.secondary.contrastText,
                    }}
                  />
                  <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
                    <Typography>{role.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Interview Tips Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-5px)' },
            }}
          >
            <CardHeader
              title="Interview Preparation Tips"
              sx={{
                bgcolor: theme.palette.info.main,
                color: theme.palette.info.contrastText,
                textAlign: 'center',
              }}
            />
            <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
              <List>
                {interviewTips.map((tip, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      mb: 1,
                      borderRadius: 2,
                      '&:hover': { bgcolor: theme.palette.grey[200] },
                    }}
                  >
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Roadmap Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>
            Career Roadmaps by Job Role
          </Typography>
          {jobRoles.map((role, index) => (
            <Accordion
              key={index}
              elevation={3}
              sx={{
                mb: 2,
                borderRadius: 2,
                '&:before': { display: 'none' },
                '&:hover': { bgcolor: theme.palette.grey[50] },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 2,
                  '& .MuiAccordionSummary-content': { alignItems: 'center' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {role.icon}
                  <Typography sx={{ fontWeight: 'bold' }}>{role.title} Roadmap</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: theme.palette.background.paper }}>
                <List>
                  {roadmaps[role.title].map((step, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        bgcolor: theme.palette.grey[100],
                        mb: 1,
                        borderRadius: 2,
                        '&:hover': { bgcolor: theme.palette.grey[200] },
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default Careerresource;
