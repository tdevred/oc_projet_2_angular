# Projet : Développez le frontend en utilisant Angular

Le but de ce projet était de proposer une visualisation des données de Jeux Olympiques à l'aide de plusieurs graphiques.

## Architecture du code et parcours utilisateur

Ce code fonctionne autour de 3 composants affichés selon l'URL entrée par l'utilisateur :

### Home : accueil

Ce composant représente le point d'entrée attendu de l'application pour un utilisateur. Les données générales sur l'ensemble des pays participants sont affichées sous la forme d'un graphique en disque, et l'accès au détail de chaque pays se fait en cliquant sur la portion de disque correspondante.

### Détail

Ce composant affiche en détail les données temporelles relatives au pays sélectionné. Un graphique en ligne affiche le nombre de médailles obtenues par édition des jeux olympiques.

Ce composant pouvant être accédé via un clic à partir du tableau de bord principal et par entrée directe de l'URL de l'utilisateur, l'id correspondant au pays sélectionné est vérifié, et redirige vers le tableau de bord principal en cas de pays non valide.

### En cas d'erreur sur l'URL

En cas d'erreur sur l'URL entrée autre que pour détail du pays, l'utilisateur voit une page avec un message et un lien l'invitant à retourner sur la page d'accueil.

## Lancer le projet

Pour lancer le projet, il faut tout d'abord installer les dépendances nécessaires à l'aide de la commande `npm install`. Puis, lancer le serveur de test s'effectue avec la commande `npm run start`. La page est alors accessible à l'URL http://localhost:4200. 