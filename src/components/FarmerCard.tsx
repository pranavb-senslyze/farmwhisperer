
import React from 'react';
import { Farmer } from '../types';
import { User, MapPin, Phone, Crop, Droplet, Users } from 'lucide-react';

interface FarmerCardProps {
  farmer: Farmer;
}

const FarmerCard: React.FC<FarmerCardProps> = ({ farmer }) => {
  // Combine first and last name for display
  const fullName = farmer.name || `${farmer.first_name} ${farmer.last_name}`;
  
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{fullName}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{farmer.district}, {farmer.state}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {farmer.gender}
            </div>
            <div className="text-xs mt-1 text-gray-500">Age: {farmer.age}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{farmer.contact}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  <span className="w-2 h-2 bg-farm-orange rounded-full"></span>
                </div>
                <span className="text-sm">{farmer.religion}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 mt-1">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  <span className="w-2 h-2 bg-farm-blue rounded-full"></span>
                </div>
                <span className="text-sm">{farmer.caste_category}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 mt-1">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  <span className="w-2 h-2 bg-farm-yellow rounded-full"></span>
                </div>
                <span className="text-sm">{farmer.marital_status}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Farm Details</h4>
            <div className="flex items-center space-x-2 text-gray-700">
              <Crop className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{farmer.land_owned} acres</span>
            </div>
            
            <div className="mt-2">
              <div className="flex flex-wrap gap-1 mt-1">
                {farmer.crop_types.map((type, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-0.5 bg-farm-green/10 text-farm-green rounded text-xs"
                  >
                    {type}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {farmer.crops.map((crop, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-0.5 bg-farm-brown/10 text-farm-brown rounded text-xs"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <Droplet className={`h-4 w-4 mr-2 ${farmer.irrigation_facility ? 'text-farm-blue' : 'text-gray-400'}`} />
              <span className="text-sm">
                {farmer.irrigation_facility ? 'Has irrigation' : 'No irrigation'}
              </span>
            </div>
          </div>
        </div>
        
        {farmer.associated_with_fpo && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium">Associated with {farmer.fpo_name}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500">
            <span>Source: {farmer.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerCard;
