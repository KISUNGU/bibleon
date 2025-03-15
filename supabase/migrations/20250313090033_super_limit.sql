/*
  # Set up authentication schema

  1. Security
    - Enable email/password authentication
    - Enable Google OAuth
    - Add user metadata for name and avatar
*/

-- Activer l'authentification par email
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);