import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react";
import { Link } from "wouter";
import { PHONE_DISPLAY as PHONE, PHONE_HREF } from "@/lib/phone";

const PRACTICE = "Southfield Family Dental Center";
const EMAIL = "Southfield.om@guardiandentistry.com";
const UPDATED = "October 28, 2026";

interface PolicySection {
  id: string;
  title: string;
  content: ReactNode;
}

const contact = (
  <>
    <p>
      For questions about this policy, contact {PRACTICE} at 18800 West 10 Mile
      Road, Southfield, MI 48075.
    </p>
    <p>
      Call <a href={PHONE_HREF}>{PHONE}</a> or email{" "}
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Please do not include sensitive
      health information in ordinary email or a general appointment inquiry.
    </p>
  </>
);

const termsSections: PolicySection[] = [
  {
    id: "informational-use",
    title: "Information, not individual dental advice",
    content: (
      <>
        <p>
          This website provides general information and education about dental
          implants, full-arch treatment, restoration materials, and services
          offered by {PRACTICE}. It is not a diagnosis, an individual treatment
          recommendation, or a substitute for an examination and advice from a
          licensed dental or medical professional.
        </p>
        <p>
          Browsing the site, watching a video, calling with questions, or
          requesting a consultation does not by itself establish a
          doctor-patient relationship. Never disregard professional advice or
          delay seeking care because of something you read here. For a medical
          emergency, call 911. For an urgent dental concern, call the practice;
          after hours, follow the phone system’s emergency instructions.
        </p>
      </>
    ),
  },
  {
    id: "results-and-images",
    title: "Treatment results, testimonials, and images",
    content: (
      <>
        <p>
          Treatment results and timelines vary. Patient testimonials describe
          individual experiences, and before-and-after photographs show
          individual cases. They do not promise that another patient will have
          the same appearance, comfort, healing time, or outcome.
        </p>
        <p>
          The site includes practice-supplied patient cases and attributed
          patient stories. Other lifestyle or product images may be
          illustrative, including generated imagery, rather than a photograph of
          a specific patient or the exact restoration a patient will receive.
          Review ratings and counts reflect the information available when
          updated and can change.
        </p>
        <p>
          “Teeth in a Day” describes a treatment approach that can provide fixed
          acrylic teeth on treatment day. It does not mean that every patient
          receives final zirconia that day. Your dental team will explain the
          sequence and timing for your care.
        </p>
      </>
    ),
  },
  {
    id: "offers-and-warranty",
    title: "Pricing, financing, and warranty terms",
    content: (
      <>
        <p>
          Advertised full-arch pricing is per arch, not automatically for both
          the upper and lower arches. The $14,990 option finishes with PMMA
          acrylic teeth. The $17,990 option includes PMMA during healing
          followed by a final zirconia bridge. IV sedation is optional and
          quoted separately. Review your treatment plan for the services and
          fees that apply to your care. Offers and pricing may change.
        </p>
        <p>
          Financing examples are illustrations, not a credit approval or a
          promise of a particular payment, rate, or loan amount. Approval and
          terms are determined by the financing provider. Insurance coverage and
          out-of-pocket costs depend on your plan and benefits.
        </p>
        <p>
          The advertised lifetime zirconia bridge warranty requires prescribed
          maintenance and is governed by the practice’s written coverage,
          exclusions, and other terms. No dental material is unbreakable. The
          website disclaimer below does not replace or cancel a separately
          provided written treatment warranty.
        </p>
      </>
    ),
  },
  {
    id: "website-and-links",
    title: "Website accuracy and third-party services",
    content: (
      <>
        <p>
          We make reasonable efforts to keep this site accurate and current.
          However, website content is provided “as is” and “as available.” To
          the extent permitted by law, the practice, its clinicians, employees,
          and affiliates disclaim implied warranties regarding website
          information and operation, including accuracy, completeness,
          uninterrupted availability, and fitness for a particular purpose.
        </p>
        <p>
          We cannot guarantee that the website or downloadable files will always
          be error-free or free of harmful components. To the extent permitted
          by law, we are not responsible for loss arising solely from reliance
          on website information or interruption of the website. Nothing here
          limits rights or responsibilities that cannot lawfully be excluded.
        </p>
        <p>
          Linked booking, financing, video, and map services are operated by
          third parties. Their terms and privacy policies apply when you use
          them. A link does not make the practice responsible for the third
          party’s content, availability, or practices.
        </p>
      </>
    ),
  },
  {
    id: "sms-program",
    title: "Text-message program terms",
    content: (
      <>
        <p>
          The Southfield Family Dental Center messaging program offers
          appointment request follow-up, scheduling, confirmations, and
          reminders to people who separately opt in to appointment texts.
          Promotional messages about dental services and special offers require
          a separate promotional-text opt-in. Either type may use automated
          technology. Message frequency varies. Message and data rates may
          apply.
        </p>
        <p>
          Both consent choices are optional and unchecked by default. You may
          request an appointment or purchase services without consenting to
          either messaging program. An inquiry, a phone number, or acceptance of
          these terms alone does not enroll you in SMS.
        </p>
        <p>
          <strong>Reply STOP to unsubscribe from the messaging program.</strong>{" "}
          You may receive a confirmation of your opt-out. To re-enroll, follow
          the program’s instructions and provide a new opt-in.{" "}
          <strong>Reply HELP for help</strong> or contact the office at{" "}
          <a href={PHONE_HREF}>{PHONE}</a> or{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <p>
          Carriers are not liable for any delayed or undelivered messages. Texts
          are not an emergency service. For a medical emergency, call 911; for
          an urgent dental concern, call the office. Read our{" "}
          <Link href="/privacy-policy/">Privacy Policy</Link> for information
          about messaging data. Enrollment and messaging begin only after an
          active submission and messaging service receives and records your
          opt-in.
        </p>
      </>
    ),
  },
  {
    id: "scope-and-contact",
    title: "Scope, updates, and contact",
    content: (
      <>
        <p>
          These Terms of Service apply to all pages of this campaign website. We
          may update them as the site or services change; the last-updated date
          will appear at the top. For information about website data handling,
          read our <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
        {contact}
      </>
    ),
  },
];

const privacySections: PolicySection[] = [
  {
    id: "policy-scope",
    title: "Our commitment and this policy’s scope",
    content: (
      <>
        <p>
          {PRACTICE} respects your privacy. This policy explains how information
          is handled when you visit this full-arch campaign website, contact our
          office through its links, or use the linked appointment service.
        </p>
        <p>
          This is a website privacy policy, not the practice’s Notice of Privacy
          Practices for patient health records. Ask the office for that notice
          and information about your health-record privacy rights.
        </p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Information you provide and website activity",
    content: (
      <>
        <p>
          You can browse this landing page without submitting information. The
          appointment request form asks for Full Name, Phone, Email, and an
          optional Message, along with separate optional appointment-text and
          promotional-text consent choices. You may also provide information
          when calling, emailing, or using the linked scheduler, which processes
          entries under its own policies.
        </p>
        <p>
          When you submit the appointment form, your entries are sent by email
          to the practice’s marketing service provider, which shares them with
          the practice so the team can contact you, and a confirmation is
          emailed to the address you provide. Each request records your separate
          text-message choices, the disclosure version shown, and the date and
          page of submission. These records are used to honor and document your
          communication preferences, not to assume consent you did not give.
          Form entries are not saved to browser storage. Our call and lead
          tracking provider may also receive form entries to attribute the
          inquiry to the advertising source that led to it.
        </p>
        <p>
          Hosting and analytics services may process technical information such
          as browser and device type, IP address, pages visited, referring page,
          and approximate location derived from network information. The site’s
          conversion events record interactions such as a call-button click,
          scheduling-link click, video opening, or case-gallery selection. These
          event hooks do not include the name, email, phone number, or health
          details entered in an appointment inquiry.
        </p>
      </>
    ),
  },
  {
    id: "information-use",
    title: "How information is used and shared",
    content: (
      <>
        <p>
          Inquiry information is used to respond to questions, help arrange
          appointments, provide requested information, and support office
          operations. Website activity helps us understand use of the site,
          improve its performance, and measure campaign engagement.
        </p>
        <p>
          We do not sell or rent the contact information you provide in an
          inquiry. Information may be handled by authorized practice staff and
          service providers assisting with scheduling, communications, hosting,
          analytics, or campaign support, as needed to perform those services.
          We may also disclose information when required by law or necessary to
          protect rights, safety, or security.
        </p>
        <p>
          Providing an appointment inquiry is not, by itself, consent to
          unrelated marketing. Where marketing communications require consent,
          that consent should be requested separately.
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-services",
    title: "Analytics, browser storage, and third-party services",
    content: (
      <>
        <p>
          This site uses Google Analytics to measure site traffic and campaign
          performance, and WhatConverts to attribute phone calls and inquiries
          to the advertising source that led to them. To do this, the site may
          display a tracking phone number that forwards to the practice. The
          site also uses Microsoft Clarity, which records how visitors scroll,
          click, and move through the page so the practice can improve it.
          Clarity is configured not to capture what you type into the
          appointment form. These services may set cookies or use browser
          storage. Browser storage
          may also be used for site preferences. The current landing page does
          not contain live chat. Additional advertising or remarketing tools, if
          introduced, should be reflected in an updated policy and any required
          consent controls.
        </p>
        <p>
          Google Fonts supplies the website fonts. Opening a testimonial loads a
          Google Drive video player. Clicking a scheduling or directions link
          takes you to a third-party service, including TrueLark or Google Maps.
          Those providers may receive technical information and use cookies or
          similar technologies under their own policies. Embedded video is
          loaded when you open its player, rather than solely from viewing its
          thumbnail.
        </p>
        <p>
          You can manage cookies and browser storage in your browser settings.
          Blocking some services may affect fonts, video playback, or
          scheduling. For Google’s advertising privacy choices, visit{" "}
          <a
            href="https://myadcenter.google.com/"
            target="_blank"
            rel="noreferrer"
          >
            Google My Ad Center
          </a>
          . That link is provided as a privacy resource; it does not mean every
          Google advertising product is installed on this site.
        </p>
      </>
    ),
  },
  {
    id: "communications",
    title: "Email and text-message choices",
    content: (
      <>
        <p>
          If you receive promotional email from the practice, use its
          unsubscribe option or contact the office to opt out.
          Appointment-related and other requested service messages may be
          handled separately from promotional communications.
        </p>
        <p>
          Appointment texts and promotional texts have separate optional,
          unchecked consent boxes. If you opt in, message frequency varies and
          message and data rates may apply. Reply STOP to unsubscribe or HELP
          for assistance, or contact the office directly. Consent to either type
          of text is not a condition of requesting an appointment or purchasing
          services. See the messaging program in our{" "}
          <Link href="/terms-of-service/#sms-program">Terms of Service</Link>.
        </p>
        <p>
          Mobile information and text-message opt-in or consent data are not
          shared with third parties or affiliates for their marketing or
          promotional purposes. Support providers may process this information
          only as needed to deliver the practice’s communications and support
          services, not for their independent marketing.
        </p>
        <p>
          We do not sell or share your SMS opt-in data or personal information
          with third parties for marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: "security-and-rights",
    title: "Security, retention, and your requests",
    content: (
      <>
        <p>
          We use reasonable safeguards appropriate to the information and
          services involved. No website, email system, or internet transmission
          can be guaranteed completely secure. Do not send medical records,
          insurance identifiers, payment details, or other sensitive information
          through ordinary email or a general inquiry. Ask the office for an
          appropriate channel.
        </p>
        <p>
          Information is retained as needed for inquiries, appointments,
          operational purposes, and applicable legal or recordkeeping
          obligations. You may contact us to request access to, correction of,
          or deletion of inquiry information, or to ask about available privacy
          choices. Requests may require identity verification and may be subject
          to legal exceptions and required retention. Rights under applicable
          privacy laws are not limited by this policy.
        </p>
        <p>
          This campaign site is directed to adults seeking dental information,
          not to children under 13. If you believe a child has submitted
          personal information through a site-linked service without appropriate
          permission, contact the office so the matter can be addressed.
        </p>
      </>
    ),
  },
  {
    id: "updates-and-contact",
    title: "Policy updates and contact",
    content: (
      <>
        <p>
          We may update this policy to reflect changes in the site, services, or
          applicable requirements. The last-updated date appears at the top of
          this page. Review the policy when using new features or submitting an
          inquiry.
        </p>
        {contact}
      </>
    ),
  },
];

function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: PolicySection[];
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const oldTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const oldDescription = description?.content;
    const ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]'
    );
    const oldOgTitle = ogTitle?.content;
    const ogDescription = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    const oldOgDescription = ogDescription?.content;
    document.title = `${title} | ${PRACTICE}`;
    if (description) description.content = intro;
    if (ogTitle) ogTitle.content = document.title;
    if (ogDescription) ogDescription.content = intro;
    const section = document.getElementById(window.location.hash.slice(1));
    if (section) {
      section.scrollIntoView({ behavior: "instant", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    }
    return () => {
      document.title = oldTitle;
      if (description && oldDescription !== undefined)
        description.content = oldDescription;
      if (ogTitle && oldOgTitle !== undefined) ogTitle.content = oldOgTitle;
      if (ogDescription && oldOgDescription !== undefined)
        ogDescription.content = oldOgDescription;
    };
  }, [title, intro]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#policy-content"
        className="sr-only z-50 rounded-lg bg-plum px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to policy content
      </a>
      <header className="border-b border-plum/10 bg-white">
        <div className="container flex min-h-[88px] flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/" aria-label="Southfield Family Dental Center home">
            <img
              src="/images/logo_849d8385.png"
              alt={PRACTICE}
              className="h-[46px] w-auto sm:h-[52px]"
            />
          </Link>
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-bold text-white transition hover:bg-orchid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
          >
            <Phone className="h-4 w-4" aria-hidden="true" /> {PHONE}
          </a>
        </div>
      </header>
      <main id="policy-content" className="container py-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-orchid hover:text-plum"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the
          full-arch page
        </Link>
        <div className="mt-5 max-w-3xl">
          <p className="eyebrow text-orchid">Southfield Family Dental Center</p>
          <h1
            ref={heading}
            tabIndex={-1}
            className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-plum outline-none sm:text-6xl"
          >
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/70 sm:text-lg">
            {intro}
          </p>
          <p className="mt-4 text-sm text-ink/60">Last updated: {UPDATED}</p>
        </div>
        <div className="mt-8 grid items-start gap-6 lg:mt-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <nav
            aria-label={`${title} sections`}
            className="rounded-2xl border border-plum/10 bg-white p-5 lg:sticky lg:top-6"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-orchid">
              On this page
            </p>
            <ol className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-11 items-start gap-2 rounded-lg px-2 py-2 text-sm leading-6 text-plum transition hover:bg-mist focus-visible:outline-2 focus-visible:outline-orchid"
                  >
                    <span className="text-orchid">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="min-w-0 rounded-3xl border border-plum/10 bg-white p-5 shadow-[0_16px_50px_rgba(53,17,61,0.04)] sm:p-9 lg:p-12 [&_a]:break-words [&_a]:font-semibold [&_a]:text-orchid [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-plum [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-orchid">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-6 border-plum/10 not-first:mt-8 not-first:border-t not-first:pt-8 sm:not-first:mt-10 sm:not-first:pt-10"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-orchid">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold leading-snug text-plum sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-ink/75">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <footer className="mt-8 bg-[#1c0d20] py-8 text-white">
        <div className="container flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold">{PRACTICE}</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              18800 West 10 Mile Road · Southfield, MI 48075
            </p>
          </div>
          <nav
            aria-label="Footer legal links"
            className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm"
          >
            <Link
              href="/terms-of-service/"
              aria-current={title === "Terms of Service" ? "page" : undefined}
              className="inline-flex min-h-11 items-center hover:text-amber aria-[current=page]:text-amber"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              aria-current={title === "Privacy Policy" ? "page" : undefined}
              className="inline-flex min-h-11 items-center hover:text-amber aria-[current=page]:text-amber"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-1 hover:text-amber"
            >
              Home <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function TermsOfService() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="Important information about this website, dental treatment, patient results, and advertised offers."
      sections={termsSections}
    />
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="How Southfield Family Dental Center handles website activity, appointment inquiries, and communication preferences."
      sections={privacySections}
    />
  );
}
