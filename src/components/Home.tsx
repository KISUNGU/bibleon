import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaUser } from 'react-icons/fa';
import { getRandomVerse, supabase } from '../services/supabase';
import { Verse } from '../types';

function Home() {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const { data: dailyVerse, isLoading } = useQuery<Verse>(
    'dailyVerse',
    getRandomVerse,
    {
      staleTime: 24 * 60 * 60 * 1000, // 24 heures
      cacheTime: 24 * 60 * 60 * 1000,
    }
  );

  useEffect(() => {
    // Vérifier l'état de l'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleShare = async () => {
    if (!dailyVerse) return;
    
    const shareText = `${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse} - ${dailyVerse.text}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Verset du jour',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Découvrez cette superbe application biblique !");
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };

  const getUserInitial = () => {
    if (!user?.user_metadata?.name) return '';
    return user.user_metadata.name.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Section 1: Salutation et nom */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bonjour{' '}
            {user ? (
              <span className="text-blue-600">{user.user_metadata?.name}</span>
            ) : (
              <span className="text-gray-600 text-base font-normal">
                veuillez vous connecter pour garder vos recherches
              </span>
            )}
          </h1>
          {user && <p className="text-gray-600 mt-1">Bienvenue dans votre Bible</p>}
        </div>
        <button
          onClick={() => user ? null : navigate('/auth')}
          className="flex items-center"
        >
          {user ? (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
              {getUserInitial()}
            </div>
          ) : (
            <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaUser className="mr-2" size={16} />
              <span>Connexion</span>
            </div>
          )}
        </button>
      </div>

      {/* Section 2: Verset du jour */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaBell className="text-yellow-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Verset du jour</h2>
          </div>
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full"
              title={navigator.share ? "Partager" : "Copier"}
            >
              <FaShare className="text-gray-600" size={18} />
            </button>
            {showCopiedMessage && (
              <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                Copié !
              </div>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : dailyVerse ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-lg text-gray-700 mb-2">{dailyVerse.text}</p>
            <p className="text-blue-600 font-medium">
              {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </p>
          </div>
        ) : null}
      </div>

      {/* Section 3: Réseaux sociaux */}
      <div className="text-center">
        <h3 className="text-gray-600 mb-4">Partagez l'application</h3>
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleSocialShare('facebook')}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <FaFacebook size={24} />
          </button>
          <button
            onClick={() => handleSocialShare('twitter')}
            className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <FaWhatsapp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;