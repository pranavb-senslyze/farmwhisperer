import { FilterParams, NLPParseResult } from '../types';
import { filterOptions } from './mockData';

export const parseNaturalLanguageQuery = (query: string): NLPParseResult => {
  const normalizedQuery = query.toLowerCase();
  const filters: FilterParams = {};

  // Initialize filter categories if needed
  if (!filters.demographics) filters.demographics = {};
  if (!filters.crop_data) filters.crop_data = {};
  if (!filters.organization) filters.organization = {};
  
  // Parse district information
  filterOptions.demographics.district.forEach(district => {
    if (normalizedQuery.includes(district.toLowerCase())) {
      if (!filters.demographics!.district) filters.demographics!.district = [];
      filters.demographics!.district.push(district);
    }
  });

  // Parse gender
  if (normalizedQuery.includes('female') || normalizedQuery.includes('women')) {
    filters.demographics!.gender = 'Female';
  } else if (normalizedQuery.includes('male') || normalizedQuery.includes('men')) {
    filters.demographics!.gender = 'Male';
  }

  // Parse crop types
  filterOptions.crop_data.cropTypes.forEach(cropType => {
    if (normalizedQuery.includes(cropType.toLowerCase())) {
      if (!filters.crop_data!.crop_types) filters.crop_data!.crop_types = [];
      filters.crop_data!.crop_types.push(cropType);
    }
  });

  // Parse specific crops
  filterOptions.crop_data.crops.forEach(crop => {
    if (normalizedQuery.includes(crop.toLowerCase())) {
      if (!filters.crop_data!.crops) filters.crop_data!.crops = [];
      filters.crop_data!.crops.push(crop);
    }
  });

  // Parse irrigation facility
  if (
    normalizedQuery.includes('irrigation') || 
    normalizedQuery.includes('irrigated') ||
    normalizedQuery.includes('water facility')
  ) {
    filters.crop_data!.irrigation_facility = true;
  }

  // Parse FPO association
  if (
    normalizedQuery.includes('fpo') || 
    normalizedQuery.includes('farmer producer organization') ||
    normalizedQuery.includes('association')
  ) {
    filters.organization!.associated_with_fpo = true;
    
    // Check for specific FPO names
    filterOptions.organization.fpoName.forEach(fpoName => {
      if (fpoName && normalizedQuery.includes(fpoName.toLowerCase())) {
        filters.organization!.fpo_name = fpoName;
      }
    });
  }

  // Parse land ownership
  const landRegex = /(\d+(?:\.\d+)?)\s*acres?/i;
  const moreThanRegex = /more than\s+(\d+(?:\.\d+)?)\s*acres?/i;
  const lessThanRegex = /less than\s+(\d+(?:\.\d+)?)\s*acres?/i;
  
  const moreThanMatch = normalizedQuery.match(moreThanRegex);
  const lessThanMatch = normalizedQuery.match(lessThanRegex);
  
  if (moreThanMatch) {
    if (!filters.crop_data!.land_owned) filters.crop_data!.land_owned = {};
    filters.crop_data!.land_owned.min = parseFloat(moreThanMatch[1]);
  }
  
  if (lessThanMatch) {
    if (!filters.crop_data!.land_owned) filters.crop_data!.land_owned = {};
    filters.crop_data!.land_owned.max = parseFloat(lessThanMatch[1]);
  }

  // Parse religion
  const religions = ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'islam'];
  religions.forEach(religion => {
    if (normalizedQuery.includes(religion)) {
      let formalReligion = religion.charAt(0).toUpperCase() + religion.slice(1);
      // Map Islam to Muslim for consistency
      if (formalReligion === 'Islam') {
        formalReligion = 'Muslim';
      }
      filters.demographics!.religion = formalReligion;
    }
  });

  // Parse marital status
  if (normalizedQuery.includes('married')) {
    filters.demographics!.marital_status = 'Married';
  } else if (normalizedQuery.includes('unmarried') || normalizedQuery.includes('single')) {
    filters.demographics!.marital_status = 'Single';
  } else if (normalizedQuery.includes('widow')) {
    filters.demographics!.marital_status = 'Widow';
  } else if (normalizedQuery.includes('separated')) {
    filters.demographics!.marital_status = 'Separated';
  }

  return {
    filters,
    originalQuery: query
  };
};

// This function is no longer needed as we're using Supabase directly
// but we'll keep it for reference or fallback purposes
export const applyFilters = (filters: FilterParams, data: any[]): any[] => {
  return [];
};
