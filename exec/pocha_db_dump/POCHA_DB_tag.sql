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
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `tag_id` bigint NOT NULL AUTO_INCREMENT,
  `tag` varchar(10) NOT NULL,
  `pocha_id` bigint NOT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `FK5vdpb8ia61j27agfn26k5ie81` (`pocha_id`),
  CONSTRAINT `FK5vdpb8ia61j27agfn26k5ie81` FOREIGN KEY (`pocha_id`) REFERENCES `pocha` (`pocha_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2934 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (2844,'위스키',1319),(2845,'음악',1319),(2846,'연애',1319),(2847,'와인',1319),(2848,'위스키',1320),(2849,'음악',1320),(2850,'연애',1320),(2851,'와인',1320),(2852,'애니메이션',1321),(2853,'애니메이션',1322),(2854,'애니메이션',1323),(2855,'게임',1323),(2856,'소주',1324),(2857,'애니메이션',1324),(2858,'애니메이션',1325),(2859,'애니메이션',1326),(2860,'애니메이션',1327),(2861,'축구',1328),(2862,'애니메이션',1329),(2863,'게임',1329),(2864,'애니메이션',1330),(2865,'게임',1330),(2866,'소주',1331),(2867,'음악',1331),(2868,'잡담',1331),(2869,'위스키',1332),(2870,'영화',1332),(2871,'운동',1332),(2872,'영화',1334),(2873,'위스키',1336),(2874,'영화',1336),(2875,'운동',1336),(2876,'맥주',1337),(2877,'축구',1337),(2878,'직장',1337),(2879,'소주',1339),(2880,'애니메이션',1339),(2881,'직장',1339),(2882,'소주',1340),(2883,'애니메이션',1340),(2884,'연예인',1340),(2885,'소주',1341),(2886,'애니메이션',1341),(2887,'연예인',1341),(2888,'애니메이션',1343),(2889,'애니메이션',1344),(2890,'와인',1345),(2891,'연애',1345),(2892,'잡담',1345),(2893,'애니메이션',1353),(2894,'소주',1353),(2895,'애니메이션',1354),(2896,'게임',1354),(2897,'애니메이션',1355),(2898,'애니메이션',1356),(2899,'애니메이션',1357),(2900,'게임',1357),(2901,'애니메이션',1358),(2902,'게임',1358),(2903,'애니메이션',1362),(2904,'게임',1362),(2905,'소주',1363),(2906,'맥주',1363),(2907,'와인',1363),(2908,'위스키',1363),(2909,'보드카',1363),(2910,'애니메이션',1364),(2911,'게임',1364),(2912,'연애',1364),(2913,'애니메이션',1365),(2914,'게임',1365),(2915,'소주',1366),(2916,'맥주',1366),(2917,'와인',1366),(2918,'위스키',1366),(2919,'보드카',1366),(2920,'소주',1367),(2921,'애니메이션',1367),(2922,'연예인',1367),(2923,'소주',1368),(2924,'애니메이션',1368),(2925,'연예인',1368),(2926,'연예인',1369),(2927,'게임',1373),(2928,'운동',1374),(2929,'영화',1375),(2930,'음악',1375),(2931,'축구',1375),(2932,'운동',1375),(2933,'애니메이션',1376);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
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

-- Dump completed on 2023-02-17 11:20:18
