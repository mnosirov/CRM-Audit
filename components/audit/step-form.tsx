"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react"

import { auditSchema, AuditFormValues } from "@/lib/schemas"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StepFormProps {
    onSubmit: (data: AuditFormValues) => void
    isSubmitting: boolean
}

const steps = [
    { id: 1, title: "step1" },
    { id: 2, title: "step2" },
    { id: 3, title: "step3" },
]

export function StepForm({ onSubmit, isSubmitting }: StepFormProps) {
    const { t } = useLanguage()
    const [currentStep, setCurrentStep] = useState(1)

    const form = useForm<AuditFormValues>({
        resolver: zodResolver(auditSchema),
        defaultValues: {
            niche: "",
            hasCrm: undefined,
            hasSalesDept: undefined,
            incomeGoal: 0,
            avgCheck: 0,
            conversion: 0,
            currentLeads: 0,
            currentBudget: 0,
        },
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        watch,
        formState: { errors, isValid },
    } = form

    const handleNext = async () => {
        let fieldsToValidate: (keyof AuditFormValues)[] = []

        if (currentStep === 1) {
            fieldsToValidate = ["niche", "hasCrm", "hasSalesDept"]
        } else if (currentStep === 2) {
            // Step 2 logic: Current state (Leads, Budget) - optional but let's validate types
            fieldsToValidate = ["currentLeads", "currentBudget"]
        } else if (currentStep === 3) {
            fieldsToValidate = ["incomeGoal", "avgCheck", "conversion"]
        }

        const isStepValid = await trigger(fieldsToValidate)
        if (isStepValid) {
            if (currentStep < 3) {
                setCurrentStep((prev) => prev + 1)
            } else {
                await handleSubmit(onSubmit)()
            }
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const progress = (currentStep / steps.length) * 100

    return (
        <div className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    <CardTitle>{t.steps[`step${currentStep}` as keyof typeof t.steps]}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                        {currentStep} / {steps.length}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </CardHeader>

            <CardContent className="py-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="niche">{t.questions.niche}</Label>
                                    <Select
                                        onValueChange={(value) => setValue("niche", value, { shouldValidate: true })}
                                        defaultValue={watch("niche")}
                                    >
                                        <SelectTrigger id="niche">
                                            <SelectValue placeholder={t.questions.niche} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(t.options.niches).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.niche && (
                                        <p className="text-sm text-destructive">{errors.niche.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>{t.questions.crm}</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue("hasCrm", value as any, { shouldValidate: true })}
                                        defaultValue={watch("hasCrm")}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        {["yes", "no", "planning"].map((option) => (
                                            <div key={option}>
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`crm-${option}`}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={`crm-${option}`}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer text-center h-full"
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {t.options[option as keyof typeof t.options]}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.hasCrm && (
                                        <p className="text-sm text-destructive">{errors.hasCrm.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>{t.questions.salesDept}</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue("hasSalesDept", value as any, { shouldValidate: true })}
                                        defaultValue={watch("hasSalesDept")}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        {["yes", "no", "planning"].map((option) => (
                                            <div key={option}>
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`sales-${option}`}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={`sales-${option}`}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer text-center h-full"
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {t.options[option as keyof typeof t.options]}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.hasSalesDept && (
                                        <p className="text-sm text-destructive">{errors.hasSalesDept.message}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="currentLeads">{t.questions.currentLeads}</Label>
                                    <Input
                                        id="currentLeads"
                                        type="number"
                                        placeholder="0"
                                        {...register("currentLeads", { valueAsNumber: true })}
                                    />
                                    {errors.currentLeads && (
                                        <p className="text-sm text-destructive">{errors.currentLeads.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentBudget">{t.questions.marketingBudget}</Label>
                                    <Input
                                        id="currentBudget"
                                        type="number"
                                        placeholder="0"
                                        {...register("currentBudget", { valueAsNumber: true })}
                                    />
                                    {errors.currentBudget && (
                                        <p className="text-sm text-destructive">{errors.currentBudget.message}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="incomeGoal">{t.questions.incomeGoal}</Label>
                                    <Input
                                        id="incomeGoal"
                                        type="number"
                                        placeholder="10000"
                                        {...register("incomeGoal", { valueAsNumber: true })}
                                    />
                                    {errors.incomeGoal && (
                                        <p className="text-sm text-destructive">{errors.incomeGoal.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="avgCheck">{t.questions.avgCheck}</Label>
                                    <Input
                                        id="avgCheck"
                                        type="number"
                                        placeholder="100"
                                        {...register("avgCheck", { valueAsNumber: true })}
                                    />
                                    {errors.avgCheck && (
                                        <p className="text-sm text-destructive">{errors.avgCheck.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="conversion">{t.questions.conversion}</Label>
                                    <Input
                                        id="conversion"
                                        type="number"
                                        placeholder="5"
                                        step="0.1"
                                        {...register("conversion", { valueAsNumber: true })}
                                    />
                                    {errors.conversion && (
                                        <p className="text-sm text-destructive">{errors.conversion.message}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.common.back}
                </Button>
                <Button onClick={handleNext} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStep === steps.length ? t.common.calculate : t.common.next}
                    {currentStep !== steps.length && !isSubmitting && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                </Button>
            </CardFooter>
        </div>
    )
}
