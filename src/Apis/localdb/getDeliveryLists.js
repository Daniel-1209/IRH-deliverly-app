import WatermelonSingleton from '../../model/database';
import {watermelonToServerMapForDeliveryList} from './helpers';

const getDeliveryLists = async () => {
  const connection = new WatermelonSingleton();
  try {
    const listCollection = await connection.db
      .get('deliverylists')
      .query()
      .fetch();

    // transform to server keys objects:
    const newArray = [];
    for (const currList of listCollection) {
      const curr = currList._raw;
      const newObj = {};
      for (const watermelonKey of Object.keys(curr)) {
        const serverKey = watermelonToServerMapForDeliveryList[watermelonKey];
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

export default getDeliveryLists;
