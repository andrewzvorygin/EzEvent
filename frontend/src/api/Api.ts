import {
  EventQueryType,
  LoginType,
  MyEventQueryType,
  ProfileType,
  RegisterType,
} from "../types";

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
  async putProfile(data: any) {
    return await fetch(`${baseUrl}profile/`, {
      method: "PUT",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getProfilePhoto(profileId: string) {
    return await fetch(`${baseUrl}profile/getPhoto?path=${profileId}`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    });
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

export const cityAPI = {
  async getCity(cityId: number) {
    return await fetch(`${baseUrl}city?city_id=${cityId}`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getCityByPrefix(prefix: string) {
    return await fetch(`${baseUrl}city/get_by_prefix?prefix=${prefix}`)
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
  async getEvents(data: EventQueryType) {
    const location =
      data.location !== undefined ? `&location=${data.location}` : ``;
    const dateEnd = data.dateEnd
      ? `&date_end=${new Date(data.dateEnd).toISOString()}`
      : ``;
    const dateStart = data.dateStart
      ? `&date_start=${new Date(data.dateStart).toISOString()}`
      : ``;
    const search = data.search?.length !== 0 ? `&search=${data.search}` : ``;

    return await fetch(
      `${baseUrl}event/events_registry?limit=${data.limit}&offset=${data.offset}${dateStart}${dateEnd}${location}${search}`,
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getMyEvents(data: MyEventQueryType) {
    const location =
      data.location !== undefined ? `&location=${data.location}` : ``;
    const dateEnd = data.dateEnd
      ? `&date_end=${new Date(data.dateEnd).toISOString()}`
      : ``;
    const dateStart = data.dateStart
      ? `&date_start=${new Date(data.dateStart).toISOString()}`
      : ``;
    const search = data.search?.length !== 0 ? `&search=${data.search}` : ``;

    return await fetch(
      `${baseUrl}event/my_events?limit=${data.limit}&offset=${data.offset}&typeUser=${data.typeUser}${dateStart}${dateEnd}${location}${search}`,
      {
        method: "GET",
        headers: {
          "Access-Token": window.localStorage.getItem("access_token") || "",
        },
      },
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getEvent(eventId: string) {
    return await fetch(`${baseUrl}event/read/${eventId}`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async putOrganizersKeyInvite(eventId: string) {
    return await fetch(`${baseUrl}event/organizers/key_invite/${eventId}`, {
      method: "PUT",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    }).catch((error) => console.error(error));
  },
  async getOrganizersKeyInvite(
    eventId: string,
    checkResponse?: (response: Response) => void,
  ) {
    return await fetch(`${baseUrl}event/organizers/key_invite/${eventId}`, {
      method: "POST",
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
  async addOrganizers(eventId: string, key: string) {
    return await fetch(`${baseUrl}event/organizers/${eventId}`, {
      method: "POST",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ key: key }),
    });
  },
  async registerOnEvent(eventId: string) {
    return await fetch(`${baseUrl}event/visit/${eventId}`, {
      method: "POST",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
      },
    });
  },
  async postComment(eventId: number, text: string, parent_id?: number) {
    return await fetch(`${baseUrl}event/comment`, {
      method: "POST",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ event_id: eventId, text, parent_id }),
    });
  },
  async getComments(eventId: number) {
    return await fetch(`${baseUrl}event/event/comment/${eventId}`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
  async getParticipants(eventId: number) {
    return await fetch(`${baseUrl}event/participants?event_uuid=${eventId}`, {
      method: "GET",
      headers: {
        "Access-Token": window.localStorage.getItem("access_token") || "",
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};
