-- Database Schema for Diafat Al-Haramain Service
-- Converted from Prisma Schema

SET FOREIGN_KEY_CHECKS = 0;

-- 🏨 Hotel Model (محرك الفنادق)
CREATE TABLE IF NOT EXISTS `Hotel` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nameEn` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `locationEn` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) DEFAULT 'SA',
    `rating` DECIMAL(3, 2) DEFAULT 0,
    `reviews` INT DEFAULT 0,
    `basePrice` DECIMAL(19, 4) NOT NULL,
    `image` VARCHAR(255) NOT NULL, -- Main cover image
    `lat` DECIMAL(10, 8) DEFAULT 0,
    `lng` DECIMAL(11, 8) DEFAULT 0,
    `description` TEXT NOT NULL,
    `isOffer` BOOLEAN DEFAULT FALSE,
    `isFeatured` BOOLEAN DEFAULT FALSE,
    `discount` VARCHAR(255),
    `distanceFromHaram` INT DEFAULT 0, -- In meters
    `hasFreeBreakfast` BOOLEAN DEFAULT FALSE,
    `hasFreeTransport` BOOLEAN DEFAULT FALSE,
    `extraBedStock` INT DEFAULT 0,
    `isVisible` BOOLEAN DEFAULT TRUE,
    `view` VARCHAR(255),
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Hotel_slug_key` (`slug`),
    INDEX `idx_hotel_city` (`city`),
    INDEX `idx_hotel_featured` (`isFeatured`),
    INDEX `idx_hotel_visible` (`isVisible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 📍 Nearby Places (Points of Interest)
CREATE TABLE IF NOT EXISTS `NearbyPlace` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `distance` VARCHAR(255) NOT NULL,
    `distanceMeters` INT,
    `type` VARCHAR(255),
    `icon` VARCHAR(255),
    `sortOrder` INT DEFAULT 0,
    `hotelId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `NearbyPlace_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🖼️ Hotel Images
CREATE TABLE IF NOT EXISTS `HotelImage` (
    `id` VARCHAR(36) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(255),
    `isMain` BOOLEAN DEFAULT FALSE,
    `hotelId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `HotelImage_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🛁 Amenities Refrence Table
CREATE TABLE IF NOT EXISTS `Amenity` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nameEn` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255),
    PRIMARY KEY (`id`),
    UNIQUE KEY `Amenity_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Junction Table for Hotel <-> Amenity
CREATE TABLE IF NOT EXISTS `HotelAmenity` (
    `hotelId` VARCHAR(36) NOT NULL,
    `amenityId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`hotelId`, `amenityId`),
    CONSTRAINT `HotelAmenity_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE,
    CONSTRAINT `HotelAmenity_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `Amenity` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🌟 Review Model
CREATE TABLE IF NOT EXISTS `Review` (
    `id` VARCHAR(36) NOT NULL,
    `userName` VARCHAR(255) NOT NULL,
    `rating` FLOAT NOT NULL,
    `text` TEXT NOT NULL,
    `date` VARCHAR(255) NOT NULL,
    `hotelId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `Review_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🛏️ Room Model
CREATE TABLE IF NOT EXISTS `Room` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `capacity` INT NOT NULL,
    `price` DECIMAL(19, 4) NOT NULL,
    `availableStock` INT DEFAULT 0,
    `mealPlan` VARCHAR(255) NOT NULL,
    `view` VARCHAR(255),
    `area` FLOAT,
    `beds` VARCHAR(255),
    `sofa` BOOLEAN DEFAULT FALSE,
    `allowExtraBed` BOOLEAN DEFAULT FALSE,
    `extraBedPrice` DECIMAL(19, 4) DEFAULT 0,
    `maxExtraBeds` INT DEFAULT 1,
    `isVisible` BOOLEAN DEFAULT TRUE,
    `hotelId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `Room_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE,
    INDEX `idx_room_hotel` (`hotelId`),
    INDEX `idx_room_visible` (`isVisible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🖼️ Room Images
CREATE TABLE IF NOT EXISTS `RoomImage` (
    `id` VARCHAR(36) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RoomImage_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ✨ Room Features
CREATE TABLE IF NOT EXISTS `RoomFeature` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `RoomFeature_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 📅 Pricing Periods
CREATE TABLE IF NOT EXISTS `PricingPeriod` (
    `id` VARCHAR(36) NOT NULL,
    `startDate` DATETIME NOT NULL,
    `endDate` DATETIME NOT NULL,
    `price` DECIMAL(19, 4) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `PricingPeriod_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room` (`id`) ON DELETE CASCADE,
    INDEX `idx_pricing_date` (`startDate`, `endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 👤 User Model
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255),
    `country` VARCHAR(255),
    `role` VARCHAR(255) DEFAULT 'USER',
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🎫 Coupon Model
CREATE TABLE IF NOT EXISTS `Coupon` (
    `id` VARCHAR(36) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `discount` INT NOT NULL,
    `limit` INT NOT NULL,
    `usedCount` INT DEFAULT 0,
    `isActive` BOOLEAN DEFAULT TRUE,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Coupon_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 📅 Booking Model
CREATE TABLE IF NOT EXISTS `Booking` (
    `id` VARCHAR(36) NOT NULL,
    `checkIn` DATETIME NOT NULL,
    `checkOut` DATETIME NOT NULL,
    `subtotal` DECIMAL(19, 4) DEFAULT 0,
    `totalPrice` DECIMAL(19, 4) NOT NULL,
    `discountAmount` DECIMAL(19, 4) DEFAULT 0,
    `status` VARCHAR(255) DEFAULT 'PENDING',
    `paymentStatus` VARCHAR(255) DEFAULT 'UNPAID',
    `paymentRef` VARCHAR(255),
    `userId` VARCHAR(36) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    `guestsCount` INT NOT NULL,
    `roomCount` INT DEFAULT 1,
    `extraBedCount` INT DEFAULT 0,
    `guestName` VARCHAR(255),
    `guestEmail` VARCHAR(255),
    `guestPhone` VARCHAR(255),
    `nationality` VARCHAR(100),
    `specialRequests` TEXT,
    `couponId` VARCHAR(36),
    -- 🛡️ Snapshot Columns (For Document Integrity & Voucher Stability)
    `bookedRoomName` VARCHAR(255),
    `bookedHotelName` VARCHAR(255),
    `bookedHotelAddress` VARCHAR(255),
    `bookedBoardBasis` VARCHAR(255),
    `bookedView` VARCHAR(255),
    `bookedBedding` VARCHAR(255),
    `bookedExtraBedPrice` DECIMAL(19, 4) DEFAULT 0,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room` (`id`) ON DELETE CASCADE,
    CONSTRAINT `Booking_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon` (`id`),
    INDEX `idx_booking_status` (`status`),
    INDEX `idx_booking_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 🔔 Notification Model
CREATE TABLE IF NOT EXISTS `Notification` (
    `id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `data` TEXT,
    `isRead` BOOLEAN DEFAULT FALSE,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 📩 Contact Message Model
CREATE TABLE IF NOT EXISTS `ContactMessage` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255),
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN DEFAULT FALSE,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
