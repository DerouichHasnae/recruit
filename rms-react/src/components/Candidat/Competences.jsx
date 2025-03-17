import React, { useState, useEffect } from 'react';
import "./competence.scss";

const Competences = () => {
  const [skills, setSkills] = useState([]); // Stocker les compétences sous forme de tableau
  const [newSkill, setNewSkill] = useState(''); // État pour stocker la nouvelle compétence
  const [userId, setUserId] = useState(null); // État pour stocker l'ID de l'utilisateur

  // Récupérer l'ID utilisateur à partir du localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserId(userId);
    } else {
      console.error('User ID not found in localStorage');
    }
  }, []);

  // Récupérer les compétences existantes depuis le backend
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5001/candidat/skills?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          // Vérifier que data.skills est bien une chaîne avant de la transformer en tableau
          const skillsArray = typeof data.skills === 'string' ? data.skills.split(',') : [];
          setSkills(skillsArray);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des compétences:', error);
          setSkills([]); // Toujours stocker un tableau
        });
    }
  }, [userId]);

  // Ajouter une compétence
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      if (skills.includes(newSkill)) {
        alert('Cette compétence existe déjà');
        return;
      }

      const updatedSkills = [...skills, newSkill];

      fetch('http://localhost:5001/candidat/add-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, skill: updatedSkills.join(',') }), // Envoyer sous forme de chaîne
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || "Erreur inconnue");
            });
          }
          return response.json();
        })
        .then(data => {
          if (data && data.candidat && data.candidat.skills) {
            setSkills(data.candidat.skills.split(',')); // Transformer en tableau
          } else {
            console.error("Réponse inattendue du serveur:", data);
            setSkills([]); // Éviter d'avoir `undefined`
          }
          setNewSkill('');
        })
        .catch(error => {
          console.error('Erreur:', error);
          alert('Erreur lors de l\'ajout de la compétence: ' + error.message);
        });
    }
  };

  // Supprimer une compétence
  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToDelete);

    fetch('http://localhost:5001/candidat/suprime-skills', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, skills: updatedSkills.join(',') }), // Envoyer sous forme de chaîne
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la compétence');
        }
        return response.json();
      })
      .then((data) => {
        setSkills(updatedSkills); // Mettre à jour les compétences
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de la compétence:', error);
        alert('Erreur lors de la suppression de la compétence. Veuillez réessayer.');
      });
  };

  // Modifier une compétence
  const handleEditSkill = (oldSkill) => {
    if (!newSkill.trim()) return;

    const updatedSkills = skills.map((skill) => (skill === oldSkill ? newSkill : skill));

    fetch('http://localhost:5001/candidat/update-skills', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, skills: updatedSkills.join(',') }), // Envoyer sous forme de chaîne
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la modification de la compétence');
        }
        return response.json();
      })
      .then((data) => {
        setSkills(updatedSkills); // Mettre à jour les compétences
        setNewSkill(''); // Réinitialiser le champ de saisie
      })
      .catch((error) => {
        console.error('Erreur lors de la modification de la compétence:', error);
        alert('Erreur lors de la modification de la compétence. Veuillez réessayer.');
      });
  };

  return (
    <div className="competences-container">
  <h2>Mes Compétences</h2>
  <div className="input-container">
    <input
      type="text"
      value={newSkill}
      onChange={(e) => setNewSkill(e.target.value)}
      placeholder="Ajouter ou modifier une compétence"
    />
    <button className="add-button" onClick={handleAddSkill}>
      Ajouter
    </button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Compétences</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {skills.map((skill, index) => (
        <tr key={index}>
          <td>{skill}</td>
          <td className="actions">
            <button className="edit-button" onClick={() => handleEditSkill(skill)}>
              Modifier
            </button>
            <button className="delete-button" onClick={() => handleDeleteSkill(skill)}>
              Supprimer
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default Competences;