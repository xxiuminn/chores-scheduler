import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const Subscription = () => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  const queryClient = useQueryClient();

  //retrieve user's group:
  const { data: usergroupData } = useQuery({
    queryKey: ["usergroup"],
    queryFn: async () => {
      return await fetchData(
        "/users/" + jwtDecode(accessToken).uuid,
        undefined,
        undefined,
        accessToken
      );
    },
  });

  const { data: subscribeData, refetch: subscribeRefetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return await fetchData(
        "/subscribe/create-checkout-session",
        "POST",
        undefined,
        accessToken
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (subscribeData && usergroupData) {
      console.log(subscribeData);
      window.location = subscribeData.url;
      // updateAcct();
    }
  }, [subscribeData]);

  const { mutate: updateAcct } = useMutation({
    mutationFn: async () => {
      await fetchData(
        "/usergroups/accounttype",
        "PATCH",
        {
          account_type: "PAID",
          usergroup_id: usergroupData.group_id,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usergroup"]);
    },
  });

  return <button onClick={subscribeRefetch}>Subscribe</button>;
};

export default Subscription;
