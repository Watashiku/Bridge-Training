# Bridge Analysis

## Comment l'utiliser
Assurez-vous d'avoir docker installé [Installer Docker](https://docs.docker.com/engine/install/)
Assurez-vous d'avoir git installé [Installer Git]([https://docs.docker.com/engine/install/](https://github.com/git-guides/install-git))
Depuis le folder dans lequel vous voulez récupérer le projet :
```bash
git clone https://github.com/Watashiku/Bridge-Training.git
cd Bridge-Training
docker compose up
```

## Description
Ce projet a pour but de faciliter l'apprentissage du brige, en particulier du SEF (Système d'Enseignement Français)

### Parsing
On crée une base de données à partir de fichier pdf decrivant des donnes de tournois pour débutant
(script python pout le parsing du pdf, fichier json pour la DB)

### Backend
Cette base est ensuite utilisée pour créer une API permettant de d"entrainer sur des donnes aléatoires
(l'API est écrite en C#)

### Frontend
Un frontend s'appuyant sur l'API permet de visualiser les exercices et interagir avec pour s'entrainer
(le frontend est en React)

## Todo
Ce programme est dans une phase initiale et connait un certain nombre de limitations

Voici une liste de bugs ou amélioration à prévoir, elle n'est pas exhaustive :
### DB
- La DB générée n'a pas exactement le même format que la DB utilisée par le backend (Donne N° -> DonneNo)
- La DB générée ne se situe pas automatiquement au bon endroit pour que le backend l'utilise
- Le format général de la DB pourrait être repensé
- La page associé à la donne devrait être liée à l'objet dans la DB
### Parsing
- Le parsing depuis le pdf n'est pas parfait : certaines donnes sont illisibles, certaines mains sont inversées (S/E)
- Il faudrait pouvoir double check le json, par exemple avec une ia qui regarde la page et valide. Ca n'est pas fiable mais ça pourrait permettre de limiter les erreurs
### Backend
- Le code a été mal écrit et mériterait d'être relu
- Les tests manquent
- L'interface de l'API n'est pas clairement définie autrepart que dans le code. Elle est encore très limitée
- Il pourrait y avoir un système de signalement d'erreur
- Le parsing des enchères devrait être rangé dans une classe à part
- Les donnes doivent être jouées jusqu'au dernier Passe du joueur
- On pourrait inclure un ajout de pdf via l'API
### Frontend
- Il y a eu des efforts sur l'affichage, mais on est encore loin d'un plateau de jeu
- l'identité visuelle est relativement absente
- Mon interet pour le front étant très limité, la plupart du code a été généré et mériterait une relecture attentive
### Organisation globale
- Le projet est séparé en trois modules écrits dans des langages différents. Est-ce pertinent ?
- La cible n'est pas bien définie : utilisateur local (moi), .exe via email, appli mobile, serveur web ... ?

Globalement, cela reste un projet perso agréable qui me permet de m'entrainer en programmation et au bridge
