"use client"

import { Fragment, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { useRouter, usePathname } from "next/navigation"

type SupportedLocales =
  | "default"
  | "en-us"
  | "de-de"
  | "fr-fr"
  | "es-es"
  | "zh-cn"
  | "ja-jp"
type Locale = {
  id: SupportedLocales
  name: string
  icon: string
}
type Locales = {
  [key: string]: Locale
}

const locales: Locales = {
  default: {
    id: "default",
    name: "Default",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  },
  "en-us": {
    id: "en-us",
    name: "English (US)",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  },
  "en-gb": {
    id: "de-de",
    name: "German",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/DE.svg",
  },
  "fr-fr": {
    id: "fr-fr",
    name: "French",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg",
  },
  "es-es": {
    id: "es-es",
    name: "Spanish",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg",
  },
  "zh-cn": {
    id: "zh-cn",
    name: "China (Mandarin)",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg",
  },
  "ja-jp": {
    id: "ja-jp",
    name: "Japanese",
    icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg",
  },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function LocaleSelector({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [selected, setSelected] = useState(
    locales[locale] || locales["default"]
  )

  function changeLocale(newLocale: SupportedLocales) {
    if (newLocale == locale || !pathname) return // no change

    const newPath = pathname!.replace(`/${locale}/`, `/${newLocale}/`)
    router.push(newPath)
  }

  return (
    <Listbox
      value={locales[locale] || locales["default"]}
      onChange={(v) => changeLocale(v.id)}
    >
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <img
                  src={selected.icon}
                  alt=""
                  className="h-4 w-6 flex-shrink-0 shadow-lg border"
                />
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.values(locales).map((locale) => (
                  <Listbox.Option
                    key={locale.id}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={locale}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <img
                            src={locale.icon}
                            alt=""
                            className="h-6 w-6 flex-shrink-0 rounded-sm"
                          />
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {locale.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
