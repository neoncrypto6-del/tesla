import { Vehicle } from '../types/vehicle';
import { images } from './images';

export const vehicles: Vehicle[] = [
{
  slug: 'model-s',
  name: 'Model S',
  tagline: 'Flagship performance sedan',
  description: 'Long-distance comfort, instant acceleration and a quiet cabin built for the open road.',
  image: images.modelS,
  trims: [
  { id: 'long-range', name: 'Long Range All-Wheel Drive', price: 79990, range: '410 mi', zeroToSixty: '3.1 s', topSpeed: '149 mph', drive: 'Dual Motor AWD' },
  { id: 'plaid', name: 'Plaid', price: 94990, range: '368 mi', zeroToSixty: '1.99 s', topSpeed: '200 mph', drive: 'Tri Motor AWD' }]

},
{
  slug: 'model-x',
  name: 'Model X',
  tagline: 'Spacious SUV with falcon wing doors',
  description: 'Seating for up to seven, best-in-class towing and doors that open to a panoramic view.',
  image: images.modelX,
  trims: [
  { id: 'long-range', name: 'Long Range All-Wheel Drive', price: 84990, range: '352 mi', zeroToSixty: '3.8 s', topSpeed: '149 mph', drive: 'Dual Motor AWD' },
  { id: 'plaid', name: 'Plaid', price: 99990, range: '335 mi', zeroToSixty: '2.5 s', topSpeed: '163 mph', drive: 'Tri Motor AWD' }]

},
{
  slug: 'model-y-l-premium',
  name: 'Model Y L Premium',
  tagline: 'Six seats. Room for everyone.',
  description: 'A longer wheelbase, three rows of premium seating and range for every family trip.',
  image: images.modelYL,
  trims: [
  { id: 'premium-awd', name: 'Premium All-Wheel Drive', price: 52990, range: '315 mi', zeroToSixty: '4.5 s', topSpeed: '125 mph', drive: 'Dual Motor AWD' },
  { id: 'launch', name: 'Premium Launch Series', price: 59990, range: '310 mi', zeroToSixty: '4.2 s', topSpeed: '130 mph', drive: 'Dual Motor AWD' }]

},
{
  slug: 'model-3',
  name: 'Model 3',
  tagline: 'Sport sedan, refined',
  description: 'Agile handling, a quiet interior and efficiency that takes you further on every charge.',
  image: images.heroModel3,
  trims: [
  { id: 'standard-rwd', name: 'Standard Rear-Wheel Drive', price: 36990, range: '321 mi', zeroToSixty: '5.8 s', topSpeed: '125 mph', drive: 'Single Motor RWD' },
  { id: 'premium-rwd', name: 'Premium Rear-Wheel Drive', price: 42490, range: '363 mi', zeroToSixty: '4.9 s', topSpeed: '125 mph', drive: 'Single Motor RWD' },
  { id: 'premium-awd', name: 'Premium All-Wheel Drive', price: 47490, range: '346 mi', zeroToSixty: '4.2 s', topSpeed: '125 mph', drive: 'Dual Motor AWD' },
  { id: 'performance', name: 'Performance All-Wheel Drive', price: 54990, range: '309 mi', zeroToSixty: '2.9 s', topSpeed: '163 mph', drive: 'Dual Motor AWD' }]

},
{
  slug: 'cybertruck',
  name: 'Cybertruck',
  tagline: 'Built for any planet',
  description: 'A stainless steel exoskeleton, adaptive air suspension and utility for every job site.',
  image: images.cybertruck,
  trims: [
  { id: 'long-range-rwd', name: 'Long Range Rear-Wheel Drive', price: 69990, range: '350 mi', zeroToSixty: '6.2 s', topSpeed: '112 mph', drive: 'Single Motor RWD' },
  { id: 'awd', name: 'All-Wheel Drive', price: 79990, range: '325 mi', zeroToSixty: '4.1 s', topSpeed: '112 mph', drive: 'Dual Motor AWD' },
  { id: 'cyberbeast', name: 'Cyberbeast', price: 99990, range: '301 mi', zeroToSixty: '2.6 s', topSpeed: '130 mph', drive: 'Tri Motor AWD' }]

},
{
  slug: 'model-y',
  name: 'Model Y',
  tagline: 'The everyday SUV',
  description: 'Versatile cargo space, a calm cabin and all-weather capability for daily life.',
  image: images.heroModelY,
  trims: [
  { id: 'standard-rwd', name: 'Standard Rear-Wheel Drive', price: 39990, range: '321 mi', zeroToSixty: '6.8 s', topSpeed: '125 mph', drive: 'Single Motor RWD' },
  { id: 'premium-rwd', name: 'Premium Rear-Wheel Drive', price: 44990, range: '357 mi', zeroToSixty: '5.4 s', topSpeed: '125 mph', drive: 'Single Motor RWD' },
  { id: 'premium-awd', name: 'Premium All-Wheel Drive', price: 48990, range: '327 mi', zeroToSixty: '4.6 s', topSpeed: '125 mph', drive: 'Dual Motor AWD' },
  { id: 'performance', name: 'Performance All-Wheel Drive', price: 57490, range: '306 mi', zeroToSixty: '3.3 s', topSpeed: '155 mph', drive: 'Dual Motor AWD' }]

}];