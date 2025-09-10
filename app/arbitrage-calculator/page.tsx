"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Calculator, ArrowRight, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import { NumberInput } from "@/components/number-input"
import Link from "next/link"

type ArbitrageInputs = {
  initialRub: number
  rubToUsdtRate: number
  rubToUsdtFeePercent: number
  rubToUsdtFeeFixed: number
  usdtToKrwRate: number
  usdtToKrwFeePercent: number
  usdtToKrwFeeFixed: number
  krwToUsdtRate: number
  krwToUsdtFeePercent: number
  krwToUsdtFeeFixed: number
  usdtToRubRate: number
  usdtToRubFeePercent: number
  usdtToRubFeeFixed: number
}

const defaultArbitrageInputs: ArbitrageInputs = {
  initialRub: 250000,
  rubToUsdtRate: 81.75,
  rubToUsdtFeePercent: 0,
  rubToUsdtFeeFixed: 0,
  usdtToKrwRate: 1475,
  usdtToKrwFeePercent: 0,
  usdtToKrwFeeFixed: 0,
  krwToUsdtRate: 1390,
  krwToUsdtFeePercent: 0.25,
  krwToUsdtFeeFixed: 0,
  usdtToRubRate: 80.5,
  usdtToRubFeePercent: 0,
  usdtToRubFeeFixed: 0,
}

const strings = {
  en: {
    title: "Arbitrage Calculator",
    subtitle: "Full cycle currency exchange: RUB → USDT → KRW → USDT → RUB",
    backToMain: "← Back to Main Calculator",
    initialAmount: "Initial RUB Amount",
    step1: "Step 1: RUB → USDT",
    step2: "Step 2: USDT → KRW",
    step3: "Step 3: KRW → USDT",
    step4: "Step 4: USDT → RUB",
    exchangeRate: "Exchange Rate",
    feePercent: "Fee (%)",
    feeFixed: "Fixed Fee",
    stepResults: "Step Results",
    finalResults: "Final Results",
    totalProfit: "Total Profit/Loss",
    profitPercent: "Profit Percentage",
    waterfall: "Waterfall Analysis",
    lossesPerStep: "Losses Per Step",
    darkMode: "Dark Mode",
  },
  ru: {
    title: "Калькулятор арбитража",
    subtitle: "Полный цикл обмена валют: RUB → USDT → KRW → USDT → RUB",
    backToMain: "← Назад к основному калькулятору",
    initialAmount: "Начальная сумма в RUB",
    step1: "Шаг 1: RUB → USDT",
    step2: "Шаг 2: USDT → KRW",
    step3: "Шаг 3: KRW → USDT",
    step4: "Шаг 4: USDT → RUB",
    exchangeRate: "Курс обмена",
    feePercent: "Комиссия (%)",
    feeFixed: "Фиксированная комиссия",
    stepResults: "Результаты шагов",
    finalResults: "Итоговые результаты",
    totalProfit: "Общая прибыль/убыток",
    profitPercent: "Процент прибыли",
    waterfall: "Анализ потерь",
    lossesPerStep: "Потери по шагам",
    darkMode: "Темная тема",
  },
}

