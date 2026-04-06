const Joi = require("joi")
const {
  PropertyType,
  ListingType,
  PropertyStatus,
  FurnishingStatus,
} = require("../../config/constant.config")

// ─────────────────────────────────────────────
//  LOCATION SCHEMA
// ─────────────────────────────────────────────
const locationSchema = Joi.object({
  address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().required(),
  zipCode: Joi.string().trim().optional(),
})

// ─────────────────────────────────────────────
//  PROPERTY FEATURE SCHEMA  (key-value pairs)
// ─────────────────────────────────────────────
const featureSchema = Joi.object({
  key: Joi.string().trim().required(),
  value: Joi.string().trim().required(),
})

// ─────────────────────────────────────────────
//  CREATE PROPERTY DTO
// ─────────────────────────────────────────────
const createPropertyDTO = Joi.object({
  // ── Core ──────────────────────────────────
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  internalNotes: Joi.string().trim().optional(),

  propertyType: Joi.string()
    .valid(...Object.values(PropertyType))
    .required(),

  listingType: Joi.string()
    .valid(...Object.values(ListingType))
    .required(),

  status: Joi.string()
    .valid(...Object.values(PropertyStatus))
    .default(PropertyStatus.ACTIVE),

  // ── Pricing ───────────────────────────────
  price: Joi.number().positive().required(),
  pricePerSqft: Joi.number().positive().optional(),
  isNegotiable: Joi.boolean().default(false),

  // ── Size & Structure ──────────────────────
  areaSize: Joi.number().positive().required(),
  areaSizeUnit: Joi.string().valid("sqft", "sqm").default("sqft"),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  floors: Joi.number().integer().min(1).optional(),
  floorNumber: Joi.number().integer().min(0).optional(),
  totalFloors: Joi.number().integer().min(1).optional(),
  parkingSpaces: Joi.number().integer().min(0).optional(),
  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),

  // ── Condition / Style ─────────────────────
  furnishingStatus: Joi.string()
    .valid(...Object.values(FurnishingStatus))
    .optional(),
  isNewConstruction: Joi.boolean().optional(),

  // ── Boolean filter flags ──────────────────
  isFeatured: Joi.boolean().default(false),
  isVerified: Joi.boolean().default(false),
  hasGarden: Joi.boolean().optional(),
  hasPool: Joi.boolean().optional(),
  hasBasement: Joi.boolean().optional(),
  hasElevator: Joi.boolean().optional(),
  hasBalcony: Joi.boolean().optional(),

  // ── Short-term / Vacation ─────────────────
  maxGuests: Joi.number().integer().min(1).optional(),
  minStayNights: Joi.number().integer().min(1).optional(),

  // ── Timestamps ────────────────────────────
  publishedAt: Joi.date().iso().optional(),

  // ── Relations ────────────────────────────
  agentId: Joi.string().trim().required(),
  location: locationSchema.required(),

  // features array is optional on creation
  features: Joi.array().items(featureSchema).optional(),
})

// ─────────────────────────────────────────────
//  UPDATE PROPERTY DTO  (all fields optional)
// ─────────────────────────────────────────────
const updatePropertyDTO = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  internalNotes: Joi.string().trim().optional(),

  propertyType: Joi.string()
    .valid(...Object.values(PropertyType))
    .optional(),

  listingType: Joi.string()
    .valid(...Object.values(ListingType))
    .optional(),

  status: Joi.string()
    .valid(...Object.values(PropertyStatus))
    .optional(),

  price: Joi.number().positive().optional(),
  pricePerSqft: Joi.number().positive().optional(),
  isNegotiable: Joi.boolean().optional(),

  areaSize: Joi.number().positive().optional(),
  areaSizeUnit: Joi.string().valid("sqft", "sqm").optional(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  floors: Joi.number().integer().min(1).optional(),
  floorNumber: Joi.number().integer().min(0).optional(),
  totalFloors: Joi.number().integer().min(1).optional(),
  parkingSpaces: Joi.number().integer().min(0).optional(),
  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),

  furnishingStatus: Joi.string()
    .valid(...Object.values(FurnishingStatus))
    .optional(),
  isNewConstruction: Joi.boolean().optional(),

  isFeatured: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
  hasGarden: Joi.boolean().optional(),
  hasPool: Joi.boolean().optional(),
  hasBasement: Joi.boolean().optional(),
  hasElevator: Joi.boolean().optional(),
  hasBalcony: Joi.boolean().optional(),

  maxGuests: Joi.number().integer().min(1).optional(),
  minStayNights: Joi.number().integer().min(1).optional(),

  publishedAt: Joi.date().iso().optional(),

  // partial location update
  location: locationSchema.optional(),

  // replace / merge features on update
  features: Joi.array().items(featureSchema).optional(),
})
  .min(1) // at least one field must be provided

module.exports = {
  locationSchema,
  featureSchema,
  createPropertyDTO,
  updatePropertyDTO,
}