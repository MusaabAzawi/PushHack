import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import { loginUser } from "../queries/query";
import { Link as Link2 } from "react-router-dom";

export default function LoginBox({loginStateUpdateFunc}) {
  const [email, setEmail] = useState("");
  const [input_password, setInputPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(email).then((data) => {
      const { password } = data; // Extract t password from the response data
      if (password === input_password) {
        const user_first_name = data.first_name;
        const user_last_name = data.last_name;
        const user_age = data.age;
        const user_gender = data.gender;
        const user_email = data.email;
        localStorage.setItem("user_first_name", user_first_name);
        localStorage.setItem("user_last_name", user_last_name);
        localStorage.setItem("user_age", user_age);
        localStorage.setItem("user_gender", user_gender);
        localStorage.setItem("user_email", user_email);
        loginStateUpdateFunc(true);
        navigate("/", { replace: true });
      } else {
        alert("Password is incorrect");
      }
    });
  };

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="Email"
          label="Your Email"
          name="Email"
          autoComplete="Email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>

        <NavLink to="/register" variant="body2">
          Don't have an account? Sign Up
        </NavLink>

        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/RecSys-SS-2023/Travel_RS_team1"
      >
        Travel RS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}