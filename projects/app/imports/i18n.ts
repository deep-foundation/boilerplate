// @flow

import i18n from 'i18next';
import {initReactI18next, useTranslation as _useTranslation} from 'react-i18next';
import { pluralize } from 'numeralize-ru';

import moment from 'moment';
import 'moment/locale/ru';
import { useCallback } from 'react';

const resources = {
  ru: {
    translation: {
    }
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',

  nsSeparator: true,
  keySeparator: true,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const defaultOptions = {};

function useTranslation(): { t: (v: string, o?: any) => string; tnum: (count: number, v: string) => string; } {
  const r = _useTranslation();
  const t = useCallback((v: string, o?: any) => {
    return r.t(v, { ...o, ...defaultOptions });
  }, []);
  const tnum = useCallback((count: number, key: string) => {
    return pluralize(count, t(`${key}-1`), t(`${key}-2`), t(`${key}-5`));
  }, []);
  return { ...r, t, tnum };
}

export { useTranslation };
