import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaStickyNote, FaBars } from 'react-icons/fa';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around py-2">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center relative"
          >
            <FaHome 
              className={`text-2xl transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
            <span className="text-xs mt-1">Accueil</span>
            {isActive('/') && (
              <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigate('/book')}
            className="flex flex-col items-center relative"
          >
            <FaBook 
              className={`text-2xl transition-colors ${
                isActive('/book') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
            <span className="text-xs mt-1">Bible</span>
            {isActive('/book') && (
              <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigate('/search')}
            className="flex flex-col items-center relative"
          >
            <FaSearch 
              className={`text-2xl transition-colors ${
                isActive('/search') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
            <span className="text-xs mt-1">Recherche</span>
            {isActive('/search') && (
              <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigate('/notes')}
            className="flex flex-col items-center relative"
          >
            <FaStickyNote 
              className={`text-2xl transition-colors ${
                isActive('/notes') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
            <span className="text-xs mt-1">Notes</span>
            {isActive('/notes') && (
              <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="flex flex-col items-center relative"
          >
            <FaBars 
              className={`text-2xl transition-colors ${
                isActive('/menu') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
            <span className="text-xs mt-1">Menu</span>
            {isActive('/menu') && (
              <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;