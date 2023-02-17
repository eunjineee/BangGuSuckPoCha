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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `birth` varchar(30) NOT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `gender` varchar(2) NOT NULL,
  `is_ban` bit(1) NOT NULL,
  `manner` double NOT NULL,
  `nickname` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `point` int NOT NULL,
  `profile` varchar(200) NOT NULL,
  `report_point` int NOT NULL,
  `role` varchar(15) NOT NULL,
  `time` datetime(6) DEFAULT NULL,
  `username` varchar(250) NOT NULL,
  `refresh_token_id` bigint DEFAULT NULL,
  `region` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FK44acn4a65scossvecwa6jx3wt` (`refresh_token_id`),
  KEY `FKpkd9k0qah1fb6iro1swuk2kew` (`region`),
  CONSTRAINT `FK44acn4a65scossvecwa6jx3wt` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_token` (`refresh_token_id`),
  CONSTRAINT `FKpkd9k0qah1fb6iro1swuk2kew` FOREIGN KEY (`region`) REFERENCES `region` (`region_code`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'1998.06.05','#ESTP #스파이패밀리 #절대안봄','F',_binary '\0',44.20000000000011,'은진공듀','0',3500,'/profile/icon_0002.png',2,'USER','2023-02-17 09:58:25.927000','BxUFqlg9eevDOdwfdd8S-BFcRavDKPxUXRmB8H00d2I',71,'2600000000'),(3,'1996.04.18','#INFP #노래방최고 #술조아','F',_binary '\0',96.63299999999997,'얼음저금통','0',1500,'/profile/icon_0007.png',10,'USER','2023-02-17 11:05:46.151000','1rvvwoVohwOln9JEnGmwYF70_9Kw-ZkBM17kicx3HdY',76,'2600000000'),(4,'1994.10.02','#마라샹궈 #수면부족','M',_binary '\0',42.10000000000008,'Hminor','0',1500,'/profile/icon_0001.png',2,'USER','2023-02-17 11:05:45.588000','1zjK_Yrq6klkIxBWj8bj1WJkV5ng-7jhrRGvlIJXawI',57,'2600000000'),(5,'1999.01.01','컨설턴트님 관리자','M',_binary '\0',0,'consultant_admin','$2a$10$kDMcv6o.0ebbsxvkjerwR.zj.mb4KVl91W2l0.ttC8o.Cu4NhbWtu',1000,'/profile/icon_0002.png',0,'ADMIN','2023-01-31 17:30:38.690000','admin',14,'1100000000'),(6,'1999.01.01','백엔드 코치님 관리자','M',_binary '\0',0,'coach_back_admin','$2a$10$kDMcv6o.0ebbsxvkjerwR.zj.mb4KVl91W2l0.ttC8o.Cu4NhbWtu',1000,'/profile/icon_0003.png',0,'ADMIN','2023-01-31 17:30:38.690000','adminBack',NULL,'1100000000'),(7,'1999.01.01','프론트 코치님 관리자','M',_binary '\0',0.2,'coach_front_admin','$2a$10$kDMcv6o.0ebbsxvkjerwR.zj.mb4KVl91W2l0.ttC8o.Cu4NhbWtu',1000,'/profile/icon_0008.png',0,'ADMIN','2023-01-31 17:30:38.690000','adminFront',NULL,'1100000000'),(8,'1998.04.01','roll_cake_5','F',_binary '\0',36.4,'롤케익','0',3000,'/profile/icon_0004.png',6,'USER','2023-02-14 13:34:54.357000','0BGG_3j2xR0i1IWEc7i9Qn_5Jw5fJBbqEM2CQxdse-o',5,'4111000000'),(9,'1998.04.01','안녕하세요!~~~~','F',_binary '\0',40.60000000000006,'오리','0',5500,'/profile/icon_0005.png',0,'USER','2023-02-17 09:49:01.883000','DnXrE8Ea860Euv_LONqQyz4pnK86XrDd0YinVdBAaeA',NULL,'4800000000'),(10,'1993.03.06',NULL,'M',_binary '\0',41.40000000000007,'핑크빈','0',8500,'/profile/icon_0006.png',0,'USER','2023-02-17 10:56:38.061000','HeiUlCpxJfMFHd5TcGkLELqswisSjEwlwEHeJdtDAMw',67,'1100000000'),(11,'1997.05.28','#하잉#바잉#또잉','M',_binary '\0',36.7,'bot','0',4000,'/profile/icon_0002.png',0,'USER','2023-02-17 10:45:31.624000','dsThTYraClKOmXMia7bSUMfeJFpwdT4RC_YvH7fU37A',45,'4111000000'),(12,'1986.11.15','#나는야도비#이름길게하지마#ㅋ#ㅋㅋ','M',_binary '\0',36.5,'나는야퉁퉁이','0',1000,'/profile/icon_0009.png',0,'USER','2023-02-03 13:50:31.523000','SY56Kd6t60gUGNPuUCmng1Q-HmPHfV86hBhTGixeYww',10,'4111000000'),(13,'1997.03.18','집 보내줘!!!!','M',_binary '\0',34.89999999999998,'부산도라에몽','0',1500,'/profile/icon_0005.png',4,'USER','2023-02-17 10:06:53.483000','NUEoAaUktTEixFvA25NzirH--LwR1eVDIsPnOAysvD8',NULL,'2600000000'),(14,'1994.07.16',NULL,'M',_binary '\0',36.5,'강코치','0',1500,'/profile/icon_0002.png',0,'USER','2023-02-16 15:58:05.279000','uJ8BLD1lCRSqVt1GfiIHXIfDVWH5nmyGIiVSQ94aAwY',NULL,'4111000000'),(15,'1998.06.05',NULL,'F',_binary '\0',36.5,'k5_UWVKyyzIhB5iaiWmA5H_o-p4MNhUsvRkhwSdvFB8','0',1000,'/profile/icon_0002.png',0,'USER','2023-02-10 01:28:29.825000','k5_UWVKyyzIhB5iaiWmA5H_o-p4MNhUsvRkhwSdvFB8',24,'1100000000'),(16,'2023.02.02',NULL,'M',_binary '\0',36.5,'관리자eunjin','$2a$10$hijF2IE.rCeDR0/oRn16R.eEXTfrc47U1Jbjh6pXlNp.5zNWSfKlS',1000,'/profile/icon_0004.png',0,'ADMIN','2023-02-10 01:40:27.368000','eun',NULL,'2600000000'),(17,'1993.03.06','#나는 핑크빈의 분신이다 ','F',_binary '\0',37.10000000000001,'예티','0',1500,'/profile/icon_0002.png',0,'USER','2023-02-17 10:56:02.054000','r7VKJ_Lv7WZF_c_AY9xxEncr9v1PLTULBllhUQLa52k',66,'2600000000'),(18,'1998.06.05',NULL,'F',_binary '\0',36.5,'인정?어인정','0',1000,'/profile/icon_0002.png',0,'USER','2023-02-10 17:49:40.652000','_u9eMU1C2e_pBxnrAVc5d-FWDM2_NryKyozJQysdKAk',30,'2600000000'),(22,'1999.01.01',NULL,'M',_binary '\0',36.5,'SFlywY-QBYlr0jkQLL7BugnnQxa9Rn6wl_TYmhAiURo','0',1000,'/profile/icon_0002.png',0,'USER','2023-02-16 14:52:49.950000','SFlywY-QBYlr0jkQLL7BugnnQxa9Rn6wl_TYmhAiURo',69,'1100000000'),(23,'1997.03.18','맑음','F',_binary '\0',36.5,'테스트규글','0',1500,'/profile/icon_0002.png',0,'USER','2023-02-17 10:16:08.331000','6TFBDidWnvpYiHzMiJMnHkfPmQKxgMnvKf24zrI11iM',73,'1100000000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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

-- Dump completed on 2023-02-17 11:20:17
