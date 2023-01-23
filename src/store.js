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
    foods_eaten_by_day: [{}],
    hasUpdatedMealTracker: false,
  }),
  actions: {
    async fetchData(tableName, alertMessage = '') {
      this.postAlertMessage(LOADING_TEXT, true);
      try {
        let { data, error } = await supabase.from(tableName).select('*');

        if (tableName === 'foods') {
          const sortedData = data.sort((a, b) => a.order - b.order);
          this[tableName] = sortedData;
        } else {
          this[tableName] = data;
        }

        if (tableName === 'foods_eaten_by_day') {
          this.updateSelectedFoods(data);
        }

        this.updateHighlightSelectedFoods();
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

    updateSelectedFoods(data) {
      let dayHasData = false;
      for (const day of data) {
        if (day.date === this.dayHighlighted) {
          dayHasData = true;
          this.selectedFoods = day.data;
        }
      }
      if (!dayHasData) {
        this.selectedFoods = [];
      }
    },

    updateHighlightSelectedFoods() {
      for (const i of this.foods) {
        i.selected = false;
        for (const j of this.selectedFoods) {
          if (i.name === j.name) {
            i.selected = true;
          }
        }
      }
    },

    alertTimeout() {
      this.alertTimeoutId = setTimeout(this.clearAlertMessage, 4500);
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
