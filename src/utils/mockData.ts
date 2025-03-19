
import { Farmer } from '../types';

export const farmers: Farmer[] = [
  {
    id: '1',
    name: 'Rajesh Patel',
    contact: '+91 9876543210',
    gender: 'Male',
    age: 45,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'OBC',
    maritalStatus: 'Married',
    landOwned: 5.5,
    cropTypes: ['Vegetables', 'Cereals'],
    crops: ['Tomatoes', 'Rice', 'Wheat'],
    irrigationFacility: true,
    associatedWithFPO: true,
    fpoName: 'Nagpur Farmers Collective',
    source: 'Agricultural Census'
  },
  {
    id: '2',
    name: 'Priya Singh',
    contact: '+91 8765432109',
    gender: 'Female',
    age: 38,
    district: 'Amravati',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'General',
    maritalStatus: 'Married',
    landOwned: 3.2,
    cropTypes: ['Fruits', 'Vegetables'],
    crops: ['Oranges', 'Spinach', 'Cauliflower'],
    irrigationFacility: true,
    associatedWithFPO: false,
    source: 'KVK Survey'
  },
  {
    id: '3',
    name: 'Mohammed Khan',
    contact: '+91 7654321098',
    gender: 'Male',
    age: 52,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Muslim',
    casteCategory: 'OBC',
    maritalStatus: 'Married',
    landOwned: 8.0,
    cropTypes: ['Cereals', 'Cash Crops'],
    crops: ['Rice', 'Cotton', 'Pulses'],
    irrigationFacility: true,
    associatedWithFPO: true,
    fpoName: 'Vidarbha Agricultural Producers',
    source: 'Government Survey'
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    contact: '+91 6543210987',
    gender: 'Female',
    age: 41,
    district: 'Wardha',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'SC',
    maritalStatus: 'Widow',
    landOwned: 2.5,
    cropTypes: ['Vegetables'],
    crops: ['Eggplant', 'Okra', 'Chili'],
    irrigationFacility: false,
    associatedWithFPO: true,
    fpoName: 'Women Farmers Collective',
    source: 'NGO Database'
  },
  {
    id: '5',
    name: 'Suresh Sinha',
    contact: '+91 5432109876',
    gender: 'Male',
    age: 60,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'General',
    maritalStatus: 'Married',
    landOwned: 12.0,
    cropTypes: ['Fruits', 'Cash Crops'],
    crops: ['Oranges', 'Soybean', 'Cotton'],
    irrigationFacility: true,
    associatedWithFPO: true,
    fpoName: 'Nagpur Farmers Collective',
    source: 'Agricultural Census'
  },
  {
    id: '6',
    name: 'Anita Sharma',
    contact: '+91 4321098765',
    gender: 'Female',
    age: 35,
    district: 'Amravati',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'OBC',
    maritalStatus: 'Married',
    landOwned: 4.0,
    cropTypes: ['Vegetables', 'Cereals'],
    crops: ['Potatoes', 'Wheat', 'Corn'],
    irrigationFacility: false,
    associatedWithFPO: false,
    source: 'KVK Survey'
  },
  {
    id: '7',
    name: 'Harish Joshi',
    contact: '+91 3210987654',
    gender: 'Male',
    age: 48,
    district: 'Wardha',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'ST',
    maritalStatus: 'Married',
    landOwned: 6.5,
    cropTypes: ['Cereals', 'Fruits'],
    crops: ['Rice', 'Bananas', 'Mangoes'],
    irrigationFacility: true,
    associatedWithFPO: false,
    source: 'Government Survey'
  },
  {
    id: '8',
    name: 'Fatima Bano',
    contact: '+91 2109876543',
    gender: 'Female',
    age: 42,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Muslim',
    casteCategory: 'OBC',
    maritalStatus: 'Married',
    landOwned: 5.0,
    cropTypes: ['Vegetables', 'Cash Crops'],
    crops: ['Tomatoes', 'Cotton', 'Chili'],
    irrigationFacility: true,
    associatedWithFPO: true,
    fpoName: 'Vidarbha Agricultural Producers',
    source: 'NGO Database'
  },
  {
    id: '9',
    name: 'Ramesh Patil',
    contact: '+91 1098765432',
    gender: 'Male',
    age: 55,
    district: 'Amravati',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'SC',
    maritalStatus: 'Married',
    landOwned: 7.2,
    cropTypes: ['Cereals', 'Cash Crops'],
    crops: ['Wheat', 'Soybean', 'Pulses'],
    irrigationFacility: false,
    associatedWithFPO: true,
    fpoName: 'Amravati Farmers Union',
    source: 'Agricultural Census'
  },
  {
    id: '10',
    name: 'Geeta Verma',
    contact: '+91 0987654321',
    gender: 'Female',
    age: 36,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'General',
    maritalStatus: 'Unmarried',
    landOwned: 3.0,
    cropTypes: ['Fruits', 'Vegetables'],
    crops: ['Oranges', 'Cabbage', 'Carrots'],
    irrigationFacility: true,
    associatedWithFPO: false,
    source: 'KVK Survey'
  },
  {
    id: '11',
    name: 'Vijay Thakur',
    contact: '+91 9988776655',
    gender: 'Male',
    age: 50,
    district: 'Chandrapur',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'OBC',
    maritalStatus: 'Married',
    landOwned: 9.5,
    cropTypes: ['Cereals', 'Pulses'],
    crops: ['Rice', 'Wheat', 'Lentils'],
    irrigationFacility: true,
    associatedWithFPO: true,
    fpoName: 'Vidarbha Farmers Association',
    source: 'Government Survey'
  },
  {
    id: '12',
    name: 'Sunita Kale',
    contact: '+91 8877665544',
    gender: 'Female',
    age: 39,
    district: 'Nagpur',
    state: 'Maharashtra',
    religion: 'Hindu',
    casteCategory: 'SC',
    maritalStatus: 'Married',
    landOwned: 4.2,
    cropTypes: ['Vegetables'],
    crops: ['Tomatoes', 'Potatoes', 'Onions'],
    irrigationFacility: false,
    associatedWithFPO: false,
    source: 'NGO Database'
  }
];

