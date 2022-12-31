import type { Locale } from "./app.types"

export const Locales: Map<string, Locale> = new Map([
  [
    "default",
    {
      id: "default",
      name: "Default",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
    },
  ],
  [
    "en-us",
    {
      id: "en-us",
      name: "English (US)",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
    },
  ],
  [
    "de-de",
    {
      id: "de-de",
      name: "German",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/DE.svg",
    },
  ],
  [
    "fr-fr",
    {
      id: "fr-fr",
      name: "French",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg",
    },
  ],
  [
    "es-es",
    {
      id: "es-es",
      name: "Spanish",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg",
    },
  ],
  [
    "zh-cn",
    {
      id: "zh-cn",
      name: "China (Mandarin)",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg",
    },
  ],
  [
    "ja-jp",
    {
      id: "ja-jp",
      name: "Japanese",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg",
    },
  ],
])
