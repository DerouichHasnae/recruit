import argparse
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import json
from pathlib import Path
import sys
from datetime import datetime
import io


# Configuration de l'encodage pour stdout/stderr
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configuration des chemins
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / 'data'
MODELS_DIR = BASE_DIR / 'models'

# Créer les répertoires s'ils n'existent pas
DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

def safe_isoformat(value):
    """Convertit une valeur en format ISO de manière sécurisée."""
    if pd.isna(value):
        return None
    if isinstance(value, (pd.Timestamp, datetime)):
        return value.isoformat()
    if isinstance(value, str):
        try:
            return pd.to_datetime(value).isoformat()
        except:
            return value
    return str(value)

def load_data():
    """Charge les données avec gestion robuste des erreurs et parsing des dates."""
    try:
        encoding = 'utf-8-sig'
        
        # Chargement des offres
        offres = pd.read_csv(
            DATA_DIR / 'offres.csv',
            encoding=encoding,
            on_bad_lines='warn'
        )
        
        # Standardisation du nom de colonne
        if 'recruiter_id' in offres.columns:
            offres = offres.rename(columns={'recruiter_id': 'recruteur_id'})
        
        # Conversion des dates pour les offres
        date_cols_offres = {
            'publication_date': '%Y-%m-%d',
            'expiration_date': '%Y-%m-%d',
            'created_at': '%Y-%m-%d %H:%M:%S',
            'updated_at': '%Y-%m-%d %H:%M:%S'
        }
        
        for col, fmt in date_cols_offres.items():
            if col in offres.columns:
                offres[col] = pd.to_datetime(offres[col], format=fmt, errors='coerce')
        
        # Chargement des candidats
        candidats = pd.read_csv(
            DATA_DIR / 'candidats.csv',
            encoding=encoding,
            on_bad_lines='warn'
        )
        
        # Conversion des dates pour les candidats
        date_cols_candidats = {
            'createdAt': '%Y-%m-%d %H:%M:%S',
            'updatedAt': '%Y-%m-%d %H:%M:%S',
            'lastLogin': '%Y-%m-%d %H:%M:%S'
        }
        
        for col, fmt in date_cols_candidats.items():
            if col in candidats.columns:
                candidats[col] = pd.to_datetime(candidats[col], format=fmt, errors='coerce')
        
        # Vérification des colonnes requises
        required_offre_cols = {'id', 'title', 'description', 'recruteur_id'}
        required_candidat_cols = {'id', 'skills', 'fullName'}
        
        missing_offre = required_offre_cols - set(offres.columns)
        missing_candidat = required_candidat_cols - set(candidats.columns)
        
        if missing_offre:
            raise ValueError(f"Colonnes manquantes dans offres.csv: {missing_offre}")
        if missing_candidat:
            raise ValueError(f"Colonnes manquantes dans candidats.csv: {missing_candidat}")
            
        return offres, candidats
        
    except Exception as e:
        raise Exception(f"Erreur de chargement des données: {str(e)}")

def train_model():
    """Entraîne et sauvegarde le modèle TF-IDF."""
    print("Chargement des données...")
    offres, candidats = load_data()

    # Prétraitement
    print(" Prétraitement des données...")
    offres['text'] = offres['description'].fillna('') + " " + offres['title'].fillna('')
    candidats['text'] = candidats['skills'].fillna('')

    # Combiner les données
    all_text = pd.concat([offres['text'], candidats['text']])

    # Créer et entraîner le vectorizer TF-IDF
    print(" Entraînement du modèle TF-IDF...")
    vectorizer = TfidfVectorizer(
        stop_words=None,
        max_features=5000,
        min_df=2,
        max_df=0.95
    )
    vectorizer.fit(all_text)

  
    model_path = MODELS_DIR / 'tfidf_vectorizer.joblib'
    joblib.dump(vectorizer, model_path)
    print(f" Modèle entraîné et sauvegardé dans '{model_path}'")

def generate_offre_recommendations(candidat_id):
    """Génère des recommandations d'offres pour un candidat donné."""
    print(f" Génération des recommandations pour le candidat {candidat_id}...")
    offres, candidats = load_data()
    

    candidat = candidats[candidats['id'] == candidat_id]
    if candidat.empty:
        raise ValueError(f"Candidat avec ID {candidat_id} non trouvé")
    candidat = candidat.iloc[0]

  
    model_path = MODELS_DIR / 'tfidf_vectorizer.joblib'
    if not model_path.exists():
        train_model()
    vectorizer = joblib.load(model_path)

    offres_text = offres['description'].fillna('') + " " + offres['title'].fillna('')
    offres_vectors = vectorizer.transform(offres_text)
    candidat_vector = vectorizer.transform([candidat['skills']])

    cosine_similarities = cosine_similarity(candidat_vector, offres_vectors).flatten()

  
    recommendations = []
    for idx in cosine_similarities.argsort()[::-1]:
        if cosine_similarities[idx] > 0:
            offre = offres.iloc[idx]
            matching_skills = [
                skill.strip() 
                for skill in candidat['skills'].split(',') 
                if skill.strip().lower() in offre['description'].lower()
            ]
            
            if matching_skills:
                
                offre_data = {
                    'offre_id': int(offre['id']),
                    'title': offre['title'],
                    'description': offre['description'],
                    'match_score': round(float(cosine_similarities[idx]), 2),
                    'matching_skills': matching_skills
                }
                
                # Ajouter les champs optionnels avec gestion sécurisée des dates
                optional_fields = [
                    'company', 'location', 'salary', 'contract_type',
                    'publication_date', 'expiration_date', 'created_at',
                    'updated_at', 'recruteur_id', 'status'
                ]
                
                for field in optional_fields:
                    if field in offre:
                        offre_data[field] = safe_isoformat(offre[field])
                
                recommendations.append(offre_data)

    return {
        'recommendations': recommendations[:10],
        'candidat_info': {
            'id': int(candidat['id']),
            'fullName': candidat['fullName'],
            'skills': candidat['skills']
        }
    }

