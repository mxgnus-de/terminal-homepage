export interface UserPreferences {
   users: {
      [username: string]: string;
   };
   currentUser: string | null;
}

export interface Preferences {
   user: UserPreferences;
}

export interface PreferencesStore extends Preferences {
   set: (state: PreferencesStore) => void;
   get: () => PreferencesStore;
   loadPreferences: () => void;
   savePreferences: () => void;
   addUser: (user: string) => null | string | React.ReactNode;
   removeUser: (user: string) => null | string | React.ReactNode;
   switchUser: (user: string | null) => null | string | React.ReactNode;
}
