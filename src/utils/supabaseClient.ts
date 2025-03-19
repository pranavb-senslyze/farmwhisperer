
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
    console.log('Fetching farmers data...');
    
    // First, fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return [];
    }
    
    console.log('Users fetched:', users);
    
    if (!users || users.length === 0) {
      console.warn('No users found');
      return [];
    }
    
    // Now fetch related data for each user
    const farmers = await Promise.all(users.map(async (user) => {
      // Fetch source data
      const { data: sourceData, error: sourceError } = await supabase
        .from('source')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (sourceError && sourceError.code !== 'PGRST116') {
        console.error(`Error fetching source for user ${user.id}:`, sourceError);
      }
      
      // Fetch crop data
      const { data: cropData, error: cropError } = await supabase
        .from('crop_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (cropError && cropError.code !== 'PGRST116') {
        console.error(`Error fetching crop_data for user ${user.id}:`, cropError);
      }
      
      // Fetch demographics data
      const { data: demographicsData, error: demographicsError } = await supabase
        .from('demographics')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (demographicsError && demographicsError.code !== 'PGRST116') {
        console.error(`Error fetching demographics for user ${user.id}:`, demographicsError);
      }
      
      // Fetch organization data
      const { data: organizationData, error: organizationError } = await supabase
        .from('organization')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (organizationError && organizationError.code !== 'PGRST116') {
        console.error(`Error fetching organization for user ${user.id}:`, organizationError);
      }
      
      // Combine all data
      const userData: UserData = {
        ...user,
        source: sourceData || undefined,
        crop_data: cropData || undefined,
        demographics: demographicsData || undefined,
        organization: organizationData || undefined
      };
      
      return transformToFarmer(userData);
    }));
    
    console.log('Transformed farmers:', farmers);
    return farmers;
  } catch (error) {
    console.error('Error in fetchFarmers:', error);
    return [];
  }
};

// Apply filters to fetch filtered farmers
export const fetchFilteredFarmers = async (filters: FilterParams): Promise<Farmer[]> => {
  try {
    console.log('Fetching filtered farmers with filters:', filters);
    
    // Start with all farmers
    const allFarmers = await fetchFarmers();
    
    // Apply filters in memory (since we're using separate tables)
    let filteredFarmers = allFarmers;
    
    // Apply demographics filters
    if (filters.demographics) {
      if (filters.demographics.district && filters.demographics.district.length > 0) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          filters.demographics?.district?.includes(farmer.district)
        );
      }
      
      if (filters.demographics.state && filters.demographics.state.length > 0) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          filters.demographics?.state?.includes(farmer.state)
        );
      }
      
      if (filters.demographics.gender) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.gender === filters.demographics?.gender
        );
      }
      
      if (filters.demographics.religion) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.religion === filters.demographics?.religion
        );
      }
      
      if (filters.demographics.caste_category) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.caste_category === filters.demographics?.caste_category
        );
      }
      
      if (filters.demographics.marital_status) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.marital_status === filters.demographics?.marital_status
        );
      }
      
      if (filters.demographics.age) {
        if (filters.demographics.age.min !== undefined) {
          filteredFarmers = filteredFarmers.filter(farmer => 
            farmer.age >= (filters.demographics?.age?.min || 0)
          );
        }
        if (filters.demographics.age.max !== undefined) {
          filteredFarmers = filteredFarmers.filter(farmer => 
            farmer.age <= (filters.demographics?.age?.max || 100)
          );
        }
      }
    }
    
    // Apply crop data filters
    if (filters.crop_data) {
      if (filters.crop_data.irrigation_facility !== undefined) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.irrigation_facility === filters.crop_data?.irrigation_facility
        );
      }
      
      if (filters.crop_data.land_owned) {
        if (filters.crop_data.land_owned.min !== undefined) {
          filteredFarmers = filteredFarmers.filter(farmer => 
            farmer.land_owned >= (filters.crop_data?.land_owned?.min || 0)
          );
        }
        if (filters.crop_data.land_owned.max !== undefined) {
          filteredFarmers = filteredFarmers.filter(farmer => 
            farmer.land_owned <= (filters.crop_data?.land_owned?.max || 100)
          );
        }
      }
      
      // For crop types, check if any of the farmer's crop types match any in the filter
      if (filters.crop_data.crop_types && filters.crop_data.crop_types.length > 0) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.crop_types.some(type => 
            filters.crop_data?.crop_types?.includes(type)
          )
        );
      }
      
      // For crops, check if any of the farmer's crops match any in the filter
      if (filters.crop_data.crops && filters.crop_data.crops.length > 0) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.crops.some(crop => 
            filters.crop_data?.crops?.includes(crop)
          )
        );
      }
    }
    
    // Apply organization filters
    if (filters.organization) {
      if (filters.organization.associated_with_fpo !== undefined) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.associated_with_fpo === filters.organization?.associated_with_fpo
        );
      }
      
      if (filters.organization.fpo_name) {
        filteredFarmers = filteredFarmers.filter(farmer => 
          farmer.fpo_name === filters.organization?.fpo_name
        );
      }
    }
    
    // Apply source filters
    if (filters.source && filters.source.name) {
      filteredFarmers = filteredFarmers.filter(farmer => 
        farmer.source === filters.source?.name
      );
    }
    
    console.log('Filtered farmers:', filteredFarmers);
    return filteredFarmers;
  } catch (error) {
    console.error('Error in fetchFilteredFarmers:', error);
    return [];
  }
};
