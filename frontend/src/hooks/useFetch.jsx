import React from "react";

const useFetch = () => {
  console.log("mutation start");
  const fetchData = async (endpoint, method, body, token) => {
    const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + token,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("database error");
    }

    const data = await res.json();
    console.log("mutation end");
    return data;
  };

  return fetchData;
};

export default useFetch;
