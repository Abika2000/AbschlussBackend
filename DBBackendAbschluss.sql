CREATE DATABASE IF NOT EXISTS `DBBackendAbschluss`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `DBBackendAbschluss`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `weapon_specs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `weapon_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `caliber` VARCHAR(100) NOT NULL,
  `range_m` INT NOT NULL,
  `material` VARCHAR(255) NOT NULL,
  `fire_rate` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `ammunition` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ammunition_type` VARCHAR(255) NOT NULL,
  `caliber` VARCHAR(100) NOT NULL,
  `penetration_mm` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `ammunition_weapon` (
  `ammunition_id` INT UNSIGNED NOT NULL,
  `weapon_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ammunition_id`, `weapon_id`),
  CONSTRAINT `fk_ammunition_weapon_ammunition`
    FOREIGN KEY (`ammunition_id`) REFERENCES `ammunition` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_ammunition_weapon_weapon`
    FOREIGN KEY (`weapon_id`) REFERENCES `weapon_specs` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `advanced_weapon_stats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_id` VARCHAR(255) NOT NULL,
  `weapon_name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NULL,
  `caliber` VARCHAR(100) NULL,
  `source_data` JSON NOT NULL,
  `fetched_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_advanced_weapon_stats_source_id` (`source_id`),
  KEY `idx_advanced_weapon_stats_weapon_name` (`weapon_name`),
  KEY `idx_advanced_weapon_stats_caliber` (`caliber`)
) ENGINE=InnoDB;