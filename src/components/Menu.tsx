import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaBook, 
  FaHighlighter, 
  FaStickyNote, 
  FaDownload, 
  FaQuestionCircle,
  FaFacebook, 
  FaStar, 
  FaShare, 
  FaEnvelope, 
  FaHeart,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch
} from 'react-icons/fa';
import { supabase } from '../services/supabase';

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier l'état de l'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bible App',
          text: 'Découvrez cette superbe application biblique !',
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Lien copié !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const openFacebook = () => {
    window.open('https://facebook.com/bibleapp', '_blank');
  };

  const openPlayStore = () => {
    window.open('https://play.google.com/store/apps/details?id=com.bibleapp', '_blank');
  };

  const contactDeveloper = () => {
    window.location.href = 'mailto:contact@bibleapp.com';
  };

  const supportDeveloper = () => {
    window.open('https://www.paypal.com/donate?hosted_button_id=XXXXX', '_blank');
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      
      <div className="space-y-2">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">OUTILS</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/lexicon')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaBook className="text-blue-600 text-xl mr-3" />
              <span>Lexique</span>
            </button>

            <button
              onClick={() => navigate('/dictionary')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaSearch className="text-blue-600 text-xl mr-3" />
              <span>Dictionnaire</span>
            </button>

            <button
              onClick={() => navigate('/highlight')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaHighlighter className="text-blue-600 text-xl mr-3" />
              <span>Surbrillance</span>
            </button>

            <button
              onClick={() => navigate('/notes')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaStickyNote className="text-blue-600 text-xl mr-3" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => navigate('/downloads')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaDownload className="text-blue-600 text-xl mr-3" />
              <span>Gestion des téléchargements</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">AIDE & SUPPORT</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/faq')}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaQuestionCircle className="text-blue-600 text-xl mr-3" />
              <span>Foire aux questions</span>
            </button>

            <button
              onClick={openFacebook}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaFacebook className="text-blue-600 text-xl mr-3" />
              <span>Nous suivre sur Facebook</span>
            </button>

            <button
              onClick={openPlayStore}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaStar className="text-blue-600 text-xl mr-3" />
              <span>Noter l'application</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaShare className="text-blue-600 text-xl mr-3" />
              <span>Partager l'application</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">CONTACT & SOUTIEN</h3>
          <div className="space-y-2">
            <button
              onClick={contactDeveloper}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaEnvelope className="text-blue-600 text-xl mr-3" />
              <span>Contacter le développeur</span>
            </button>

            <button
              onClick={supportDeveloper}
              className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FaHeart className="text-blue-600 text-xl mr-3" />
              <span>Soutenir le développeur</span>
            </button>
          </div>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt className="text-xl mr-3" />
            <span>Se déconnecter</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="w-full flex items-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaSignInAlt className="text-xl mr-3" />
            <span>Se connecter</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Menu;