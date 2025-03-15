import fs from 'fs';
import fetch from 'node-fetch';

const XML_URL = 'https://raw.githubusercontent.com/bible-hub/bible/refs/heads/master/fr/fren.xml';
const OUTPUT_FILE = './data/bible.xml';
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadWithRetry(url, retryCount = 0) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BibleImporter/1.0;)',
        'Accept': 'application/xml'
      },
      timeout: 30000 // 30 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received');
    }

    return text;
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      throw new Error(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
    }

    const delayTime = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
    console.log(`Tentative ${retryCount + 1} échouée. Nouvelle tentative dans ${delayTime/1000} secondes...`);
    await delay(delayTime);
    
    return downloadWithRetry(url, retryCount + 1);
  }
}

async function main() {
  console.log('Début du téléchargement du fichier XML...');

  try {
    // Ensure data directory exists
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
    }

    // Download the file
    const content = await downloadWithRetry(XML_URL);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
    
    console.log('Téléchargement terminé avec succès !');
    console.log(`Fichier sauvegardé: ${OUTPUT_FILE}`);
    console.log(`Taille: ${(content.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});