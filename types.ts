import React from 'react';

export interface Industry {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ColorPalette {
  name: string;
  description: string;
  colors: BrandColor[];
}

export interface BrandColor {
    name: string;
    hex: string;
}

export interface FontStyle {
  name:string;
  className: string; // for preview
  family: string; // for CSS font-family
  tags: string[]; // For filtering
}

// Editor Types
export type TextAlignment = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold';
export type FontStyleOption = 'normal' | 'italic';
export type ShapeType = 'rectangle' | 'circle';

export interface BaseElement {
    id: string;
    x: number; // percentage
    y: number; // percentage
    width: number; // percentage
    height: number; // percentage
    zIndex: number;
}

export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
    color: string;
    fontSize: number; // pixels
    fontFamily: string;
    fontWeight: FontWeight;
    fontStyle: FontStyleOption;
    textAlign: TextAlignment;
}

export interface ShapeElement extends BaseElement {
    type: 'shape';
    shape: ShapeType;
    color: string;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string; // base64 URL
}

export type Layer = TextElement | ShapeElement | ImageElement;

// Background Types
export type Background = 
  | { type: 'color'; value: string; }
  | { type: 'transparent'; }
  | { type: 'image'; value: string; }; // value is base64 URL

// App State Types
export interface LogoGenerationParams {
    name: string;
    slogan?: string;
    industry: Industry | null;
    colors: {name: string}[];
    fonts: FontStyle[];
    prompt?: string;
    referenceImage?: string;
    layout?: 'icon-top' | 'icon-left' | 'icon-right' | 'icon-only' | 'text-only';
    iconDescription?: string;
    style?: string;
}
  
export interface Variation {
    prompt: LogoGenerationParams;
    imageUrl: string;
}

export interface HistoryItem {
    prompt: LogoGenerationParams;
    layers: Layer[];
    background: Background;
}

// User Account & Subscription System
export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface User {
  name: string;
  email: string;
  plan: SubscriptionPlan;
  generationsUsed: number;
  generationLimit: number; // Use Infinity for unlimited
  stripeCustomerId?: string;
}

export interface LogoAsset {
    id: string;
    imageUrl: string;
    prompt: LogoGenerationParams;
    createdAt: Date;
}
