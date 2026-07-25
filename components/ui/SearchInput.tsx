import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Underline search field with a leading magnifying-glass icon.
 * Shared by the confession pages (Belgic, Dort, Heidelberg).
 */
export default function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-border focus:border-gold-500 outline-none py-3 pl-8 font-sans text-foreground placeholder:text-muted-foreground transition-colors duration-500"
      />
    </div>
  )
}
