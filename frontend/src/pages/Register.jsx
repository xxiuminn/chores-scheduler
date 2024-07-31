import React, { useState } from "react";
import styles from "./Login.module.css";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";

const Register = (props) => {
  const fetchData = useFetch();
  const [viewPw, setViewPw] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () =>
      await fetchData(
        "/auth/register",
        "PUT",
        {
          name,
          email,
          password,
        },
        undefined
      ),
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    mutate();
  };

  const handleShowPw = (type) => {
    setViewPw(!viewPw);
    setInputType(type);
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Register</h2>
            <p>For an account.</p>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            <label htmlFor="name">Name</label>
            <div className={styles.inputbox}>
              <input
                name="name"
                type="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="email">Email</label>
            <div className={styles.inputbox}>
              <input
                name="email"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
            </div>
            <label htmlFor="password">Password</label>
            <div className={styles.inputbox}>
              <input
                name="password"
                id="password"
                type={inputType}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                maxLength="50"
                minLength="8"
              ></input>
              {!viewPw && (
                <i
                  className="bi bi-eye"
                  onClick={() => handleShowPw("text")}
                ></i>
              )}
              {viewPw && (
                <i
                  className="bi bi-eye-slash"
                  onClick={() => handleShowPw("password")}
                ></i>
              )}
            </div>
            <button type="submit">Join</button>
            <div>
              Have an account?{" "}
              <span className={styles.link}>
                <Link to="/login">Sign in</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
