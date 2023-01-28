import WatermelonSingleton from '../../model/database';
import {watermelonToServerMapForPhotos} from './helpers';

const getPhotos = async () => {
  const connection = new WatermelonSingleton();
  try {
    const photosCollection = await connection.db.get('photos').query().fetch();

    // transform to server keys objects:
    const newArray = [];
    for (const currPhoto of photosCollection) {
      const curr = currPhoto._raw;
      const newObj = {};
      for (const watermelonKey of Object.keys(curr)) {
        const serverKey = watermelonToServerMapForPhotos[watermelonKey];
        if (serverKey !== undefined) {
          newObj[serverKey] = curr[watermelonKey];
        }
      }
      newArray.push(newObj);
    }

    return newArray;
  } catch (error) {
    console.log('Error executing query', error);
    return false;
  }
};

export default getPhotos;
