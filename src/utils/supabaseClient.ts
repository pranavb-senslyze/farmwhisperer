
import { supabase } from '../integrations/supabase/client';
import { Farmer, FilterParams } from '../types';

// Helper to transform database rows to our Farmer type
export const transformFarmerData = (row: any): Farmer => {
  return {
    id: row.id.toString(),
    first_name: row.first_name,
    last_name: row.last_name,
    name: `${row.first_name} ${row.last_name}`,
    contact: row.contact,
    gender: row.gender,
    age: row.age,
    district: row.district,
    state: row.state,
    religion: row.religion || '',
    caste_category: row.caste_category || '',
    marital_status: row.marital_status || '',
    land_owned: row.land_owned,
    crop_types: row.crop_types || [],
    crops: row.crops || [],
    irrigation_facility: row.irrigation_facility,
    associated_with_fpo: row.associated_with_fpo,
    fpo_name: row.fpo_name || '',
    source: row.source
  };
};

// Fetch all farmers
export const fetchFarmers = async (): Promise<Farmer[]> => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*');
      
    if (error) {
      console.error('Error fetching farmers:', error);
      return [];
    }
    
    return data.map(transformFarmerData);
  } catch (error) {
    console.error('Error in fetchFarmers:', error);
    return [];
  }
};

// Apply filters to Supabase query
export const fetchFilteredFarmers = async (filters: FilterParams): Promise<Farmer[]> => {
  try {
    let query = supabase.from('farmers').select('*');
    
    // Apply demographics filters
    if (filters.demographics) {
      if (filters.demographics.district && filters.demographics.district.length > 0) {
        query = query.in('district', filters.demographics.district);
      }
      
      if (filters.demographics.gender) {
        query = query.eq('gender', filters.demographics.gender);
      }
      
      if (filters.demographics.religion) {
        query = query.eq('religion', filters.demographics.religion);
      }
      
      if (filters.demographics.caste_category) {
        query = query.eq('caste_category', filters.demographics.caste_category);
      }
      
      if (filters.demographics.marital_status) {
        query = query.eq('marital_status', filters.demographics.marital_status);
      }
      
      if (filters.demographics.age) {
        if (filters.demographics.age.min !== undefined) {
          query = query.gte('age', filters.demographics.age.min);
        }
        if (filters.demographics.age.max !== undefined) {
          query = query.lte('age', filters.demographics.age.max);
        }
      }
    }
    
    // Apply crop data filters
    if (filters.crop_data) {
      if (filters.crop_data.irrigation_facility !== undefined) {
        query = query.eq('irrigation_facility', filters.crop_data.irrigation_facility);
      }
      
      if (filters.crop_data.land_owned) {
        if (filters.crop_data.land_owned.min !== undefined) {
          query = query.gte('land_owned', filters.crop_data.land_owned.min);
        }
        if (filters.crop_data.land_owned.max !== undefined) {
          query = query.lte('land_owned', filters.crop_data.land_owned.max);
        }
      }
      
      // Array contains for crop types and crops
      if (filters.crop_data.crop_types && filters.crop_data.crop_types.length > 0) {
        // In Supabase, we need to use overlaps for array contains
        query = query.overlaps('crop_types', filters.crop_data.crop_types);
      }
      
      if (filters.crop_data.crops && filters.crop_data.crops.length > 0) {
        query = query.overlaps('crops', filters.crop_data.crops);
      }
    }
    
    // Apply organization filters
    if (filters.organization) {
      if (filters.organization.associated_with_fpo !== undefined) {
        query = query.eq('associated_with_fpo', filters.organization.associated_with_fpo);
      }
      
      if (filters.organization.fpo_name) {
        query = query.eq('fpo_name', filters.organization.fpo_name);
      }
    }
    
    // Apply source filters
    if (filters.source && filters.source.name) {
      query = query.eq('source', filters.source.name);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered farmers:', error);
      return [];
    }
    
    return data.map(transformFarmerData);
  } catch (error) {
    console.error('Error in fetchFilteredFarmers:', error);
    return [];
  }
};
