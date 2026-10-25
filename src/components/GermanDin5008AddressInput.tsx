import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wand2,
  Copy,
  Check,
  Building,
  Globe,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  FileText
} from "lucide-react";
import { Din5008AddressData } from "../types";

export interface GermanDin5008AddressInputProps {
  initialAddress?: string;
  initialData?: Partial<Din5008AddressData>;
  onChange: (formattedAddress: string, data: Din5008AddressData) => void;
  className?: string;
}

export const GermanDin5008AddressInput: React.FC<GermanDin5008AddressInputProps> = ({
  initialAddress,
  initialData,
  onChange,
  className = ""
}) => {
  // Preset location modes
  const [locationType, setLocationType] = useState<"iran" | "germany" | "international">(() => {
    if (initialData?.locationType) return initialData.locationType;
    if (initialAddress?.toLowerCase().includes("iran") || initialAddress?.includes("ایران")) return "iran";
    if (initialAddress && /\b\d{5}\b/.test(initialAddress)) return "germany";
    return "iran";
  });

  // Detailed address parts according to DIN 5008
  const [street, setStreet] = useState<string>(() => {
    return initialData?.street || (locationType === "iran" ? "Valiasr Ave. 1420" : "Friedrichstraße 42");
  });

  const [addressAddon, setAddressAddon] = useState<string>(() => {
    return initialData?.addressAddon || "";
  });

  const [plz, setPlz] = useState<string>(() => {
    return initialData?.plz || (locationType === "iran" ? "19979-12345" : "10117");
  });

  const [city, setCity] = useState<string>(() => {
    return initialData?.city || (locationType === "iran" ? "Teheran" : "Berlin");
  });

  const [country, setCountry] = useState<string>(() => {
    return initialData?.country || (locationType === "iran" ? "Iran" : "Deutschland");
  });

  const [relocationNote, setRelocationNote] = useState<string>(() => {
    if (initialData?.relocationNote !== undefined) return initialData.relocationNote;
    return locationType === "iran" ? "Bereit zum Umzug nach Deutschland (Relocation Ready)" : "";
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [showDinGuide, setShowDinGuide] = useState<boolean>(false);

  // Switch location presets
  const handleLocationPreset = (type: "iran" | "germany" | "international") => {
    setLocationType(type);
    if (type === "iran") {
      setStreet("Valiasr Ave. 1420");
      setPlz("19979-12345");
      setCity("Teheran");
      setCountry("Iran");
      setRelocationNote("Bereit zum Umzug nach Deutschland (Relocation Ready)");
    } else if (type === "germany") {
      setStreet("Friedrichstraße 42");
      setPlz("10117");
      setCity("Berlin");
      setCountry("Deutschland");
      setRelocationNote("");
    } else {
      setStreet("Example Road 15");
      setPlz("12345");
      setCity("Dubai");
      setCountry("UAE");
      setRelocationNote("Bereit zum Umzug nach Deutschland (Relocation Ready)");
    }
  };

  // Real-time DIN 5008 Validation Engine
  const validation = useMemo(() => {
    const issues: { id: string; message: string; severity: "error" | "warning"; fixAction?: () => void }[] = [];
    const passed: string[] = [];

    const cleanStreet = street.trim();
    const cleanPlz = plz.trim();
    const cleanCity = city.trim();

    // 1. Street & House Number Check:
    // In German DIN 5008, house number MUST follow the street name: "Musterstraße 12", NOT "12 Musterstraße"
    const startsWithNumberRegex = /^(\d+[a-zA-Z\/\-]?)\s+([a-zA-ZäöüßÄÖÜ\s\.\,\-]+)$/;
    const invertedMatch = cleanStreet.match(startsWithNumberRegex);

    if (invertedMatch) {
      const houseNo = invertedMatch[1];
      const streetName = invertedMatch[2].trim();
      issues.push({
        id: "house_number_order",
        message: `مطابق استاندارد DIN 5008 پلاک باید بعد از نام خیابان بیاید: "${streetName} ${houseNo}"`,
        severity: "error",
        fixAction: () => setStreet(`${streetName} ${houseNo}`)
      });
    } else {
      const endsWithNumberRegex = /\s+(\d+[a-zA-Z\/\-]?).*$/;
      if (!endsWithNumberRegex.test(cleanStreet) && cleanStreet.length > 0) {
        issues.push({
          id: "missing_house_number",
          message: "پلاک ساختمان (Hausnummer) در نام خیابان یافت نشد. لطفا پلاک را در انتهای خیابان درج کنید.",
          severity: "warning"
        });
      } else if (cleanStreet.length > 0) {
        passed.push("ترتیب نام خیابان و پلاک منطبق با DIN 5008 (Straße und Hausnummer)");
      }
    }

    if (!cleanStreet) {
      issues.push({
        id: "street_empty",
        message: "نام خیابان و پلاک وارد نشده است.",
        severity: "error"
      });
    }

    // 2. Postal Code (PLZ) Checks:
    // Check for obsolete country prefix: "D-10115" was abolished by DIN 5008
    const obsoleteCountryPrefixRegex = /^(D|DE|IR|IRN)[\s\-]+(\d+.*)$/i;
    const prefixMatch = cleanPlz.match(obsoleteCountryPrefixRegex);
    if (prefixMatch) {
      const purePlz = prefixMatch[2];
      issues.push({
        id: "obsolete_plz_prefix",
        message: `پیشوند کشور در کد پستی (مانند ${prefixMatch[1]}-) در استاندارد DIN 5008 منسوخ شده است. تنها عدد کد پستی را بنویسید.`,
        severity: "warning",
        fixAction: () => setPlz(purePlz)
      });
    }

    if (locationType === "germany") {
      // Germany strictly requires 5-digit PLZ
      if (!/^\d{5}$/.test(cleanPlz)) {
        issues.push({
          id: "germany_plz_format",
          message: "کد پستی آلمان (PLZ) باید دقیقاً یک عدد ۵ رقمی معتبر باشد (مثال: 10115).",
          severity: "error"
        });
      } else {
        passed.push("کد پستی معتبر ۵ رقمی آلمان (5-stellige deutsche PLZ)");
      }
    } else {
      if (!cleanPlz) {
        issues.push({
          id: "plz_empty",
          message: "کد پستی وارد نشده است.",
          severity: "warning"
        });
      } else {
        passed.push("قالب کد پستی معتبر برای مکاتبات بین‌المللی");
      }
    }

    // 3. City (Ort) Check:
    if (!cleanCity) {
      issues.push({
        id: "city_empty",
        message: "نام شهر وارد نشده است.",
        severity: "error"
      });
    } else if (/\d/.test(cleanCity)) {
      issues.push({
        id: "city_has_digits",
        message: "نام شهر نباید شامل عدد باشد. کد پستی را در کادر مربوط به PLZ وارد کنید.",
        severity: "error"
      });
    } else {
      passed.push("نام شهر استاندارد (Wohnort / Stadt)");
    }

    // 4. Country & Relocation Check:
    if (locationType !== "germany") {
      if (relocationNote) {
        passed.push("عبارت استاندارد آمادگی جابجایی کاری درج شده است (Bereitschaft zum Umzug)");
      } else {
        issues.push({
          id: "recommend_relocation_note",
          message: "توصیه استخدامی: برای متقاضیان خارج از آلمان، درج عبارت آمادگی جابجایی (Relocation Ready) در هدر توصیه می‌شود.",
          severity: "warning",
          fixAction: () => setRelocationNote("Bereit zum Umzug nach Deutschland (Relocation Ready)")
        });
      }
    }

    const hasErrors = issues.some(i => i.severity === "error");
    const hasWarnings = issues.some(i => i.severity === "warning");

    let status: "valid" | "warning" | "incomplete" = "valid";
    if (hasErrors) status = "incomplete";
    else if (hasWarnings) status = "warning";

    return {
      status,
      issues,
      passed,
      isPerfect: issues.length === 0
    };
  }, [street, plz, city, country, locationType, relocationNote]);

  // Generate DIN 5008 Formatted Single-Line & Multi-Line Strings
  const formattedData: Din5008AddressData = useMemo(() => {
    const cleanStreet = street.trim();
    const cleanAddon = addressAddon.trim();
    const cleanPlz = plz.trim().replace(/^(D|DE|IR)[\s\-]+/i, "");
    const cleanCity = city.trim();
    const cleanCountry = country.trim();
    const cleanNote = relocationNote.trim();

    // DIN 5008 Street Line: Street HouseNo, Addon
    let streetLine = cleanStreet;
    if (cleanAddon) {
      streetLine = `${cleanStreet}, ${cleanAddon}`;
    }

    // DIN 5008 City Line: PLZ City
    const cityLine = `${cleanPlz} ${cleanCity}`.trim();

    // Formatted line for CV Header:
    // e.g.: "Valiasr Ave. 1420, 19979-12345 Teheran, Iran (Bereit zum Umzug nach Deutschland)"
    // or Germany: "Friedrichstraße 42, 10117 Berlin, Deutschland"
    const parts: string[] = [];
    if (streetLine) parts.push(streetLine);
    if (cityLine) parts.push(cityLine);
    if (cleanCountry) parts.push(cleanCountry);
    if (cleanNote) parts.push(`(${cleanNote})`);

    const formattedFull = parts.join(", ");

    return {
      street: cleanStreet,
      houseNumber: "",
      plz: cleanPlz,
      city: cleanCity,
      country: cleanCountry,
      addressAddon: cleanAddon,
      relocationNote: cleanNote,
      locationType,
      formattedFull
    };
  }, [street, addressAddon, plz, city, country, relocationNote, locationType]);

  // Keep latest onChange in a ref so changes in callback reference don't trigger the effect
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Track last emitted address string to prevent infinite update depth / loop cycles
  const lastEmittedRef = useRef<string>(initialAddress || "");

  // Propagate changes upstream only when formatted output actually changes
  useEffect(() => {
    if (formattedData.formattedFull && lastEmittedRef.current !== formattedData.formattedFull) {
      lastEmittedRef.current = formattedData.formattedFull;
      onChangeRef.current(formattedData.formattedFull, formattedData);
    }
  }, [formattedData]);

  // Handle Quick Auto-Fix
  const handleAutoFixAll = () => {
    validation.issues.forEach(issue => {
      if (issue.fixAction) {
        issue.fixAction();
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedData.formattedFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-4 rounded-2xl border p-4 sm:p-5 transition-all ${
      validation.isPerfect
        ? "bg-slate-900/90 border-emerald-500/30"
        : validation.status === "warning"
        ? "bg-slate-900/90 border-amber-500/30"
        : "bg-slate-900/90 border-slate-800"
    } ${className}`} dir="rtl">
      
      {/* Header and Compliance Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <MapPin className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                آدرس پستی استاندارد هدر رزومه آلمان (DIN 5008)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                DIN 5008 Norm
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              چیدمان قانونی آدرس، پلاک، کد پستی ۵ رقمی و آمادگی جابجایی کاری
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2">
          {validation.isPerfect ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>انطباق ۱۰۰٪ با DIN 5008</span>
            </span>
          ) : validation.status === "warning" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>نیاز به بهبود جزئی</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>اصلاح الزامات الزامی</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowDinGuide(!showDinGuide)}
            className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded transition"
            title="راهنمای استانداردهای آدرس نویسی DIN 5008"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Location Type Tabs */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => handleLocationPreset("iran")}
          className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
            locationType === "iran"
              ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🇮🇷 مقیم ایران (آماده جابجایی)</span>
        </button>

        <button
          type="button"
          onClick={() => handleLocationPreset("germany")}
          className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
            locationType === "germany"
              ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🇩🇪 ساکن آلمان (PLZ ۵ رقمی)</span>
        </button>

        <button
          type="button"
          onClick={() => handleLocationPreset("international")}
          className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
            locationType === "international"
              ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🌐 سایر کشورها / سفارشی</span>
        </button>
      </div>

      {/* Guided DIN 5008 Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        
        {/* Field 1: Street & House Number */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-slate-300 font-bold flex items-center justify-between">
            <span>نام خیابان و پلاک (Straße und Hausnummer):</span>
            <span className="text-[10px] text-slate-400 font-mono">الزام: پلاک در انتها</span>
          </label>
          <input
            type="text"
            dir="ltr"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder={locationType === "iran" ? "Valiasr Ave. 1420" : "Musterstraße 42"}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

        {/* Field 2: Postal Code (PLZ) */}
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold flex items-center justify-between">
            <span>کد پستی (PLZ):</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {locationType === "germany" ? "۵ رقمی دقیق" : "بدون پیشوند D-"}
            </span>
          </label>
          <input
            type="text"
            dir="ltr"
            value={plz}
            onChange={(e) => setPlz(e.target.value)}
            placeholder={locationType === "germany" ? "10115" : "19979-12345"}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

        {/* Field 3: City (Ort / Stadt) */}
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold">شهر (Wohnort / Stadt):</label>
          <input
            type="text"
            dir="ltr"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={locationType === "iran" ? "Teheran" : "Berlin"}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

        {/* Field 4: Country (Land) */}
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold">کشور (Land):</label>
          <input
            type="text"
            dir="ltr"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Deutschland / Iran"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

        {/* Field 5: Address Addon / c/o (Optional) */}
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold">الحاقات اختیاری (c/o, App.):</label>
          <input
            type="text"
            dir="ltr"
            value={addressAddon}
            onChange={(e) => setAddressAddon(e.target.value)}
            placeholder="مثال: App. 4B یا c/o Müller"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

        {/* Field 6: Relocation Readiness Note */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-slate-300 font-bold flex items-center justify-between">
            <span>آمادگی جابجایی کاری به آلمان:</span>
            <span className="text-[10px] text-emerald-400 font-bold">مزیت استخدام خارجی</span>
          </label>
          <input
            type="text"
            dir="ltr"
            value={relocationNote}
            onChange={(e) => setRelocationNote(e.target.value)}
            placeholder="Bereit zum Umzug nach Deutschland (Relocation Ready)"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder:text-slate-400"
          />
        </div>

      </div>

      {/* Real-time DIN 5008 Diagnostic Feedback & Auto-Fix */}
      {validation.issues.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>هشدارهای اعتبارسنجی استاندارد DIN 5008:</span>
            </span>

            {validation.issues.some(i => i.fixAction) && (
              <button
                type="button"
                onClick={handleAutoFixAll}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>تصحیح خودکار قوانین DIN 5008</span>
              </button>
            )}
          </div>

          <ul className="space-y-1.5 pr-2">
            {validation.issues.map((issue) => (
              <li key={issue.id} className="flex items-center justify-between text-[11px] text-amber-200/90">
                <span className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{issue.message}</span>
                </span>
                {issue.fixAction && (
                  <button
                    type="button"
                    onClick={issue.fixAction}
                    className="text-xs text-sky-400 hover:text-sky-300 underline shrink-0 mr-2 cursor-pointer font-bold"
                  >
                    اعمال اصلاح
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Passed Standards Checklist (When expanding or compliant) */}
      {validation.passed.length > 0 && (
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
          {validation.passed.map((pass, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-medium">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{pass}</span>
            </span>
          ))}
        </div>
      )}

      {/* Live DIN 5008 Header Preview Sheet Box */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>پیش‌نمایش زنده در سربرگ رزومه و انگیزه‌نامه (Header Preview):</span>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "کپی شد" : "کپی آدرس"}</span>
          </button>
        </div>

        {/* Visualized DIN 5008 Address Block */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-200 space-y-0.5 select-all" dir="ltr">
          <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800 flex justify-between">
            <span>DIN 5008 Form A/B Absenderangabe</span>
            <span className="text-emerald-400">{locationType === "iran" ? "International Header" : "Domestic Header"}</span>
          </div>
          <div className="pt-1 text-slate-200">
            {street} {addressAddon ? `, ${addressAddon}` : ""}
          </div>
          <div className="text-slate-300 font-bold">
            {plz} {city}
          </div>
          <div className="text-indigo-400">
            {country} {relocationNote ? `| ${relocationNote}` : ""}
          </div>
        </div>
      </div>

      {/* Collapsible DIN 5008 Norms Educational Guide */}
      {showDinGuide && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 space-y-2">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              <span>نکات کلیدی استاندارد DIN 5008 در ارسال رزومه برای کارفرمایان آلمانی:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowDinGuide(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              بستن
            </button>
          </div>
          <ul className="space-y-1.5 text-[11px] text-indigo-300/90 leading-relaxed list-disc list-inside">
            <li><strong>پلاک بعد از خیابان:</strong> در فرهنگ نگارشی آلمان، شماره ساختمان همواره پس از نام خیابان درج می‌گردد (مثال: <code>Musterstraße 12</code>).</li>
            <li><strong>حذف پیشوند کشور از کد پستی:</strong> بر اساس اصلاحیه استاندارد DIN 5008، نوشتن <code>D-10115</code> غلط بوده و فقط باید عدد ۵ رقمی کد پستی نوشته شود.</li>
            <li><strong>فاصله میان کد پستی و شهر:</strong> بین کد پستی و نام شهر دقیقاً یک فاصله قرار می‌گیرد و از کاما یا خط‌تیره استفاده نمی‌شود (<code>10115 Berlin</code>).</li>
            <li><strong>اعلام آمادگی جابجایی:</strong> برای متقاضیان ایرانی، عبارت <code>Bereit zum Umzug nach Deutschland</code> در سربرگ به مدیر جذب نشان می‌دهد که متقاضی آماده دریافت ویزا و آغاز به کار در آلمان است.</li>
          </ul>
        </div>
      )}

    </div>
  );
};

export default GermanDin5008AddressInput;
