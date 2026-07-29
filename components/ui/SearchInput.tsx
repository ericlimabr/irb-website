"use client"

import { useRef } from "react"
import { Search, X } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Underline search field with a leading magnifying-glass icon and a trailing
 * clear (X) button that appears once there is text. Shared by the confession
 * pages (Belgic, Dort, Heidelberg).
 */
export default function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <Search
        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-border focus:border-gold-500 outline-none py-3 pl-8 pr-9 font-sans text-foreground placeholder:text-muted-foreground transition-colors duration-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          aria-label="Limpar busca"
          className="absolute right-0 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-gold-500 transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
