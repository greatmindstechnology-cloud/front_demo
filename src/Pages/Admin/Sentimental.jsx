// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Avatar,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import CommentIcon from "@mui/icons-material/Comment";
// import Sentiment from "sentiment";

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const dummyCourses = ["React Basics", "Advanced JS", "Node Mastery"];
// const dummyAuthors = ["John Doe", "Jane Smith", "Elon Code"];

// // Mock API function to simulate backend response
// const fetchFeedbackFromBackend = async (item) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const mockFeedback = {
//     "React Basics": [
//       { id: "RB001", text: "Loved it!", date: "2025-07-01" },
//       { id: "RB002", text: "Too basic", date: "2025-07-02" },
//       { id: "RB003", text: "Great examples", date: "2025-07-03" },
//     ],
//     "Advanced JS": [
//       { id: "AJ001", text: "Confusing", date: "2025-06-28" },
//       { id: "AJ002", text: "Very detailed", date: "2025-06-29" },
//       { id: "AJ003", text: "Excellent!", date: "2025-06-30" },
//     ],
//     "Node Mastery": [
//       { id: "NM001", text: "Can't Understand the Course", date: "2025-07-04" },
//       { id: "NM002", text: "Needed more depth", date: "2025-07-05" },
//     ],
//     "John Doe": [ 
//       { id: "JD001", text: "Clear teaching", date: "2025-07-01" },
//       { id: "JD002", text: "Engaging", date: "2025-07-02" },
//     ],
//     "Jane Smith": [
//       { id: "JS001", text: "Too fast-paced", date: "2025-07-03" },
//       { id: "JS002", text: "Knowledgeable", date: "2025-07-04" },
//     ],
//     "Elon Code": [
//       { id: "EC001", text: "Innovative approach", date: "2025-07-05" },
//       { id: "EC002", text: "Inspiring", date: "2025-07-06" },
//     ],
//   };

//   return mockFeedback[item] || [];
// };

// const SentimentAnalysisAdmin = () => {
//   const [mode, setMode] = useState("course");
//   const [selectedItem, setSelectedItem] = useState("");
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const items = mode === "course" ? dummyCourses : dummyAuthors;

//   // Initialize sentiment analyzer
//   const sentimentAnalyzer = new Sentiment();

//   // Calculate sentiment for feedback list
//   const enrichedFeedback = feedbackList.map((fb) => {
//     const analysis = sentimentAnalyzer.analyze(fb.text);
//     return {
//       ...fb,
//       sentiment: analysis.score >= 0 ? "positive" : "negative",
//     };
//   });

//   // Calculate aggregate sentiment for pie chart
//   const totalFeedback = enrichedFeedback.length;
//   const likeCount = enrichedFeedback.filter((fb) => fb.sentiment === "positive").length;
//   const dislikeCount = totalFeedback - likeCount;
//   const sentiment = {
//     like: totalFeedback > 0 ? Math.round((likeCount / totalFeedback) * 100) : 0,
//     dislike: totalFeedback > 0 ? Math.round((dislikeCount / totalFeedback) * 100) : 0,
//   };

//   // Fetch feedback when selectedItem changes
//   useEffect(() => {
//     if (!selectedItem) {
//       setFeedbackList([]);
//       setError(null);
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await fetchFeedbackFromBackend(selectedItem);
//         setFeedbackList(data);
//       } catch (err) {
//         setError("Failed to fetch feedback. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedItem]);

//   const pieData = {
//     labels: ["Like", "Dislike"],
//     datasets: [
//       {
//         data: [sentiment.like, sentiment.dislike],
//         backgroundColor: ["#4caf50", "#f44336"],
//         borderColor: ["#388e3c", "#d32f2f"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieOptions = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           color: "#000",
//         },
//       },
//     },
//   };

//   const isDataAvailable = selectedItem && feedbackList.length > 0;

