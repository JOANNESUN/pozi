import { z } from 'zod';

export const CATEGORY_VALUES = [
  'pothole',
  'tree_down',
  'dead_animal',
  'injured_animal',
  'other',
];

export const feedbackSchema = z.object({
  comment: z.string().trim().min(1).max(1200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  category: z.enum(CATEGORY_VALUES),
});
