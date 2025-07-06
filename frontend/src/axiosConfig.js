import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // sửa thành URL backend của bạn nếu khác
  withCredentials: true, // nếu dùng cookie xác thực
});

export default instance;