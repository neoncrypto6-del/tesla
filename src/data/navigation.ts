import { images } from './images';

export type NavLink = {label: string;to: string;};
export type NavFeatured = {title: string;image: string;to: string;};
export type NavMenu = {
  id: string;
  label: string;
  to: string;
  featured?: NavFeatured[];
  links?: NavLink[];
  groups?: {title: string;links: NavLink[];}[];
};

export const navMenus: NavMenu[] = [
{
  id: 'vehicles',
  label: 'Vehicles',
  to: '/vehicles/model-y',
  links: [
  { label: 'Current Offers', to: '/discover' },
  { label: 'Demo Drive', to: '/discover' },
  { label: 'Trade-in', to: '/discover' },
  { label: 'Help Me Choose', to: '/vehicles/model-y' },
  { label: 'Compare', to: '/vehicles/model-3' },
  { label: 'Fleet', to: '/semi' }]

},
{
  id: 'energy',
  label: 'Energy',
  to: '/energy',
  featured: [
  { title: 'Solar Panels', image: images.solar, to: '/energy' },
  { title: 'Powerwall', image: images.powerwall, to: '/energy' }],

  links: [
  { label: 'Schedule a Consultation', to: '/energy' },
  { label: 'Why Solar', to: '/energy' },
  { label: 'Incentives', to: '/energy' },
  { label: 'Support', to: '/discover' }]

},
{
  id: 'charging',
  label: 'Charging',
  to: '/charging',
  featured: [
  { title: 'Supercharging', image: images.supercharger, to: '/charging' },
  { title: 'Home Charging', image: images.powerwall, to: '/charging' }],

  links: [
  { label: 'Help Me Charge', to: '/charging' },
  { label: 'Charging Calculator', to: '/charging' },
  { label: 'Supercharger Voting', to: '/charging' },
  { label: 'Find Us', to: '/charging' }]

},
{ id: 'semi', label: 'Semi', to: '/semi' },
{
  id: 'discover',
  label: 'Discover',
  to: '/discover',
  groups: [
  {
    title: 'Resources',
    links: [
    { label: 'Demo Drive', to: '/discover' },
    { label: 'Insurance', to: '/discover' },
    { label: 'Video Guides', to: '/discover' },
    { label: 'Customer Stories', to: '/discover' }]

  },
  {
    title: 'Location Services',
    links: [
    { label: 'Find Us', to: '/charging' },
    { label: 'Trip Planner', to: '/charging' },
    { label: 'Find a Collision Center', to: '/discover' }]

  },
  {
    title: 'Company',
    links: [
    { label: 'About', to: '/discover' },
    { label: 'Careers', to: '/discover' },
    { label: 'Investor Relations', to: '/discover' }]

  }]

},
{
  id: 'shop',
  label: 'Shop',
  to: '/shop',
  featured: [
  { title: 'Charging', image: images.powerwall, to: '/shop' },
  { title: 'Vehicle Accessories', image: images.shop, to: '/shop' }],

  links: [
  { label: 'Apparel', to: '/shop' },
  { label: 'Lifestyle', to: '/shop' },
  { label: 'Gift Cards', to: '/shop' }]

}];