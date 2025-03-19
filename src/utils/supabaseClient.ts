
import { supabase } from '../integrations/supabase/client';
import { Farmer, FilterParams, UserData, SourceData, CropData, DemographicsData, OrganizationData } from '../types';

// Helper to transform from our database schema to the Farmer type needed for the UI
export const transformToFarmer = (userData: UserData): Farmer => {
  const demographic = userData.demographics || {} as DemographicsData;
  const cropData = userData.crop_data || {} as CropData;
  const orgData = userData.organization || {} as OrganizationData;
  const sourceData = userData.source || {} as SourceData;

  // Convert crops and crop_types from comma-separated strings to arrays
  const crops = cropData.crop_associated ? cropData.crop_associated.split(', ') : [];
  const cropTypes = cropData.crop_types ? cropData.crop_types.split(', ') : [];
  
  return {
    id: userData.id.toString(),
    first_name: userData.first_name,
    last_name: userData.last_name,
    name: `${userData.first_name} ${userData.last_name}`,
    contact: userData.mobile_number1,
    gender: demographic.gender as 'Male' | 'Female' | 'Other',
    age: demographic.age || 0,
    district: demographic.district || '',
    state: demographic.state || '',
    religion: demographic.religion || '',
    caste_category: demographic.caste_category || '',
    marital_status: demographic.marital_status || '',
    land_owned: cropData.land_owned || 0,
    crop_types: cropTypes,
    crops: crops,
    irrigation_facility: cropData.irrigation_facility === 'Yes',
    associated_with_fpo: orgData.associated_with_fpo === 'Yes',
    fpo_name: orgData.fpo_name || '',
    source: sourceData.source1 || ''
  };
};

// Fetch all farmer data by joining the tables
export const fetchFarmers = async (): Promise<Farmer[]> => {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        source(*),
        crop_data(*),
        demographics(*),
        organization(*)
      `);
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return [];
    }
    
    // Transform the joined data to our Farmer type
    return users.map(user => transformToFarmer(user as UserData));
  } catch (error) {
    console.error('Error in fetchFarmers:', error);
    return [];
  }
};

// Apply filters to Supabase query
export const fetchFilteredFarmers = async (filters: FilterParams): Promise<Farmer[]> => {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        source(*),
        crop_data(*),
        demographics(*),
        organization(*)
      `);
    
    // Apply demographics filters
    if (filters.demographics) {
      if (filters.demographics.district && filters.demographics.district.length > 0) {
        query = query.in('demographics.district', filters.demographics.district);
      }
      
      if (filters.demographics.gender) {
        query = query.eq('demographics.gender', filters.demographics.gender);
      }
      
      if (filters.demographics.religion) {
        query = query.eq('demographics.religion', filters.demographics.religion);
      }
      
      if (filters.demographics.caste_category) {
        query = query.eq('demographics.caste_category', filters.demographics.caste_category);
      }
      
      if (filters.demographics.marital_status) {
        query = query.eq('demographics.marital_status', filters.demographics.marital_status);
      }
      
      if (filters.demographics.age) {
        if (filters.demographics.age.min !== undefined) {
          query = query.gte('demographics.age', filters.demographics.age.min);
        }
        if (filters.demographics.age.max !== undefined) {
          query = query.lte('demographics.age', filters.demographics.age.max);
        }
      }
    }
    
    // Apply crop data filters
    if (filters.crop_data) {
      if (filters.crop_data.irrigation_facility !== undefined) {
        const irrigationValue = filters.crop_data.irrigation_facility ? 'Yes' : 'No';
        query = query.eq('crop_data.irrigation_facility', irrigationValue);
      }
      
      if (filters.crop_data.land_owned) {
        if (filters.crop_data.land_owned.min !== undefined) {
          query = query.gte('crop_data.land_owned', filters.crop_data.land_owned.min);
        }
        if (filters.crop_data.land_owned.max !== undefined) {
          query = query.lte('crop_data.land_owned', filters.crop_data.land_owned.max);
        }
      }
      
      // For crop types and crops, we need to use LIKE queries for comma-separated strings
      if (filters.crop_data.crop_types && filters.crop_data.crop_types.length > 0) {
        filters.crop_data.crop_types.forEach(cropType => {
          query = query.like('crop_data.crop_types', `%${cropType}%`);
        });
      }
      
      if (filters.crop_data.crops && filters.crop_data.crops.length > 0) {
        filters.crop_data.crops.forEach(crop => {
          query = query.like('crop_data.crop_associated', `%${crop}%`);
        });
      }
    }
    
    // Apply organization filters
    if (filters.organization) {
      if (filters.organization.associated_with_fpo !== undefined) {
        const fpoValue = filters.organization.associated_with_fpo ? 'Yes' : 'No';
        query = query.eq('organization.associated_with_fpo', fpoValue);
      }
      
      if (filters.organization.fpo_name) {
        query = query.eq('organization.fpo_name', filters.organization.fpo_name);
      }
    }
    
    // Apply source filters
    if (filters.source && filters.source.name) {
      query = query.eq('source.source1', filters.source.name);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered farmers:', error);
      return [];
    }
    
    return data.map(user => transformToFarmer(user as UserData));
  } catch (error) {
    console.error('Error in fetchFilteredFarmers:', error);
    return [];
  }
};
