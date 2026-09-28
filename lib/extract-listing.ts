import Firecrawl from '@mendable/firecrawl-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NICE_TO_HAVE_TILES, normalizeBhk } from './types';
import { generateNickname } from './nickname';

const MAX_MARKDOWN_CHARS = 12000;
const MIN_CONTENT_CHARS = 200;
const AMENITY_KEYS = NICE_TO_HAVE_TILES.map((t) => t.key);

export interface ExtractedListing {
  title: string;
  nickname: string;
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
    is_valid_listing: {
      type: 'boolean',
      description:
        'False if the page content is a block/error/captcha/login page, or otherwise does not actually describe a rental property.',
    },
    block_reason: {
      type: 'string',
      nullable: true,
      description: 'If is_valid_listing is false, a short reason why (e.g. "page blocked access", "login required").',
    },
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
    title: { type: 'string', description: 'Short factual listing title, e.g. "2BHK in Koramangala"' },
    nickname: {
      type: 'string',
      description:
        'A short, catchy 2-5 word nickname for this specific property, distinct from the factual title — ' +
        'e.g. "The Cozy Koramangala Corner", "Sunny HSR Retreat". Playful but not silly.',
    },
    description: {
      type: 'string',
      description:
        'One factual sentence describing the property: size/locality/floor/key features/rent. No em dashes.',
    },
  },
  required: ['is_valid_listing', 'title', 'nickname', 'description'],
};

const EXTRACTION_PROMPT = `You are extracting structured facts about a Bangalore rental property listing from scraped page content. First decide whether the content actually describes a rental property listing — set is_valid_listing to false (with a short block_reason) if the page is a block page, CAPTCHA, login wall, error page, or otherwise doesn't contain real listing details. Otherwise, only report fields that are explicitly stated or very clearly implied — return null (or omit from amenities) for anything not mentioned. Do not guess or invent values. Rent must be a plain number in INR. Return JSON only, matching the given schema.`;

const BLOCK_SIGNALS = /\b(access denied|blocked|are you a human|captcha|checking your browser|just a moment|unusual traffic|please verify|forbidden|robot check|sign in to continue|log in to view)\b/i;

const CHROME_PATTERNS = /logo|icon|sprite|avatar|placeholder|fallback|default|badge|banner|\buser\.|\bshop\d*\.|\/assets\/|\/common\/|\/news\/|wp-content/i;
// Real property photos are typically served from a hashed/random path segment
// (e.g. "01c16c28/22e442124.../medium.jpg"); site-chrome assets usually aren't.
const HASHED_PATH = /\/[a-f0-9]{6,}\//i;

function isLikelyPhotoUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|avif)(\?|$)/i.test(url) && !CHROME_PATTERNS.test(url);
}

// Puts photos that look like real uploaded property images first, so the
// cover photo isn't a generic site icon that merely happened to load earlier.
function rankPhotos(urls: string[]): string[] {
  return [...urls].sort((a, b) => Number(HASHED_PATH.test(b)) - Number(HASHED_PATH.test(a)));
}

export async function extractListingFromUrl(url: string): Promise<ExtractedListing> {
  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

  const doc = await firecrawl.scrape(url, { formats: ['markdown', 'images'], proxy: 'auto' });

  const statusCode = doc.metadata?.statusCode;
  if (statusCode && statusCode >= 400) {
    throw new Error(`That site returned an error (${statusCode}) — it may be blocking automated requests.`);
  }

  const markdown = (doc.markdown ?? '').trim();
  if (!markdown) {
    throw new Error('Could not read any content from that URL.');
  }
  // A genuine block/CAPTCHA page puts its message immediately — the whole
  // page IS the message. Only scan the prefix, so an unrelated ad/tracker
  // iframe snippet ("...is blocked. Try disabling your extensions.") buried
  // deep in an otherwise-real, long listing page doesn't cause a false hit.
  if (markdown.length < MIN_CONTENT_CHARS || BLOCK_SIGNALS.test(markdown.slice(0, 2000))) {
    throw new Error("That site blocked the request, so there's nothing real to extract.");
  }

  const photos = rankPhotos(Array.from(new Set((doc.images ?? []).filter(isLikelyPhotoUrl)))).slice(0, 8);

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
    `Page content:\n${markdown.slice(0, MAX_MARKDOWN_CHARS)}`,
  ]);

  const parsed = JSON.parse(result.response.text());

  if (parsed.is_valid_listing === false) {
    throw new Error(parsed.block_reason || "That page doesn't look like a real listing.");
  }

  const { title, nickname, description, ...fields } = parsed;
  delete fields.is_valid_listing;
  delete fields.block_reason;

  const bhk = normalizeBhk(typeof fields.bhk === 'string' ? fields.bhk : null);
  fields.bhk = bhk;
  const locality = typeof fields.locality === 'string' ? fields.locality : null;

  return {
    title: title || 'Untitled listing',
    nickname: (typeof nickname === 'string' && nickname.trim()) || generateNickname(url, locality),
    description: description || '',
    rent: typeof fields.rent === 'number' ? fields.rent : null,
    bhk,
    locality,
    photos,
    cover_photo: photos[0] ?? null,
    extracted_fields: fields,
  };
}
