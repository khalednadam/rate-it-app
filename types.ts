export type User = {
    uid: string; 
    name: string;
    email: string;
    points: number;
    followedUsers: [User];
    rates: [Rate];
    role: string,
    profilePicURL: string
}

export type Service = {
    id: string;
    name: string;
    category:
        | "Restaurant"
        | "Bank"
        | "Internet Comapny"
        | "Gaming"
        | "Hospital";
    generalRate: number;
    description: string;
    rates: [Rate];
};

export type Rate = {
    comment: string,
	ratePoints: number,
	// TODO: pics: [Photo],
	userId: User,
	serviceId: Service,
	// date:  
}

export type CategoriesTypes = 
"Gym" |"Restaurants" | "Cafes" | "Internet Companies" | "Banks" | "Apps" | 
"Retail Stores" | "Online Stores" | "TV Channels" | "Mall" | 
"Media Companies" | "Medical" | "Hotels" | "Schools" | "Airlines" | "Other"