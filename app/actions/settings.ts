"use server"

import { SettingsState } from "@/components/pages/SettingsPageComponent"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getUser } from "@/utils/getUser"
import { isValidGoogleAnalyticsId } from "@/utils/strings"

export async function updateSettings(formData: SettingsState) {
  if (!(await getUser())) return { success: false, error: "Não autorizado" }

  try {
    if (!process.env.GLOBAL_CONFIG_ID) {
      throw new Error("GLOBAL_CONFIG_ID não definido nas variáveis de ambiente")
    }

    const {
      siteName,
      siteTagline,
      authorBio,
      logoUrl,
      authorAvatarUrl,
      socialWhatsApp,
      socialLinkedin,
      socialX,
      socialInstagram,
      socialFacebook,
      socialYoutube,
      metaTitle,
      metaDescription,
      ogImageUrl,
      googleAnalyticsId,
      postsPerPage,
      maintenanceMode,
      customScriptsHead,
      customScriptsFooter,
      contactEmail,
    } = formData

    if (googleAnalyticsId && !isValidGoogleAnalyticsId(googleAnalyticsId)) {
      return {
        success: false,
        error: "Google Analytics ID inválido. Use o formato G-XXXXXXXXXX.",
      }
    }

    await prisma.globalSettings.upsert({
      where: { id: process.env.GLOBAL_CONFIG_ID },
      update: {
        siteName,
        siteTagline,
        authorBio,
        logoUrl,
        authorAvatarUrl,
        socialWhatsApp,
        socialLinkedin,
        socialX,
        socialInstagram,
        socialFacebook,
        socialYoutube,
        metaTitle,
        metaDescription,
        ogImageUrl,
        googleAnalyticsId,
        postsPerPage:
          typeof postsPerPage === "string"
            ? parseInt(postsPerPage, 10)
            : postsPerPage,
        maintenanceMode,
        customScriptsHead,
        customScriptsFooter,
        contactEmail,
      },
      create: { id: process.env.GLOBAL_CONFIG_ID, ...formData },
    })

    revalidatePath("/", "layout")
    revalidatePath("/admin/configuracoes")

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { success: false, error: "Falha ao atualizar configurações" }
  }
}
