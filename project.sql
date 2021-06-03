-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 19 oct. 2020 à 15:22
-- Version du serveur :  10.3.22-MariaDB-1ubuntu1
-- Version de PHP : 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `project`
--

-- --------------------------------------------------------

--
-- Structure de la table `advertisements`
--

CREATE TABLE `advertisements` (
  `advert_id` int(10) UNSIGNED NOT NULL,
  `advert_title` text NOT NULL,
  `advert_pdate` date NOT NULL,
  `advert_startdate` date NOT NULL,
  `advert_presentation` text NOT NULL,
  `advert_contractcat` text NOT NULL,
  `advert_pay` text NOT NULL,
  `compa_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `advertisements`
--

INSERT INTO `advertisements` (`advert_id`, `advert_title`, `advert_pdate`, `advert_startdate`, `advert_presentation`, `advert_contractcat`, `advert_pay`, `compa_id`) VALUES
(10, 'example 1', '2020-10-01', '2020-10-03', 'little presentation', 'CDD', '6000', 13),
(14, 'example 2', '2020-10-02', '2020-10-09', 'little presentation 2', 'Internship', '700', 14);

-- --------------------------------------------------------

--
-- Structure de la table `apply`
--

CREATE TABLE `apply` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `emailu` varchar(100) NOT NULL,
  `phone` int(15) NOT NULL,
  `text` varchar(5000) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp(),
  `ad_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `compagnies`
--

CREATE TABLE `compagnies` (
  `comp_id` int(10) UNSIGNED NOT NULL,
  `comp_adresse` text NOT NULL,
  `comp_ZIP` int(10) UNSIGNED NOT NULL,
  `comp_city` varchar(40) NOT NULL,
  `comp_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `compagnies`
--

INSERT INTO `compagnies` (`comp_id`, `comp_adresse`, `comp_ZIP`, `comp_city`, `comp_name`) VALUES
(13, '21 jump street', 42000, 'life place', 'Company1'),
(14, '22 jump street', 42001, 'New York', 'Company2');

-- --------------------------------------------------------

--
-- Structure de la table `people`
--

CREATE TABLE `people` (
  `id` int(10) UNSIGNED NOT NULL,
  `fname` varchar(50) NOT NULL,
  `sname` varchar(50) NOT NULL,
  `emailu` varchar(50) DEFAULT NULL,
  `phone` int(15) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `role` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `people`
--

INSERT INTO `people` (`id`, `fname`, `sname`, `emailu`, `phone`, `username`, `password`, `role`) VALUES
(1, 'Hugo', 'Manginot', NULL, NULL, 'adminhugo', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin'),
(2, 'Gabin', 'NERON', NULL, NULL, 'admingabin', 'e8653c7a2c6b96d66bd1e8dd270e3ed1', 'admin'),
(3, 'test11', 'test', 'test@mail.com', 0, 'gohu', '098f6bcd4621d373cade4e832627b4f6', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `advertisements`
--
ALTER TABLE `advertisements`
  ADD PRIMARY KEY (`advert_id`),
  ADD KEY `comp_id` (`compa_id`);

--
-- Index pour la table `apply`
--
ALTER TABLE `apply`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ad_id` (`ad_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `compagnies`
--
ALTER TABLE `compagnies`
  ADD PRIMARY KEY (`comp_id`);

--
-- Index pour la table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `advertisements`
--
ALTER TABLE `advertisements`
  MODIFY `advert_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `apply`
--
ALTER TABLE `apply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `compagnies`
--
ALTER TABLE `compagnies`
  MODIFY `comp_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `people`
--
ALTER TABLE `people`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `advertisements`
--
ALTER TABLE `advertisements`
  ADD CONSTRAINT `advertisements_ibfk_1` FOREIGN KEY (`compa_id`) REFERENCES `compagnies` (`comp_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `apply`
--
ALTER TABLE `apply`
  ADD CONSTRAINT `apply_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `advertisements` (`advert_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `apply_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `people` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
