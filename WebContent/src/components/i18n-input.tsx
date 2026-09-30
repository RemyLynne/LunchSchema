import type {Text} from "@/models/i18n/text"
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {CheckIcon, ChevronDownIcon} from "lucide-react"
import {type ChangeEvent, type ComponentProps, useCallback, useState} from "react"
import i18next from "i18next"
import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES} from "@/i18n"

type I18nInputProps = Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: Text,
  onChange: (text: Text) => void
}

export function I18nInput({value, onChange, ...props}: I18nInputProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.languages[0])

  const onValueChangeInternal = useCallback((e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    onChange({
      ...value,
      translations: {
        ...value.translations,
        [selectedLanguage]: e.target.value,
      },
      content: (
        selectedLanguage === DEFAULT_LANGUAGE
        || value.translations[DEFAULT_LANGUAGE] == null
      ) ? e.target.value : value.content
    })
  }, [onChange, selectedLanguage, value])

  return (
    <InputGroup>
      <InputGroupInput
        value={value.translations[selectedLanguage] ?? value.content}
        onChange={onValueChangeInternal}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<InputGroupButton variant="ghost" className="pr-1.5! text-xs">{selectedLanguage.toUpperCase()} <ChevronDownIcon className="size-3" /></InputGroupButton>} />
          <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
            <DropdownMenuGroup>
              {SUPPORTED_LANGUAGES.map(lng => (
                <DropdownMenuItem
                  key={lng}
                  onClick={() => setSelectedLanguage(lng)}
                  className="justify-between"
                >
                  <span>{lng.toUpperCase()}</span>
                  {selectedLanguage === lng && (<CheckIcon className="pointer-events-none" />)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  )
}
