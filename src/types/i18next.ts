// import { resources, defaultNS } from '../components/i18n/i18n.tsx';

/*
 * import fallback from '../locales/en/fallback.json';
 * import ns1 from '../locales/en/ns1.json';
 * import ns2 from '../locales/en/ns2.json';
 */
import jsonLocaleKeys from '../../public/locales/en-US.json';

type JsonLocaleKeys<T = typeof jsonLocaleKeys> = T;

type ConcatLocaleKeys<T, U> = T extends string ? `${T & string}.${U & string}` : never;

type NestedLocaleKeys<T> = T extends object
  ? {
      [K in keyof T]: K | ConcatLocaleKeys<K, NestedLocaleKeys<T[K]>>;
    }[keyof T]
  : string;

type LocaleKeys = NestedLocaleKeys<JsonLocaleKeys>;

export { type LocaleKeys };

// declare global {
//  export type LocaleKeys = NestedLocaleKeys<JsonLocaleKeys>;
// }

// declare global {
// type LocalKeys = LocaleKeys;
// }

/*
 * works
 * declare global {
 *
 * type Translations<T = typeof jsonLocaleKeys> = T;
 * type ConcatKeys<T, U> = T extends string ? `${T & string}.${U & string}` : never;
 *
 * // Define a recursive type for nested keys
 * type NestedKeys<T> =
 *    T extends object ? {
 *            [K in keyof T]: K | ConcatKeys<K, NestedKeys<T[K]>>;
 *        }[keyof T] :
 *        string;
 *
 * type TranslationKeys= NestedKeys<Translations>;
 * // interface TranslationFunction<T> {
 * //    <K extends TranslationKeys<T>>(key: K, nestedKeys?: string[]): string;
 * // }
 * // export const t: TranslationFunction<Translations>;
 * }
 */

/*
 *declare module 'i18next' {
 *
 *  type Translations<T = typeof jsonLocaleKeys> = T;
 *  type ConcatKeys<T, U> = T extends string ? `${T & string}.${U & string}` : never;
 *
 *  // Define a recursive type for nested keys
 *  type NestedKeys<T> =
 *      T extends object ? {
 *              [K in keyof T]: K | ConcatKeys<K, NestedKeys<T[K]>>;
 *          }[keyof T] :
 *          string;
 *
 *  type TranslationKeys<T> = NestedKeys<T>;
 *  // interface TranslationFunction<T> {
 *  //    <K extends TranslationKeys<T>>(key: K, nestedKeys?: string[]): string;
 *  // }
 *  // export const t: TranslationFunction<Translations>;
 *}
 */

/*
 *const resources = {
 *  ...jsonLocaleKeys
 *} as const;
 */

/*
 *declare module 'i18next' {
 *  interface LocaleKeys {
 *    resources: typeof resources;
 *  }
 *}
 */
/*
 *declare global {
 *  interface LocaleKeys<Keys> {
 *    [K]
 *  }
 *}
 */

/*
 *declare global {
 *  interface LocaleKeys {
 *    resources: typeof resources;
 *  }
 *}
 */

/*
 *const resources = {
 *  localeKeys
 *} as const;
 *
 *interface I18nKeys {
 *  defaultNS: 'default';
 *  resources: typeof resources;
 *}
 *
 *declare module 'i18next' {
 *  interface CustomTypeOptions extends I18nKeys {}
 *}
 */

/*
 *import { defaultNS, fallbackNS } from '../i18n';
 *import fallback from '../locales/en/fallback.json';
 *import ns1 from '../locales/en/ns1.json';
 *import ns2 from '../locales/en/ns2.json';
 *
 *const resources = {
 *  fallback,
 *  ns1,
 *  ns2
 *} as const;
 *
 *declare module 'i18next' {
 *  interface CustomTypeOptions {
 *    defaultNS: typeof defaultNS;
 *    fallbackNS: typeof fallbackNS;
 *    resources: typeof resources;
 *  }
 *}
 */

// export { type LocaleKeys };
