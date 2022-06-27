import create from 'zustand';
import { DEFAULT_USER, HOST } from '../config/terminal';
import { Preferences, PreferencesStore } from '../types/Preferences';

export const usePreferences = create<PreferencesStore>((set, get) => {
   return {
      get: () => get(),
      set: (state: PreferencesStore) => set(state),
      loadPreferences: () => {
         const preferences = localStorage.getItem('preferences');

         if (!preferences) return;
         const parsedPreferences: Preferences = JSON.parse(preferences);

         set({
            ...get(),
            user: {
               ...parsedPreferences.user,
               currentUser: null,
               users: {
                  ...get().user.users,
                  ...parsedPreferences.user.users,
               },
            },
         });
      },
      savePreferences: () => {
         localStorage.setItem('preferences', JSON.stringify(get()));
      },
      user: {
         currentUser: null,
         users: {
            [DEFAULT_USER]: DEFAULT_USER,
            root: 'root',
         },
      },
      addUser: (user) => {
         const users = Object.keys(get().user.users);
         if (user === '') {
            return 'User name cannot be empty';
         } else if (users.includes(user)) {
            return `User ${user} already exists`;
         }

         set({
            user: {
               ...get().user,
               users: {
                  ...get().user.users,
                  [user]: user,
               },
            },
         });
         get().savePreferences();
         return null;
      },
      removeUser: (user) => {
         const users = Object.keys(get().user.users);
         if (user === get().user.currentUser) {
            return 'Cannot remove current user';
         } else if (users.length === 1) {
            return 'Cannot remove last user';
         } else if (!users.includes(user)) {
            return 'User does not exist';
         } else if (user === DEFAULT_USER) {
            return 'Cannot remove default user';
         }

         const newUsers: {
            [username: string]: string;
         } = {};

         users.forEach((u) => {
            if (u !== user) {
               newUsers[u] = u;
            }
         });

         set({
            user: {
               ...get().user,
               users: newUsers,
            },
         });
         get().savePreferences();
         return null;
      },
      switchUser: (user) => {
         const users = Object.keys(get().user.users);
         if (user === '') {
            return 'Username cannot be empty';
         } else if (!users.includes(user || '')) {
            return `User '${user}' does not exist`;
         } else if (user === get().user.currentUser) {
            return `User '${user}' is already the current user`;
         }

         set({
            user: {
               ...get().user,
               currentUser: user,
            },
         });

         get().savePreferences();
         return null;
      },
   };
});
