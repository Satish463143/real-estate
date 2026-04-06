const Role = {
    ADMIN: "admin",
    USER: "user",
}

const PropertyType = {
    HOUSE: "house",
    APARTMENT: "apartment",
    TOWNHOUSE: "townhouse",
    VILLA: "villa",
    STUDIO: "studio",
    OFFICE: "office",
    SHOP: "shop",
    WAREHOUSE: "warehouse",
    INDUSTRIAL: "industrial",
    LAND: "land",
    PLOT: "plot",
    FARM: "farm",
}

const ListingType = {
    FOR_SALE: "for_sale",
    FOR_RENT: "for_rent",
    SHORT_TERM: "short_term",
    VACATION: "vacation",
}

const PropertyStatus = {
    ACTIVE: "active",
    PENDING: "pending",
    SOLD: "sold",
    RENTED: "rented",
    INACTIVE: "inactive",
}

const FurnishingStatus = {
    FURNISHED: "furnished",
    SEMI_FURNISHED: "semi_furnished",
    UNFURNISHED: "unfurnished",
}

const InquiryStatus = {
    NEW: "new",
    IN_PROGRESS: "in_progress",
    CLOSED: "closed",
}

module.exports = {
    Role,
    PropertyType,
    ListingType,
    PropertyStatus,
    FurnishingStatus,
    InquiryStatus,
}