def generate_recruiter_recommendations(recruiter_id):
    """Génère des recommandations de candidats pour toutes les offres d'un recruteur."""
    print(f" Génération des recommandations pour le recruteur {recruiter_id}...")
    offres, candidats = load_data()
    
   
    offres_recruteur = offres[offres['recruteur_id'] == recruiter_id]
    if offres_recruteur.empty:
        return {"recommendations": [], "stats": {"offres_count": 0}}
    

    all_offres_text = " ".join(
        offres_recruteur['description'].fillna('') + " " + 
        offres_recruteur['title'].fillna('')
    )
    
  
    model_path = MODELS_DIR / 'tfidf_vectorizer.joblib'
    if not model_path.exists():
        train_model()
    vectorizer = joblib.load(model_path)
    
 
    candidats_vectors = vectorizer.transform(candidats['skills'].fillna(''))
    offres_vector = vectorizer.transform([all_offres_text])
    
    cosine_similarities = cosine_similarity(offres_vector, candidats_vectors).flatten()
    
   
    recommendations = []
    for idx in cosine_similarities.argsort()[::-1]:
        if cosine_similarities[idx] > 0:
            cand = candidats.iloc[idx]
            
            matching_skills = [
                skill.strip() 
                for skill in cand['skills'].split(',')
                if any(skill.strip().lower() in o.lower() 
                     for o in offres_recruteur['description'])
            ]
            
            if matching_skills:
                # Offres correspondantes
                matching_offres = []
                for o in offres_recruteur.itertuples():
                    matching_skills_count = sum(
                        1 for skill in cand['skills'].split(',')
                        if skill.strip().lower() in o.description.lower()
                    )
                    if matching_skills_count > 0:
                        total_skills = len(cand['skills'].split(','))
                        match_score = round(matching_skills_count / total_skills, 2)
                        
                        matching_offres.append({
                            'offre_id': int(o.id),
                            'title': o.title,
                            'match_score': match_score,
                            'matching_skills_count': matching_skills_count
                        })
                
                # Trier et garder les 3 meilleures offres
                matching_offres = sorted(
                    matching_offres,
                    key=lambda x: (-x['match_score'], -x['matching_skills_count'])
                )[:3]
                
                # Dernière activité
                dt_values = []
                for col in ['updatedAt', 'lastLogin']:
                    if col in cand and pd.notna(cand[col]):
                        dt_values.append(pd.to_datetime(cand[col], errors='coerce'))
                
                last_activity = max(dt_values) if dt_values else None
                
                # Construction de l'objet candidat
                candidate_data = {
                    'candidat_id': int(cand['id']),
                    'fullName': str(cand.get('fullName', '')),
                    'match_score': round(float(cosine_similarities[idx]), 2),
                    'matching_skills': matching_skills,
                    'matching_skills_count': len(matching_skills),
                    'matching_offres': matching_offres,
                    'lastActivity': safe_isoformat(last_activity)
                }
                
                # Ajouter tous les champs optionnels du candidat
                optional_fields = [
                    'profileImage', 'age', 'gender', 'email', 'phoneNumber',
                    'address', 'location', 'education', 'experience_years',
                    'current_position', 'disponibility', 'status',
                    'notice_period', 'createdAt', 'updatedAt'
                ]
                
                for field in optional_fields:
                    if field in cand:
                        candidate_data[field] = safe_isoformat(cand[field])
                
                recommendations.append(candidate_data)
    
    return {
        'recommendations': sorted(
            recommendations[:50],
            key=lambda x: (-x['match_score'], -x['matching_skills_count'])
        ),
        'stats': {
            'total_offres': len(offres_recruteur),
            'candidates_evaluated': len(candidats),
            'matching_candidates': len(recommendations),
            'average_match_score': round(
                sum(r['match_score'] for r in recommendations) / len(recommendations), 2
            ) if recommendations else 0,
            'execution_time': datetime.now().isoformat()
        }
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Système de recommandation")
    parser.add_argument('--train', action='store_true', help="Entraîner le modèle TF-IDF")
    parser.add_argument('--candidat', type=int, help="ID du candidat pour les recommandations d'offres")
    parser.add_argument('--recruteur', type=int, help="ID du recruteur pour les recommandations globales")
    
    args = parser.parse_args()

    try:
      
        sys.stderr = sys.stdout
        
        if args.train:
            train_model()
        elif args.candidat is not None:
            result = generate_offre_recommendations(args.candidat)
            print(json.dumps(result, ensure_ascii=False))
        elif args.recruteur is not None:
            result = generate_recruiter_recommendations(args.recruteur)
            print(json.dumps(result, ensure_ascii=False))
        else:
            parser.print_help()
            sys.exit(0)
            
    except Exception as e:
        error_msg = json.dumps({
            "error": str(e),
            "success": False
        })
        print(error_msg, file=sys.stderr)
        sys.exit(1)