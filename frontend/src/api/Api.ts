import { LoginType, ProfileType, RegisterType } from "../types";

const baseUrl = "http://localhost:8000/";

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  const [resource, config] = args;
  const response = await originalFetch(resource, config);
  if (response.status === 401 && resource !== `${baseUrl}auth/refresh_token`) {
    const accessToken = await authAPI.putRefreshToken();
    return await originalFetch(resource, {
      ...config,
      headers: {
        "Access-Token": accessToken,
      },
    });
  }
  return response;
};

export const authAPI = {
  async postAuthLogin(
    data: LoginType,
    checkResponse?: (response: Response) => void,
  ) {
    return await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (checkResponse) {
          checkResponse(response);
        }
        return response.json();
      })
      .then((data) => {
        window.localStorage.setItem("access_token", data.access_token);
      });
  },
  async deleteAuthLogin() {
    return await fetch(`${baseUrl}auth/logout`, {
      method: "DELETE",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        window.localStorage.setItem("access_token", data.access_token);
      })
      .catch((error) => console.error(error));
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
  async putRefreshToken() {
    return await fetch(`${baseUrl}auth/refresh_token`, {
      method: "PUT",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        window.localStorage.setItem("access_token", data.access_token);
        return data.access_token;
      })
      .catch((error) => console.error(error));
  },
  getAuthMe: async (checkResponse?: (response: Response) => void) => {
    return await fetch(`${baseUrl}auth/isAuth`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => {
        if (checkResponse) {
          checkResponse(response);
        }
        return response.json();
      })
      .catch((error) => console.error(error));
  },
};

export const profileAPI = {
  async getProfile() {
    return await fetch(`${baseUrl}profile/`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async putProfile(data: ProfileType) {
    return await fetch(`${baseUrl}profile/`, {
      method: "PUT",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getProfilePhoto() {
    return await fetch(`${baseUrl}profile/`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async putProfilePhoto(photo: File) {
    const formData = new FormData();
    formData.append("photo", photo);
    return await fetch(`${baseUrl}profile/uploadPhoto`, {
      method: "PUT",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};

export const eventsAPI = {
  async postEvent() {
    return await fetch(`${baseUrl}event/`, {
      method: "POST",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => response.json())
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
