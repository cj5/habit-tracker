import { defineStore } from 'pinia';
import { createClient } from '@supabase/supabase-js';
const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

export const useStore = defineStore('main', {
  state: () => ({
    dates: [],
    displayedDates: [],
    mostRecentSunId: null,
    todayId: null,

    foods: [{}],
    selectedFoods: [],
  }),
  actions: {
    async fetchData(tableName) {
      try {
        let { data, error } = await supabase.from(tableName).select('*');
        // console.log(JSON.stringify(data, null, 2));
        this[tableName] = data;
      } catch (error) {
        console.log('error:', error);
      }
    },
  },
});
