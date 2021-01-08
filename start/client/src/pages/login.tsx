import React from "react";
import { gql, useMutation } from "@apollo/client";

import LoginFrom from "./../components/login-form";
import Loading from "./../components/loading";

import * as LoginTypes from "./__generated__/login";
import LoginForm from "./../components/login-form";

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      email
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
      }
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occured</p>;

  return <LoginForm login={login} />;
}
