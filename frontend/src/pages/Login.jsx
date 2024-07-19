import React, { useContext, useEffect, useState } from "react";
import styles from "./Login.module.css";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import UserContext from "../context/user";

const Login = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [viewPw, setViewPw] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [inputType, setInputType] = useState("password");

  const { data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      try {
        return await fetchData(
          "/api/user/login",
          "POST",
          { email, password },
          undefined
        );
      } catch (error) {
        throw error.message;
      }
    },
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      userCtx.setAccessToken(data.access);
      // const decoded = jwtDecode(data.access);
      console.log(data.access);
      console.log("login successful");
    }
  }, [data]);

  const handleShowPw = (type) => {
    setViewPw(!viewPw);
    setInputType(type);
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Login</h2>
            <p>Welcome back.</p>
          </div>

          <div className={styles.form}>
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
            <button onClick={refetch}>Sign In</button>
            <div>
              Don't have an account?{" "}
              <span onClick={() => props.handleShowLogin()}>Join</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
