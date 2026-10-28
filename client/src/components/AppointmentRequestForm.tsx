import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { ArrowRight, CircleCheck, Info, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PHONE_DISPLAY } from "@/lib/phone";
import {
  APPOINTMENT_SMS_CONSENT,
  MARKETING_SMS_CONSENT,
  SMS_CONSENT_VERSION,
  type AppointmentRequest,
} from "@/lib/appointment-request";

interface FormProps {
  // Supply an approved server/CRM adapter. A missing adapter never fakes delivery.
  submitRequest?: (
    request: AppointmentRequest
  ) => Promise<{ requestId: string }>;
}

export default function AppointmentRequestForm({ submitRequest }: FormProps) {
  const [appointmentConsent, setAppointmentConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    const form = event.currentTarget;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const digits = phoneInput.value.replace(/\D/g, "");
    const nationalNumber =
      digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    phoneInput.setCustomValidity(
      /^[2-9]\d{2}[2-9]\d{6}$/.test(nationalNumber)
        ? ""
        : "Please enter a valid 10-digit U.S. phone number."
    );
    const nameInput = form.elements.namedItem("fullName") as HTMLInputElement;
    nameInput.setCustomValidity(
      nameInput.value.trim() ? "" : "Please enter your full name."
    );
    if (!form.reportValidity()) return;

    if (!submitRequest) {
      setStatus("error");
      setNotice(
        `No request has been sent. Online submission is not active yet. Please call ${PHONE_DISPLAY} or use the practice’s online scheduling link below.`
      );
      return;
    }

    const data = new FormData(form);
    // Inquiry details remain in form memory only. Never put them in analytics or browser storage.
    const request: AppointmentRequest = {
      fullName: String(data.get("fullName") ?? "").trim(),
      phone: `+1${nationalNumber}`,
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      appointmentSmsConsent: appointmentConsent,
      marketingSmsConsent: marketingConsent,
      consentVersion: SMS_CONSENT_VERSION,
      appointmentConsentText: APPOINTMENT_SMS_CONSENT,
      marketingConsentText: MARKETING_SMS_CONSENT,
      sourcePath: window.location.pathname + window.location.search,
      clientSubmittedAt: new Date().toISOString(),
      website: String(data.get("website") ?? ""),
    };
    setStatus("pending");
    setNotice("");
    try {
      const receipt = await submitRequest(request);
      if (!receipt.requestId) throw new Error("No delivery receipt");
      setStatus("success");
      setNotice(
        "Your appointment request was received. The Southfield team will contact you to confirm a time. This is a request, not a confirmed appointment."
      );
      form.reset();
      setAppointmentConsent(false);
      setMarketingConsent(false);
    } catch {
      setStatus("error");
      setNotice(
        `We could not confirm delivery of your request. Please call ${PHONE_DISPLAY} or use the online scheduling link below. Your form entries have been kept so you can try again.`
      );
    }
  }

  const fieldClass =
    "min-h-12 rounded-xl border-plum/20 bg-white px-3 py-3 text-base md:text-base focus-visible:border-orchid focus-visible:ring-orchid/20";

  return (
    <form
      // Stable identifiers for WhatConverts form tracking and GA4 form events.
      id="appointment-request-form"
      name="appointment-request-form"
      aria-label="Request an Appointment"
      onSubmit={handleSubmit}
      // Keep patient entries out of Clarity session recordings.
      data-clarity-mask="true"
      className="manus-no-record mt-6 space-y-5"
    >
      {!submitRequest && (
        <div
          className="flex gap-2 rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm leading-6 text-plum"
          role="note"
        >
          <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Online submission is not active yet. Please call or use the
            practice’s online scheduling link below to request an appointment.
          </p>
        </div>
      )}
      <p className="text-xs text-ink/65">
        Full Name, Phone, and Email are required. Message and both text-message
        choices are optional.
      </p>
      {/* Honeypot for bots. Off-screen, unlabeled for assistive tech, and skipped by Tab. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          data-wc-ignore="true"
          defaultValue=""
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="appointment-full-name"
          className="block text-sm font-bold text-plum"
        >
          Full Name
        </label>
        <Input
          id="appointment-full-name"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          className={fieldClass}
          onInput={event => event.currentTarget.setCustomValidity("")}
          disabled={status === "pending"}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="appointment-phone"
            className="block text-sm font-bold text-plum"
          >
            Phone
          </label>
          <Input
            id="appointment-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={30}
            className={fieldClass}
            onInput={event => event.currentTarget.setCustomValidity("")}
            disabled={status === "pending"}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="appointment-email"
            className="block text-sm font-bold text-plum"
          >
            Email
          </label>
          <Input
            id="appointment-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={fieldClass}
            disabled={status === "pending"}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="appointment-message"
          className="block text-sm font-bold text-plum"
        >
          Message
        </label>
        <Textarea
          id="appointment-message"
          name="message"
          rows={3}
          maxLength={2000}
          className={`${fieldClass} min-h-28 resize-y`}
          aria-describedby="appointment-message-help"
          disabled={status === "pending"}
        />
        <p
          id="appointment-message-help"
          className="text-xs leading-5 text-ink/65"
        >
          Share your preferred appointment time or a general question. Do not
          include medical records, insurance identifiers, or payment details.
          This form is not for emergencies.
        </p>
      </div>
      <fieldset
        className="space-y-3 rounded-2xl border border-plum/10 bg-cream p-4"
        disabled={status === "pending"}
      >
        <legend className="px-1 text-sm font-bold text-plum">
          Text-message preferences (optional)
        </legend>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-6 text-ink/75 sm:text-sm">
          <input
            type="checkbox"
            name="appointmentSmsConsent"
            value="yes"
            checked={appointmentConsent}
            onChange={event => setAppointmentConsent(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#35113d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
          />
          <span>
            <span className="mb-1 block font-bold text-plum">
              Appointment texts
            </span>
            {APPOINTMENT_SMS_CONSENT}
          </span>
        </label>
        <div className="border-t border-plum/10 pt-3">
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-6 text-ink/75 sm:text-sm">
            <input
              type="checkbox"
              name="marketingSmsConsent"
              value="yes"
              checked={marketingConsent}
              onChange={event => setMarketingConsent(event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#35113d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
            />
            <span>
              <span className="mb-1 block font-bold text-plum">
                Promotional texts
              </span>
              {MARKETING_SMS_CONSENT}
            </span>
          </label>
        </div>
        <p className="border-t border-plum/10 pt-3 text-xs leading-5 text-ink/75">
          Neither checkbox is required to request an appointment or purchase
          services. Leaving both unchecked does not enroll you in text messages.
          For assistance, call {PHONE_DISPLAY}.
        </p>
      </fieldset>
      <p className="text-xs leading-6 text-ink/70">
        Please review our{" "}
        <Link
          href="/terms-of-service/"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-orchid underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy/"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-orchid underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        . These links do not enroll you in SMS. SMS opt-in data is not sold or
        shared for third-party marketing.
      </p>
      {notice && (
        <div
          role={status === "success" ? "status" : "alert"}
          className={`flex gap-2 rounded-xl border p-4 text-sm leading-6 ${status === "success" ? "border-plum/20 bg-mist text-plum" : "border-amber/50 bg-amber/10 text-plum"}`}
        >
          {status === "success" ? (
            <CircleCheck className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <p>{notice}</p>
        </div>
      )}
      <button
        type="submit"
        className="button-secondary min-h-12 w-full !text-sm normal-case disabled:cursor-wait disabled:opacity-60"
        disabled={status === "pending"}
      >
        {status === "pending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{" "}
            Sending request…
          </>
        ) : (
          <>
            Request an Appointment{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-center text-xs leading-5 text-ink/65">
        A request is not a confirmed appointment. The office will confirm your
        time after receiving your request.
      </p>
    </form>
  );
}
