-- SQL statements for the DOWN migration
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `access_token`, `role`, `user`, `user_role`;
SET foreign_key_checks = 1;
