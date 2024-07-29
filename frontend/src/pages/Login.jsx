import React, { useContext, useEffect, useState } from "react";
import styles from "./Login.module.css";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

const Login = (props) => {
  const fetchData = useFetch();
  const [viewPw, setViewPw] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  // const [userData, setUserData] = useState("");

  const { data } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      try {
        return await fetchData(
          "/auth/login",
          "POST",
          { email, password },
          undefined
        );
      } catch (error) {
        throw error.message;
      }
    },
    enabled: isLogin,
  });

  useEffect(() => {
    if (data && isLogin) {
      localStorage.setItem("token", data.access);
      const decoded = jwtDecode(data.access);
      console.log("login successful");
      refetch();
      // navigate("/board");
      // setIsLogin(false);
    }
  }, [data]);

  const handleShowPw = (type) => {
    setViewPw(!viewPw);
    setInputType(type);
  };

  // fetch user info

  const { data: getUserData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("get user data please");
      return await fetchData(
        "/users/user/" + jwtDecode(localStorage.getItem("token")).uuid,
        undefined,
        undefined,
        localStorage.getItem("token")
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (getUserData && isLogin) {
      if (getUserData.membership === "ACTIVE") {
        navigate("/board");
      } else {
        navigate("/joingroup");
      }
      setIsLogin(false);
    }
  }, [getUserData]);

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
            <button onClick={() => setIsLogin(!isLogin)}>Sign In</button>
            <div>
              Don't have an account?{" "}
              <span>
                <Link to="/register">Join</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
