import { i18n } from '~/modules'

export function useLanguage() {
  const { locale } = i18n.global
  const language = ref('cn')
  watch(language, (lang) => {
    locale.value = lang
  })
  function toggle() {
    language.value = language.value === 'cn' ? 'en' : 'cn'
  }
  function setLanguage(lang: 'cn' | 'en') {
    language.value = lang
  }
  return {
    language: language as WritableComputedRef<'cn' | 'en'>,
    toggle,
    setLanguage,
  }
}
