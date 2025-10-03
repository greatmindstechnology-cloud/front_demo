// GitHubLoginButton.jsx
import React from 'react';

const GITHUB_CLIENT_ID = "Ov23li0fc9J2XelvcIZ0";
const REDIRECT_URI = "https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/68145b5500021b5b6c65";

const GitHubLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
  };

  return (
    <button onClick={handleLogin} style={styles.button}>
      <img
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub logo"
        style={styles.icon}
      />
      Login with GitHub
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#24292e",
    color: "white",
    padding: "1rem 12rem",
    border: "none",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  icon: {
    width: "24px",
    height: "24px",
    marginRight: "20px",
  },
};

export default GitHubLoginButton;
