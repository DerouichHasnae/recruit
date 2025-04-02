import argparse
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os
import json
from pathlib import Path

# Configuration des chemins
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / 'data'
MODELS_DIR = BASE_DIR / 'models'

# Créer les répertoires s'ils n'existent pas
DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

def load_data():
    """Charge les données des fichiers CSV avec gestion des erreurs."""
    try:
        offres = pd.read_csv(DATA_DIR / 'offres.csv')
        candidats = pd.read_csv(DATA_DIR / 'candidats.csv')
        
        # Vérification des colonnes requises
        required_offre_cols = {'id', 'description', 'title'}
        required_candidat_cols = {'id', 'skills'}
        
        if not required_offre_cols.issubset(offres.columns):
            raise ValueError(f"Les colonnes requises pour les offres sont: {required_offre_cols}")
            
        if not required_candidat_cols.issubset(candidats.columns):
            raise ValueError(f"Les colonnes requises pour les candidats sont: {required_candidat_cols}")
            
        return offres, candidats
        
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Fichier de données manquant: {e}. Assurez-vous que les fichiers existent dans {DATA_DIR}")

def train_model():
    """Entraîne le modèle TF-IDF et le sauvegarde."""
    offres, candidats = load_data()

    # Prétraitement des données
    offres['skills'] = offres['description'].fillna('')
    candidats['skills'] = candidats['skills'].fillna('')

    # Combiner les données
    all_skills = pd.concat([offres['skills'], candidats['skills']])

    # Créer et entraîner le vectorizer TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    vectorizer.fit(all_skills)

    # Sauvegarder le modèle
    model_path = MODELS_DIR / 'tfidf_vectorizer.joblib'
    joblib.dump(vectorizer, model_path)

    print(f"✅ Modèle TF-IDF entraîné et sauvegardé dans '{model_path}'")

def generate_recommendations(candidat_id):
    """Génère des recommandations pour un candidat donné."""
    offres, candidats = load_data()
    
    # Vérifier que le candidat existe
    if candidat_id not in candidats['id'].values:
        raise ValueError(f"Candidat avec ID {candidat_id} non trouvé")

    # Charger le modèle TF-IDF
    model_path = MODELS_DIR / 'tfidf_vectorizer.joblib'
    if not model_path.exists():
        raise FileNotFoundError("Modèle non trouvé. Veuillez d'abord entraîner le modèle avec --train")
    
    vectorizer = joblib.load(model_path)

    # Prétraitement
    offres['skills'] = offres['description'].fillna('')
    candidats['skills'] = candidats['skills'].fillna('')

    # Vectorisation
    offres_vectors = vectorizer.transform(offres['skills'])
    candidat_skills = candidats.loc[candidats['id'] == candidat_id, 'skills'].iloc[0]
    candidat_vector = vectorizer.transform([candidat_skills])

    # Calcul de similarité
    cosine_similarities = cosine_similarity(candidat_vector, offres_vectors).flatten()

    # Création des recommandations
    recommendations = []
    for idx in cosine_similarities.argsort()[::-1]:
        if cosine_similarities[idx] > 0:  # Ne garder que les similarités positives
            offre = offres.iloc[idx]
            recommendations.append({
                'offre_id': int(offre['id']),  # Convertir 'id' en int
                'title': offre['title'],
                'match_score': float(cosine_similarities[idx]),  # Convertir en float pour la sérialisation
                'matching_skills': [skill.strip() for skill in candidat_skills.split(',') if skill.strip()]
            })

    # Sérialiser les recommandations en JSON
    return json.dumps({'recommendations': recommendations[:10]})  # Retourner les 10 meilleures recommandations en JSON

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Recommandation d'offres pour un candidat")
    parser.add_argument('--train', action='store_true', help="Entraîner le modèle TF-IDF")
    parser.add_argument('--candidatId', type=int, help="ID du candidat pour les recommandations")
    
    args = parser.parse_args()

    try:
        if args.train:
            train_model()
        elif args.candidatId is not None:
            recommendations = generate_recommendations(args.candidatId)
            print(recommendations)  # Un seul print JSON
        else:
            parser.print_help()
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")