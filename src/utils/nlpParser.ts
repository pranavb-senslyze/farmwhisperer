
import { FilterParams, NLPParseResult } from '../types';
import { districts, crops, cropTypes, fpoNames } from './mockData';

export const parseNaturalLanguageQuery = (query: string): NLPParseResult => {
  const normalizedQuery = query.toLowerCase();
  const filters: FilterParams = {};

  // Initialize filter categories if needed
  if (!filters.demographics) filters.demographics = {};
  if (!filters.crop_data) filters.crop_data = {};
  if (!filters.organization) filters.organization = {};
  
  // Parse district information
  districts.forEach(district => {
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
  cropTypes.forEach(cropType => {
    if (normalizedQuery.includes(cropType.toLowerCase())) {
      if (!filters.crop_data!.cropTypes) filters.crop_data!.cropTypes = [];
      filters.crop_data!.cropTypes.push(cropType);
    }
  });

  // Parse specific crops
  crops.forEach(crop => {
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
    filters.crop_data!.irrigationFacility = true;
  }

  // Parse FPO association
  if (
    normalizedQuery.includes('fpo') || 
    normalizedQuery.includes('farmer producer organization') ||
    normalizedQuery.includes('association')
  ) {
    filters.organization!.associatedWithFPO = true;
    
    // Check for specific FPO names
    fpoNames.forEach(fpoName => {
      if (fpoName && normalizedQuery.includes(fpoName.toLowerCase())) {
        filters.organization!.fpoName = fpoName;
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
    if (!filters.crop_data!.landOwned) filters.crop_data!.landOwned = {};
    filters.crop_data!.landOwned.min = parseFloat(moreThanMatch[1]);
  }
  
  if (lessThanMatch) {
    if (!filters.crop_data!.landOwned) filters.crop_data!.landOwned = {};
    filters.crop_data!.landOwned.max = parseFloat(lessThanMatch[1]);
  }

  // Parse religion
  const religions = ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain'];
  religions.forEach(religion => {
    if (normalizedQuery.includes(religion)) {
      filters.demographics!.religion = religion.charAt(0).toUpperCase() + religion.slice(1);
    }
  });

  // Parse marital status
  if (normalizedQuery.includes('married')) {
    filters.demographics!.maritalStatus = 'Married';
  } else if (normalizedQuery.includes('unmarried') || normalizedQuery.includes('single')) {
    filters.demographics!.maritalStatus = 'Unmarried';
  } else if (normalizedQuery.includes('widow')) {
    filters.demographics!.maritalStatus = 'Widow';
  }

  return {
    filters,
    originalQuery: query
  };
};

export const applyFilters = (filters: FilterParams, data: any[]): any[] => {
  return data.filter(item => {
    let matches = true;
    
    // Check demographics filters
    if (filters.demographics) {
      const demo = filters.demographics;
      
      if (demo.district && demo.district.length > 0) {
        matches = matches && demo.district.includes(item.district);
      }
      
      if (demo.state && demo.state.length > 0) {
        matches = matches && demo.state.includes(item.state);
      }
      
      if (demo.gender) {
        matches = matches && item.gender === demo.gender;
      }
      
      if (demo.religion) {
        matches = matches && item.religion === demo.religion;
      }
      
      if (demo.casteCategory) {
        matches = matches && item.casteCategory === demo.casteCategory;
      }
      
      if (demo.maritalStatus) {
        matches = matches && item.maritalStatus === demo.maritalStatus;
      }
      
      if (demo.age && (demo.age.min !== undefined || demo.age.max !== undefined)) {
        if (demo.age.min !== undefined) {
          matches = matches && item.age >= demo.age.min;
        }
        if (demo.age.max !== undefined) {
          matches = matches && item.age <= demo.age.max;
        }
      }
    }
    
    // Check crop_data filters
    if (filters.crop_data) {
      const crop = filters.crop_data;
      
      if (crop.cropTypes && crop.cropTypes.length > 0) {
        matches = matches && crop.cropTypes.some(type => item.cropTypes.includes(type));
      }
      
      if (crop.crops && crop.crops.length > 0) {
        matches = matches && crop.crops.some(c => item.crops.includes(c));
      }
      
      if (crop.irrigationFacility !== undefined) {
        matches = matches && item.irrigationFacility === crop.irrigationFacility;
      }
      
      if (crop.landOwned) {
        if (crop.landOwned.min !== undefined) {
          matches = matches && item.landOwned >= crop.landOwned.min;
        }
        if (crop.landOwned.max !== undefined) {
          matches = matches && item.landOwned <= crop.landOwned.max;
        }
      }
    }
    
    // Check organization filters
    if (filters.organization) {
      const org = filters.organization;
      
      if (org.associatedWithFPO !== undefined) {
        matches = matches && item.associatedWithFPO === org.associatedWithFPO;
      }
      
      if (org.fpoName) {
        matches = matches && item.fpoName === org.fpoName;
      }
    }
    
    // Check source filters
    if (filters.source && filters.source.name) {
      matches = matches && item.source === filters.source.name;
    }
    
    return matches;
  });
};