export const districts = [...new Set(farmers.map(farmer => farmer.district))];
export const states = [...new Set(farmers.map(farmer => farmer.state))];
export const religions = [...new Set(farmers.map(farmer => farmer.religion))];
export const casteCategories = [...new Set(farmers.map(farmer => farmer.casteCategory))];
export const maritalStatuses = [...new Set(farmers.map(farmer => farmer.maritalStatus))];
export const cropTypes = [...new Set(farmers.flatMap(farmer => farmer.cropTypes))];
export const crops = [...new Set(farmers.flatMap(farmer => farmer.crops))];
export const fpoNames = [...new Set(farmers.filter(farmer => farmer.fpoName).map(farmer => farmer.fpoName))];
export const sources = [...new Set(farmers.map(farmer => farmer.source))];

export const filterOptions = {
  demographics: {
    district: districts,
    state: states,
    gender: ['Male', 'Female', 'Other'],
    religion: religions,
    casteCategory: casteCategories,
    maritalStatus: maritalStatuses
  },
  crop_data: {
    cropTypes: cropTypes,
    crops: crops,
    irrigationFacility: [true, false]
  },
  organization: {
    associatedWithFPO: [true, false],
    fpoName: fpoNames.filter(Boolean) as string[]
  },
  source: {
    name: sources
  }
};

export const searchExamples = [
  "Show me all farmers in Nagpur district",
  "Find female farmers who grow fruits",
  "List all farmers with FPO association and irrigation facilities",
  "Show me farmers who own more than 5 acres of land and grow rice",
  "Find Hindu farmers from Amravati who are married"
];
