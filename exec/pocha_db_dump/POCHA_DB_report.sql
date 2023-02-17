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
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `report_id` bigint NOT NULL AUTO_INCREMENT,
  `demerit` int NOT NULL,
  `report_reason` varchar(255) DEFAULT NULL,
  `report_result` bit(1) NOT NULL,
  `report_type` int NOT NULL,
  `report_at` datetime(6) NOT NULL,
  `attacker_id` bigint DEFAULT NULL,
  `repoter_id` bigint DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `FKb7w8y8mhh7lixy9edpe15sg8w` (`attacker_id`),
  KEY `FK92j0g9sbbmc3t2dwi07kf36j3` (`repoter_id`),
  CONSTRAINT `FK92j0g9sbbmc3t2dwi07kf36j3` FOREIGN KEY (`repoter_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKb7w8y8mhh7lixy9edpe15sg8w` FOREIGN KEY (`attacker_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES (1,0,'string',_binary '',0,'2023-02-01 23:38:22.777000',2,4),(2,0,'c초코로 암살',_binary '',0,'2023-02-02 09:40:47.861000',3,4),(3,0,'string',_binary '\0',0,'2023-02-02 10:28:04.533000',8,4),(4,2,'째가 그랬어요;;;;',_binary '',0,'2023-02-07 15:13:42.897000',4,2),(5,2,'코딩 혼자 다해서 젼나멋져요',_binary '',0,'2023-02-07 15:14:18.719000',13,2),(6,0,'닉네임이 분홍돼지에욤',_binary '\0',0,'2023-02-07 15:14:45.723000',8,2),(7,2,'닉네임이 별로에요',_binary '',0,'2023-02-07 15:14:55.021000',8,2),(8,0,'닉네임 별로임',_binary '',0,'2023-02-07 15:15:00.734000',8,2),(9,0,'닉네임 바꾸라고 해주세요',_binary '\0',0,'2023-02-07 15:15:08.216000',8,2),(10,1,'닉네임 꿀꿀돼지 어떠신지?',_binary '',0,'2023-02-07 15:15:18.361000',8,2),(11,0,'123123',_binary '\0',0,'2023-02-11 16:27:52.171000',17,10),(12,0,'신고',_binary '\0',0,'2023-02-11 16:31:41.100000',2,10),(15,0,'타입오나?',_binary '\0',0,'2023-02-12 20:58:41.989000',10,10),(16,0,'ㅋㅋ',_binary '\0',3,'2023-02-12 20:59:07.835000',10,10),(17,0,'심각하네요',_binary '\0',0,'2023-02-16 08:53:49.243000',3,4),(18,2,'ㅋ',_binary '',0,'2023-02-16 14:08:35.861000',3,2),(19,2,'ㅁ',_binary '',0,'2023-02-16 14:10:36.841000',3,2),(20,2,'ㅁ',_binary '',0,'2023-02-16 14:10:41.981000',3,2),(21,0,'ㅁ',_binary '\0',0,'2023-02-16 14:10:49.037000',3,2),(22,0,'홓',_binary '\0',0,'2023-02-16 14:10:54.000000',3,2),(23,0,'drydry',_binary '\0',0,'2023-02-17 02:11:44.383000',13,3),(24,0,'ㅅㄴㄷㅅㄴㄷㅅㄷㄴㅅ',_binary '\0',0,'2023-02-17 02:22:05.279000',13,3),(25,0,'이사람 유튜브 사칭범임',_binary '\0',0,'2023-02-17 10:45:15.705000',4,10),(26,0,'얘 나한테 욕했어요 ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ',_binary '\0',0,'2023-02-17 10:45:29.446000',3,10),(27,0,'그냥 못생겨서 신고합니다 ㅋㅋ',_binary '\0',0,'2023-02-17 10:45:45.246000',4,10),(28,0,'저금통이 얼음인건 좀 오바인듯 ㅋㅋㅋ',_binary '\0',0,'2023-02-17 10:46:00.752000',3,10);
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
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

-- Dump completed on 2023-02-17 11:20:24
