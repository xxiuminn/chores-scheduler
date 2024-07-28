import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";

const Subscription = () => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");

  const { data, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return await fetchData(
        "/create-checkout-session",
        "POST",
        undefined,
        accessToken
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      window.location = data.url;
    }
  });

  return <button onClick={refetch}>Subscribe</button>;
};

export default Subscription;
