import { jsPDF } from 'jspdf';
import { Verse } from '../types';

interface DownloadProps {
  verses: Verse[];
  currentBook: string;
  currentChapter: number;
}

function Download({ verses, currentBook, currentChapter }: DownloadProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`${currentBook} ${currentChapter}`, 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    verses.forEach((verse) => {
      const text = `${verse.verse}. ${verse.text}`;
      const lines = doc.splitTextToSize(text, 170);
      
      if (y + 10 * lines.length > 280) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(lines, 20, y);
      y += 10 * lines.length + 5;
    });
    
    doc.save(`${currentBook}_${currentChapter}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Télécharger</h2>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Télécharger en PDF
      </button>
    </div>
  );
}

export default Download;