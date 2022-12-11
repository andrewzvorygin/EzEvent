import Cookies from "js-cookie";

import { LoginType, RegisterType } from "../types";

const baseUrl = "http://127.0.0.1:8000/";

export const authAPI = {
  async postAuthLogin(data: LoginType) {
    return await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(data),
    });
  },
  async deleteAuthLogin() {
    return await fetch(`${baseUrl}auth/logout`, {
      method: "DELETE",
    }).catch((error) => console.error(error));
  },
  async postAuthRegister(data: RegisterType) {
    return await fetch(`${baseUrl}auth/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  getAuthMe: async () => {
    const accessToken = Cookies.get("access_token") || "";
    return await fetch(`${baseUrl}auth/isAuth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Token": accessToken,
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};
export const eventsAPI = {
  async postEvent() {
    const accessToken = Cookies.get("access_token") || "";
    const csrftoken = Cookies.get("X-CSRF-Token") || "";
    return await fetch(`${baseUrl}event/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRF-Token": csrftoken,
        "Access-Token": accessToken,
      },
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  },
  async getEvent(eventId: string) {
    return await fetch(`${baseUrl}event/read/${eventId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async putOrganizersKeyInvite(eventId: string) {
    return await fetch(`${baseUrl}event/organizers/key_invite/${eventId}`, {
      method: "PUT",
    }).catch((error) => console.error(error));
  },
  async getOrganizersKeyInvite(eventId: string) {
    return await fetch(`${baseUrl}event/organizers/key_invite/${eventId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  addOrganizers: async (eventId: string): Promise<Response> => {
    return await fetch(`${baseUrl}/event/organizers/${eventId}`, {
      method: "POST",
    }).then((response) => response);
  },
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzc3NAc3NzLnJ1IiwiZXhwIjoxNjcwNjcyNTAzfQ.aD6F9JeIZzQ968e7pMshw7etdILdsM4HXZotFVxFpFE
