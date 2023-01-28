import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Delivery extends Model {
  static table = 'deliveries';

  @field('id_db') idDb;
  @field('address_latitude') addressLatitude;
  @field('address_longitude') addressLongitude;
  @field('amount') amount;
  @field('beneficiary_age') beneficiaryAge;
  @field('beneficiary_id_db') beneficiaryIdDb;
  @field('city_id_db') cityIdDb;
  @field('city_latitude') cityLatitude;
  @field('city_longitude') cityLongitude;
  @field('delivered_by_id_db') deliveredByIdDb;
  @field('delivery_event_id_db') deliveryEventIdDb;
  @field('delivery_list_id_db') deliveryListIdDb;
  @field('delivered_date') deliveryDateIdDb;
  @field('enrollment_id_db') enrollmentIdDb;
  @field('locality_id_db') localityIdDb;
  @field('locality_latitude') localityLatitude;
  @field('locality_longitude') localityLongitude;
  @field('school_id_db') schoolIdDb;
  @field('school_latitude') schoolLatitude;
  @field('school_longitude') schoolLongitude;
  @field('program_social_id_db') programSocialIdDb;
  @field('social_program_announcement_id_db') socialProgramAnnouncementIdDb;
  @field('beneficiary_birthday') beneficiaryBirthday;
  @field('beneficiary_curp') beneficiaryCurp;
  @field('beneficiary_email') beneficiaryEmail;
  @field('beneficiary_gender') beneficiaryGender;
  @field('beneficiary_lastname') beneficiaryLastname;
  @field('beneficiary_name') beneficiaryName;
  @field('card_number') cardNumber;
  @field('city_name') cityName;
  @field('comments') comments;
  @field('face_encodings') faceEncodings;
  @field('full_address') fullAddress;
  @field('locality_name') localityName;
  @field('school_level') schoolLevel;
  @field('school_name') schoolName;
  @field('status') status;
  @field('photo') photo;
  @field('profile_photo') profilePhoto;
  @field('receipt_photo') receiptPhoto;
  @field('is_synced') isSynced;
}
