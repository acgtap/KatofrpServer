--
-- File generated with SQLiteStudio v3.4.4 on ÖÜÎå 3ÔÂ 29 12:43:01 2024
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: user
DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user (
    id           INTEGER       NOT NULL
                               PRIMARY KEY AUTOINCREMENT,
    code         INTEGER,
    faceimg      VARCHAR (255),
    gender       VARCHAR (255),
    ip           VARCHAR (255),
    location     VARCHAR (255),
    msg          VARCHAR (255),
    nickname     VARCHAR (255),
    social_uid   VARCHAR (255),
    type         VARCHAR (255),
    isPro        BOOLEAN,
    access_token VARCHAR (255),
    outtime      VARCHAR (255),
    created_at   DATETIME      NOT NULL
                               DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL
                               DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user (id, code, faceimg, gender, ip, location, msg, nickname, social_uid, type, isPro, access_token, outtime, created_at, updated_at) VALUES (6, 0, 'https://thirdqq.qlogo.cn/ek_qqapp/AQBcJqkcicrHkpialorkoHtp1CoibJNNg4Mlv6hHIADaxcYkXyEAokI9KqGjMsGW6efCsdwGlbSUfYYc9mU3xzthhuUa9NcmvlbFowWISD7U2pqXpA856jA1CJPKcsmUQ/100', 'ÄÐ', '183.64.62.169', NULL, 'succ', 'www.', '1A02475C9F940948E48D6FDB66F4836E', 'qq', 1, 'E9F55DF1648851CFCAAFB2C7EA1F1C5C', '', '2024-02-28 15:51:57', '2024-02-28 15:51:57');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
