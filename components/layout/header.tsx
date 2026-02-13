"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function Header() {
    const { t, language, setLanguage } = useLanguage()

    const toggleLanguage = () => {
        setLanguage(language === "uz" ? "ru" : "uz")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="font-bold">M</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">{t.header.title}</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                            {t.header.subtitle}
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="gap-2"
                >
                    <Languages className="h-4 w-4" />
                    <span className="font-medium text-xs uppercase">{language}</span>
                </Button>
            </div>
        </header>
    )
}
