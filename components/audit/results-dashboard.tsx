"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { AuditFormValues } from "@/lib/schemas"
import { AuditResults } from "@/hooks/use-audit-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, TrendingUp, DollarSign, Users, Target, Download, RefreshCw } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ResultsDashboardProps {
    results: AuditResults
    formData: AuditFormValues
    onReset: () => void
}

export function ResultsDashboard({ results, formData, onReset }: ResultsDashboardProps) {
    const { t } = useLanguage()
    const componentRef = useRef<HTMLDivElement>(null)

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return

        try {
            const element = componentRef.current
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                ignoreElements: (node) => {
                    return node.classList?.contains("print:hidden")
                }
            } as any)

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            })

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save(`CRM_Audit_Results_${new Date().toISOString().split("T")[0]}.pdf`)
        } catch (error) {
            console.error("PDF generation failed:", error)
            alert("PDF yuklab olishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
        }
    }

    const getRiskColor = (level: string) => {
        if (level === "low") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        if (level === "medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
        if (level === "high") return "text-orange-500 bg-orange-500/10 border-orange-500/20"
        return "text-red-500 bg-red-500/10 border-red-500/20"
    }

    const getRiskLabel = (level: string) => {
        return t.risks[level as keyof typeof t.risks]
    }

    // Calculate budget distribution based on OPTIMAL budget
    const totalBudget = results.budgetRange.optimal
    const adBudget = totalBudget * 0.7
    const toolsBudget = totalBudget * 0.15
    const miscBudget = totalBudget * 0.15

    return (
        <div ref={componentRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-0 bg-background/50 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                {/* ... Header content ... */}
                <div>
                    {/* ... Title ... */}
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t.results.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {t.results.riskLevel}: <span className={`font-semibold px-2 py-0.5 rounded-full text-xs border ${getRiskColor(results.riskLevel)}`}>
                            {getRiskLabel(results.riskLevel)}
                        </span>
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={onReset} className="flex-1 sm:flex-none">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t.common.finish}
                    </Button>
                    <Button onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Print Header (Visible only in print) */}
            <div className="hidden print:block mb-8">
                <h1 className="text-4xl font-bold mb-2">{t.header.title}</h1>
                <p className="text-muted-foreground">{t.header.subtitle}</p>
                <div className="mt-4 border-b pb-4">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Grid Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
                {/* ... Cards code (replace content with t.results keys) ... */}
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all print:border print:shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t.results.leadsRequired}
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {results.leadsRequired} <span className="text-xs font-normal text-muted-foreground">{t.results.leads}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all print:border print:shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t.results.budgetRequired}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {t.results.currency}{results.budgetRange.min.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Min</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-violet-500 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-background to-violet-500/5 print:border print:shadow-none print:bg-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t.results.optimalBudget}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {t.results.currency}{results.budgetRange.optimal.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Optimal</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all print:border print:shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t.results.clientsRequired}
                        </CardTitle>
                        <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {results.clientsRequired} <span className="text-xs font-normal text-muted-foreground">{t.results.clients}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1 print:gap-4">
                <Card className="shadow-sm print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            {t.results.recommendations}
                        </CardTitle>
                        <CardDescription>
                            Based on your inputs, we recommend the following actions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {results.recommendations.map((recKey, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 print:bg-transparent print:border-none print:p-0">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary print:border print:border-primary">
                                    {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed">
                                    {t.recommendations[recKey as keyof typeof t.recommendations] || recKey}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="shadow-sm print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle>{t.results.budgetDistribution}</CardTitle>
                        <CardDescription>{t.results.allocationDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Simple CSS Chart */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t.results.ads}</span>
                                <span className="font-medium">{t.results.currency}{adBudget.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden print:bg-gray-200">
                                <div className="h-full bg-blue-500 rounded-full print:bg-black" style={{ width: "70%" }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t.results.tools}</span>
                                <span className="font-medium">{t.results.currency}{toolsBudget.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden print:bg-gray-200">
                                <div className="h-full bg-violet-500 rounded-full print:bg-black" style={{ width: "15%" }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t.results.management}</span>
                                <span className="font-medium">{t.results.currency}{miscBudget.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden print:bg-gray-200">
                                <div className="h-full bg-orange-500 rounded-full print:bg-black" style={{ width: "15%" }} />
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t flex justify-between items-center">
                            <span className="font-semibold text-sm text-muted-foreground">{t.results.totalScale}</span>
                            <span className="text-xl font-bold text-primary">{t.results.currency}{results.budgetRange.optimal.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
