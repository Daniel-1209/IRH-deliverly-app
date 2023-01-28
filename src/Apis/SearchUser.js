import axios from 'axios';

const SearchUser = async (email, passwordReceived) => {
  try {
    const response = await axios.post(
      'https://wobz-government-dif-qro.uw.r.appspot.com/api/auth/local',
      {
        identifier: email,
        password: passwordReceived,
      },
    );
    return response;
  } catch (error) {
    return false;
  }
};

export default SearchUser;
