import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://face-id-recognition-eb24vcyziq-uw.a.run.app';
const NO_FACEID = {
  face_detected: false,
  result: false,
};
const NO_FACEID_ENCODINGS = {
  face_detected: false,
  encodings: [],
};

const BYPASS_FACEID = true;
const WITH_FACEID = {
  face_detected: true,
  result: true,
};

const doAsyncFetchFaceEncodings = (url, formData) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        resolve({
          face_detected: data.face_detected,
          encodings: data.encodings,
        });
      })
      .catch(error => {
        console.log('uploadImage error:', error);
        reject(NO_FACEID_ENCODINGS);
      });
  });
};

export const getFaceEncodings = async faceImage => {
  const network = await NetInfo.fetch();
  if (network.isConnected) {
    const formData = new FormData();

    formData.append('file', {
      name: faceImage.fileName,
      type: faceImage.type,
      uri: faceImage.uri,
    });
    const url = `${BASE_URL}/generate-encodings`;

    try {
      const result = await doAsyncFetchFaceEncodings(url, formData);
      return result;
    } catch (error) {
      return NO_FACEID_ENCODINGS;
    }
  }

  return NO_FACEID_ENCODINGS;
};

// =================================================================

const doAsyncFetchCompareFaces = (url, formData) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
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

export const compareFaceEncodings = async (encodings, faceImage) => {
  if (!BYPASS_FACEID) {
    const network = await NetInfo.fetch();

    if (network.isConnected) {
      const formData = new FormData();
      formData.append('file', {
        name: faceImage.fileName,
        type: faceImage.type,
        uri: faceImage.uri,
      });
      formData.append('encodings', JSON.stringify(encodings));
      const url = `${BASE_URL}/compare-faces`;

      try {
        const result = await doAsyncFetchCompareFaces(url, formData);
        return result;
      } catch (error) {
        return NO_FACEID;
      }
    }

    return NO_FACEID;
  } else {
    return WITH_FACEID;
  }
};
