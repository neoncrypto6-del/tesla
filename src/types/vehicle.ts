export type Trim = {
  id: string;
  name: string;
  price: number;
  range: string;
  zeroToSixty: string;
  topSpeed: string;
  drive: string;
};

export type Vehicle = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  trims: Trim[];
};

export type PaintOption = {
  id: string;
  name: string;
  hex: string;
  price: number;
};

export type InteriorOption = {
  id: string;
  name: string;
  swatch: string[];
  price: number;
  image: string;
};

export type ChargingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
};