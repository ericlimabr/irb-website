export function sanitizeFilename(filename: string): string {
  const extension = filename.split(".").pop()
  const nameWithoutExtension = filename.split(".").slice(0, -1).join(".")

  const sanitized = nameWithoutExtension
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const uniqueSuffix = Date.now().toString().slice(-4)
  return `${sanitized}-${uniqueSuffix}.${extension}`
}
