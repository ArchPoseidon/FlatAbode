import Firecrawl from '@mendable/firecrawl-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NICE_TO_HAVE_TILES } from './types';

const MAX_MARKDOWN_CHARS = 12000;
const AMENITY_KEYS = NICE_TO_HAVE_TILES.map((t) => t.key);

export interface ExtractedListing {
  title: string;
  description: string;
  rent: number | null;
  bhk: string | null;
  locality: string | null;
  photos: string[];
  cover_photo: string | null;
  extracted_fields: Record<string, unknown>;
}

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    rent: { type: 'number', nullable: true, description: 'Monthly rent in INR, digits only' },
    bhk: { type: 'string', nullable: true, description: 'e.g. "1", "2", "3", "4", "4+"' },
    locality: { type: 'string', nullable: true, description: 'Bangalore neighbourhood/locality name' },
    lift: { type: 'boolean', nullable: true },
    power_backup: { type: 'boolean', nullable: true },
    covered_parking: { type: 'boolean', nullable: true },
    pet_friendly: { type: 'boolean', nullable: true },
    furnished: { type: 'boolean', nullable: true },
    water_supply_247: { type: 'boolean', nullable: true },
    amenities: {
      type: 'array',
      items: { type: 'string', enum: AMENITY_KEYS },
      description: 'Only amenities explicitly mentioned in the content, using these exact keys.',
    },
    title: { type: 'string', description: 'Short listing title, e.g. "2BHK in Koramangala"' },
    description: {
      type: 'string',
      description:
        'One factual sentence describing the property: size/locality/floor/key features/rent. No em dashes.',
    },
  },
  required: ['title', 'description'],
};

const EXTRACTION_PROMPT = `You are extracting structured facts about a Bangalore rental property listing from scraped page content. Only report fields that are explicitly stated or very clearly implied in the content — return null (or omit from amenities) for anything not mentioned. Do not guess or invent values. Rent must be a plain number in INR. Return JSON only, matching the given schema.`;

function isLikelyPhotoUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|avif)(\?|$)/i.test(url) && !/logo|icon|sprite|avatar/i.test(url);
}

export async function extractListingFromUrl(url: string): Promise<ExtractedListing> {
  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

  const doc = await firecrawl.scrape(url, { formats: ['markdown', 'images'] });

  const markdown = (doc.markdown ?? '').slice(0, MAX_MARKDOWN_CHARS);
  if (!markdown.trim()) {
    throw new Error('Could not read any content from that URL.');
  }

  const photos = Array.from(new Set((doc.images ?? []).filter(isLikelyPhotoUrl))).slice(0, 8);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA as never,
    },
  });

  const result = await model.generateContent([
    EXTRACTION_PROMPT,
    `Page title: ${doc.metadata?.title ?? ''}`,
    `Page content:\n${markdown}`,
  ]);

  const parsed = JSON.parse(result.response.text());

  const { title, description, ...fields } = parsed;

  return {
    title: title || 'Untitled listing',
    description: description || '',
    rent: typeof fields.rent === 'number' ? fields.rent : null,
    bhk: typeof fields.bhk === 'string' ? fields.bhk : null,
    locality: typeof fields.locality === 'string' ? fields.locality : null,
    photos,
    cover_photo: photos[0] ?? null,
    extracted_fields: fields,
  };
}
