"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Select, TextField } from "@/components/ui";
import { isValid, MIN_DAILY_BUDGET, validateCampaign } from "@/lib/validation";
import { reportError } from "@/lib/monitoring";
import type { FieldErrors, NewCampaignInput } from "@/lib/types";
import styles from "./campaigns.module.css";

const objectives = [
  { value: "awareness", label: "Awareness: reach new shoppers" },
  { value: "consideration", label: "Consideration: drive product page visits" },
  { value: "conversion", label: "Conversion: drive sales" },
];

type FormState = Record<keyof NewCampaignInput, string>;
const empty: FormState = { name: "", objective: "", dailyBudget: "", startDate: "", endDate: "" };

export function CampaignForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(empty);
  const [errors, setErrors] = useState<FieldErrors<NewCampaignInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const found = validateCampaign(values);
    setErrors(found);
    if (!isValid(found)) {
      // Move focus to the error summary so screen reader and keyboard users know what to fix.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, dailyBudget: Number(values.dailyBudget) }),
      });
      if (res.status === 422) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        return;
      }
      if (!res.ok) throw new Error(`Create campaign failed: ${res.status}`);
      onCreated?.();
      router.push("/campaigns");
      router.refresh();
    } catch (err) {
      reportError(err, { component: "CampaignForm" });
      setServerError("We couldn't save your campaign. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const errorList = Object.entries(errors) as [keyof NewCampaignInput, string][];

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {errorList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className={styles.errorSummary}>
            <h2 className={styles.h2}>Fix {errorList.length} {errorList.length === 1 ? "problem" : "problems"} to continue</h2>
            <ul>{errorList.map(([field, msg]) => <li key={field}>{msg}</li>)}</ul>
          </div>
        )}
        {serverError && <p role="alert" className={styles.errorSummary}>{serverError}</p>}

        <TextField label="Campaign name" name="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={120} autoComplete="off" />
        <Select label="Objective" name="objective" options={objectives} placeholder="Choose an objective" value={values.objective} onChange={set("objective")} error={errors.objective} />
        <TextField label="Daily budget (USD)" name="dailyBudget" type="number" inputMode="decimal" min={MIN_DAILY_BUDGET} step="1" hint={`Minimum $${MIN_DAILY_BUDGET} per day.`} value={values.dailyBudget} onChange={set("dailyBudget")} error={errors.dailyBudget} />
        <div className={styles.row}>
          <TextField label="Start date" name="startDate" type="date" value={values.startDate} onChange={set("startDate")} error={errors.startDate} />
          <TextField label="End date" name="endDate" type="date" value={values.endDate} onChange={set("endDate")} error={errors.endDate} />
        </div>

        <div className={styles.actions}>
          <Button type="submit" loading={submitting}>Create campaign</Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/campaigns")}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