//   return (
//     <Box sx={{ p: 4, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4 }}>
//       {/* Left Panel */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//         <FormControl fullWidth>
//           <InputLabel id="mode-label">Course / Author</InputLabel>
//           <Select
//             labelId="mode-label"
//             value={mode}
//             label="Course / Author"
//             onChange={(e) => {
//               setSelectedItem("");
//               setMode(e.target.value);
//             }}
//           >
//             <MenuItem value="course">Course</MenuItem>
//             <MenuItem value="author">Author</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth>
//           <InputLabel id="item-label">Select a name</InputLabel>
//           <Select
//             labelId="item-label"
//             value={selectedItem}
//             label="Select a name"
//             onChange={(e) => setSelectedItem(e.target.value)}
//           >
//             {items.map((name) => (
//               <MenuItem key={name} value={name}>
//                 {name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Card elevation={3}>
//           <CardContent>
//             <Typography variant="h6" align="center" gutterBottom>
//               Like vs Dislike
//             </Typography>
//             <Typography variant="srOnly">
//               Pie chart showing {sentiment.like}% likes and {sentiment.dislike}% dislikes for {selectedItem || "selected item"}.
//             </Typography>
//             <Box sx={{ height: 200 }}>
//               <Pie data={pieData} options={pieOptions} height={200} />
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>

//       {/* Right Panel - Enhanced Feedback List */}
//       <Card elevation={3}>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>
//             Feedback List
//           </Typography>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : error ? (
//             <Typography color="error">{error}</Typography>
//           ) : isDataAvailable ? (
//             <List
//               sx={{
//                 maxHeight: 400,
//                 overflowY: "auto",
//                 bgcolor: "background.paper",
//                 borderRadius: 1,
//               }}
//               aria-label="Feedback list"
//             >
//               {enrichedFeedback.map((fb, i) => (
//                 <React.Fragment key={fb.id}>
//                   <ListItem
//                     sx={{
//                       "&:hover": {
//                         bgcolor: "action.hover",
//                       },
//                     }}
//                   >
//                     <ListItemAvatar>
//                       <Avatar sx={{ bgcolor: fb.sentiment === "positive" ? "success.main" : "error.main" }}>
//                         <CommentIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={fb.text}
//                       secondary={
//                         <>
//                           <Typography
//                             component="span"
//                             variant="body2"
//                             color="text.secondary"
//                           >
//                             ID: {fb.id} | Date: {fb.date} | Sentiment: {fb.sentiment}
//                           </Typography>
//                         </>
//                       }
//                     />
//                   </ListItem>
//                   {i < enrichedFeedback.length - 1 && <Divider component="li" />}
//                 </React.Fragment>
//               ))}
//             </List>
//           ) : (
//             <Typography color="text.secondary">
//               {selectedItem ? "No feedback available." : "Please select an item."}
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default SentimentAnalysisAdmin;
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CommentIcon from "@mui/icons-material/Comment";
import Sentiment from "sentiment";
import { getCourseFeedbacks } from "../../services/CourseService"; // Updated import path

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const dummyCourses = ["React Basics", "Advanced JS", "Node Mastery"];
const dummyAuthors = ["John Doe", "Jane Smith", "Elon Code"];

// Map course IDs to course names (adjust based on your actual course data)
const courseIdToName = {
  1: "React Basics",
  2: "Advanced JS",
  3: "Node Mastery",
};

// Mock API function for author feedback
const fetchAuthorFeedback = async (item) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const mockFeedback = {
    "John Doe": [
      { id: "JD001", text: "Clear teaching", date: "2025-07-01" },
      { id: "JD002", text: "Engaging", date: "2025-07-02" },
    ],
    "Jane Smith": [
      { id: "JS001", text: "Too fast-paced", date: "2025-07-03" },
      { id: "JS002", text: "Knowledgeable", date: "2025-07-04" },
    ],
    "Elon Code": [
      { id: "EC001", text: "Innovative approach", date: "2025-07-05" },
      { id: "EC002", text: "Inspiring", date: "2025-07-06" },
    ],
  };
  return mockFeedback[item] || [];
};

