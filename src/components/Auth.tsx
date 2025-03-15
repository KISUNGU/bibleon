import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../services/supabase';

function Auth() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <button
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`
                }
              })}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Continuer avec Google</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <div className="mt-6">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#3B82F6',
                      brandAccent: '#2563EB',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  label: 'block text-sm font-medium text-gray-700',
                  input: 'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  divider: 'my-4',
                  socialButtons: 'space-y-2',
                  socialButtonsBlockButton: 'w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                },
              }}
              view="sign_in"
              showLinks={false}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    button_label: 'Se connecter',
                    social_provider_text: 'Continuer avec {{provider}}',
                    link: {
                      text: "Vous n'avez pas de compte ?",
                      text_sign_up: "S'inscrire",
                    },
                  },
                  sign_up: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    button_label: "S'inscrire",
                    social_provider_text: 'Continuer avec {{provider}}',
                    link: {
                      text: 'Déjà un compte ?',
                      text_sign_in: 'Se connecter',
                    },
                  },
                  providers: {
                    google: 'Google',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;