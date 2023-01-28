import fs from 'react-native-fs';

export const DIRECTORY_RECEIPT_PHOTOS =
  fs.DocumentDirectoryPath + '/receiptphotos';
export const DIRECTORY_FACE_PHOTOS = fs.DocumentDirectoryPath + '/facephotos';
export const DIRECTORY_PROFILE_PHOTOS =
  fs.DocumentDirectoryPath + '/profilephotos';

fs.mkdir(DIRECTORY_RECEIPT_PHOTOS);
fs.mkdir(DIRECTORY_FACE_PHOTOS);
fs.mkdir(DIRECTORY_PROFILE_PHOTOS);

export const watermelonToServerMap = {
  id_db: 'id',
  address_latitude: 'address_latitude',
  address_longitude: 'address_longitude',
  amount: 'amount',
  beneficiary_age: 'beneficiary_age',
  beneficiary_id_db: 'beneficiary_id',
  city_id_db: 'city_id',
  city_latitude: 'city_latitude',
  city_longitude: 'city_longitude',
  delivered_by_id_db: 'delivered_by_id',
  delivery_event_id_db: 'delivery_event_id',
  delivery_list_id_db: 'delivery_list_id',
  delivered_date: 'delivered_date',
  enrollment_id_db: 'enrollment_id',
  locality_id_db: 'locality_id',
  locality_latitude: 'locality_latitude',
  locality_longitude: 'locality_longitude',
  school_id_db: 'school_id',
  school_latitude: 'school_latitude',
  school_longitude: 'school_longitude',
  program_social_id_db: 'program_social_id',
  social_program_announcement_id_db: 'social_program_announcement_id',
  beneficiary_birthday: 'beneficiary_birthday',
  beneficiary_curp: 'beneficiary_curp',
  beneficiary_email: 'beneficiary_email',
  beneficiary_gender: 'beneficiary_gender',
  beneficiary_lastname: 'beneficiary_lastname',
  beneficiary_name: 'beneficiary_name',
  card_number: 'card_number',
  city_name: 'city_name',
  comments: 'comments',
  face_encodings: 'face_encodings',
  full_address: 'full_address',
  locality_name: 'locality_name',
  school_level: 'school_level',
  school_name: 'school_name',
  status: 'status',
  photo: 'photo',
  profile_photo: 'profile_photo',
  receipt_photo: 'receipt_photo',
};

export const watermelonToServerMapForDeliveryList = {
  id_db: 'id',
  event_id_db: 'event_id',
  event_name: 'event_name',
  name: 'name',
  beneficiary_initials: 'beneficiary_initials',
};

export const watermelonToServerMapForPhotos = {
  user_id_db: 'user_id',
  delivery_id_db: 'delivery_id',
  field_to_fill: 'field_to_fill',
  photo: 'photo',
  is_synced: 'is_synced',
};

export const serverToWatermelonMap = {
  address_latitude: 'address_latitude',
  address_longitude: 'address_longitude',
  amount: 'amount',
  beneficiary_age: 'beneficiary_age',
  beneficiary_birthday: 'beneficiary_birthday',
  beneficiary_curp: 'beneficiary_curp',
  beneficiary_email: 'beneficiary_email',
  beneficiary_gender: 'beneficiary_gender',
  beneficiary_id: 'beneficiary_id_db',
  beneficiary_lastname: 'beneficiary_lastname',
  beneficiary_name: 'beneficiary_name',
  card_number: 'card_number',
  city_id: 'city_id_db',
  city_latitude: 'city_latitude',
  city_longitude: 'city_longitude',
  city_name: 'city_name',
  comments: 'comments',
  delivered_by_id: 'delivered_by_id_db',
  delivery_event_id: 'delivery_event_id_db',
  delivery_list_id: 'delivery_list_id_db',
  delivered_date: 'delivered_date',
  enrollment_id: 'enrollment_id_db',
  face_encodings: 'face_encodings',
  full_address: 'full_address',
  id: 'id_db',
  locality_id: 'locality_id_db',
  locality_latitude: 'locality_latitude',
  locality_longitude: 'locality_longitude',
  locality_name: 'locality_name',
  program_social_id: 'program_social_id_db',
  school_id: 'school_id_db',
  school_latitude: 'school_latitude',
  school_level: 'school_level',
  school_longitude: 'school_longitude',
  school_name: 'school_name',
  social_program_announcement_id: 'social_program_announcement_id_db',
  status: 'status',
  photo: 'photo',
  profile_photo: 'profile_photo',
  receipt_photo: 'receipt_photo',
};
