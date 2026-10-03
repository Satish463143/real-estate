const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Property Seeding ---');

    // 1. Get an existing agent to associate properties with
    const agent = await prisma.agent.findFirst();
    if (!agent) {
        throw new Error('No agent found in database. Please create an agent first.');
    }
    console.log(`Using Agent: ${agent.firstName} ${agent.lastName} (ID: ${agent.id})`);

    // 2. Fetch existing property images so we can reuse valid image bytes
    const existingImages = await prisma.propertyImage.findMany({
        take: 12,
        select: { image: true }
    });

    const sampleImages = existingImages.map(img => img.image);
    console.log(`Loaded ${sampleImages.length} sample images from existing properties.`);

    const propertiesToSeed = [
        {
            title: "Modern 2BHK Apartment in Jhamsikhel",
            description: "Chic and modern 2-bedroom apartment situated in the peaceful neighborhood of Jhamsikhel. Features open floor design, hardwood floors, high-speed fiber internet, and 24/7 security.",
            propertyType: "apartment",
            listingType: "for_rent",
            status: "active",
            price: 1200,
            pricePerSqft: 120,
            isNegotiable: true,
            areaSize: 1000,
            areaSizeUnit: "sqft",
            bedrooms: 2,
            bathrooms: 2,
            floorNumber: 3,
            totalFloors: 6,
            parkingSpaces: 1,
            yearBuilt: 2021,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: true,
            hasElevator: true,
            hasBalcony: true,
            maxGuests: 4,
            minStayNights: 30,
            location: {
                address: "Sanepa Road",
                city: "Lalitpur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44700"
            },
            features: [
                { key: "security", value: "24/7 Guard" },
                { key: "power_backup", value: "Inverter generator" },
                { key: "view", value: "City skyline" }
            ]
        },
        {
            title: "Spacious 3BHK Family Flat in Baneshwor",
            description: "Spacious 3BHK flat ideal for a medium family. Located close to major shopping centers, schools, and hospitals with abundant natural sunlight.",
            propertyType: "apartment",
            listingType: "for_rent",
            status: "active",
            price: 1500,
            pricePerSqft: 115,
            isNegotiable: false,
            areaSize: 1300,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            totalFloors: 5,
            parkingSpaces: 1,
            yearBuilt: 2018,
            furnishingStatus: "semi_furnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: true,
            hasBalcony: true,
            maxGuests: 5,
            minStayNights: 30,
            location: {
                address: "New Baneshwor Chowk",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "water_supply", value: "24-hour supply" },
                { key: "parking", value: "Dedicated car & bike" }
            ]
        },
        {
            title: "Cozy Studio Apartment in Thamel",
            description: "Compact, well-furnished studio perfect for solo professionals or digital nomads. Walking distance to popular cafes, restaurants, and convenience stores.",
            propertyType: "studio",
            listingType: "for_rent",
            status: "active",
            price: 650,
            pricePerSqft: 144,
            isNegotiable: true,
            areaSize: 450,
            areaSizeUnit: "sqft",
            bedrooms: 1,
            bathrooms: 1,
            floorNumber: 4,
            totalFloors: 5,
            parkingSpaces: 1,
            yearBuilt: 2022,
            furnishingStatus: "furnished",
            isNewConstruction: true,
            isFeatured: false,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 2,
            minStayNights: 7,
            location: {
                address: "Paknajol Marg",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "internet", value: "High-speed Wi-Fi included" },
                { key: "kitchen", value: "Modular kitchenette" }
            ]
        },
        {
            title: "Luxury 4BHK Villa with Private Pool",
            description: "An architectural masterpiece in Budhanilkantha offering panoramic mountain vistas, heated swimming pool, landscaped gardens, and premium Italian fittings.",
            propertyType: "villa",
            listingType: "for_sale",
            status: "active",
            price: 8500,
            pricePerSqft: 188,
            isNegotiable: true,
            areaSize: 4500,
            areaSizeUnit: "sqft",
            bedrooms: 4,
            bathrooms: 5,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 3,
            yearBuilt: 2023,
            furnishingStatus: "furnished",
            isNewConstruction: true,
            isFeatured: true,
            isVerified: true,
            hasGarden: true,
            hasPool: true,
            hasBasement: true,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 8,
            minStayNights: 1,
            location: {
                address: "Deuba Chowk",
                city: "Budhanilkantha",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "pool", value: "Private heated infinity pool" },
                { key: "garden", value: "12 aana manicured lawn" },
                { key: "solar", value: "5kW Solar rooftop system" }
            ]
        },
        {
            title: "Elegant 3BHK Standalone House for Sale",
            description: "Solid earthquake-resistant 2.5 storey residential house located in a quiet cul-de-sac. Excellent neighborhood with broad 16ft pitched access road.",
            propertyType: "house",
            listingType: "for_sale",
            status: "active",
            price: 4200,
            pricePerSqft: 150,
            isNegotiable: true,
            areaSize: 2800,
            areaSizeUnit: "sqft",
            bedrooms: 4,
            bathrooms: 4,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 2,
            yearBuilt: 2019,
            furnishingStatus: "semi_furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 6,
            minStayNights: 1,
            location: {
                address: "Golfutar Height",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "water_tank", value: "10,000L Underground reserve" },
                { key: "road_access", value: "16ft Blacktopped" }
            ]
        },
        {
            title: "Contemporary Townhouse near Ring Road",
            description: "Brand new townhouse with clean lines, rooftop terrace, modular kitchen, and double parking. Ideal for modern urban living.",
            propertyType: "townhouse",
            listingType: "for_sale",
            status: "active",
            price: 3600,
            pricePerSqft: 163,
            isNegotiable: false,
            areaSize: 2200,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 3,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 2,
            yearBuilt: 2024,
            furnishingStatus: "unfurnished",
            isNewConstruction: true,
            isFeatured: false,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 5,
            minStayNights: 1,
            location: {
                address: "Maharajgunj",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "kitchen", value: "Italian modular fittings" },
                { key: "terrace", value: "Rooftop bbq deck" }
            ]
        },
        {
            title: "Commercial Office Space in Lazimpat",
            description: "Spacious open-concept commercial floor perfect for corporate offices, IT consultancies, or financial institutions. High footfall and central connectivity.",
            propertyType: "office",
            listingType: "for_rent",
            status: "active",
            price: 2500,
            pricePerSqft: 83,
            isNegotiable: true,
            areaSize: 3000,
            areaSizeUnit: "sqft",
            bedrooms: null,
            bathrooms: 3,
            floorNumber: 2,
            totalFloors: 6,
            parkingSpaces: 4,
            yearBuilt: 2020,
            furnishingStatus: "unfurnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: true,
            hasElevator: true,
            hasBalcony: false,
            maxGuests: null,
            minStayNights: null,
            location: {
                address: "Lazimpat Embassy Area",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "backup", value: "100% Commercial generator" },
                { key: "hvac", value: "Central VRV Air Conditioning" }
            ]
        },
        {
            title: "Lakeside Vacation Villa with Garden",
            description: "Breathtaking vacation villa situated steps away from Phewa Lake in Pokhara. Features sunny lawn, barbecue area, and tranquil ambiance for tourists.",
            propertyType: "villa",
            listingType: "vacation",
            status: "active",
            price: 2800,
            pricePerSqft: 112,
            isNegotiable: true,
            areaSize: 2500,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 3,
            floorNumber: 1,
            totalFloors: 2,
            parkingSpaces: 2,
            yearBuilt: 2017,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 6,
            minStayNights: 2,
            location: {
                address: "Lakeside Road",
                city: "Pokhara",
                state: "Gandaki",
                country: "Nepal",
                zipCode: "33700"
            },
            features: [
                { key: "view", value: "Phewa Lake & Annapurna range" },
                { key: "outdoor", value: "Campfire & BBQ pit" }
            ]
        },
        {
            title: "Prime Residential Land in Bhaktapur",
            description: "5 Aana prime residential plot facing east, located inside an upcoming planned colony with drainage, water supply, and wide roads.",
            propertyType: "land",
            listingType: "for_sale",
            status: "active",
            price: 1800,
            pricePerSqft: 105,
            isNegotiable: true,
            areaSize: 1715,
            areaSizeUnit: "sqft",
            bedrooms: null,
            bathrooms: null,
            floorNumber: null,
            totalFloors: null,
            parkingSpaces: null,
            yearBuilt: null,
            furnishingStatus: "unfurnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: false,
            maxGuests: null,
            minStayNights: null,
            location: {
                address: "Radhe Radhe",
                city: "Bhaktapur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44800"
            },
            features: [
                { key: "facing", value: "East / Morning Sun" },
                { key: "access", value: "20ft wide road" }
            ]
        },
        {
            title: "Modern 3BHK Penthouse with Terrace",
            description: "Top floor penthouse apartment with wrap-around balconies and panoramic 360-degree valley views. Luxurious finishes and private rooftop access.",
            propertyType: "apartment",
            listingType: "for_sale",
            status: "active",
            price: 5200,
            pricePerSqft: 200,
            isNegotiable: false,
            areaSize: 2600,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 3,
            floorNumber: 10,
            totalFloors: 10,
            parkingSpaces: 2,
            yearBuilt: 2022,
            furnishingStatus: "furnished",
            isNewConstruction: true,
            isFeatured: true,
            isVerified: true,
            hasGarden: false,
            hasPool: true,
            hasBasement: true,
            hasElevator: true,
            hasBalcony: true,
            maxGuests: 6,
            minStayNights: 1,
            location: {
                address: "Dhapakhel Heights",
                city: "Lalitpur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44700"
            },
            features: [
                { key: "rooftop", value: "Private terrace garden" },
                { key: "clubhouse", value: "Gym, sauna & indoor pool access" }
            ]
        },
        {
            title: "Affordable 1BHK Flat in Kirtipur",
            description: "Budget-friendly 1-bedroom flat close to Tribhuvan University. Quiet residential neighborhood with friendly community and low utilities.",
            propertyType: "apartment",
            listingType: "for_rent",
            status: "active",
            price: 450,
            pricePerSqft: 75,
            isNegotiable: true,
            areaSize: 600,
            areaSizeUnit: "sqft",
            bedrooms: 1,
            bathrooms: 1,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 1,
            yearBuilt: 2016,
            furnishingStatus: "unfurnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: false,
            hasGarden: false,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: false,
            maxGuests: 2,
            minStayNights: 30,
            location: {
                address: "Naya Bazar",
                city: "Kirtipur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44618"
            },
            features: [
                { key: "suitable_for", value: "Students & young couples" },
                { key: "water", value: "Deep boring water" }
            ]
        },
        {
            title: "Traditional Newari House in Patan Durbar",
            description: "Heritage restored Newari brick home featuring intricately carved wooden windows, courtyard (chowk), and traditional terracotta tiled ceilings.",
            propertyType: "house",
            listingType: "vacation",
            status: "active",
            price: 2100,
            pricePerSqft: 116,
            isNegotiable: false,
            areaSize: 1800,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 1,
            yearBuilt: 2012,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 6,
            minStayNights: 3,
            location: {
                address: "Mangal Bazar",
                city: "Lalitpur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44700"
            },
            features: [
                { key: "architecture", value: "Traditional Newari carved wood" },
                { key: "courtyard", value: "Traditional private inner chowk" }
            ]
        },
        {
            title: "Commercial Retail Shop in New Road",
            description: "High-visibility ground floor shop space right in the bustling heart of New Road. Unbeatable foot traffic for retail, electronics, or fashion boutique.",
            propertyType: "shop",
            listingType: "for_rent",
            status: "active",
            price: 1800,
            pricePerSqft: 360,
            isNegotiable: true,
            areaSize: 500,
            areaSizeUnit: "sqft",
            bedrooms: null,
            bathrooms: 1,
            floorNumber: 1,
            totalFloors: 4,
            parkingSpaces: 0,
            yearBuilt: 2015,
            furnishingStatus: "semi_furnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: false,
            maxGuests: null,
            minStayNights: null,
            location: {
                address: "Khichapokhari",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "foot_traffic", value: "10,000+ daily pedestrians" },
                { key: "shutter", value: "Motorized security shutter" }
            ]
        },
        {
            title: "Cozy 2BHK Home with Sunny Backyard",
            description: "Delightful single-family bungalow featuring a private grassy yard, vegetable patch, sunny veranda, and secure boundary perimeter.",
            propertyType: "house",
            listingType: "for_rent",
            status: "active",
            price: 1100,
            pricePerSqft: 73,
            isNegotiable: true,
            areaSize: 1500,
            areaSizeUnit: "sqft",
            bedrooms: 2,
            bathrooms: 2,
            floorNumber: 1,
            totalFloors: 2,
            parkingSpaces: 2,
            yearBuilt: 2014,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 4,
            minStayNights: 30,
            location: {
                address: "Bhaisepati",
                city: "Lalitpur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44700"
            },
            features: [
                { key: "pet_friendly", value: "Yes, dogs & cats welcome" },
                { key: "garden", value: "Vegetable garden patch" }
            ]
        },
        {
            title: "Executive 3BHK Serviced Apartment",
            description: "Fully serviced luxury apartment designed for expat executives. Weekly housekeeping, gym access, concierge, and dedicated covered basement parking included.",
            propertyType: "apartment",
            listingType: "short_term",
            status: "active",
            price: 2400,
            pricePerSqft: 150,
            isNegotiable: false,
            areaSize: 1600,
            areaSizeUnit: "sqft",
            bedrooms: 3,
            bathrooms: 3,
            floorNumber: 5,
            totalFloors: 8,
            parkingSpaces: 1,
            yearBuilt: 2021,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: false,
            hasPool: true,
            hasBasement: true,
            hasElevator: true,
            hasBalcony: true,
            maxGuests: 5,
            minStayNights: 7,
            location: {
                address: "Baluwatar Prime",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "housekeeping", value: "Twice weekly included" },
                { key: "amenities", value: "Gym & Swimming Pool access" }
            ]
        },
        {
            title: "Suburban 4BHK Family Villa in Sitapaila",
            description: "Sprawling 4BHK villa on a quiet hill slope with tranquil mountain views. Ample yard space for children and pets, plus separate servant quarters.",
            propertyType: "villa",
            listingType: "for_sale",
            status: "active",
            price: 4900,
            pricePerSqft: 140,
            isNegotiable: true,
            areaSize: 3500,
            areaSizeUnit: "sqft",
            bedrooms: 4,
            bathrooms: 4,
            floorNumber: 1,
            totalFloors: 3,
            parkingSpaces: 3,
            yearBuilt: 2020,
            furnishingStatus: "semi_furnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: true,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 8,
            minStayNights: 1,
            location: {
                address: "Sitapaila Heights",
                city: "Kathmandu",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44600"
            },
            features: [
                { key: "servant_quarter", value: "Attached 1 room + bath" },
                { key: "parking", value: "Accommodates 3 SUVs" }
            ]
        },
        {
            title: "Commercial Warehouse Space in Balkumari",
            description: "Heavy-duty commercial warehouse with 22ft ceiling clearance, wide container truck loading bay, three-phase industrial power, and concrete flooring.",
            propertyType: "warehouse",
            listingType: "for_rent",
            status: "active",
            price: 3200,
            pricePerSqft: 53,
            isNegotiable: true,
            areaSize: 6000,
            areaSizeUnit: "sqft",
            bedrooms: null,
            bathrooms: 2,
            floorNumber: 1,
            totalFloors: 1,
            parkingSpaces: 6,
            yearBuilt: 2019,
            furnishingStatus: "unfurnished",
            isNewConstruction: false,
            isFeatured: false,
            isVerified: true,
            hasGarden: false,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: false,
            maxGuests: null,
            minStayNights: null,
            location: {
                address: "Ring Road Corridor",
                city: "Lalitpur",
                state: "Bagmati",
                country: "Nepal",
                zipCode: "44700"
            },
            features: [
                { key: "loading_bay", value: "Accommodates 40ft containers" },
                { key: "power", value: "Industrial 3-Phase 100kVA" }
            ]
        },
        {
            title: "Charming Lakeview Vacation Cottage",
            description: "Rustic wooden vacation cottage overlooking Begnas Lake. Quiet retreat surrounded by organic fruit orchards and clean fresh air.",
            propertyType: "house",
            listingType: "vacation",
            status: "active",
            price: 1350,
            pricePerSqft: 112,
            isNegotiable: false,
            areaSize: 1200,
            areaSizeUnit: "sqft",
            bedrooms: 2,
            bathrooms: 1,
            floorNumber: 1,
            totalFloors: 2,
            parkingSpaces: 1,
            yearBuilt: 2018,
            furnishingStatus: "furnished",
            isNewConstruction: false,
            isFeatured: true,
            isVerified: true,
            hasGarden: true,
            hasPool: false,
            hasBasement: false,
            hasElevator: false,
            hasBalcony: true,
            maxGuests: 4,
            minStayNights: 2,
            location: {
                address: "Begnas Tal Road",
                city: "Pokhara",
                state: "Gandaki",
                country: "Nepal",
                zipCode: "33700"
            },
            features: [
                { key: "view", value: "Direct Begnas Lake frontage" },
                { key: "activities", value: "Boating and hiking trails nearby" }
            ]
        }
    ];

    let createdCount = 0;

    for (let i = 0; i < propertiesToSeed.length; i++) {
        const item = propertiesToSeed[i];
        const { location, features, ...propertyData } = item;

        // Generate clean unique slug
        let baseSlug = slugify(propertyData.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.property.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Pick 1-2 images from the existing pool
        const imagePayload = [];
        if (sampleImages.length > 0) {
            const img1 = sampleImages[i % sampleImages.length];
            imagePayload.push({
                image: img1,
                altText: `${propertyData.title} - Main View`,
                isPrimary: true,
                sortOrder: 0,
            });

            if (sampleImages.length > 1) {
                const img2 = sampleImages[(i + 1) % sampleImages.length];
                imagePayload.push({
                    image: img2,
                    altText: `${propertyData.title} - Interior View`,
                    isPrimary: false,
                    sortOrder: 1,
                });
            }
        }

        const created = await prisma.property.create({
            data: {
                ...propertyData,
                slug,
                agent: { connect: { id: agent.id } },
                location: {
                    create: location
                },
                features: features && features.length > 0 ? {
                    create: features
                } : undefined,
                images: imagePayload.length > 0 ? {
                    create: imagePayload
                } : undefined
            }
        });

        createdCount++;
        console.log(`[${createdCount}/${propertiesToSeed.length}] Created: "${created.title}" (ID: ${created.id}, Slug: ${created.slug})`);
    }

    console.log(`\n Successfully seeded ${createdCount} properties!`);
    const totalCount = await prisma.property.count();
    console.log(`Total properties currently in database: ${totalCount}`);
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
