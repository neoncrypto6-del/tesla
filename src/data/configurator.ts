import { InteriorOption, PaintOption } from '../types/vehicle';
import { images } from './images';

export const paintOptions: PaintOption[] = [
{ id: 'stealth-grey', name: 'Stealth Grey', hex: '#4A4D52', price: 0 },
{ id: 'pearl-white', name: 'Pearl White Multi-Coat', hex: '#F2F2F0', price: 1000 },
{ id: 'marine-blue', name: 'Marine Blue', hex: '#1F3A6B', price: 1500 },
{ id: 'diamond-black', name: 'Diamond Black', hex: '#0B0B0C', price: 1500 },
{ id: 'ultra-red', name: 'Ultra Red', hex: '#A3161F', price: 2000 },
{ id: 'quicksilver', name: 'Quicksilver', hex: '#B9BCBF', price: 2000 }];


export const interiorOptions: InteriorOption[] = [
{ id: 'all-black', name: 'All Black', swatch: ['#111111', '#111111'], price: 0, image: images.interiorBlack },
{ id: 'black-white', name: 'Black and White', swatch: ['#111111', '#F2F2F2'], price: 1000, image: images.interiorWhite }];


export const fsdOption = {
  name: 'Full Self-Driving (Supervised)',
  description:
  'Your vehicle will be able to drive itself almost anywhere with minimal driver intervention.',
  price: 8000,
  features: [
  'Navigate on highways and city streets',
  'Automatic lane changes and parking',
  'Summon your car from a parking spot',
  'Traffic light and stop sign control']

};

export const chargingIncluded = [
{
  id: 'supercharging',
  name: 'Supercharging Network',
  description: 'Access to the largest global Supercharging network, with 70,000+ stalls worldwide.'
},
{
  id: 'wall-connector',
  name: 'Wall Connector',
  description: 'Fast home charging, adding up to 44 miles of range per hour.'
}];


export const chargingSummary = 'Supercharging access + Wall Connector';

export const MIN_DEPOSIT = 500;
export const MIN_INSTALLMENT = 100;

export const paymentMethods = [
{ id: 'Bank Transfer', name: 'Bank Transfer', description: 'Transfer from your bank account using your order number as the reference.' },
{ id: 'Wire Transfer', name: 'Wire Transfer', description: 'Domestic or international wire. Confirmation usually takes 1–2 business days.' },
{ id: 'Financing Partner', name: 'Financing Partner', description: 'Pay through an approved auto-financing partner.' }];