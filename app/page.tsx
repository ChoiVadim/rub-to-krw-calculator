"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Download, Copy, TrendingUp, Calculator, RefreshCw, Wifi, WifiOff, ArrowRight } from "lucide-react"
import { NumberInput } from "@/components/number-input"
import { ResultsCard } from "@/components/results-card"
import { ComparisonChart } from "@/components/comparison-chart"
import { formatKRW, formatPct } from "@/lib/formatters"

type Inputs = {
  rub: number
  midRubUsd: number
  midUsdKrw: number
  p2pRubUsd: number
  p2pUsdKrw: number
  p2pExtraKrw: number
  koronaRubUsd: number
  e9payUsdKrw: number
  e9payFixedKrw: number
  koronaSmsRub: number
  ozonPct: number
  applyOzon: boolean
}

const defaultInputs: Inputs = {
  rub: 250000,
  midRubUsd: 79.9,
  midUsdKrw: 1393,
  p2pRubUsd: 81.75,
  p2pUsdKrw: 1475,
  p2pExtraKrw: 0,
  koronaRubUsd: 86.8021,
  e9payUsdKrw: 1354.25,
  e9payFixedKrw: 7000,
  koronaSmsRub: 99,
  ozonPct: 1,
  applyOzon: true,
}

const strings = {
  en: {
    title: "RUB→KRW Transfer Cost Calculator",
    global: "Global Settings",
    rubAmount: "RUB Amount",
    midRubUsd: "Mid RUB→USD Rate",
    midUsdKrw: "Mid USD→KRW Rate",
    midRubKrw: "Mid RUB→KRW Rate",
    p2pTitle: "P2P Method",
    p2pRubUsd: "P2P RUB→USDT Rate",
    p2pUsdKrw: "P2P USDT→KRW Rate",
    p2pExtraKrw: "Extra Fee (KRW)",
    koronaTitle: "Korona + E9Pay Method",
    koronaRubUsd: "Korona RUB→USD Rate",
    e9payUsdKrw: "E9Pay USD→KRW Rate",
    e9payFixedKrw: "E9Pay Fixed Fee",
    koronaSmsRub: "Korona SMS Fee",
    ozonPct: "Ozon Bank Surcharge",
    applyOzon: "Apply Ozon Fee",
    resetDefaults: "Reset to Defaults",
    savePreset: "Save Preset",
    loadPreset: "Load Preset",
    midMarket: "Mid-Market (Ideal)",
    p2pMethod: "P2P Method",
    koronaMethod: "Korona + E9Pay",
    krwOut: "KRW Output",
    effRate: "Effective Rate",
    lossVsMid: "Loss vs Mid",
    exportCsv: "Export CSV",
    copySummary: "Copy Summary",
    darkMode: "Dark Mode",
    arbitrageIndicator: "Arbitrage Indicator",
    arbitrageProfitable: "P2P rate is above mid-market",
    arbitrageUnprofitable: "P2P rate is below mid-market",
    autoFetch: "Auto-fetch",
    lastUpdated: "Last updated:",
    error: "Error:",
  },
  ru: {
    title: "Калькулятор стоимости перевода RUB→KRW",
    global: "Общие настройки",
    rubAmount: "Сумма в рублях",
    midRubUsd: "Средний курс RUB→USD",
    midUsdKrw: "Средний курс USD→KRW",
    midRubKrw: "Средний курс RUB→KRW",
    p2pTitle: "P2P метод",
    p2pRubUsd: "P2P курс RUB→USDT",
    p2pUsdKrw: "P2P курс USDT→KRW",
    p2pExtraKrw: "Доп. комиссия (KRW)",
    koronaTitle: "Korona + E9Pay метод",
    koronaRubUsd: "Korona курс RUB→USD",
    e9payUsdKrw: "E9Pay курс USD→KRW",
    e9payFixedKrw: "E9Pay фикс. комиссия",
    koronaSmsRub: "Korona SMS комиссия",
    ozonPct: "Наценка Ozon Bank",
    applyOzon: "Применить комиссию Ozon",
    resetDefaults: "Сбросить",
    savePreset: "Сохранить пресет",
    loadPreset: "Загрузить пресет",
    midMarket: "Средний курс (идеал)",
    p2pMethod: "P2P метод",
    koronaMethod: "Korona + E9Pay",
    krwOut: "Получите KRW",
    effRate: "Эффективный курс",
    lossVsMid: "Потери от среднего",
    exportCsv: "Экспорт CSV",
    copySummary: "Копировать сводку",
    darkMode: "Темная тема",
    arbitrageIndicator: "Индикатор арбитража",
    arbitrageProfitable: "P2P курс выше среднего",
    arbitrageUnprofitable: "P2P курс ниже среднего",
    autoFetch: "Авто-обновление",
    lastUpdated: "Обновлено:",
    error: "Ошибка:",
  },
}

