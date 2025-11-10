import {  onboarding1, onboarding2, onboarding3 } from '../assets';

export type OnboardingItem = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  backgroundColor: string;
};

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to HarvestHub',
    subtitle: 'Fresh food, straight from local farms to your table.',
    image: onboarding1,
    backgroundColor: '#5D0C1D', // Dark maroon
  },
  {
    id: '2',
    title: 'Support Local Farmers',
    subtitle: 'Every purchase helps farmers earn fair prices.',
    image: onboarding2,
    backgroundColor: '#5D0C1D',
  },
  {
    id: '3',
    title: 'Eat Better, Live Better',
    subtitle: "Get affordable, organic, chemical free food.",
    image: onboarding3,
    backgroundColor: '#5D0C1D',
  },
];




export const menuItems = ['Funnel cakes', 'Falafels', 'Hamburgers', 'Churros'];
export const favourites = [
  {
    name: 'GYPSY KITCHEN',
    rating: 4.5,
    address: '20 Cooper Square, New York',
  },
  {
    name: 'RANDOM TRUCK',
    rating: 4.2,
    address: '20 Cooper Square, New York',
  },
];



export const filters = [
  { label: 'Gluten free' },
  { label: 'Near me' },
];
export const recentSearches = ['Cheese Fries', 'Gypsy kitchen', 'Lobster rolls'];
export const results = [
  {
    title: 'FUNNEL CAKES',
    price: '12.60 $',
    vendor: 'Oswald cuisine',
    rating: 4.5,
    ratingsCount: 26,
    address: '20 Cooper Square, New York',
    cartEnabled: true,
  },
  {
    title: 'FUNNEL CAKES',
    price: '11.90 $',
    vendor: 'Gypsy kitchen',
    rating: 4.5,
    ratingsCount: 26,
    address: '20 Cooper Square, New York',
    cartEnabled: false,
  },
  {
    title: 'FUNNEL CAKES',
    price: '12.20 $',
    vendor: 'Darren taste',
    rating: 4.5,
    ratingsCount: 26,
    address: '20 Cooper Square, New York',
    cartEnabled: true,
  },
];