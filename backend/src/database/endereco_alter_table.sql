-- Endereço de entrega gravado em cada pedido (cadastrado ou personalizado no checkout).
-- Rode UMA vez no banco que já existe (feracustom_database).
-- Se você criar o banco do zero com script_feracustom.sql, NÃO precisa rodar este arquivo.

USE `feracustom_database`;

ALTER TABLE `pedidos`
  ADD COLUMN `entrega_rua` varchar(100) DEFAULT NULL,
  ADD COLUMN `entrega_numero` varchar(20) DEFAULT NULL,
  ADD COLUMN `entrega_bairro` varchar(100) DEFAULT NULL,
  ADD COLUMN `entrega_cidade` varchar(100) DEFAULT NULL,
  ADD COLUMN `entrega_uf` char(2) DEFAULT NULL,
  ADD COLUMN `entrega_cep` char(8) DEFAULT NULL,
  ADD COLUMN `entrega_complemento` varchar(255) DEFAULT NULL;