export default function ArbitrageCalculator() {
  const [inputs, setInputs] = useState<ArbitrageInputs>(defaultArbitrageInputs)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<"en" | "ru">("en")
  const [mounted, setMounted] = useState(false)

  const t = strings[language]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const savedInputs = localStorage.getItem("arbitrage-calc:inputs")
    const savedTheme = localStorage.getItem("rub-krw-calc:theme")

    if (savedInputs) {
      try {
        setInputs(JSON.parse(savedInputs))
      } catch (e) {
        console.error("Failed to parse saved inputs:", e)
      }
    }

    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return
    localStorage.setItem("arbitrage-calc:inputs", JSON.stringify(inputs))
  }, [inputs, mounted])

  useEffect(() => {
    if (!mounted) return

    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("rub-krw-calc:theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("rub-krw-calc:theme", "light")
    }
  }, [darkMode, mounted])

  const calculations = useMemo(() => {
    // Step 1: RUB → USDT
    const step1Amount = inputs.initialRub
    const step1Usdt = step1Amount / inputs.rubToUsdtRate
    const step1FeePercent = step1Usdt * (inputs.rubToUsdtFeePercent / 100)
    const step1FeeFixed = inputs.rubToUsdtFeeFixed
    const step1Result = Math.max(0, step1Usdt - step1FeePercent - step1FeeFixed)
    const step1Loss = step1Usdt - step1Result

    // Step 2: USDT → KRW
    const step2Amount = step1Result
    const step2Krw = step2Amount * inputs.usdtToKrwRate
    const step2FeePercent = step2Krw * (inputs.usdtToKrwFeePercent / 100)
    const step2FeeFixed = inputs.usdtToKrwFeeFixed
    const step2Result = Math.max(0, step2Krw - step2FeePercent - step2FeeFixed)
    const step2Loss = step2Krw - step2Result

    // Step 3: KRW → USDT
    const step3Amount = step2Result
    const step3Usdt = step3Amount / inputs.krwToUsdtRate
    const step3FeePercent = step3Usdt * (inputs.krwToUsdtFeePercent / 100)
    const step3FeeFixed = inputs.krwToUsdtFeeFixed / inputs.krwToUsdtRate // Convert KRW fee to USDT
    const step3Result = Math.max(0, step3Usdt - step3FeePercent - step3FeeFixed)
    const step3Loss = step3Usdt - step3Result

    // Step 4: USDT → RUB
    const step4Amount = step3Result
    const step4Rub = step4Amount * inputs.usdtToRubRate
    const step4FeePercent = step4Rub * (inputs.usdtToRubFeePercent / 100)
    const step4FeeFixed = inputs.usdtToRubFeeFixed
    const step4Result = Math.max(0, step4Rub - step4FeePercent - step4FeeFixed)
    const step4Loss = step4Rub - step4Result

    const finalRub = step4Result
    const totalProfit = finalRub - inputs.initialRub
    const profitPercent = inputs.initialRub > 0 ? (totalProfit / inputs.initialRub) * 100 : 0

    return {
      step1: { amount: step1Amount, result: step1Result, loss: step1Loss, currency: "USDT" },
      step2: { amount: step2Amount, result: step2Result, loss: step2Loss, currency: "KRW" },
      step3: { amount: step3Amount, result: step3Result, loss: step3Loss, currency: "USDT" },
      step4: { amount: step4Amount, result: step4Result, loss: step4Loss, currency: "RUB" },
      finalRub,
      totalProfit,
      profitPercent,
      isProfitable: totalProfit > 0,
    }
  }, [inputs])

  const updateInput = (key: keyof ArbitrageInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-colors duration-200">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 p-4 bg-card/30 backdrop-blur-sm rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm sm:text-base font-medium text-muted-foreground">
                {language === "en" ? "Back to Main Calculator" : "Назад к основному калькулятору"}
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-card/80 rounded-xl border shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ru" : "en")}
                className="font-medium hover:bg-muted/50 text-xs sm:text-sm px-2 sm:px-3"
              >
                {language === "en" ? "🇷🇺 RU" : "🇺🇸 EN"}
              </Button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-card/80 rounded-xl border shadow-sm">
              <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label={t.darkMode}
                className="scale-75 sm:scale-100"
              />
              <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Initial Amount */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t.initialAmount}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberInput
                  label={t.initialAmount}
                  value={inputs.initialRub}
                  onChange={(value) => updateInput("initialRub", value)}
                  unit="₽"
                  min={0}
                />
              </CardContent>
            </Card>

            {/* Step 1: RUB → USDT */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t.step1}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberInput
                    label={`${t.exchangeRate} (₽/USDT)`}
                    value={inputs.rubToUsdtRate}
                    onChange={(value) => updateInput("rubToUsdtRate", value)}
                    unit="₽"
                    min={0}
                    step={0.01}
                  />
                  <NumberInput
                    label={t.feePercent}
                    value={inputs.rubToUsdtFeePercent}
                    onChange={(value) => updateInput("rubToUsdtFeePercent", value)}
                    unit="%"
                    min={0}
                    step={0.1}
                  />
                  <NumberInput
                    label={`${t.feeFixed} (USDT)`}
                    value={inputs.rubToUsdtFeeFixed}
                    onChange={(value) => updateInput("rubToUsdtFeeFixed", value)}
                    unit="USDT"
                    min={0}
                    step={0.01}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 2: USDT → KRW */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t.step2}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberInput
                    label={`${t.exchangeRate} (₩/USDT)`}
                    value={inputs.usdtToKrwRate}
                    onChange={(value) => updateInput("usdtToKrwRate", value)}
                    unit="₩"
                    min={0}
                    step={0.01}
                  />
                  <NumberInput
                    label={t.feePercent}
                    value={inputs.usdtToKrwFeePercent}
                    onChange={(value) => updateInput("usdtToKrwFeePercent", value)}
                    unit="%"
                    min={0}
                    step={0.1}
                  />
                  <NumberInput
                    label={`${t.feeFixed} (₩)`}
                    value={inputs.usdtToKrwFeeFixed}
                    onChange={(value) => updateInput("usdtToKrwFeeFixed", value)}
                    unit="₩"
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 3: KRW → USDT */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {t.step3}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberInput
                    label={`${t.exchangeRate} (₩/USDT)`}
                    value={inputs.krwToUsdtRate}
                    onChange={(value) => updateInput("krwToUsdtRate", value)}
                    unit="₩"
                    min={0}
                    step={0.01}
                  />
                  <NumberInput
                    label={t.feePercent}
                    value={inputs.krwToUsdtFeePercent}
                    onChange={(value) => updateInput("krwToUsdtFeePercent", value)}
                    unit="%"
                    min={0}
                    step={0.1}
                  />
                  <NumberInput
                    label={`${t.feeFixed} (₩)`}
                    value={inputs.krwToUsdtFeeFixed}
                    onChange={(value) => updateInput("krwToUsdtFeeFixed", value)}
                    unit="₩"
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 4: USDT → RUB */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {t.step4}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberInput
                    label={`${t.exchangeRate} (₽/USDT)`}
                    value={inputs.usdtToRubRate}
                    onChange={(value) => updateInput("usdtToRubRate", value)}
                    unit="₽"
                    min={0}
                    step={0.01}
                  />
                  <NumberInput
                    label={t.feePercent}
                    value={inputs.usdtToRubFeePercent}
                    onChange={(value) => updateInput("usdtToRubFeePercent", value)}
                    unit="%"
                    min={0}
                    step={0.1}
                  />
                  <NumberInput
                    label={`${t.feeFixed} (₽)`}
                    value={inputs.usdtToRubFeeFixed}
                    onChange={(value) => updateInput("usdtToRubFeeFixed", value)}
                    unit="₽"
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Step Results */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">{t.stepResults}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[calculations.step1, calculations.step2, calculations.step3, calculations.step4].map((step, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Step {index + 1}</span>
                      <span className="text-xs text-muted-foreground">{step.currency}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Result:</span>
                        <span className="font-mono">
                          {step.currency === "RUB" && "₽"}
                          {step.currency === "KRW" && "₩"}
                          {step.result.toFixed(step.currency === "KRW" ? 0 : 2)}
                          {step.currency === "USDT" && " USDT"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Loss:</span>
                        <span className="font-mono">-{step.loss.toFixed(step.currency === "KRW" ? 0 : 2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Final Results */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">{t.finalResults}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <Label className="text-sm font-medium text-muted-foreground">Final Amount</Label>
                  <div className="text-2xl font-bold text-primary mt-1">₽{calculations.finalRub.toFixed(2)}</div>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 ${
                    calculations.isProfitable
                      ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {calculations.isProfitable ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <Label className="text-sm font-medium text-muted-foreground">{t.totalProfit}</Label>
                  </div>
                  <div
                    className={`text-2xl font-bold ${calculations.isProfitable ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculations.isProfitable ? "+" : ""}₽{calculations.totalProfit.toFixed(2)}
                  </div>
                  <div className={`text-sm mt-1 ${calculations.isProfitable ? "text-green-600" : "text-red-600"}`}>
                    {calculations.isProfitable ? "+" : ""}
                    {calculations.profitPercent.toFixed(2)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Waterfall Chart */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">{t.lossesPerStep}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[calculations.step1, calculations.step2, calculations.step3, calculations.step4].map(
                      (step, index) => {
                        const maxLoss = Math.max(
                          calculations.step1.loss,
                          calculations.step2.loss,
                          calculations.step3.loss,
                          calculations.step4.loss,
                        )
                        const widthPercent = maxLoss > 0 ? (step.loss / maxLoss) * 100 : 0
                        const colors = ["bg-blue-500", "bg-green-500", "bg-orange-500", "bg-red-500"]

                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Step {index + 1}</span>
                              <span className="font-mono text-red-600">
                                -{step.loss.toFixed(step.currency === "KRW" ? 0 : 2)} {step.currency}
                              </span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-3 relative overflow-hidden">
                              <div
                                className={`${colors[index]} h-3 rounded-full transition-all duration-500 ease-out`}
                                style={{ width: `${widthPercent}%` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-muted/20 rounded-xl">
                    <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                      {language === "en" ? "Cumulative Flow" : "Кумулятивный поток"}
                    </Label>
                    <div className="space-y-2">
                      {/* Initial amount bar */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-xs text-muted-foreground">Start</div>
                        <div className="flex-1 bg-primary/20 rounded-full h-6 relative overflow-hidden">
                          <div className="bg-primary h-6 rounded-full w-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              ₽{inputs.initialRub.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Step results - convert all to RUB equivalent for proper comparison */}
                      {(() => {
                        // Convert all step results to RUB equivalent for proper waterfall visualization
                        const step1RubEquivalent = calculations.step1.result * inputs.rubToUsdtRate // USDT to RUB
                        const step2RubEquivalent =
                          (calculations.step2.result / inputs.usdtToKrwRate) * inputs.rubToUsdtRate // KRW to USDT to RUB
                        const step3RubEquivalent = calculations.step3.result * inputs.rubToUsdtRate // USDT to RUB
                        const step4RubEquivalent = calculations.step4.result // Already in RUB

                        const stepEquivalents = [
                          { equivalent: step1RubEquivalent, original: calculations.step1, color: "bg-blue-500" },
                          { equivalent: step2RubEquivalent, original: calculations.step2, color: "bg-green-500" },
                          { equivalent: step3RubEquivalent, original: calculations.step3, color: "bg-orange-500" },
                          { equivalent: step4RubEquivalent, original: calculations.step4, color: "bg-red-500" },
                        ]

                        return stepEquivalents.map((step, index) => {
                          const widthPercent = inputs.initialRub > 0 ? (step.equivalent / inputs.initialRub) * 100 : 0

                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-16 text-xs text-muted-foreground">Step {index + 1}</div>
                              <div className="flex-1 bg-muted/30 rounded-full h-6 relative overflow-hidden">
                                <div
                                  className={`${step.color} h-6 rounded-full transition-all duration-500 flex items-center justify-center`}
                                  style={{ width: `${Math.max(widthPercent, 5)}%` }}
                                >
                                  <span className="text-xs font-medium text-white truncate px-2">
                                    {step.original.currency === "RUB" && "₽"}
                                    {step.original.currency === "KRW" && "₩"}
                                    {step.original.result.toFixed(step.original.currency === "KRW" ? 0 : 2)}
                                    {step.original.currency === "USDT" && " USDT"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground min-w-[60px] text-right">
                                ₽{step.equivalent.toFixed(0)}
                              </div>
                            </div>
                          )
                        })
                      })()}

                      {/* Final result */}
                      <div className="flex items-center gap-3 pt-2 border-t border-muted/30">
                        <div className="w-16 text-xs font-medium">Final</div>
                        <div className="flex-1 bg-muted/30 rounded-full h-8 relative overflow-hidden">
                          <div
                            className={`h-8 rounded-full transition-all duration-500 flex items-center justify-center ${
                              calculations.isProfitable ? "bg-green-600" : "bg-red-600"
                            }`}
                            style={{
                              width: `${Math.max((calculations.finalRub / inputs.initialRub) * 100, 5)}%`,
                            }}
                          >
                            <span className="text-sm font-bold text-white">₽{calculations.finalRub.toFixed(2)}</span>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            calculations.isProfitable ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {calculations.isProfitable ? "+" : ""}
                          {calculations.profitPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
