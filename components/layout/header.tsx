"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Languages, BarChart3 } from "lucide-react"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function Header() {
    const { t, language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()

    const toggleLanguage = () => {
        setLanguage(language === "uz" ? "ru" : "uz")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-heading font-bold leading-none tracking-tight text-foreground/90">
                            CRM Audit
                        </h1>
                        <p className="text-[10px] font-medium text-muted-foreground hidden sm:block">
                            {t.header.subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full border border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="gap-2 rounded-full border border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                        <Languages className="h-4 w-4" />
                        <span className="font-medium text-xs uppercase">{language}</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
