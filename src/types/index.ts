
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
