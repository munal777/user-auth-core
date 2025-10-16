import axios from "axios";
import { API_ROUTES } from "../config/api";

export const GoogleLoginService = async (credential) => {
    
  const response = await axios.post(API_ROUTES.AUTH.GOOGLE_LOGIN, {
    token: credential,
  });

  return response;
};
