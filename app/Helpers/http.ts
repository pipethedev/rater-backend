import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

export class HTTPClient {
  static create(config: AxiosRequestConfig): AxiosInstance {
    config.headers = Object.assign(
      { "content-type": "application/json", Accept: "application/json" },
      config.headers
    );

    return axios.create(config);
  }
}