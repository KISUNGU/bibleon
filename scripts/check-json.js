import fs from 'fs';

const filePath = './data/louis-segond-formatted.json';

try {
  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.error('Le fichier n\'existe pas:', filePath);
    process.exit(1);
  }

  // Lire les 20 premières lignes
  const content = fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .slice(0, 20)
    .join('\n');

  console.log('=== Contenu des 20 premières lignes ===\n');
  console.log(content);
  console.log('\n=====================================');

} catch (error) {
  console.error('Erreur lors de la lecture du fichier:', error);
  process.exit(1);
}