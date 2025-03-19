
export type Farmer = {
  id: string;
  first_name: string;
  last_name: string;
  name?: string; // Virtual field that will be computed
  contact: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  district: string;
  state: string;
  religion: string;
  caste_category: string;
  marital_status: string;
  land_owned: number; // in acres
  crop_types: string[];
  crops: string[];
  irrigation_facility: boolean;
  associated_with_fpo: boolean;
  fpo_name?: string;
  source: string;
};

export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  mobile_number1: string;
  mobile_number2?: string;
  mobile_number3?: string;
  mobile_number1_country_code: string;
  email_id?: string;
  data_role: string;
  whatsapp_validation?: 'Valid' | 'Invalid';
  smartu_product_used: string;
  data_uploaded_date: string;
  data_uploaded_by: string;
  // Related data from other tables
  source?: SourceData;
  crop_data?: CropData;
  demographics?: DemographicsData;
  organization?: OrganizationData;
};

export type SourceData = {
  user_id: number;
  source1: string;
  source2?: string;
  source3?: string;
  source_remarks?: string;
  wa_fb_group_name: string;
};

export type CropData = {
  user_id: number;
  crop_associated: string;
  crop_types: string;
  land_owned: number;
  irrigation_facility?: 'Yes' | 'No';
  crop_cultivation_year?: number;
  farm_machinery_owned?: string;
};

export type DemographicsData = {
  user_id: number;
  gender?: 'Male' | 'Female';
  country?: string;
  state?: string;
  district?: string;
  block_taluka?: string;
  village_name?: string;
  pincode: string;
  full_address?: string;
  caste_category?: string;
  religion?: string;
  aadhaar_number?: string;
  pan_number?: string;
  land_identification_number?: string;
  age: number;
  marital_status?: string;
  bank_account_holder?: 'Yes' | 'No';
  bank_name?: string;
  occupation?: string;
  income_range?: string;
};

export type OrganizationData = {
  user_id: number;
  associated_with_fpo?: 'Yes' | 'No';
  fpo_name?: string;
  fpo_address?: string;
};

export type FilterParams = {
  demographics?: {
    district?: string[];
    state?: string[];
    gender?: string;
    age?: { min?: number; max?: number };
    religion?: string;
    caste_category?: string;
    marital_status?: string;
  };
  crop_data?: {
    crop_types?: string[];
    crops?: string[];
    irrigation_facility?: boolean;
    land_owned?: { min?: number; max?: number };
  };
  organization?: {
    associated_with_fpo?: boolean;
    fpo_name?: string;
  };
  source?: {
    name?: string;
  };
};

export type NLPParseResult = {
  filters: FilterParams;
  originalQuery: string;
};

export type SortDirection = 'asc' | 'desc' | undefined;

export type SortConfig = {
  key: keyof Farmer | '';
  direction: SortDirection;
};

export type PaginationConfig = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};
