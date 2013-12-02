# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.33)
# Database: ci_codeclub
# Generation Time: 2013-11-21 08:50:41 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table dances
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dances`;

CREATE TABLE `dances` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `robot_name` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `robot_still` blob,
  `guid` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `move` text CHARACTER SET latin1,
  `votes` int(11) DEFAULT '0',
  `date_created` int(11) DEFAULT NULL,
  `date_updated` int(11) DEFAULT NULL,
  `is_entered_into_comp` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table dances_robots
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dances_robots`;

CREATE TABLE `dances_robots` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dance_id` int(11) DEFAULT NULL,
  `robot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table dances_soundtracks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dances_soundtracks`;

CREATE TABLE `dances_soundtracks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dance_id` int(11) DEFAULT NULL,
  `soundtrack_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table dances_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dances_users`;

CREATE TABLE `dances_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dance_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table robots
# ------------------------------------------------------------

DROP TABLE IF EXISTS `robots`;

CREATE TABLE `robots` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Data help in puppets.json',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table soundtracks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `soundtracks`;

CREATE TABLE `soundtracks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
