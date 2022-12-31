"use client"

import { Fragment, useState } from "react"
import { useContext } from "react"
import { LayoutContext } from "../providers"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { useRouter, usePathname } from "next/navigation"
import { Locale, SupportedLocales } from "../layout.types"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function LocaleSelector({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const context = useContext(LayoutContext)
  const { locales } = context
  const selectedLocale: Locale =
    locales.get(locale) || (locales.get("default") as Locale)

  function changeLocale(newLocale: SupportedLocales) {
    if (newLocale == locale || !pathname) return // no change

    const newPath = pathname!.replace(`/${locale}/`, `/${newLocale}/`)
    router.push(newPath)
  }

  return (
    <Listbox value={selectedLocale} onChange={(v) => changeLocale(v.id)}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <img
                  src={selectedLocale.icon}
                  alt=""
                  className="h-4 w-6 flex-shrink-0 shadow-lg border"
                />
                <span className="ml-3 block truncate">
                  {selectedLocale.name}
                </span>
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
                {Array.from(locales.values()).map((locale) => (
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
