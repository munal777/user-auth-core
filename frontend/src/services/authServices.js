import axios from "axios";
import { API_ROUTES } from "../config/api";

export const googleLoginService = async (credential) => {
    
  const response = await axios.post(API_ROUTES.AUTH.GOOGLE_LOGIN, {
    credential,
  });

  return response;
};
