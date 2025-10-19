import { Industry, FontStyle, BrandColor, ColorPalette } from '../types';
import {
  TravelIcon, SportsIcon, RetailIcon, ReligiousIcon, RealEstateIcon, LegalIcon,
  InternetIcon, TechnologyIcon, HomeIcon, EventsIcon, MedicalIcon, RestaurantIcon,
  FinanceIcon, NonprofitIcon, EntertainmentIcon, ConstructionIcon, EducationIcon,
  BeautyIcon, AutomotiveIcon, AnimalsIcon, OtherIcon
} from './icons';

export const industries: Industry[] = [
  { name: 'Travel', icon: TravelIcon },
  { name: 'Sports/Fitness', icon: SportsIcon },
  { name: 'Retail', icon: RetailIcon },
  { name: 'Religious', icon: ReligiousIcon },
  { name: 'Real Estate', icon: RealEstateIcon },
  { name: 'Legal', icon: LegalIcon },
  { name: 'Internet', icon: InternetIcon },
  { name: 'Technology', icon: TechnologyIcon },
  { name: 'Home/Family', icon: HomeIcon },
  { name: 'Events', icon: EventsIcon },
  { name: 'Medical/Dental', icon: MedicalIcon },
  { name: 'Restaurant', icon: RestaurantIcon },
  { name: 'Finance', icon: FinanceIcon },
  { name: 'Nonprofit', icon: NonprofitIcon },
  { name: 'Entertainment', icon: EntertainmentIcon },
  { name: 'Construction', icon: ConstructionIcon },
  { name: 'Education', icon: EducationIcon },
  { name: 'Beauty/Spa', icon: BeautyIcon },
  { name: 'Automotive', icon: AutomotiveIcon },
  { name: 'Animals/Pets', icon: AnimalsIcon },
  { name: 'Others', icon: OtherIcon },
];

