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
-- Table structure for table `friend`
--

DROP TABLE IF EXISTS `friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend` (
  `friend_id` bigint NOT NULL AUTO_INCREMENT,
  `best_friend` bit(1) NOT NULL DEFAULT b'0',
  `my_id` bigint DEFAULT NULL,
  `your_id` bigint DEFAULT NULL,
  `chat_id` bigint DEFAULT NULL,
  PRIMARY KEY (`friend_id`),
  KEY `FKjsj765jki270yn3ns5nq8t9cr` (`my_id`),
  KEY `FKnwmksb2jcmx1qpxna0pn5ssn2` (`your_id`),
  KEY `FKqvf5l9tqhcggd4pr5ntraovwx` (`chat_id`),
  CONSTRAINT `FKjsj765jki270yn3ns5nq8t9cr` FOREIGN KEY (`my_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKnwmksb2jcmx1qpxna0pn5ssn2` FOREIGN KEY (`your_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKqvf5l9tqhcggd4pr5ntraovwx` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend`
--

LOCK TABLES `friend` WRITE;
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
INSERT INTO `friend` VALUES (89,_binary '\0',8,2,25),(90,_binary '\0',2,8,25),(91,_binary '\0',10,13,26),(92,_binary '',13,10,26),(93,_binary '\0',10,2,27),(94,_binary '',2,10,27),(95,_binary '\0',10,3,28),(96,_binary '\0',3,10,28),(97,_binary '\0',10,9,29),(98,_binary '',9,10,29),(103,_binary '\0',13,2,32),(104,_binary '\0',2,13,32),(105,_binary '\0',13,3,33),(106,_binary '\0',3,13,33),(123,_binary '\0',9,2,42),(124,_binary '',2,9,42),(127,_binary '\0',9,13,44),(128,_binary '\0',13,9,44),(131,_binary '\0',17,13,46),(132,_binary '\0',13,17,46),(135,_binary '\0',17,9,48),(136,_binary '\0',9,17,48),(137,_binary '\0',17,2,49),(138,_binary '\0',2,17,49),(139,_binary '\0',17,3,50),(140,_binary '\0',3,17,50),(143,_binary '\0',2,18,52),(144,_binary '\0',18,2,52),(159,_binary '\0',4,18,60),(160,_binary '\0',18,4,60),(161,_binary '\0',4,2,61),(162,_binary '\0',2,4,61),(165,_binary '\0',4,12,63),(166,_binary '\0',12,4,63),(167,_binary '\0',4,9,64),(168,_binary '\0',9,4,64),(169,_binary '\0',8,9,65),(170,_binary '\0',9,8,65),(171,_binary '\0',4,3,66),(172,_binary '\0',3,4,66),(173,_binary '\0',2,3,67),(175,_binary '\0',10,11,68),(176,_binary '\0',11,10,68),(177,_binary '\0',10,4,69),(178,_binary '\0',4,10,69);
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;
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
