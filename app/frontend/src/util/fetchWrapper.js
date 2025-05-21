import axios from "axios";
import { useSetRecoilState } from "recoil";
import { exceptionAtom } from "../states/index.js";

export const authHeader = () => {
  return {
    Accept: "application/json",
  };
};

export const handleResponse = (response) => {
  const data = response.data;

  if (![200, 201, 204].includes(response.status)) {
    const error = (data && data.message) || response.statusText;
    throw error;
  }

  return response;
};

export function useFetchWrapper() {
  const setExceptions = useSetRecoilState(exceptionAtom);

  const appendException = (err) => {
    setExceptions((prev) => [...prev, err]);
  };

  const request = async (method, url, body) => {
    const requestOptions = {
      url: url,
      method: method,
      headers: authHeader(),
    };

    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.data = body;
    }

    try {
      const response = await axios.request(requestOptions);
      return handleResponse(response);
    } catch (error) {
      console.error(
        `The following error occurred while requesting ${method} ${url} ${JSON.stringify(body)}: ${error.message || JSON.stringify(error)}`,
      );
      appendException(error);
      throw error;
    }
  };

  return {
    get: (url, body) => request("GET", url, body),
    post: (url, body) => request("POST", url, body),
    put: (url, body) => request("PUT", url, body),
    patch: (url, body) => request("PATCH", url, body),
    delete: (url, body) => request("DELETE", url, body),
  };
}
