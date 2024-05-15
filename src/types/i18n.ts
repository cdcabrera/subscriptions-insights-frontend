import jsonLocaleKeys from '../../public/locales/en-US.json';

type JsonLocaleKeys = typeof jsonLocaleKeys;

type ConcatLocaleKeys<T, U> = T extends string ? `${T & string}.${U & string}` : never;

type NestedLocaleKeys<T> = T extends object
  ? {
      [K in keyof T]: K | ConcatLocaleKeys<K, NestedLocaleKeys<T[K]>>;
    }[keyof T]
  : string;

type LocaleKeys = NestedLocaleKeys<JsonLocaleKeys>;

export { type LocaleKeys as default, type LocaleKeys };