export default function RubKrwCalculator() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<"en" | "ru">("en")
  const [presetName, setPresetName] = useState("")
  const [mounted, setMounted] = useState(false)
  const [autoFetch, setAutoFetch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const t = strings[language]

  const fetchExchangeRates = async () => {
    if (!autoFetch) return

    setIsLoading(true)
    setFetchError(null)

    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/RUB")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.rates && data.rates.USD && data.rates.KRW) {
        const rubToUsd = 1 / data.rates.USD
        const rubToKrw = data.rates.KRW
        const usdToKrw = data.rates.KRW / data.rates.USD

        setInputs((prev) => ({
          ...prev,
          midRubUsd: rubToUsd,
          midUsdKrw: usdToKrw,
        }))

        setLastUpdated(new Date())
        console.log("Exchange rates updated:", { rubToUsd, usdToKrw })
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error)
      setFetchError(error instanceof Error ? error.message : "Failed to fetch rates")
    } finally {
      setIsLoading(false)
    }
  }

  const manualRefresh = () => {
    fetchExchangeRates()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const savedInputs = localStorage.getItem("rub-krw-calc:inputs")
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
    if (!mounted || !autoFetch) return

    fetchExchangeRates()

    const interval = setInterval(fetchExchangeRates, 5000)

    return () => clearInterval(interval)
  }, [mounted, autoFetch])

  const calculations = useMemo(() => {
    const midRubKrw = inputs.midUsdKrw / inputs.midRubUsd
    const midKrwOut = inputs.rub * midRubKrw

    const p2pRubKrw = inputs.p2pUsdKrw / inputs.p2pRubUsd
    const p2pKrwOut = Math.max(0, inputs.rub * p2pRubKrw - inputs.p2pExtraKrw)

    const koronaRubEffective = (() => {
      const afterOzon = inputs.applyOzon ? inputs.rub * (1 - inputs.ozonPct / 100) : inputs.rub
      return Math.max(0, afterOzon - inputs.koronaSmsRub)
    })()
    const koronaRubKrw = inputs.e9payUsdKrw / inputs.koronaRubUsd
    const koronaKrwOut = Math.max(0, koronaRubEffective * koronaRubKrw - inputs.e9payFixedKrw)

    const lossPct = (mid: number, actual: number) => (mid <= 0 ? 0 : Math.max(0, ((mid - actual) / mid) * 100))

    const effKrwPerRub = (krwOut: number, rub: number) => (rub <= 0 ? 0 : krwOut / rub)

    const p2pArbitrageAdvantage = p2pRubKrw > midRubKrw
    const p2pArbitragePercentage = midRubKrw > 0 ? ((p2pRubKrw - midRubKrw) / midRubKrw) * 100 : 0

    const p2pKrwRub = 1 / p2pRubKrw // KRW to RUB rate via P2P
    const midKrwRub = 1 / midRubKrw // KRW to RUB rate via mid-market

    // Calculate how many RUB you get from converting KRW via P2P
    const sampleKrwAmount = 1000000 // 1M KRW as sample
    const p2pRubFromKrw = sampleKrwAmount * p2pKrwRub
    const midRubFromKrw = sampleKrwAmount * midKrwRub

    const p2pReverseAdvantage = p2pKrwRub > midKrwRub
    const p2pReversePercentage = midKrwRub > 0 ? ((p2pKrwRub - midKrwRub) / midKrwRub) * 100 : 0

    return {
      midRubKrw,
      midKrwOut,
      p2pKrwOut,
      koronaKrwOut,
      midEffRate: effKrwPerRub(midKrwOut, inputs.rub),
      p2pEffRate: effKrwPerRub(p2pKrwOut, inputs.rub),
      koronaEffRate: effKrwPerRub(koronaKrwOut, inputs.rub),
      p2pLossPct: lossPct(midKrwOut, p2pKrwOut),
      koronaLossPct: lossPct(midKrwOut, koronaKrwOut),
      p2pLossKrw: midKrwOut - p2pKrwOut,
      koronaLossKrw: midKrwOut - koronaKrwOut,
      p2pRubKrw,
      p2pArbitrageAdvantage,
      p2pArbitragePercentage,
      p2pKrwRub,
      midKrwRub,
      p2pRubFromKrw,
      midRubFromKrw,
      p2pReverseAdvantage,
      p2pReversePercentage,
    }
  }, [inputs])

  const updateInput = (key: keyof Inputs, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setInputs(defaultInputs)
  }

  const savePreset = () => {
    if (!presetName.trim() || typeof window === "undefined") return

    const presets = JSON.parse(localStorage.getItem("rub-krw-calc:presets") || "{}")
    presets[presetName] = inputs
    localStorage.setItem("rub-krw-calc:presets", JSON.stringify(presets))
    setPresetName("")
  }

  const loadPreset = (name: string) => {
    if (typeof window === "undefined") return

    const presets = JSON.parse(localStorage.getItem("rub-krw-calc:presets") || "{}")
    if (presets[name]) {
      setInputs(presets[name])
    }
  }

  const exportCsv = () => {
    const data = [
      ["Parameter", "Value"],
      ["RUB Amount", inputs.rub],
      ["Mid RUB→USD", inputs.midRubUsd],
      ["Mid USD→KRW", inputs.midUsdKrw],
      ["Mid RUB→KRW", calculations.midRubKrw.toFixed(4)],
      ["P2P RUB→USDT", inputs.p2pRubUsd],
      ["P2P USDT→KRW", inputs.p2pUsdKrw],
      ["P2P Extra Fee (KRW)", inputs.p2pExtraKrw],
      ["Korona RUB→USD", inputs.koronaRubUsd],
      ["E9Pay USD→KRW", inputs.e9payUsdKrw],
      ["E9Pay Fixed Fee (KRW)", inputs.e9payFixedKrw],
      ["Korona SMS Fee (RUB)", inputs.koronaSmsRub],
      ["Ozon Surcharge (%)", inputs.ozonPct],
      ["Apply Ozon", inputs.applyOzon],
      ["", ""],
      ["Results", ""],
      ["Mid-Market KRW Out", calculations.midKrwOut.toFixed(0)],
      ["P2P KRW Out", calculations.p2pKrwOut.toFixed(0)],
      ["Korona+E9Pay KRW Out", calculations.koronaKrwOut.toFixed(0)],
      ["P2P Loss %", calculations.p2pLossPct.toFixed(2)],
      ["Korona Loss %", calculations.koronaLossPct.toFixed(2)],
    ]

    const csv = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "rub-krw-calculator.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copySummary = async () => {
    const summary = `RUB→KRW Transfer Comparison (${inputs.rub.toLocaleString()} RUB)

Mid-Market: ${formatKRW(calculations.midKrwOut)} (${calculations.midEffRate.toFixed(4)} KRW/RUB)
P2P: ${formatKRW(calculations.p2pKrwOut)} (${calculations.p2pEffRate.toFixed(4)} KRW/RUB) - Loss: ${formatPct(calculations.p2pLossPct)}
Korona+E9Pay: ${formatKRW(calculations.koronaKrwOut)} (${calculations.koronaEffRate.toFixed(4)} KRW/RUB) - Loss: ${formatPct(calculations.koronaLossPct)}`

    try {
      await navigator.clipboard.writeText(summary)
    } catch (err) {
      console.error("Failed to copy summary:", err)
    }
  }

  const savedPresets =
    mounted && typeof window !== "undefined" ? JSON.parse(localStorage.getItem("rub-krw-calc:presets") || "{}") : {}

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-colors duration-200`}
    >
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="flex items-center justify-between mb-12 p-4 bg-card/30 backdrop-blur-sm rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/arbitrage-calculator")}
              className="hidden sm:flex items-center gap-2 text-sm font-medium hover:bg-primary/10"
            >
              Arbitrage
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/arbitrage-calculator")}
              className="sm:hidden flex items-center gap-1 text-xs px-2 py-1"
            >
              <Calculator className="h-3 w-3" />
              Arb
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-card/80 rounded-xl border shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ru" : "en")}
                className="font-medium hover:bg-muted/50 text-xs sm:text-sm"
              >
                {language === "en" ? "🇷🇺 RU" : "🇺🇸 EN"}
              </Button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-card/80 rounded-xl border shadow-sm">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label={t.darkMode} />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Global Settings */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {t.global}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg text-sm">
                      {autoFetch ? (
                        <Wifi className={`h-4 w-4 ${isLoading ? "text-blue-500 animate-pulse" : "text-green-500"}`} />
                      ) : (
                        <WifiOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch checked={autoFetch} onCheckedChange={setAutoFetch} size="sm" />
                      <span className="font-medium whitespace-nowrap">
                        {language === "en" ? "Auto-fetch" : "Авто-обновление"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={manualRefresh}
                      disabled={isLoading}
                      className="shadow-sm bg-transparent"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
                {(lastUpdated || fetchError) && (
                  <div className="mt-3 text-sm">
                    {fetchError ? (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        {language === "en" ? "Error:" : "Ошибка:"} {fetchError}
                      </div>
                    ) : lastUpdated ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {language === "en" ? "Last updated:" : "Обновлено:"} {lastUpdated.toLocaleTimeString()}
                      </div>
                    ) : null}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <NumberInput
                    label={t.rubAmount}
                    value={inputs.rub}
                    onChange={(value) => updateInput("rub", value)}
                    unit="₽"
                    min={0}
                  />
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <Label className="text-sm font-medium text-muted-foreground">{t.midRubKrw}</Label>
                    <div className="text-2xl font-bold text-primary mt-1">{calculations.midRubKrw.toFixed(4)} ₩/₽</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <NumberInput
                      label={t.midRubUsd}
                      value={inputs.midRubUsd}
                      onChange={(value) => updateInput("midRubUsd", value)}
                      unit="₽/$"
                      min={0}
                      step={0.1}
                    />
                    {autoFetch && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <NumberInput
                      label={t.midUsdKrw}
                      value={inputs.midUsdKrw}
                      onChange={(value) => updateInput("midUsdKrw", value)}
                      unit="₩/$"
                      min={0}
                      step={0.1}
                    />
                    {autoFetch && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    {t.p2pTitle}
                  </CardTitle>
                  <div
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl border-2 border-dashed text-sm"
                    style={{
                      borderColor: calculations.p2pArbitrageAdvantage ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                      backgroundColor: calculations.p2pArbitrageAdvantage
                        ? "rgb(34, 197, 94, 0.1)"
                        : "rgb(239, 68, 68, 0.1)",
                    }}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${calculations.p2pArbitrageAdvantage ? "text-green-600" : "text-red-600"}`}
                    />
                    <span
                      className={`font-bold ${calculations.p2pArbitrageAdvantage ? "text-green-600" : "text-red-600"}`}
                    >
                      {calculations.p2pArbitrageAdvantage ? "+" : ""}
                      {calculations.p2pArbitragePercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <NumberInput
                    label={t.p2pRubUsd}
                    value={inputs.p2pRubUsd}
                    onChange={(value) => updateInput("p2pRubUsd", value)}
                    unit="₽/$"
                    min={0}
                    step={0.1}
                  />
                  <NumberInput
                    label={t.p2pUsdKrw}
                    value={inputs.p2pUsdKrw}
                    onChange={(value) => updateInput("p2pUsdKrw", value)}
                    unit="₩/$"
                    min={0}
                    step={0.1}
                  />
                </div>
                <NumberInput
                  label={t.p2pExtraKrw}
                  value={inputs.p2pExtraKrw}
                  onChange={(value) => updateInput("p2pExtraKrw", value)}
                  unit="₩"
                  min={0}
                />
                <div className="p-3 sm:p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                  <Label className="text-sm font-medium text-muted-foreground">P2P RUB→KRW Rate</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                    <div className="text-xl sm:text-2xl font-bold text-secondary">
                      {calculations.p2pRubKrw.toFixed(4)} ₩/₽
                    </div>
                    <span
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium self-start ${
                        calculations.p2pArbitrageAdvantage
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                      }`}
                    >
                      {calculations.p2pArbitrageAdvantage ? "+" : ""}
                      {calculations.p2pArbitragePercentage.toFixed(2)}% vs mid
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "P2P KRW→RUB Conversion" : "P2P конвертация KRW→RUB"}
                  </Label>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === "en" ? "P2P Rate:" : "P2P курс:"}</span>
                      <span className="font-mono font-medium text-xs sm:text-sm">
                        {calculations.p2pKrwRub.toFixed(6)} ₽/₩
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === "en" ? "Mid Rate:" : "Средний курс:"}</span>
                      <span className="font-mono font-medium text-xs sm:text-sm">
                        {calculations.midKrwRub.toFixed(6)} ₽/₩
                      </span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {language === "en" ? "From 1,000,000 KRW:" : "Из 1,000,000 KRW:"}
                        </span>
                        <div className="text-right">
                          <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                            {calculations.p2pRubFromKrw.toFixed(0)} ₽
                          </div>
                          <div className="text-xs text-muted-foreground">
                            vs {calculations.midRubFromKrw.toFixed(0)} ₽ (mid)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-muted-foreground">
                          {language === "en" ? "Difference:" : "Разница:"}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            calculations.p2pReverseAdvantage ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {calculations.p2pReverseAdvantage ? "+" : ""}
                          {calculations.p2pReversePercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <NumberInput
                    label={t.koronaRubUsd}
                    value={inputs.koronaRubUsd}
                    onChange={(value) => updateInput("koronaRubUsd", value)}
                    unit="₽/$"
                    min={0}
                    step={0.0001}
                  />
                  <NumberInput
                    label={t.e9payUsdKrw}
                    value={inputs.e9payUsdKrw}
                    onChange={(value) => updateInput("e9payUsdKrw", value)}
                    unit="₩/$"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <NumberInput
                    label={t.e9payFixedKrw}
                    value={inputs.e9payFixedKrw}
                    onChange={(value) => updateInput("e9payFixedKrw", value)}
                    unit="₩"
                    min={0}
                  />
                  <NumberInput
                    label={t.koronaSmsRub}
                    value={inputs.koronaSmsRub}
                    onChange={(value) => updateInput("koronaSmsRub", value)}
                    unit="₽"
                    min={0}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <NumberInput
                    label={t.ozonPct}
                    value={inputs.ozonPct}
                    onChange={(value) => updateInput("ozonPct", value)}
                    unit="%"
                    min={0}
                    step={0.1}
                  />
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-xl">
                    <Switch
                      id="apply-ozon"
                      checked={inputs.applyOzon}
                      onCheckedChange={(checked) => updateInput("applyOzon", checked)}
                    />
                    <Label htmlFor="apply-ozon" className="font-medium">
                      {t.applyOzon}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Cards */}
            <div className="space-y-4 sm:space-y-6">
              <ResultsCard
                title={t.midMarket}
                krwOut={calculations.midKrwOut}
                effRate={calculations.midEffRate}
                lossPct={0}
                lossKrw={0}
                variant="ideal"
              />
              <ResultsCard
                title={t.p2pMethod}
                krwOut={calculations.p2pKrwOut}
                effRate={calculations.p2pEffRate}
                lossPct={calculations.p2pLossPct}
                lossKrw={calculations.p2pLossKrw}
                variant="p2p"
              />
              <ResultsCard
                title={t.koronaMethod}
                krwOut={calculations.koronaKrwOut}
                effRate={calculations.koronaEffRate}
                lossPct={calculations.koronaLossPct}
                lossKrw={calculations.koronaLossKrw}
                variant="korona"
              />
            </div>

            {/* Charts */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Comparison Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonChart
                  midKrwOut={calculations.midKrwOut}
                  p2pKrwOut={calculations.p2pKrwOut}
                  koronaKrwOut={calculations.koronaKrwOut}
                  p2pLossPct={calculations.p2pLossPct}
                  koronaLossPct={calculations.koronaLossPct}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={exportCsv} variant="outline" size="lg" className="shadow-sm bg-transparent text-sm">
                <Download className="h-4 w-4 mr-2" />
                {t.exportCsv}
              </Button>
              <Button onClick={copySummary} variant="outline" size="lg" className="shadow-sm bg-transparent text-sm">
                <Copy className="h-4 w-4 mr-2" />
                {t.copySummary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
