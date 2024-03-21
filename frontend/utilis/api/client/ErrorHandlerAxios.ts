import axios from "axios";

const errorHandlerAxiosInstance = axios.create({ baseURL: "api/" });

export default errorHandlerAxiosInstance;
