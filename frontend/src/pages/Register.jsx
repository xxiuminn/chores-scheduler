import React, { useState } from "react";
import styles from "./Login.module.css";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";

const Register = (props) => {
  const fetchData = useFetch();
  const [viewPw, setViewPw] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("password");

  const { mutate } = useMutation({
    mutationFn: async () =>
      await fetchData(
        "/auth/register",
        "POST",
        {
          name,
          email,
          password,
        },
        undefined
      ),
    onSuccess: () => props.handleShowLogin(),
  });

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

          <div className={styles.form}>
            <label htmlFor="name">Name</label>
            <div className={styles.inputbox}>
              <input
                name="name"
                type="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <label htmlFor="email">Email</label>
            <div className={styles.inputbox}>
              <input
                name="email"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
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
            <button onClick={mutate}>Join</button>
            <div>
              Have an account?{" "}
              <span onClick={() => props.handleShowLogin()}>Sign in</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
