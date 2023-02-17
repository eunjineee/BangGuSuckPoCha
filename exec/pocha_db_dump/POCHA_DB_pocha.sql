CREATE DATABASE  IF NOT EXISTS `POCHA_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `POCHA_DB`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: pocha.c2dmjuulvzgw.ap-northeast-2.rds.amazonaws.com    Database: POCHA_DB
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `pocha`
--

DROP TABLE IF EXISTS `pocha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pocha` (
  `pocha_id` bigint NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) DEFAULT NULL,
  `age` int NOT NULL,
  `alcohol` int NOT NULL,
  `end_at` datetime(6) NOT NULL,
  `is_end` bit(1) NOT NULL,
  `is_private` bit(1) NOT NULL,
  `is_ssul` bit(1) NOT NULL,
  `limit_user` int NOT NULL,
  `region` varchar(50) NOT NULL,
  `ssul_title` varchar(40) DEFAULT NULL,
  `theme_id` varchar(50) NOT NULL,
  `is_waiting` bit(1) NOT NULL,
  PRIMARY KEY (`pocha_id`),
  KEY `FKlgqx3gu5dr93ds8oc11m1t043` (`theme_id`),
  CONSTRAINT `FKlgqx3gu5dr93ds8oc11m1t043` FOREIGN KEY (`theme_id`) REFERENCES `theme` (`theme_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1379 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pocha`
--

LOCK TABLES `pocha` WRITE;
/*!40000 ALTER TABLE `pocha` DISABLE KEYS */;
INSERT INTO `pocha` VALUES (1319,'2023-02-17 00:55:20.391000',0,0,'2023-02-17 02:55:20.391000',_binary '\0',_binary '\0',_binary '\0',4,'전국',NULL,'T1B0',_binary '\0'),(1320,'2023-02-17 00:55:20.430000',0,0,'2023-02-17 00:55:41.948000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T1B0',_binary '\0'),(1321,'2023-02-17 00:59:20.886000',0,0,'2023-02-17 02:59:20.886000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1322,'2023-02-17 01:00:16.330000',0,0,'2023-02-17 01:04:46.174000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1323,'2023-02-17 01:04:55.788000',0,0,'2023-02-17 01:05:30.539000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1324,'2023-02-17 01:05:33.387000',0,0,'2023-02-17 01:06:07.396000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1325,'2023-02-17 01:06:11.881000',0,0,'2023-02-17 01:08:37.739000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1326,'2023-02-17 01:08:40.525000',0,0,'2023-02-17 01:10:09.019000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1327,'2023-02-17 01:10:27.716000',0,0,'2023-02-17 01:17:18.028000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1328,'2023-02-17 01:17:08.125000',0,0,'2023-02-17 01:17:41.282000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T0B0',_binary '\0'),(1329,'2023-02-17 01:17:20.781000',0,0,'2023-02-17 01:20:16.077000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1330,'2023-02-17 01:20:19.036000',0,0,'2023-02-17 03:14:04.593000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1331,'2023-02-17 01:39:18.262000',0,0,'2023-02-17 03:39:18.262000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1332,'2023-02-17 01:52:20.713000',0,0,'2023-02-17 01:54:41.127000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1333,'2023-02-17 01:55:58.962000',0,0,'2023-02-17 01:57:35.465000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1334,'2023-02-17 01:56:12.177000',0,0,'2023-02-17 03:56:12.177000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B2',_binary '\0'),(1335,'2023-02-17 01:57:21.818000',0,0,'2023-02-17 01:57:29.704000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1336,'2023-02-17 01:58:04.809000',0,2,'2023-02-17 02:01:15.700000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1337,'2023-02-17 02:11:18.259000',0,0,'2023-02-17 02:11:57.820000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T0B1',_binary '\0'),(1338,'2023-02-17 02:12:04.239000',0,0,'2023-02-17 04:12:04.239000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1339,'2023-02-17 02:12:08.616000',0,2,'2023-02-17 02:13:38.318000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T1B0',_binary '\0'),(1340,'2023-02-17 02:13:55.173000',0,4,'2023-02-17 02:16:27.274000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1341,'2023-02-17 02:21:12.563000',0,0,'2023-02-17 02:23:11.334000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1342,'2023-02-17 08:30:37.245000',0,0,'2023-02-17 08:31:25.059000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1343,'2023-02-17 09:02:35.178000',0,0,'2023-02-17 09:05:35.104000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1344,'2023-02-17 09:05:38.978000',0,0,'2023-02-17 09:06:13.357000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T1B0',_binary '\0'),(1345,'2023-02-17 09:12:26.537000',0,0,'2023-02-17 11:12:26.537000',_binary '\0',_binary '\0',_binary '\0',6,'전국',NULL,'T2B0',_binary ''),(1346,'2023-02-17 09:15:52.252000',0,0,'2023-02-17 09:16:52.558000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T0B0',_binary '\0'),(1347,'2023-02-17 09:16:49.697000',0,0,'2023-02-17 09:17:41.990000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T1B0',_binary '\0'),(1348,'2023-02-17 09:17:55.432000',0,0,'2023-02-17 09:19:16.758000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1349,'2023-02-17 09:19:31.350000',0,0,'2023-02-17 09:21:45.136000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1350,'2023-02-17 09:22:10.357000',0,0,'2023-02-17 11:22:10.357000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1351,'2023-02-17 09:22:22.524000',0,0,'2023-02-17 09:23:22.830000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1352,'2023-02-17 09:22:22.081000',0,0,'2023-02-17 09:23:11.345000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T1B0',_binary '\0'),(1353,'2023-02-17 09:23:26.894000',0,0,'2023-02-17 09:24:25.433000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1354,'2023-02-17 09:24:59.521000',0,0,'2023-02-17 09:37:01.128000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1355,'2023-02-17 09:31:41.254000',0,0,'2023-02-17 11:31:41.254000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1356,'2023-02-17 09:31:58.389000',0,0,'2023-02-17 09:33:24.472000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1357,'2023-02-17 09:35:06.836000',0,0,'2023-02-17 11:35:06.836000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1358,'2023-02-17 09:35:29.584000',0,0,'2023-02-17 09:39:54.572000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1359,'2023-02-17 09:39:45.830000',0,0,'2023-02-17 11:39:45.830000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1360,'2023-02-17 09:39:45.866000',0,0,'2023-02-17 09:39:47.632000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1361,'2023-02-17 09:40:13.500000',0,0,'2023-02-17 09:41:31.741000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1362,'2023-02-17 09:47:04.723000',0,0,'2023-02-17 09:52:00.943000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1363,'2023-02-17 09:53:23.257000',0,0,'2023-02-17 09:55:11.439000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1364,'2023-02-17 09:55:23.812000',0,0,'2023-02-17 09:56:35.525000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1365,'2023-02-17 09:56:56.785000',0,0,'2023-02-17 11:56:56.785000',_binary '\0',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1366,'2023-02-17 10:09:47.569000',0,0,'2023-02-17 10:19:54.839000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1367,'2023-02-17 10:10:23.644000',0,0,'2023-02-17 10:15:27.526000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T2B0',_binary ''),(1368,'2023-02-17 10:16:10.443000',0,0,'2023-02-17 10:22:21.015000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T2B0',_binary '\0'),(1369,'2023-02-17 10:20:04.348000',0,0,'2023-02-17 10:37:57.929000',_binary '',_binary '\0',_binary '',2,'전국','썰 등록','T0B0',_binary '\0'),(1370,'2023-02-17 10:38:16.071000',0,0,'2023-02-17 10:43:21.439000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T0B0',_binary '\0'),(1371,'2023-02-17 10:39:58.263000',0,0,'2023-02-17 12:39:58.263000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1372,'2023-02-17 10:40:24.755000',0,0,'2023-02-17 10:44:33.398000',_binary '',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0'),(1373,'2023-02-17 10:43:22.162000',0,0,'2023-02-17 10:43:50.445000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T0B0',_binary '\0'),(1374,'2023-02-17 10:43:54.391000',0,0,'2023-02-17 10:44:23.093000',_binary '',_binary '\0',_binary '\0',5,'전국',NULL,'T0B2',_binary '\0'),(1375,'2023-02-17 10:44:46.424000',0,0,'2023-02-17 10:52:27.318000',_binary '',_binary '\0',_binary '\0',6,'전국',NULL,'T0B0',_binary '\0'),(1376,'2023-02-17 10:51:28.900000',0,0,'2023-02-17 11:05:54.330000',_binary '',_binary '\0',_binary '\0',4,'전국',NULL,'T0B0',_binary '\0'),(1377,'2023-02-17 10:55:43.235000',0,0,'2023-02-17 12:55:43.235000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary ''),(1378,'2023-02-17 10:56:05.384000',0,0,'2023-02-17 12:56:05.384000',_binary '\0',_binary '\0',_binary '\0',2,'전국',NULL,'T2B0',_binary '\0');
/*!40000 ALTER TABLE `pocha` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-17 11:20:21