const SentimentAnalysisAdmin = () => {
  const [mode, setMode] = useState("course");
  const [selectedItem, setSelectedItem] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = mode === "course" ? dummyCourses : dummyAuthors;

  // Initialize sentiment analyzer
  const sentimentAnalyzer = new Sentiment();

  // Calculate sentiment for feedback list
  const enrichedFeedback = feedbackList.map((fb) => {
    const analysis = sentimentAnalyzer.analyze(fb.text);
    return {
      ...fb,
      sentiment: analysis.score >= 0 ? "positive" : "negative",
    };
  });

  // Calculate aggregate sentiment for pie chart
  const totalFeedback = enrichedFeedback.length;
  const likeCount = enrichedFeedback.filter((fb) => fb.sentiment === "positive").length;
  const dislikeCount = totalFeedback - likeCount;
  const sentiment = {
    like: totalFeedback > 0 ? Math.round((likeCount / totalFeedback) * 100) : 0,
    dislike: totalFeedback > 0 ? Math.round((dislikeCount / totalFeedback) * 100) : 0,
  };

  // Fetch feedback when selectedItem changes
  useEffect(() => {
    if (!selectedItem) {
      setFeedbackList([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (mode === "course") {
          // Find course ID for the selected course name
          const courseId = Object.keys(courseIdToName).find(
            (key) => courseIdToName[key] === selectedItem
          );
          if (!courseId) {
            throw new Error(`Course "${selectedItem}" not found in courseIdToName mapping`);
          }
          console.log(`Fetching feedback for course ID: ${courseId} (${selectedItem})`);
          // Fetch feedback from API
          data = await getCourseFeedbacks(courseId);
          console.log("API response:", data);

          // Handle non-array responses
          if (!Array.isArray(data)) {
            console.warn("API response is not an array:", data);
            // Check for common nested array patterns
            data = data.data || data.feedback || data.results || [];
            if (!Array.isArray(data)) {
              throw new Error("Invalid API response: Expected an array of feedback items");
            }
          }

          // Transform API response to match expected format
          data = data.map((item) => {
            if (!item || !item.id || !item.submitted_at) {
              console.warn("Invalid feedback item:", item);
              return null;
            }
            return {
              id: item.id.toString(),
              text: `${item.what_do_you_like_most || ""} ${
                item.what_do_you_like_least || ""
              } ${item.suggestions || ""}`.trim() || "No feedback provided",
              date: item.submitted_at.split("T")[0] || "Unknown date",
              original: item,
            };
          }).filter(item => item !== null);

          console.log("Transformed feedback:", data);
        } else {
          // Use mock data for author feedback
          data = await fetchAuthorFeedback(selectedItem);
        }

        setFeedbackList(data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(err.message || "Failed to fetch feedback. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedItem, mode]);

  const pieData = {
    labels: ["Like", "Dislike"],
    datasets: [
      {
        data: [sentiment.like, sentiment.dislike],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#000",
        },
      },
    },
  };

  const isDataAvailable = selectedItem && feedbackList.length > 0;

  return (
    <Box sx={{ p: 4, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4 }}>
      {/* Left Panel */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="mode-label">Course / Author</InputLabel>
          <Select
            labelId="mode-label"
            value={mode}
            label="Course / Author"
            onChange={(e) => {
              setSelectedItem("");
              setMode(e.target.value);
            }}
            inputProps={{ "aria-label": "Select mode: Course or Author" }}
          >
            <MenuItem value="course">Course</MenuItem>
            <MenuItem value="author">Author</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="item-label">Select a name</InputLabel>
          <Select
            labelId="item-label"
            value={selectedItem}
            label="Select a name"
            onChange={(e) => setSelectedItem(e.target.value)}
            inputProps={{ "aria-label": "Select a course or author" }}
          >
            {items.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Like vs Dislike
            </Typography>
            <Typography variant="srOnly">
              Pie chart showing {sentiment.like}% likes and {sentiment.dislike}% dislikes for {selectedItem || "selected item"}.
            </Typography>
            <Box sx={{ height: 200 }}>
              <Pie data={pieData} options={pieOptions} height={200} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Right Panel - Enhanced Feedback List */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Feedback List
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : isDataAvailable ? (
            <List
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
              aria-label="Feedback list"
            >
              {enrichedFeedback.map((fb, i) => (
                <React.Fragment key={fb.id}>
                  <ListItem
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: fb.sentiment === "positive" ? "success.main" : "error.main" }}>
                        <CommentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" variant="body1">
                            Likes: {fb.original?.what_do_you_like_most || "N/A"}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body1">
                            Dislikes: {fb.original?.what_do_you_like_least || "N/A"}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body1">
                            Suggestions: {fb.original?.suggestions || "N/A"}
                          </Typography>
                        </>
                      }
                      secondary={
                        <Typography component="span" variant="body2" color="text.secondary">
                          ID: {fb.id} | Date: {fb.date} | Sentiment: {fb.sentiment} | Overall Rating: {fb.original?.overall_rating || "N/A"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {i < enrichedFeedback.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              {selectedItem ? "No feedback available." : "Please select an item."}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SentimentAnalysisAdmin;