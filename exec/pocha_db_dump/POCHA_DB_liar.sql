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
-- Table structure for table `liar`
--

DROP TABLE IF EXISTS `liar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `liar` (
  `liar_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(30) NOT NULL,
  `word` varchar(30) NOT NULL,
  PRIMARY KEY (`liar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liar`
--

LOCK TABLES `liar` WRITE;
/*!40000 ALTER TABLE `liar` DISABLE KEYS */;
INSERT INTO `liar` VALUES (1,'인물','강동원'),(2,'인물','유재석'),(3,'인물','공유'),(4,'인물','손석구'),(5,'인물','장원영'),(6,'인물','뉴진스 민지'),(7,'인물','수지'),(8,'인물','이재용'),(9,'인물','하하'),(10,'인물','박명수'),(11,'인물','정준하'),(12,'인물','전소민'),(13,'인물','송지효'),(14,'인물','김민경'),(15,'인물','원빈'),(17,'인물 ','김연아'),(18,'인물','백현'),(19,'인물','서장훈'),(20,'인물','이수근'),(21,'인물','강호동'),(22,'인물','김희철'),(23,'인물','려욱'),(24,'인물','이용진'),(25,'인물','조세호'),(26,'인물','남창희');
/*!40000 ALTER TABLE `liar` ENABLE KEYS */;
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

-- Dump completed on 2023-02-17 11:20:22
