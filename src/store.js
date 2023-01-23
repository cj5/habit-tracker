import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';
const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

const DATE_FORMAT = 'YYYY-MM-DD';

export const useStore = defineStore('main', {
  state: () => ({
    dates: [],
    displayedDates: [],
    mostRecentSunId: null,
    todayId: null,

    alertMessage: '',
    dateFormat: DATE_FORMAT,
    today: dayjs().format(DATE_FORMAT),

    dayHighlighted: dayjs().format(DATE_FORMAT),
    foods: [{}],
    selectedFoods: [],
    eaten_by_day: [{}],
    hasUpdatedMealTracker: false,
  }),
  actions: {
    async fetchData(tableName) {
      try {
        let { data, error } = await supabase.from(tableName).select('*');
        this[tableName] = data;

        if (tableName === 'eaten_by_day') {
          for (const day of data) {
            if (day.date === this.today) {
              this.selectedFoods = day.data;
            }
          }
        }

        for (const i of this.foods) {
          for (const j of this.selectedFoods) {
            if (i.name === j.name) {
              i.selected = true;
            }
          }
        }

        if (error) console.log('ERROR:', error);
      } catch (error) {
        console.log('error:', error);
      }
    },

    async pushData(tableName, toPush) {
      try {
        let { error } = await supabase.from(tableName).upsert(toPush);
        this.postAlertMessage('Foods were submitted for the current day');

        if (error) console.log('ERROR:', error);
      } catch (error) {
        console.log('error:', error);
      }
    },

    postAlertMessage(text, persist = false) {
      this.alertMessage = text;
      if (!persist) {
        setTimeout(() => (this.alertMessage = ''), 5000);
      }
    },
  },
});
