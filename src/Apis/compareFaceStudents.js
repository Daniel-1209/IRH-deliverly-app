import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://face-id-recognition-eb24vcyziq-uw.a.run.app';
const NO_FACEID = {
  face_detected: false,
  result: false,
};
const BYPASS_FACEID = true;
const WITH_FACEID = {
  face_detected: true,
  result: true,
};

const doAsyncFetch = formData => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/compare-faces`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        resolve({
          face_detected: data.face_detected,
          result: data.result,
        });
      })
      .catch(error => {
        console.log('uploadImage error:', error);
        reject(NO_FACEID);
      });
  });
};

const compareFaceStudents = async (encodings, faceImage) => {
  if (!BYPASS_FACEID) {
    const network = await NetInfo.fetch();

    if (network.isConnected) {
      const formData = new FormData();
      formData.append('file', {
        name: faceImage.fileName,
        type: faceImage.type,
        uri: faceImage.uri,
      });
      formData.append('encodings', encodings);
      try {
        const result = await doAsyncFetch(formData);
        return result;
      } catch (error) {
        return NO_FACEID;
      }
    } else {
      return NO_FACEID;
    }
  } else {
    return WITH_FACEID;
  }
};

export default compareFaceStudents;
