import { useMemo } from "react"
import { AuditFormValues } from "@/lib/schemas"

export interface AuditResults {
    leadsRequired: number
    clientsRequired: number
    budgetRange: {
        min: number
        max: number
        optimal: number
    }
    riskLevel: "low" | "medium" | "high" | "critical"
    recommendations: string[]
}

export function useAuditCalculator(data: AuditFormValues | null) {
    const results = useMemo<AuditResults | null>(() => {
        if (!data) return null

        const {
            incomeGoal,
            avgCheck,
            conversion,
            hasCrm,
            hasSalesDept,
        } = data

        // 1. CalculateClients Required
        // Income / AvgCheck = Clients
        const clientsRequired = Math.ceil(incomeGoal / avgCheck)

        // 2. Calculate Leads Required
        // Clients / (Conversion / 100)
        const conversionRate = conversion / 100
        const leadsRequired = Math.ceil(clientsRequired / conversionRate)

        // 3. Risk & Penalty Calculation
        let penalty = 0
        let riskScore = 0

        if (hasCrm === "no") {
            penalty += 0.20 // +20% penalty
            riskScore += 2
        } else if (hasCrm === "planning") {
            penalty += 0.10
            riskScore += 1
        }

        if (hasSalesDept === "no") {
            penalty += 0.20 // +20% penalty
            riskScore += 2
        } else if (hasSalesDept === "planning") {
            penalty += 0.10
            riskScore += 1
        }

        // Risk Level determination
        let riskLevel: "low" | "medium" | "high" | "critical" = "low"
        if (riskScore >= 4) riskLevel = "critical"
        else if (riskScore >= 2) riskLevel = "high"
        else if (riskScore === 1) riskLevel = "medium"

        // 4. Budget Calculation
        // Base CPL Benchmark: $0.8 - $1.5
        // Apply penalty to CPL (inefficiency increases cost)
        const baseCplMin = 0.8
        const baseCplMax = 1.5

        const penaltyMultiplier = 1 + penalty

        const effectiveCplMin = baseCplMin * penaltyMultiplier
        const effectiveCplMax = baseCplMax * penaltyMultiplier

        const budgetMin = Math.ceil(leadsRequired * effectiveCplMin)
        const budgetMax = Math.ceil(leadsRequired * effectiveCplMax)
        const budgetOptimal = Math.ceil((budgetMin + budgetMax) / 2)

        // 5. Recommendations
        const recommendations: string[] = []
        if (hasCrm === "no") recommendations.push("crm")
        if (hasSalesDept === "no") recommendations.push("sales")
        if (conversion < 1) recommendations.push("conversion")

        return {
            leadsRequired,
            clientsRequired,
            budgetRange: {
                min: budgetMin,
                max: budgetMax,
                optimal: budgetOptimal,
            },
            riskLevel,
            recommendations,
        }
    }, [data])

    return results
}
