class Livre {
    constructor(nom, auteur, annee, isbn) {
        this.nom = nom;
        this.auteur = auteur;
        this.annee = annee;
        if (isbn) {
            (isbn.toString().length === 10 ||
            isbn.toString().length === 13) &&
            typeof isbn === 'number' ?
            this.isbn = isbn :
            console.warn('L\'ISBN est incorrect il doit être composé de 10 ou 13 chiffres et ne dois pas être mis entre guillemets');
        } else {
            console.warn('L\'ISBN est maquant veuillez l\'indiquer')
        }
        this.emprunte = false;
    }
    afficherDetails() {
        console.log(`Titre: ${this.nom}, Auteur: ${this.auteur}, Année de parution: ${this.annee}, ISBN: ${this.isbn}`);
    }
}

class Categorie {
    constructor(nom) {
        this.nom = nom;
        this.livres = [];
    }
    afficherLivre(nom) {
        const index = this.livres.findIndex((livre) => livre.nom === nom);
        if (index !== -1) {
            this.livres[index].afficherDetails();
        }
    }
    afficherLivres() {
        this.livres.forEach((livre) => livre.afficherDetails());
    }
    ajouterLivre(livre) {
        this.livres.push(livre);
    }
    supprimerLivre(nom) {
        const index = this.livres.findIndex((livre) => livre.nom === nom);
        if (index !== -1) {
            this.livres.splice(index, 1);
        }
    }
    direNombreLivres() {
        return this.livres.length;
    }
    chercherLivreParAuteur(auteur) {
        this.livres.forEach((livre) => {
            if (livre.auteur === auteur) {
                livre.afficherDetails();
            }
        })
    }
    chercherLivreParISBN(isbn) {
        const livre = this.livres.find((livre) => livre.isbn === isbn);
        if (livre) {
            livre.afficherDetails();
        }
        else {
            console.warn(`Aucun Livre avec L'ISBN ${isbn}`);
        }
    }
    emprunterLivre(nom) {
        const livre = this.livres.find((livre) => livre.nom === nom);
        if (livre) {
            livre.emprunte = true;
        }
    }
}

class Bibliotheque {
    constructor() {
        this.categories = [];
    }
    ajouterCategorie(categorie) {
        this.categories.push(categorie);
    }
    chercherLivreParTitre(nom) {
        this.categories.forEach((categorie) => {
            categorie.afficherLivre(nom);
        })
    }
    afficherNombreLivres() {
        let compteur = 0;
        this.categories.forEach((categorie) => {
            const nombreLivres = categorie.direNombreLivres();
            compteur += nombreLivres;
        })
        console.log(`Nombre livres: ${compteur}`);
    }
    afficherCategories() {
        this.categories.forEach((categorie) => console.log(categorie.nom));
    }
    afficherCategorie(nom) {
        const index = this.categories.findIndex((categorie) => categorie.nom === nom);
        if (index !== -1) {
            const categorie = this.categories[index];
            console.log(`Nom: ${nom}`);
            categorie.livres.forEach((livre) => livre.afficherDetails());
        }
    }
    chercherLivreParAuteur(auteur) {
        this.categories.forEach((categorie) => {
            categorie.chercherLivreParAuteur(auteur);
        })
    }
    chercherLivreParISBN(nomCategorie, isbn) {
        const categorie = this.categories.find((categorie) => categorie.nom === nomCategorie);
        if (categorie) {
            categorie.chercherLivreParISBN(isbn);
        }
    }
}

class Utilisateur {
    constructor(nom,  bibliotheque, role = "Membre") {
        this.nom = nom;
        this.role = role;
        this.livresEmpruntes = [];
        this.bibliotheque = bibliotheque;
        this.limites = {
            "Membre": 3,
            "Employé": 5,
            "Responsable": 10,
        }
        this.montantEmprunt = {
            "Membre": 10,
            "Employé": 6,
            "Responsable": 2,
        }
        this.solde = 5;
    }
    emprunterLivre(nomCategorie, nomLivre) {
        const categorie = this.bibliotheque.categories.find((categorie) => categorie.nom === nomCategorie);
        if (categorie) {
            const livre = categorie.livres.find((livre) => livre.nom === nomLivre);
            if (livre) {
                if (!livre.emprunte) {
                    if (this.livresEmpruntes.length < this.limites[this.role]) {
                        if (this.solde > this.montantEmprunt[this.role]) {
                            this.livresEmpruntes.push(livre);
                            this.solde -= this.montantEmprunt[this.role];
                            console.log(`Livre ${nomLivre} de la catégorie ${nomCategorie} est loué par ${this.nom} pour ${this.montantEmprunt[this.role]}€`);
                        } else {
                            console.log(`Vous n'avez pas assez d'argent sur votre vous avez ${this.solde}€ et il vous faut ${this.montantEmprunt[this.role]}€`)
                        }
                    } else {
                        console.log(`Vous avez emprunté le maximum de livres possible avec votre rôle (${this.role})`);
                    }
                } else {
                    console.log(`Le livre ${nomLivre} de la catégorie ${nomCategorie} est déjà emprunté`)
                }
            } else {
                console.log(`Aucun livre dans la catégorie ${nomCategorie} avec le nom: ${nomLivre}`);
            }
        } else {
            console.log(`Aucune catégorie avec le nom: ${nomCategorie} dans la bibliothèque ${this.bibliotheque}`);
        }
    }
    afficherLivresEmpruntes() {
        this.livresEmpruntes.forEach((livre) => livre.afficherDetails());
    }
    rendreLivre(nomCategorie, nomLivre) {
        const categorie = this.bibliotheque.categories.find((categorie) => categorie.nom === nomCategorie);
        if (categorie) {
            const livre = categorie.livres.find((livre) => livre.nom === nomLivre);
            if (livre) {
                const livreEmprunte = this.livresEmpruntes.findIndex((livre) => livre.nom === nomLivre)
                if (livreEmprunte !== -1) {
                    livreEmprunte.emprunte = false;
                    this.livresEmpruntes.splice(livreEmprunte, 1)
                    console.log(`Le livre ${nomLivre} à été rendu`);
                    this.solde += this.montantEmprunt[this.role] / 2;
                } else {
                    console.log(`Vous n'avez pas emprunté le livre avec le nom ${nomLivre} de la catégorie ${nomCategorie}`)
                }
            } else {
                console.log(`Aucun livre avec le nom ${nomLivre} de la catégorie ${nomCategorie}`)
            }
        } else {
            console.log(`Aucune catégorie avec le nom ${nomCategorie}`);
        }
    }
    ajouterFonds(montant) {
        this.solde += montant;
        console.log(`${montant}€ on été ajoutés au solde de ${this.nom}. Noveau solde: ${this.solde}`);
    }
    afficherSolde() {
        console.log(`${this.nom} à un solde de ${this.solde}€`);
    }
}

