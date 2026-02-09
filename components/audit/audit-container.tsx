"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { AuditFormValues, auditSchema } from "@/lib/schemas"
import { useAuditCalculator } from "@/hooks/use-audit-calculator"
import { StepForm } from "@/components/audit/step-form"
import { ResultsDashboard } from "@/components/audit/results-dashboard"
import { Card } from "@/components/ui/card"

export function AuditContainer() {
    const { t } = useLanguage()
    const [formData, setFormData] = useState<AuditFormValues | null>(null)
    const [issubmitting, setIsSubmitting] = useState(false)

    const results = useAuditCalculator(formData)

    const handleFormSubmit = (data: AuditFormValues) => {
        setIsSubmitting(true)
        // Simulate API call or processing time
        setTimeout(() => {
            setFormData(data)
            setIsSubmitting(false)
        }, 1500)
    }

    const handleReset = () => {
        setFormData(null)
    }

    return (
        <div className="container max-w-4xl py-6 lg:py-10">
            {!formData ? (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {t.header.title}
                        </h2>
                        <p className="text-muted-foreground">
                            {t.header.subtitle}
                        </p>
                    </div>
                    <Card className="p-6">
                        <StepForm onSubmit={handleFormSubmit} isSubmitting={issubmitting} />
                    </Card>
                </div>
            ) : (
                <ResultsDashboard
                    results={results!}
                    formData={formData}
                    onReset={handleReset}
                />
            )}
        </div>
    )
}
