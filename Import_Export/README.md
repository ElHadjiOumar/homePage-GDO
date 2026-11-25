# Import / Export

- [Export](./export/index.html) : interface autonome conforme à la maquette, avec HTML, CSS et JavaScript séparés. Ouvrir `export/index.html` dans un navigateur, sans installation.
- [Import](./import/index.html) : interface autonome reprenant la maquette Collibra Bulk Manager, avec HTML, CSS et JavaScript séparés. Ouvrir `import/index.html` dans un navigateur.

La page export propose quatre contenus, des champs dynamiques, la conservation des sélections par contenu et une réinitialisation vers la sélection initiale de la maquette. Elle s'adapte aux écrans mobiles et utilise des contrôles natifs accessibles au clavier.

Le bouton **Generate export** télécharge uniquement la configuration choisie au format JSON. Aucune source métier ni API n'est encore connectée. Le raccordement se fera dans le gestionnaire `submit` de `export/script.js`.

Les champs du Business Data Dictionary reprennent la maquette. Ceux des trois autres contenus sont des propositions à adapter au schéma réel dans `contentTypes`.

## Import

Sélection du contenu et du domaine, ajout d'un fichier CSV ou XLSX par sélection ou glisser-déposer, suppression du fichier et contrôle de son extension et de sa taille non nulle. Le nom, la taille et le format affichés correspondent au fichier choisi. Aucun fichier de démonstration n'est présélectionné ; les nombres de lignes et de colonnes de la maquette ne sont pas simulés. Le contenu des fichiers n'est pas encore analysé.

Les deux domaines de la maquette sont des options locales ; leurs identifiants devront être remplacés par les UUID Collibra réels. **Import and update** affiche explicitement que l'intégration n'est pas connectée et n'envoie aucune donnée. Le point de raccordement au backend se trouve dans le gestionnaire `submit` de `import/script.js`.
