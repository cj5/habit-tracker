import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';
const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

const DATE_FORMAT = 'YYYY-MM-DD';
const LOADING_TEXT = 'Loading...';

export const useStore = defineStore('main', {
  state: () => ({
    dates: [],
    displayedDates: [],
    mostRecentSunId: null,
    todayId: null,

    alertMessage: '',
    alertTimeoutId: null,
    dateFormat: DATE_FORMAT,
    today: dayjs().format(DATE_FORMAT),

    dayHighlighted: dayjs().format(DATE_FORMAT),
    foods: [{}],
    selectedFoods: [],
    eaten_by_day: [{}],
    hasUpdatedMealTracker: false,
  }),
  actions: {
    async fetchData(tableName, alertMessage = '') {
      this.postAlertMessage(LOADING_TEXT, true);
      try {
        let { data, error } = await supabase.from(tableName).select('*');
        this[tableName] = data;

        let hasData = false;

        if (tableName === 'eaten_by_day') {
          for (const day of data) {
            if (day.date === this.dayHighlighted) {
              hasData = true;
              this.selectedFoods = day.data;
            }
          }
          if (!hasData) {
            this.selectedFoods = [];
          }
        }

        for (const i of this.foods) {
          i.selected = false;
          for (const j of this.selectedFoods) {
            if (i.name === j.name) {
              i.selected = true;
            }
          }
        }

        this.clearAlertMessage();
        this.postAlertMessage(alertMessage);

        if (error) console.log('ERROR:', error);
      } catch (error) {
        console.log('error:', error);
      }
    },

    async pushData(tableName, toPush, alertMessage) {
      this.postAlertMessage(LOADING_TEXT, true);
      try {
        let { error } = await supabase.from(tableName).upsert(toPush);

        this.clearAlertMessage();
        this.postAlertMessage(alertMessage);

        if (error) console.log('ERROR:', error);
      } catch (error) {
        console.log('error:', error);
      }
    },

    async deleteData(tableName, date, alertMessage) {
      this.postAlertMessage(LOADING_TEXT, true);
      try {
        let { error } = await supabase.from(tableName).delete().match({ date: date });

        this.clearAlertMessage();
        this.postAlertMessage(alertMessage);

        if (error) console.log('ERROR:', error);
      } catch (error) {}
    },

    alertTimeout() {
      this.alertTimeoutId = setTimeout(this.clearAlertMessage, 4000);
    },

    postAlertMessage(text, persist = false) {
      this.alertMessage = text;
      if (!persist) {
        clearTimeout(this.alertTimeoutId);
        this.alertTimeout();
      }
    },

    clearAlertMessage() {
      this.alertMessage = '';
    },
  },
});
