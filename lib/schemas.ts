import { z } from "zod"

export const auditSchema = z.object({
    niche: z.string().min(2, { message: "Soha nomini kiritish shart" }),
    hasCrm: z.enum(["yes", "no", "planning"], {
        required_error: "CRM holatini tanlang",
    }),
    hasSalesDept: z.enum(["yes", "no", "planning"], {
        required_error: "Sotuv bo'limi holatini tanlang",
    }),
    incomeGoal: z.coerce
        .number()
        .min(1, { message: "Daromad maqsadi 0 dan katta bo'lishi kerak" }),
    avgCheck: z.coerce
        .number()
        .min(1, { message: "O'rtacha chek miqdori kiritilishi shart" }),
    conversion: z.coerce
        .number()
        .min(0.1, { message: "Konversiya foizi kiritilishi shart" })
        .max(100, { message: "Konversiya 100% dan oshmasligi kerak" }),
    currentLeads: z.coerce.number().optional(),
    currentBudget: z.coerce.number().optional(),
})

export type AuditFormValues = z.infer<typeof auditSchema>
