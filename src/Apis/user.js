import axios from 'axios';
import {getFaceEncodings} from './faceid';

const BASE_URL = 'https://wobz-government-dif-qro.uw.r.appspot.com/api';

const registerUserUrl = `${BASE_URL}/auth/local/register`;

export const registerUser = async user => {
  const newUser = {
    ...user,
    username: user.email,
  };

  const response = await axios.post(registerUserUrl, newUser);
  console.log(response);
  return response;
};

const validateCurpUrl = `${BASE_URL}/helpers/validate-curp`;

export const validateCurp = async curp => {
  const body = {
    curp,
  };

  const response = await axios.post(validateCurpUrl, body);
  // console.log(response);
  return response;
};

export const updateFaceEncodings = async (faceImage, user) => {
  //TODO:
  // Call face recognition api to get face encodings
  // send encodings to backend in user object with key face_encodings
  const getEncodings = await getFaceEncodings(faceImage);
};

export default registerUser;
