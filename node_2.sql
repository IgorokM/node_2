-- Дамп структуры базы данных node_2
CREATE DATABASE IF NOT EXISTS `node_2`;
USE `node_2`;

-- Дамп структуры для таблица node_2.answer
CREATE TABLE IF NOT EXISTS `answer` (
  `name` enum('karl','marks') COLLATE utf8mb4_general_ci NOT NULL,
  `count` int(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы node_2.answer: ~2 rows (приблизительно)
DELETE FROM `answer`;
INSERT INTO `answer` (`name`, `count`) VALUES
	('karl', 0),
	('marks', 0);