export const colorPalettes: ColorPalette[] = [
  {
    name: 'Guardian News',
    description: 'Bold, authoritative, and trustworthy.',
    colors: [
      { name: 'Guardian Blue', hex: '#052962' },
      { name: 'Guardian Yellow', hex: '#FFE500' },
      { name: 'Guardian Red', hex: '#C70000' },
      { name: 'Newsprint', hex: '#F6F6F6' },
      { name: 'Guardian Black', hex: '#121212' },
    ],
  },
  {
    name: 'Vibrant & Energetic',
    description: 'Playful, creative, and full of life.',
    colors: [
        { name: 'Hot Pink', hex: '#FF69B4' },
        { name: 'Electric Blue', hex: '#7DF9FF' },
        { name: 'Sunny Yellow', hex: '#FFD700' },
        { name: 'Lime Green', hex: '#32CD32' },
    ],
  },
  {
    name: 'Corporate & Trustworthy',
    description: 'Professional, reliable, and calm.',
    colors: [
      { name: 'Navy Blue', hex: '#000080' },
      { name: 'Steel Gray', hex: '#71797E' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
];

export const brandColors: BrandColor[] = [
  { name: 'Crimson Red', hex: '#DC143C' },
  { name: 'Coral Pink', hex: '#FF7F50' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

export const fontStyles: FontStyle[] = [
  // Sans-Serif - Modern & Minimalist
  { name: 'Inter', className: 'font-inter', family: "'Inter', sans-serif", tags: ['Sans-Serif', 'Modern', 'Minimalist'] },
  { name: 'Montserrat', className: 'font-montserrat', family: "'Montserrat', sans-serif", tags: ['Sans-Serif', 'Modern', 'Elegant', 'Bold'] },
  { name: 'Poppins', className: 'font-poppins', family: "'Poppins', sans-serif", tags: ['Sans-Serif', 'Modern', 'Fun'] },
  { name: 'Lato', className: 'font-lato', family: "'Lato', sans-serif", tags: ['Sans-Serif', 'Modern', 'Elegant'] },
  { name: 'Roboto', className: 'font-roboto', family: "'Roboto', sans-serif", tags: ['Sans-Serif', 'Modern', 'Minimalist'] },
  { name: 'Open Sans', className: 'font-open-sans', family: "'Open Sans', sans-serif", tags: ['Sans-Serif', 'Modern', 'Minimalist'] },
  { name: 'Raleway', className: 'font-raleway', family: "'Raleway', sans-serif", tags: ['Sans-Serif', 'Elegant', 'Minimalist'] },
  { name: 'Oswald', className: 'font-oswald', family: "'Oswald', sans-serif", tags: ['Sans-Serif', 'Display', 'Bold', 'Modern'] },
  { name: 'Nunito', className: 'font-nunito', family: "'Nunito', sans-serif", tags: ['Sans-Serif', 'Fun', 'Modern'] },
  
  // Serif - Elegant & Classic
  { name: 'Playfair Display', className: 'font-playfair', family: "'Playfair Display', serif", tags: ['Serif', 'Elegant', 'Classic'] },
  { name: 'Lora', className: 'font-lora', family: "'Lora', serif", tags: ['Serif', 'Elegant', 'Classic'] },
  { name: 'Merriweather', className: 'font-merriweather', family: "'Merriweather', serif", tags: ['Serif', 'Classic', 'Bold'] },
  { name: 'Arvo', className: 'font-arvo', family: "'Arvo', serif", tags: ['Serif', 'Bold', 'Modern'] },
  { name: 'PT Serif', className: 'font-pt-serif', family: "'PT Serif', serif", tags: ['Serif', 'Classic', 'Elegant'] },
  { name: 'Cormorant Garamond', className: 'font-cormorant', family: "'Cormorant Garamond', serif", tags: ['Serif', 'Elegant', 'Classic'] },

  // Display - Bold & Fun
  { name: 'Lobster', className: 'font-lobster', family: "'Lobster', cursive", tags: ['Display', 'Handwriting', 'Fun'] },
  { name: 'Alfa Slab One', className: 'font-alfa-slab', family: "'Alfa Slab One', cursive", tags: ['Display', 'Bold', 'Classic'] },
  { name: 'Bebas Neue', className: 'font-bebas-neue', family: "'Bebas Neue', sans-serif", tags: ['Display', 'Bold', 'Minimalist', 'Modern'] },
  { name: 'Anton', className: 'font-anton', family: "'Anton', sans-serif", tags: ['Display', 'Bold', 'Modern'] },
  { name: 'Righteous', className: 'font-righteous', family: "'Righteous', cursive", tags: ['Display', 'Fun', 'Modern'] },
  { name: 'Fredoka One', className: 'font-fredoka', family: "'Fredoka One', cursive", tags: ['Display', 'Fun', 'Bold'] },

  // Handwriting - Fun & Elegant
  { name: 'Pacifico', className: 'font-pacifico', family: "'Pacifico', cursive", tags: ['Handwriting', 'Fun', 'Classic'] },
  { name: 'Caveat', className: 'font-caveat', family: "'Caveat', cursive", tags: ['Handwriting', 'Fun', 'Minimalist'] },
  { name: 'Dancing Script', className: 'font-dancing-script', family: "'Dancing Script', cursive", tags: ['Handwriting', 'Elegant', 'Classic'] },
  { name: 'Sacramento', className: 'font-sacramento', family: "'Sacramento', cursive", tags: ['Handwriting', 'Elegant', 'Minimalist'] },
  { name: 'Indie Flower', className: 'font-indie-flower', family: "'Indie Flower', cursive", tags: ['Handwriting', 'Fun'] },
  { name: 'Satisfy', className: 'font-satisfy', family: "'Satisfy', cursive", tags: ['Handwriting', 'Elegant'] },
  
  // Monospace
  { name: 'Source Code Pro', className: 'font-source-code', family: "'Source Code Pro', monospace", tags: ['Monospace', 'Modern'] },
  { name: 'Inconsolata', className: 'font-inconsolata', family: "'Inconsolata', monospace", tags: ['Monospace', 'Minimalist'] },
];


function loadFonts() {
  if (document.getElementById('dynamic-google-fonts')) return;

  const fontsToLoad = [
    'Inter:ital,wght@0,400;0,700;1,400;1,700',
    'Montserrat:ital,wght@0,400;0,700;1,400;1,700',
    'Poppins:ital,wght@0,400;0,700;1,400;1,700',
    'Lato:ital,wght@0,400;0,700;1,400;1,700',
    'Roboto:ital,wght@0,400;0,700;1,400;1,700',
    'Open+Sans:ital,wght@0,400;0,700;1,400;1,700',
    'Raleway:ital,wght@0,400;0,700;1,400;1,700',
    'Oswald:wght@400;700',
    'Nunito:ital,wght@0,400;0,700;1,400;1,700',
    'Playfair+Display:ital,wght@0,400;0,700;1,400;1,700',
    'Lora:ital,wght@0,400;0,700;1,400;1,700',
    'Merriweather:ital,wght@0,400;0,700;1,400;1,700',
    'Arvo:ital,wght@0,400;0,700;1,400;1,700',
    'PT+Serif:ital,wght@0,400;0,700;1,400;1,700',
    'Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700',
    'Lobster',
    'Alfa+Slab+One',
    'Bebas+Neue',
    'Anton',
    'Righteous',
    'Fredoka+One',
    'Pacifico',
    'Caveat:wght@400;700',
    'Dancing+Script:wght@400;700',
    'Sacramento',
    'Indie+Flower',
    'Satisfy',
    'Source+Code+Pro:ital,wght@0,400;0,700;1,400;1,700',
    'Inconsolata:wght@400;700',
  ];

  const link = document.createElement('link');
  link.id = 'dynamic-google-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f}`).join('&')}&display=swap`;
  document.head.appendChild(link);
  
  const style = document.createElement('style');
  style.id = 'dynamic-font-classes';
  style.innerHTML = fontStyles.map(f => `.${f.className} { font-family: ${f.family}; }`).join('\n');
  document.head.appendChild(style);
}

loadFonts();