/**
 * Geography Configuration
 * Region-to-State mapping for India
 * 
 * TODO: Consider fetching this from API for dynamic updates
 */

export const REGION_STATES: Record<string, string[]> = {
    North: [
        'Delhi',
        'Punjab',
        'Haryana',
        'Uttar Pradesh',
        'Himachal Pradesh',
        'Uttarakhand',
        'Jammu and Kashmir',
        'Chandigarh',
    ],
    South: [
        'Karnataka',
        'Tamil Nadu',
        'Telangana',
        'Kerala',
        'Andhra Pradesh',
        'Puducherry',
    ],
    East: [
        'West Bengal',
        'Bihar',
        'Odisha',
        'Jharkhand',
        'Assam',
        'Sikkim',
        'Arunachal Pradesh',
        'Nagaland',
        'Manipur',
        'Mizoram',
        'Tripura',
        'Meghalaya',
    ],
    West: [
        'Maharashtra',
        'Gujarat',
        'Rajasthan',
        'Goa',
        'Madhya Pradesh',
        'Chhattisgarh',
        'Daman and Diu',
        'Dadra and Nagar Haveli',
    ],
};

/**
 * Get all regions
 */
export const getRegions = () => Object.keys(REGION_STATES);

/**
 * Get states for a specific region
 */
export const getStatesForRegion = (region: string): string[] => {
    return REGION_STATES[region] || [];
};
