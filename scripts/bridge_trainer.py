import json
import tkinter as tk
from tkinter import simpledialog, messagebox, Button
import random
import os

class BridgeTrainer:
    def __init__(self, master, database):
        self.master = master
        master.title("Entraînement aux Enchères au Bridge")

        self.database = database
        self.donne_index = 0
        self.player_view = "Ouest"  # Valeur par défaut, sera randomisée
        self.encheres_courantes = []
        self.nombre_de_passes_consecutifs = 0
        self.ordre_encheres = ["Nord", "Est", "Sud", "Ouest"]
        self.bidding_sequence_index = 0
        self.enchere_correcte = None
        self.couleurs = {"♣": "black", "♦": "red", "♥": "red", "♠": "black"}
        self.symboles = {"♣": "♣", "♦": "♦", "♥": "♥", "♠": "♠"}

        self.create_widgets()
        self.charger_donne()

    def create_widgets(self):
        """Crée et organise les widgets de l'interface."""

        self.main_frame = tk.Frame(self.master)
        self.main_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        self.donne_label = tk.Label(self.main_frame, text="", font=("Arial", 14, "bold"))
        self.donne_label.pack(pady=(0, 5))

        self.joueur_label = tk.Label(self.main_frame, text=f"Vous êtes : {self.player_view}", font=("Arial", 12))
        self.joueur_label.pack(pady=(0, 5))

        self.cartes_label = tk.Label(self.main_frame, text="Vos cartes :", font=("Arial", 12))
        self.cartes_label.pack()

        self.main_label = tk.Label(self.main_frame, text="", font=("Arial", 12), justify=tk.LEFT)
        self.main_label.pack()

        self.encheres_historique_label = tk.Label(self.main_frame, text="Enchères :", font=("Arial", 12))
        self.encheres_historique_label.pack()

        self.encheres_historique_text = tk.Text(self.main_frame, height=10, width=40, font=("Courier New", 12))
        self.encheres_historique_text.config(state=tk.DISABLED)
        self.encheres_historique_text.pack()

        self.feedback_label = tk.Label(self.main_frame, text="", fg="red", font=("Arial", 12, "italic"))
        self.feedback_label.pack(pady=(5, 0))

        self.button_frame = tk.Frame(self.main_frame)
        self.button_frame.pack(pady=10)

        self.create_bid_buttons(self.button_frame)
        self.create_navigation_buttons(self.button_frame)

    def create_bid_buttons(self, parent_frame):
        """Crée les boutons d'enchère."""

        self.pass_button = tk.Button(parent_frame, text="Passe", command=lambda: self.soumettre_enchere("Passe"), width=6)
        self.pass_button.pack(side=tk.LEFT, padx=2)
        self.enchere_buttons = []
        for niveau in range(1, 8):
            for couleur_abbr in ["♣", "♦", "♥", "♠", "SA"]:
                enchere = f"{niveau}{couleur_abbr}"
                button = tk.Button(parent_frame, text=enchere, command=lambda e=enchere: self.soumettre_enchere(e), width=4)
                self.enchere_buttons.append(button)
                button.pack(side=tk.LEFT, padx=2)

    def create_navigation_buttons(self, parent_frame):
        """Crée les boutons de navigation."""

        self.prev_button = tk.Button(parent_frame, text="Précédent", command=self.charger_donne_precedente, width=8)
        self.next_button = tk.Button(parent_frame, text="Suivant", command=self.charger_donne_suivante, width=8)
        self.prev_button.pack(side=tk.LEFT, padx=5, pady=5)
        self.next_button.pack(side=tk.RIGHT, padx=5, pady=5)

    def charger_donne(self):
        """Charge et affiche une donne aléatoire depuis la base de données."""

        if not self.database:
            self.clear_display()
            self.donne_label.config(text="Base de données vide.", fg="red")
            self.desactiver_encheres()
            return

        donne_keys = list(self.database.keys())
        if not donne_keys:
            self.clear_display()
            self.donne_label.config(text="Aucune donne disponible.", fg="red")
            self.desactiver_encheres()
            return

        random_donne_key = random.choice(donne_keys)
        self.donne_actuelle = random.choice(self.database[random_donne_key])
        self.donne_label.config(text=f"Donne N°: {self.donne_actuelle['Donne N°']}, Donneur: {self.donne_actuelle['Donneur']}", fg="black")

        self.player_view = random.choice(self.ordre_encheres)  # Choisit une vue aléatoire
        self.joueur_label.config(text=f"Vous êtes : {self.player_view}", font=("Arial", 12))

        self.afficher_main()
        self.afficher_encheres_initiales()
        self.determiner_joueur_actuel()

    def afficher_main(self):
        """Affiche la main du joueur avec les symboles de couleur."""

        main_texte = [
            f"{self.symboles.get(couleur[-1], '')} {couleur}"
            for couleur in self.donne_actuelle['Cartes'][self.player_view]
        ]
        self.main_label.config(text="\n".join(main_texte), fg="black")

    def afficher_encheres_initiales(self):
        """Affiche les enchères initiales de la donne."""

        self.clear_bids_display()
        donneur_index = self.ordre_encheres.index(self.donne_actuelle['Donneur'])
        joueur_index = self.ordre_encheres.index(self.player_view)
        nb_encheres_initiales = (joueur_index - donneur_index) % 4

        self.encheres_courantes = []
        self.nombre_de_passes_consecutifs = 0
        self.bidding_sequence_index = 0

        for i in range(nb_encheres_initiales):
            if i < len(self.donne_actuelle.get('Encheres', [])):
                enchere = self.donne_actuelle['Encheres'][i]
                self.encheres_courantes.append(enchere)
                self.add_bid_to_display(enchere)
                self.update_pass_count(enchere)
                self.bidding_sequence_index += 1

    def charger_donne_suivante(self):
        """Charge une nouvelle donne aléatoire."""
        self.charger_donne()

    def charger_donne_precedente(self):
        """Charge une nouvelle donne aléatoire (précédent et suivant font la même chose)."""
        self.charger_donne()

    def afficher_encheres(self):
        """Affiche toutes les enchères courantes."""

        self.clear_bids_display()
        for enchere in self.encheres_courantes:
            self.add_bid_to_display(enchere)

    def add_bid_to_display(self, enchere):
        """Ajoute une enchère à l'affichage."""
        self.encheres_historique_text.config(state=tk.NORMAL)
        self.encheres_historique_text.insert(tk.END, enchere + "\n")
        self.encheres_historique_text.config(state=tk.DISABLED)

    def clear_bids_display(self):
        """Efface l'affichage des enchères."""

        self.encheres_historique_text.config(state=tk.NORMAL)
        self.encheres_historique_text.delete(1.0, tk.END)
        self.encheres_historique_text.config(state=tk.DISABLED)

    def clear_display(self):
        """Efface l'affichage principal."""
        self.clear_bids_display()
        self.main_label.config(text="")
        self.donne_label.config(text="")
        self.feedback_label.config(text="")

    def determiner_joueur_actuel(self):
        """Détermine le joueur actuel et gère l'état de l'interface."""

        donneur_index = self.ordre_encheres.index(self.donne_actuelle['Donneur'])
        joueur_index_relatif = len(self.encheres_courantes) % 4
        self.joueur_actuel = self.ordre_encheres[(donneur_index + joueur_index_relatif) % 4]

        attend_joueur = (
            self.joueur_actuel == self.player_view
            and self.nombre_de_passes_consecutifs < 3
            and self.bidding_sequence_index < len(self.donne_actuelle.get('Encheres', []))
        )

        if attend_joueur:
            self.activer_encheres()
            self.enchere_correcte = self.donne_actuelle['Encheres'][self.bidding_sequence_index]
            self.feedback_label.config(text="À votre tour d'enchérir.", fg="black")
        else:
            self.desactiver_encheres()
            self.handle_bidding_end()
            if self.joueur_actuel != self.player_view and self.bidding_sequence_index < len(self.donne_actuelle.get('Encheres', [])):
                self.master.after(1000, self.simuler_encheres_adversaires)

    def handle_bidding_end(self):
        """Gère la fin des enchères."""
        if self.nombre_de_passes_consecutifs >= 3:
            self.feedback_label.config(text="Fin des enchères.", fg="blue")
        elif self.bidding_sequence_index >= len(self.donne_actuelle.get('Encheres', [])):
            self.feedback_label.config(text="Séquence d'enchères terminée.", fg="blue")

    def soumettre_enchere(self, enchere_joueur):
        """Gère la soumission d'une enchère par le joueur."""

        if (self.joueur_actuel == self.player_view
                and self.nombre_de_passes_consecutifs < 3
                and self.bidding_sequence_index < len(self.donne_actuelle.get('Encheres', []))):

            if not self.est_enchere_valide(enchere_joueur):
                self.feedback_label.config(text="Enchère invalide.", fg="red")
                return

            enchere_attendue = self.donne_actuelle['Encheres'][self.bidding_sequence_index]
            self.encheres_courantes.append(enchere_joueur)
            self.afficher_encheres()

            if enchere_joueur == enchere_attendue:
                self.feedback_label.config(text="Bonne enchère !", fg="green")
                self.update_pass_count(enchere_joueur)
                self.bidding_sequence_index += 1
                self.determiner_joueur_actuel()
            else:
                self.feedback_label.config(text=f"Mauvaise enchère. La bonne réponse était : {enchere_attendue}", fg="red")

    def est_enchere_valide(self, enchere):
        """Vérifie si l'enchère est valide par rapport à l'enchère précédente."""

        if enchere.lower() == "passe":
            return True

        derniere_enchere = self.obtenir_derniere_enchere()
        if not derniere_enchere:
            return True  # Première enchère toujours valide

        try:
            niveau = int(enchere[0])
            couleur = enchere[1:]
            dernier_niveau = int(derniere_enchere[0])
            derniere_couleur = derniere_enchere[1:]

            ordre_couleurs = ["♣", "♦", "♥", "♠", "SA"]
            if niveau > dernier_niveau:
                return True
            elif niveau == dernier_niveau and ordre_couleurs.index(couleur) > ordre_couleurs.index(derniere_couleur):
                return True
            else:
                return False
        except (ValueError, IndexError):
            return False

    def obtenir_derniere_enchere(self):
        """Obtient la dernière enchère valide."""
        for enchere in reversed(self.encheres_courantes):
            if enchere.lower() != "passe":
                return enchere
        return None

    def update_pass_count(self, enchere):
        """Met à jour le compteur de passes consécutifs."""

        if enchere.lower() == "passe":
            self.nombre_de_passes_consecutifs += 1
        else:
            self.nombre_de_passes_consecutifs = 0

    def simuler_encheres_adversaires(self):
        """Simule les enchères des adversaires."""

        while (self.joueur_actuel != self.player_view
               and self.nombre_de_passes_consecutifs < 3
               and self.bidding_sequence_index < len(self.donne_actuelle.get('Encheres', []))):
            enchere_auto = self.donne_actuelle['Encheres'][self.bidding_sequence_index]
            self.encheres_courantes.append(enchere_auto)
            self.afficher_encheres()
            self.update_pass_count(enchere_auto)
            self.bidding_sequence_index += 1
            self.determiner_joueur_actuel()
            self.master.update()
            if self.nombre_de_passes_consecutifs >= 3 or self.bidding_sequence_index >= len(self.donne_actuelle.get('Encheres', [])):
                break
        if (self.joueur_actuel == self.player_view
                and self.nombre_de_passes_consecutifs < 3
                and self.bidding_sequence_index < len(self.donne_actuelle.get('Encheres', []))):
            self.feedback_label.config(text="À votre tour d'enchérir.", fg="black")

    def activer_encheres(self):
        """Active les boutons d'enchère."""

        self.pass_button.config(state=tk.NORMAL)
        for button in self.enchere_buttons:
            button.config(state=tk.NORMAL)

    def desactiver_encheres(self):
        """Désactive les boutons d'enchère."""

        self.pass_button.config(state=tk.DISABLED)
        for button in self.enchere_buttons:
            button.config(state=tk.DISABLED)

def charger_base_de_donnees(filepath):
    """Charge la base de données des donnes depuis un fichier JSON."""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        messagebox.showerror("Erreur", f"Le fichier '{filepath}' n'a pas été trouvé.")
        return {}
    except json.JSONDecodeError:
        messagebox.showerror("Erreur", "Erreur de décodage JSON dans le fichier.")
        return {}

if __name__ == "__main__":
    filepath = "json/deals.json"
    if filepath:
        database = charger_base_de_donnees(filepath)
        if database:
            root = tk.Tk()
            app = BridgeTrainer(root, database)
            root.mainloop()