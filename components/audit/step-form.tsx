"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Loader2, Check, DollarSign, Users, Target, Percent } from "lucide-react"

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
            incomeGoal: undefined,
            avgCheck: undefined,
            conversion: undefined,
            currentLeads: undefined,
            currentBudget: undefined,
        },
        mode: "onChange",
    })

    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        watch,
        formState: { errors },
    } = form

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["-", "+", "e", "E"].includes(e.key)) {
            e.preventDefault()
        }
    }

    const handleNext = async () => {
        let fieldsToValidate: (keyof AuditFormValues)[] = []

        if (currentStep === 1) {
            fieldsToValidate = ["niche", "hasCrm", "hasSalesDept"]
        } else if (currentStep === 2) {
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
                <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {t.common.step} {currentStep} / {steps.length}
                        </span>
                        <CardTitle className="text-2xl">{t.steps[`step${currentStep}` as keyof typeof t.steps]}</CardTitle>
                    </div>
                </div>
                <Progress value={progress} className="h-2 bg-secondary" />
            </CardHeader>

            <CardContent className="py-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label htmlFor="niche" className="text-base">{t.questions.niche}</Label>
                                    <Select
                                        onValueChange={(value) => setValue("niche", value, { shouldValidate: true })}
                                        defaultValue={watch("niche")}
                                    >
                                        <SelectTrigger id="niche" className="h-12 text-base">
                                            <SelectValue placeholder={t.common.select} />
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
                                        <p className="text-sm font-medium text-destructive">{errors.niche.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base">{t.questions.crm}</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue("hasCrm", value as any, { shouldValidate: true })}
                                        defaultValue={watch("hasCrm")}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
                                                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer text-center h-full transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {t.options[option as "yes" | "no" | "planning"]}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.hasCrm && (
                                        <p className="text-sm font-medium text-destructive">{errors.hasCrm.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base">{t.questions.salesDept}</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue("hasSalesDept", value as any, { shouldValidate: true })}
                                        defaultValue={watch("hasSalesDept")}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
                                                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer text-center h-full transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {t.options[option as "yes" | "no" | "planning"]}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.hasSalesDept && (
                                        <p className="text-sm font-medium text-destructive">{errors.hasSalesDept.message}</p>
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
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label htmlFor="currentLeads" className="text-base">{t.questions.currentLeads}</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="currentLeads"
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            className="pl-10 h-12 text-base"
                                            onKeyDown={handleKeyDown}
                                            {...register("currentLeads", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.currentLeads && (
                                        <p className="text-sm font-medium text-destructive">{errors.currentLeads.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="currentBudget" className="text-base">{t.questions.marketingBudget}</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="currentBudget"
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            className="pl-10 h-12 text-base"
                                            onKeyDown={handleKeyDown}
                                            {...register("currentBudget", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.currentBudget && (
                                        <p className="text-sm font-medium text-destructive">{errors.currentBudget.message}</p>
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
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label htmlFor="incomeGoal" className="text-base">{t.questions.incomeGoal}</Label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="incomeGoal"
                                            type="number"
                                            min={0}
                                            placeholder="10000"
                                            className="pl-10 h-12 text-base"
                                            onKeyDown={handleKeyDown}
                                            {...register("incomeGoal", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.incomeGoal && (
                                        <p className="text-sm font-medium text-destructive">{errors.incomeGoal.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="avgCheck" className="text-base">{t.questions.avgCheck}</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="avgCheck"
                                            type="number"
                                            min={0}
                                            placeholder="100"
                                            className="pl-10 h-12 text-base"
                                            onKeyDown={handleKeyDown}
                                            {...register("avgCheck", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.avgCheck && (
                                        <p className="text-sm font-medium text-destructive">{errors.avgCheck.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="conversion" className="text-base">{t.questions.conversion}</Label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="conversion"
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder="5"
                                            step="0.1"
                                            className="pl-10 h-12 text-base"
                                            onKeyDown={handleKeyDown}
                                            {...register("conversion", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.conversion && (
                                        <p className="text-sm font-medium text-destructive">{errors.conversion.message}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between pt-0 pb-6 px-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.common.back}
                </Button>
                <Button onClick={handleNext} disabled={isSubmitting} className="px-8 shadow-md">
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
