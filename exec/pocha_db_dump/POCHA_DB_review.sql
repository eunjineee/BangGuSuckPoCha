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
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) NOT NULL,
  `review_score` int NOT NULL,
  `review_at` datetime(6) DEFAULT NULL,
  `from_id` bigint DEFAULT NULL,
  `web_id` bigint DEFAULT NULL,
  `to_id` bigint DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `FKjpcb4py2gfc9k4a8pldisrmyj` (`from_id`),
  KEY `FK40dq79aelievdf1833ai9pbf0` (`web_id`),
  KEY `FKpiugvwm0jk8087byjwpqmhcbw` (`to_id`),
  CONSTRAINT `FK40dq79aelievdf1833ai9pbf0` FOREIGN KEY (`web_id`) REFERENCES `pocha` (`pocha_id`),
  CONSTRAINT `FKjpcb4py2gfc9k4a8pldisrmyj` FOREIGN KEY (`from_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKpiugvwm0jk8087byjwpqmhcbw` FOREIGN KEY (`to_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=834 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (828,'2023-02-17 10:58:20.771000',3,NULL,3,1376,10),(829,'2023-02-17 10:58:20.777000',3,'2023-02-17 10:59:54.755000',10,1376,3),(830,'2023-02-17 10:58:20.778000',3,NULL,4,1376,10),(831,'2023-02-17 10:58:20.779000',3,NULL,10,1376,4),(832,'2023-02-17 11:01:11.770000',3,NULL,4,1376,3),(833,'2023-02-17 11:01:11.772000',3,NULL,3,1376,4);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
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

-- Dump completed on 2023-02-17 11:20:20
