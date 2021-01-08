import React from "react";
import { gql, useMutation } from "@apollo/client";

import Loading from "./../components/loading";

import * as LoginTypes from "./__generated__/login";
import LoginForm from "./../components/login-form";
import { isLoggedInVar } from "../cache";

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      email
      token
    }
  }
`;

export default function Login() {
  const [login, { loading, error }] = useMutation<
    LoginTypes.Login,
    LoginTypes.LoginVariables
  >(LOGIN_USER, {
    onCompleted: ({ login }) => {
      if (login) {
        localStorage.setItem("token", login.token as string);
        localStorage.setItem("userId", login.id as string);
        isLoggedInVar(true);
      }
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occured</p>;

  return <LoginForm login={login} />;
}
