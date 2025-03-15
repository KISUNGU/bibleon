function About() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">À propos</h2>
      <div className="prose">
        <p className="mb-4">
          Cette application Bible vous permet de lire la Bible, de prendre des notes
          et de télécharger des chapitres en PDF.
        </p>
        <h3 className="text-lg font-semibold mb-2">Fonctionnalités</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>Navigation par livre, chapitre et verset</li>
          <li>Prise de notes personnelles</li>
          <li>Téléchargement de chapitres en PDF</li>
          <li>Interface intuitive et moderne</li>
        </ul>
        <p className="text-sm text-gray-600">
          Version 1.0.0 - © 2024 Tous droits réservés
        </p>
      </div>
    </div>
  );
}

export default About;