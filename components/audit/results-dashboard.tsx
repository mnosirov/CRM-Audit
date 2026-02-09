"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw } from "lucide-react"

import { AuditResults } from "@/hooks/use-audit-calculator"
import { AuditFormValues } from "@/lib/schemas"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface ResultsDashboardProps {
    results: AuditResults
    formData: AuditFormValues
    onReset: () => void
}

export function ResultsDashboard({ results, formData, onReset }: ResultsDashboardProps) {
    const { t } = useLanguage()

    const riskColor = {
        low: "text-emerald-500",
        medium: "text-yellow-500",
        high: "text-orange-500",
        critical: "text-destructive",
    }

    const riskIcon = {
        low: <CheckCircle className="h-8 w-8 text-emerald-500" />,
        medium: <CheckCircle className="h-8 w-8 text-yellow-500" />, // Or AlertCircle
        high: <AlertTriangle className="h-8 w-8 text-orange-500" />,
        critical: <XCircle className="h-8 w-8 text-destructive" />,
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                    {/* Header with Risk Level */}
                    <div className="bg-muted/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">{t.results.title}</h2>
                            <p className="text-muted-foreground">{formData.niche}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-full border shadow-sm">
                            {riskIcon[results.riskLevel]}
                            <div className="flex flex-col">
                                <span className="text-xs uppercase font-semibold text-muted-foreground">{t.results.riskLevel}</span>
                                <span className={`font-bold ${riskColor[results.riskLevel]}`}>
                                    {t.risks[results.riskLevel]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <CardContent className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Leads Required */}
                        <div className="bg-secondary/20 p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground">{t.results.clientsRequired}</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">{results.clientsRequired}</span>
                                <span className="text-xs text-muted-foreground">{t.results.clients}</span>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground">{t.results.leadsRequired}</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">{results.leadsRequired}</span>
                                <span className="text-xs text-muted-foreground">{t.results.leads}</span>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg border">
                            <span className="text-sm font-medium text-muted-foreground">{t.results.budgetRequired}</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-bold">{results.budgetRange.min.toLocaleString()}</span>
                                <span className="text-sm font-semibold">{t.results.currency}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Min</p>
                        </div>

                        <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                            <span className="text-sm font-medium text-muted-foreground">{t.results.optimalBudget}</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">{results.budgetRange.optimal.toLocaleString()}</span>
                                <span className="text-sm font-semibold">{t.results.currency}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Optimal</p>
                        </div>
                    </CardContent>

                    {/* Recommendations */}
                    <div className="px-6 pb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            {t.results.recommendations}
                        </h3>
                        <div className="grid gap-3">
                            {results.recommendations.length > 0 ? (
                                results.recommendations.map((recKey, index) => (
                                    <motion.div
                                        key={recKey}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                                    >
                                        <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        <p className="text-sm">{t.recommendations[recKey as keyof typeof t.recommendations]}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg border border-emerald-200">
                                    <p className="text-sm">Tabriklaymiz! Sizning holatingiz a'lo darajada. O'sishda davom eting!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t flex justify-center">
                        <Button variant="outline" onClick={onReset} className="gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            {t.common.finish} / Qayta hisoblash
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
