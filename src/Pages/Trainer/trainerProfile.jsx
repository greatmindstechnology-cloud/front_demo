import React, { useState, useEffect } from 'react';
import axios from "axios";
// import '../Trainer/';
import profilePhoto from "../../assets/emptyprofile.png";
import { Card, CardContent, Typography, Button, LinearProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

function TrainerProfile() {
    const [trainer, setTrainer] = useState(null);
    const navigate = useNavigate();

    const navigateEditForm = () => {
        navigate("/dashboard/trainereditprofile");
    };


      const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("https://api.example.com/user/1")
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, []); // Runs once when component mounts

    useEffect(() => {

        const loadStudent = async () => {
            const email = localStorage.getItem("loggedInUserEmail");
            if (!email) {
                console.warn("No email found in localStorage");
                return;
            }

            try {
                const res = await axios.post("http://localhost:8000/user-profile/",
                    new URLSearchParams({ email }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                setTrainer(res.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        loadStudent();
    }, []);



    return (
        <div>
          <div className='profile-header'>
            <div className='profile_subheader'>
              <div className='profile_photo_header'>
                <img src={profilePhoto} className='profile_photo' alt="profile" />
              </div>
              <div className='profile_right_side'>
                <h2>{trainer?.username || "Loading..."}</h2>
                <small>Trainer</small>
                <p>Location</p>
              </div>
            </div>
    
            <Card className='card-header' sx={{ width: '85%', borderRadius: 2, boxShadow: 3, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Profile Status</Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={70} />
                </Box>
              </CardContent>
            </Card>
    
            <div className='profile_button'>
              <Button
                variant="contained"
                color="info"
                startIcon={<EditIcon />}
                onClick={navigateEditForm}
              >
                Edit
              </Button>
            </div>
          </div>
    
          {/* Student details */}
          <div className='student-details'>
            <Card sx={{ width: '95%', margin: '0 auto', mb: 2 }}>
              <CardContent>
                <Typography sx={{marginBottom:'20px'}} variant="h6" gutterBottom>Info</Typography>
                <div className='student_details_list'>
                  <div className='list_left'>
                    <h6>Name</h6>
                    <h6>Email</h6>
                    <h6>Phone Number</h6>
                    <h6>Date of Birth</h6>
                    <h6>Courses</h6>
                  </div>
                  <div className='list_right'>
                    <p><strong>:</strong> {trainer?.username}</p>
                    <p><strong>:</strong> {trainer?.email}</p>
                    <p><strong>:</strong> {trainer?.fullNumber}</p>
                    <p><strong>:</strong> 05-04-2001</p>
                    <p><strong>:</strong> Java Full Stack</p>
                  </div>
                </div>
              </CardContent>
            </Card>
    
            <Card sx={{ width: '95%', margin: '0 auto' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Skill</Typography>
                <Box className='skill_list'>
                  <small>HTML5</small>
                  <small>CSS3</small>
                  <small>JavaScript</small>
                  <small>ReactJs</small>
                  <small>NodeJs</small>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      );



};

export default  TrainerProfile;