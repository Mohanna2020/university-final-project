import React from "react";
import { useQuery } from "react-query";
import get from "../../service/get";
import { useNavigate, useParams } from "react-router-dom";

const RecoveryPassword = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  return <div>RESEND</div>;
};

export default RecoveryPassword;
