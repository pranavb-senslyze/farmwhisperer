import React, { useState, useEffect, useMemo } from 'react';
import { FilterParams } from '../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MultiSelect } from './ui/MultiSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { districts, states, religions, casteCategories, maritalStatuses, cropTypes, crops, fpoNames, sources } from '../utils/mockData';

interface FilterPanelProps {
  filters: FilterParams;
  updateFilters: (filters: FilterParams) => void;
  totalResults: number;
}

const AgeRangeSlider: React.FC<{ min: number; max: number; value: number[]; onChange: (value: number[]) => void }> = ({ min, max, value, onChange }) => {
  return (
    <Slider
      defaultValue={value}
      max={max}
      min={min}
      step={1}
      onValueChange={onChange}
      aria-label="Age Range"
    />
  );
};

const LandOwnedSlider: React.FC<{ min: number; max: number; value: number[]; onChange: (value: number[]) => void }> = ({ min, max, value, onChange }) => {
  return (
    <Slider
      defaultValue={value}
      max={max}
      min={min}
      step={0.5}
      onValueChange={onChange}
      aria-label="Land Owned Range"
    />
  );
};

// Update all instances of camelCase property names to snake_case to match our updated types
const FilterPanel: React.FC<FilterPanelProps> = ({ filters, updateFilters, totalResults }) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(filters.demographics?.district || []);
  const [selectedStates, setSelectedStates] = useState<string[]>(filters.demographics?.state || []);
  const [selectedGender, setSelectedGender] = useState<string>(filters.demographics?.gender || '');
  const [selectedReligion, setSelectedReligion] = useState<string>(filters.demographics?.religion || '');
  const [selectedCaste, setSelectedCaste] = useState<string>(filters.demographics?.caste_category || '');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string>(filters.demographics?.marital_status || '');
  const [ageRange, setAgeRange] = useState<[number, number]>([
    filters.demographics?.age?.min || 18,
    filters.demographics?.age?.max || 100,
  ]);
  const [selectedCropTypes, setSelectedCropTypes] = useState<string[]>(filters.crop_data?.crop_types || []);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(filters.crop_data?.crops || []);
  const [selectedIrrigation, setSelectedIrrigation] = useState<boolean | undefined>(filters.crop_data?.irrigation_facility);
  const [landOwnedRange, setLandOwnedRange] = useState<[number, number]>([
    filters.crop_data?.land_owned?.min || 0,
    filters.crop_data?.land_owned?.max || 20,
  ]);
  const [selectedFPOAssociation, setSelectedFPOAssociation] = useState<boolean | undefined>(filters.organization?.associated_with_fpo);
  const [selectedFPOName, setSelectedFPOName] = useState<string>(filters.organization?.fpo_name || '');
  const [selectedSource, setSelectedSource] = useState<string>(filters.source?.name || '');
  
  const handleFilterChange = (category: keyof FilterParams, subCategory: string, value: any) => {
    const newFilters = { ...filters };
    
    if (!newFilters[category]) {
      newFilters[category] = {};
    }
    
    // Set the value
    (newFilters[category] as any)[subCategory] = value;
    
    // Clean up empty filters
    for (const cat in newFilters) {
      if (Object.keys(newFilters[cat as keyof FilterParams] || {}).length === 0) {
        delete newFilters[cat as keyof FilterParams];
      }
    }
    
    updateFilters(newFilters);
  };
  
  const filterOptions = useMemo(() => ({
    districts: [...new Set(districts)].sort(),
    states: [...new Set(states)].sort(),
    religions: [...new Set(religions)].sort(),
    casteCategories: [...new Set(casteCategories)].sort(),
    maritalStatuses: [...new Set(maritalStatuses)].sort(),
    cropTypes: [...new Set(cropTypes)].sort(),
    crops: [...new Set(crops)].sort(),
    fpoNames: [...new Set(fpoNames)].sort(),
    sources: [...new Set(sources)].sort(),
  }), []);
  
  const cropTypeOptions = useMemo(() => filterOptions.cropTypes.map(ct => ({ label: ct, value: ct })), [filterOptions.cropTypes]);
  const cropOptions = useMemo(() => filterOptions.crops.map(c => ({ label: c, value: c })), [filterOptions.crops]);
  
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  
  // Convert filter keys to snake_case
  const handleDistrictChange = (districts: string[]) => {
    handleFilterChange('demographics', 'district', districts.length > 0 ? districts : undefined);
  };
  
  const handleStateChange = (states: string[]) => {
    handleFilterChange('demographics', 'state', states.length > 0 ? states : undefined);
  };
  
  const handleGenderChange = (gender: string) => {
    handleFilterChange('demographics', 'gender', gender || undefined);
  };
  
  const handleReligionChange = (religion: string) => {
    handleFilterChange('demographics', 'religion', religion || undefined);
  };
  
  const handleCasteChange = (caste: string) => {
    handleFilterChange('demographics', 'caste_category', caste || undefined);
  };
  
  const handleMaritalStatusChange = (status: string) => {
    handleFilterChange('demographics', 'marital_status', status || undefined);
  };
  
  const handleAgeChange = (range: [number, number]) => {
    const [min, max] = range;
    handleFilterChange('demographics', 'age', { min, max });
  };
  
  const handleResetAgeFilter = () => {
    handleFilterChange('demographics', 'age', undefined);
  };
  
  const handleCropTypesChange = (types: string[]) => {
    handleFilterChange('crop_data', 'crop_types', types.length > 0 ? types : undefined);
  };
  
  const handleCropsChange = (crops: string[]) => {
    handleFilterChange('crop_data', 'crops', crops.length > 0 ? crops : undefined);
  };
  
  const handleIrrigationChange = (value: boolean | undefined) => {
    handleFilterChange('crop_data', 'irrigation_facility', value);
  };
  
  const handleLandOwnedChange = (range: [number, number]) => {
    const [min, max] = range;
    handleFilterChange('crop_data', 'land_owned', { min, max });
  };
  
  const handleResetLandOwnedFilter = () => {
    handleFilterChange('crop_data', 'land_owned', undefined);
  };
  
  const handleFPOAssociationChange = (value: boolean | undefined) => {
    handleFilterChange('organization', 'associated_with_fpo', value);
  };
  
  const handleFPONameChange = (name: string) => {
    handleFilterChange('organization', 'fpo_name', name || undefined);
  };
  
  const handleSourceChange = (source: string) => {
    handleFilterChange('source', 'name', source || undefined);
  };
  
  const demographicFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.demographics?.district) count++;
    if (filters.demographics?.state) count++;
    if (filters.demographics?.gender) count++;
    if (filters.demographics?.religion) count++;
    if (filters.demographics?.caste_category) count++;
    if (filters.demographics?.marital_status) count++;
    if (filters.demographics?.age) count++;
    return count;
  }, [filters.demographics]);
  
  const cropFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.crop_data?.crop_types) count++;
    if (filters.crop_data?.crops) count++;
    if (filters.crop_data?.irrigation_facility !== undefined) count++;
    if (filters.crop_data?.land_owned) count++;
    return count;
  }, [filters.crop_data]);
  
  const organizationFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.organization?.associated_with_fpo !== undefined) count++;
    if (filters.organization?.fpo_name) count++;
    return count;
  }, [filters.organization]);
  
  const sourceFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.source?.name) count++;
    return count;
  }, [filters.source]);
  
  const totalActiveFilters = useMemo(() => {
    return demographicFiltersCount + cropFiltersCount + organizationFiltersCount + sourceFiltersCount;
  }, [demographicFiltersCount, cropFiltersCount, organizationFiltersCount, sourceFiltersCount]);
  
  const handleClearFilters = () => {
    updateFilters({});
    // Reset all local filter states
    setSelectedDistricts([]);
    setSelectedStates([]);
    setSelectedGender('');
    setSelectedReligion('');
    setSelectedCaste('');
    setSelectedMaritalStatus('');
    setAgeRange([18, 100]);
    setSelectedCropTypes([]);
    setSelectedCrops([]);
    setSelectedIrrigation(undefined);
    setLandOwnedRange([0, 20]);
    setSelectedFPOAssociation(undefined);
    setSelectedFPOName('');
    setSelectedSource('');
  };
  
  // Need to update the fields to use snake_case in the accordion panels
  return (
    <div className="mb-8">
      {totalActiveFilters > 0 && (
        <div className="mb-4">
          <Badge variant="secondary">
            {totalActiveFilters} filter{totalActiveFilters !== 1 ? 's' : ''} active
          </Badge>
        </div>
      )}
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="demographics" className="border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium">Demographics</h3>
              {demographicFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{demographicFiltersCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">District</label>
                <MultiSelect
                  options={districts.map(d => ({ label: d, value: d }))}
                  value={filters.demographics?.district || []}
                  onChange={handleDistrictChange}
                  placeholder="Select districts..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <MultiSelect
                  options={states.map(s => ({ label: s, value: s }))}
                  value={filters.demographics?.state || []}
                  onChange={handleStateChange}
                  placeholder="Select states..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <Select value={filters.demographics?.gender || ''} onValueChange={handleGenderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Religion</label>
                <Select value={filters.demographics?.religion || ''} onValueChange={handleReligionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {religions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Caste Category</label>
                <Select value={filters.demographics?.caste_category || ''} onValueChange={handleCasteChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select caste category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {casteCategories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Marital Status</label>
                <Select value={filters.demographics?.marital_status || ''} onValueChange={handleMaritalStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {maritalStatuses.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Age Range</label>
                  {filters.demographics?.age && (
                    <Button variant="ghost" size="sm" onClick={handleResetAgeFilter} className="h-6 px-2">
                      Reset
                    </Button>
                  )}
                </div>
                <div className="pt-4 px-1">
                  <AgeRangeSlider 
                    min={18} 
                    max={100}
                    value={[
                      filters.demographics?.age?.min || 18,
                      filters.demographics?.age?.max || 100
                    ]}
                    onChange={handleAgeChange}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="crops" className="border rounded-md overflow-hidden mt-2">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium">Crops & Land</h3>
              {cropFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{cropFiltersCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Crop Types</label>
                <MultiSelect
                  options={cropTypeOptions.map(ct => ({ label: ct, value: ct }))}
                  value={filters.crop_data?.crop_types || []}
                  onChange={handleCropTypesChange}
                  placeholder="Select crop types..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Crops</label>
                <MultiSelect
                  options={cropOptions.map(c => ({ label: c, value: c }))}
                  value={filters.crop_data?.crops || []}
                  onChange={handleCropsChange}
                  placeholder="Select crops..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Irrigation Facility</label>
                <Select 
                  value={filters.crop_data?.irrigation_facility === undefined 
                    ? '' 
                    : filters.crop_data.irrigation_facility ? 'yes' : 'no'
                  } 
                  onValueChange={(val) => {
                    if (val === '') handleIrrigationChange(undefined);
                    else handleIrrigationChange(val === 'yes');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Land Owned (acres)</label>
                  {filters.crop_data?.land_owned && (
                    <Button variant="ghost" size="sm" onClick={handleResetLandOwnedFilter} className="h-6 px-2">
                      Reset
                    </Button>
                  )}
                </div>
                <div className="pt-4 px-1">
                  <LandOwnedSlider 
                    min={0} 
                    max={20}
                    value={[
                      filters.crop_data?.land_owned?.min || 0,
                      filters.crop_data?.land_owned?.max || 20
                    ]}
                    onChange={handleLandOwnedChange}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="organization" className="border rounded-md overflow-hidden mt-2">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium">Organization</h3>
              {organizationFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{organizationFiltersCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Associated with FPO</label>
                <Select 
                  value={filters.organization?.associated_with_fpo === undefined 
                    ? '' 
                    : filters.organization.associated_with_fpo ? 'yes' : 'no'
                  } 
                  onValueChange={(val) => {
                    if (val === '') handleFPOAssociationChange(undefined);
                    else handleFPOAssociationChange(val === 'yes');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select FPO association..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">FPO Name</label>
                <Select value={filters.organization?.fpo_name || ''} onValueChange={handleFPONameChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select FPO..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {fpoNames.map(fpo => (
                      <SelectItem key={fpo} value={fpo}>{fpo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="source" className="border rounded-md overflow-hidden mt-2">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium">Source</h3>
              {sourceFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{sourceFiltersCount}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Source</label>
              <Select value={filters.source?.name || ''} onValueChange={handleSourceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  {sources.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearFilters}
          disabled={totalActiveFilters === 0}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        {totalResults === 0 ? (
          <p>No farmers found with the current filters</p>
        ) : (
          <p>Showing {totalResults} farmer{totalResults !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
