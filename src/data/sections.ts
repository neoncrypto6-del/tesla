import { images } from './images';

export type SectionSlug = 'energy' | 'charging' | 'semi' | 'discover' | 'shop';

export type SectionContent = {
  slug: SectionSlug;
  title: string;
  subtitle: string;
  image: string;
  primaryLabel: string;
  secondary: {label: string;to: string;};
  features: {title: string;body: string;}[];
};

export const sections: SectionContent[] = [
{
  slug: 'energy',
  title: 'Solar & Powerwall',
  subtitle: 'Generate, store and use your own clean energy',
  image: images.solar,
  primaryLabel: 'Schedule a Consultation',
  secondary: { label: 'Shop Charging', to: '/shop' },
  features: [
  { title: 'Lower bills', body: 'Produce energy during the day and use it whenever you need it.' },
  { title: 'Backup protection', body: 'Powerwall detects outages and keeps your home running automatically.' },
  { title: 'App control', body: 'Monitor production and usage in real time from your phone.' }]

},
{
  slug: 'charging',
  title: 'Charge Anywhere',
  subtitle: 'Over 70,000 Superchargers along popular routes',
  image: images.supercharger,
  primaryLabel: 'Request Home Charging Install',
  secondary: { label: 'View Vehicles', to: '/vehicles/model-y' },
  features: [
  { title: 'Supercharging', body: 'Add up to 200 miles of range in 15 minutes on the road.' },
  { title: 'Home charging', body: 'Wake up to a full battery every morning with a Wall Connector.' },
  { title: 'Trip planning', body: 'Your vehicle routes you through chargers automatically.' }]

},
{
  slug: 'semi',
  title: 'Semi',
  subtitle: 'The future of long-haul freight is electric',
  image: images.semi,
  primaryLabel: 'Request Fleet Info',
  secondary: { label: 'Explore Charging', to: '/charging' },
  features: [
  { title: '500 mile range', body: 'Fully loaded at 82,000 lbs on a single charge.' },
  { title: 'Lower cost per mile', body: 'Save on fuel and maintenance compared to diesel.' },
  { title: 'Centered cab', body: 'Unmatched visibility and control for every driver.' }]

},
{
  slug: 'discover',
  title: 'Discover TACYE',
  subtitle: 'Demo drives, insurance, guides and company news',
  image: images.fsd2,
  primaryLabel: 'Schedule a Demo Drive',
  secondary: { label: 'View Vehicles', to: '/vehicles/model-3' },
  features: [
  { title: 'Demo Drive', body: 'Experience any model at a location near you.' },
  { title: 'Insurance', body: 'Real-time pricing based on how you actually drive.' },
  { title: 'Video Guides', body: 'Learn every feature of your vehicle in minutes.' }]

},
{
  slug: 'shop',
  title: 'Shop',
  subtitle: 'Charging, accessories, apparel and more',
  image: images.shop,
  primaryLabel: 'Notify Me of New Arrivals',
  secondary: { label: 'Explore Charging', to: '/charging' },
  features: [
  { title: 'Charging', body: 'Wall Connectors, adapters and mobile chargers.' },
  { title: 'Vehicle Accessories', body: 'All-weather mats, roof racks and wheel covers.' },
  { title: 'Apparel', body: 'Everyday essentials designed in-house.' }]

}];