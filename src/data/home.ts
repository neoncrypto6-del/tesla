import { images } from './images';

export type HeroTone = 'light' | 'dark';

export const heroSlides = [
{
  id: 'model-y',
  title: 'Model Y',
  subtitle: 'Starting at $29,340 with 40% off available',
  image: images.heroModelY,
  tone: 'dark' as HeroTone,
  primary: { label: 'Order Now', to: '/order/model-y' },
  secondary: { label: 'Learn More', to: '/vehicles/model-y' }
},
{
  id: 'model-3',
  title: 'Model 3',
  subtitle: 'Own from $22,194 now for a limited time',
  image: images.heroModel3,
  tone: 'dark' as HeroTone,
  primary: { label: 'Order Now', to: '/order/model-3' },
  secondary: { label: 'Learn More', to: '/vehicles/model-3' }
},
{
  id: 'model-y-l-premium',
  title: 'Model Y L Premium',
  subtitle: 'Six seats crafted for premium comfort',
  image: images.interiorWhite,
  tone: 'light' as HeroTone,
  primary: { label: 'Order Now', to: '/order/model-y-l-premium' },
  secondary: { label: 'Learn More', to: '/vehicles/model-y-l-premium' }
}];


export const fsdImages = {
  top: [
  { src: images.fsd1, alt: 'Driver relaxing while the car navigates a city street' },
  { src: images.fsd2, alt: 'Rear-seat view of a car driving itself on a suburban road' },
  { src: images.fsd3, alt: 'Highway at dusk seen through the windshield' }],

  bottom: [
  { src: images.fsd4, alt: 'Car driving itself through heavy rain on a highway' },
  { src: images.fsd5, alt: 'Driver with hands off the wheel in a parking lot' }]

};

export const fsdCaptions = ['by focusing on,', 'the road ahead,', 'so you can relax.'];

export const lineup = [
{ slug: 'model-y-l-premium', name: 'Model Y L Premium', tagline: 'Six seats. Room for everyone.', image: images.modelYL },
{ slug: 'model-3', name: 'Model 3', tagline: 'Sport sedan, refined', image: images.heroModel3 },
{ slug: 'cybertruck', name: 'Cybertruck', tagline: 'Built for any planet', image: images.cybertruck },
{ slug: 'model-y', name: 'Model Y', tagline: 'The everyday SUV', image: images.heroModelY }];


export const energyCards = [
{ id: 'solar', title: 'Solar Panels', subtitle: 'Power your home with clean, low-cost energy', image: images.solar, learn: '/energy' },
{ id: 'powerwall', title: 'Powerwall', subtitle: 'Keep the lights on during any outage', image: images.powerwall, learn: '/energy' }];


export const footerLinks = [
{ label: 'TACYE © 2026', to: '/' },
{ label: 'Privacy & Legal', to: '/discover' },
{ label: 'Vehicle Recalls', to: '/discover' },
{ label: 'Contact', to: '/discover' },
{ label: 'News', to: '/discover' },
{ label: 'Get Updates', to: '/create-account' },
{ label: 'Locations', to: '/charging' },
{ label: 'Admin Login', to: '/admin/login' }];
