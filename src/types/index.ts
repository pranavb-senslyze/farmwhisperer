
export type Farmer = {
  id: string;
  name: string;
  contact: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  district: string;
  state: string;
  religion: string;
  casteCategory: string;
  maritalStatus: string;
  landOwned: number; // in acres
  cropTypes: string[];
  crops: string[];
  irrigationFacility: boolean;
  associatedWithFPO: boolean;
  fpoName?: string;
  source: string;
};

export type FilterParams = {
  demographics?: {
    district?: string[];
    state?: string[];
    gender?: string;
    age?: { min?: number; max?: number };
    religion?: string;
    casteCategory?: string;
    maritalStatus?: string;
  };
  crop_data?: {
    cropTypes?: string[];
    crops?: string[];
    irrigationFacility?: boolean;
    landOwned?: { min?: number; max?: number };
  };
  organization?: {
    associatedWithFPO?: boolean;
    fpoName?: string;
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
