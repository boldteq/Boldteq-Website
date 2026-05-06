export type LegalNode =
  | { type: "p"; html: string }
  | { type: "h4"; text: string }
  | { type: "ul"; items: string[] };

export interface LegalSection {
  heading: string;
  nodes: LegalNode[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "April 2026",
  sections: [
    {
      heading: "Overview",
      nodes: [
        {
          type: "p",
          html: "At Boldteq, your privacy is not a formality — it&rsquo;s a commitment. We are a white-label web design and development platform built for digital agencies. This Privacy Policy explains what information we collect, how we use it, and the choices you have. We encourage you to read it fully. By using boldteq.com or any of our services (including our Client Portal at portal.boldteq.com), you agree to the practices described in this policy.",
        },
      ],
    },
    {
      heading: "1. Who We Are",
      nodes: [
        {
          type: "p",
          html: "Boldteq is a delivery infrastructure service for digital agencies. We provide white-label web development, UI/UX design, and graphic design services through a subscription-based model. Our registered business operates from India.",
        },
        { type: "p", html: "If you have questions about this policy, contact us at:" },
        {
          type: "p",
          html: '<strong>📧&nbsp;&nbsp;</strong><a href="mailto:support@boldteq.com">support@boldteq.com</a>',
        },
        {
          type: "p",
          html: '<strong>🌐</strong>&nbsp;&nbsp;<a href="https://boldteq.com/contact">https://boldteq.com/contact</a>',
        },
      ],
    },
    {
      heading: "2. Information We Collect",
      nodes: [
        { type: "h4", text: "2.1 Information You Provide to Us" },
        {
          type: "p",
          html: "When you sign up, schedule a demo, or interact with our platform, we may collect:",
        },
        {
          type: "ul",
          items: [
            "Full name and professional title",
            "Business name and agency details",
            "Email address and phone number",
            "Billing and payment information (processed securely via third-party payment processors)",
            "Project briefs, task descriptions, files, and feedback you submit through our platform",
            "Messages and communications sent via our Smart Client Workspace",
          ],
        },
        { type: "h4", text: "2.2 Information We Collect Automatically" },
        {
          type: "p",
          html: "When you visit our website or use our platform, we may automatically collect:",
        },
        {
          type: "ul",
          items: [
            "IP address and approximate location",
            "Browser type, device type, and operating system",
            "Pages visited, time spent, and click stream data",
            "Referral URLs and traffic sources",
            "Cookies and similar tracking technologies",
          ],
        },
        { type: "h4", text: "2.3 Information from Third Parties" },
        { type: "p", html: "We may receive information about you from:" },
        {
          type: "ul",
          items: [
            "Payment processors (e.g., Stripe) — transaction status, not full card details",
            "Analytics providers (e.g., Google Analytics) — aggregated usage data",
            "Marketing platforms — if you interact with our campaigns or newsletter",
          ],
        },
      ],
    },
    {
      heading: "3. How We Use Your Information",
      nodes: [
        { type: "p", html: "We use the information we collect for the following purposes:" },
        {
          type: "ul",
          items: [
            "To create and manage your account on our platform",
            "To deliver and improve our web development and design services",
            "To process payments and manage subscription billing",
            "To communicate with you about your requests, tasks, and account",
            "To send product updates, newsletters, or promotional content (with your consent)",
            "To analyze platform usage and improve our services",
            "To detect and prevent fraud, misuse, or security incidents",
            "To comply with applicable legal obligations",
          ],
        },
        {
          type: "p",
          html: "We do not sell your personal information to third parties. We do not use your data to train AI models or share it with advertising networks.",
        },
      ],
    },
    {
      heading: "4. Legal Basis for Processing (GDPR)",
      nodes: [
        {
          type: "p",
          html: "If you are located in the European Economic Area (EEA), our legal basis for collecting and using your information includes:",
        },
        {
          type: "ul",
          items: [
            "Performance of a contract — to deliver the services you have subscribed to",
            "Legitimate interests — to improve our platform, ensure security, and communicate with users",
            "Consent — for marketing communications and non-essential cookies",
            "Legal obligation — to comply with applicable laws and regulations",
          ],
        },
      ],
    },
    {
      heading: "5. How We Share Your Information",
      nodes: [
        { type: "p", html: "We only share your information in the following circumstances:" },
        { type: "h4", text: "5.1 Service Providers" },
        {
          type: "p",
          html: "We work with trusted third-party vendors to operate our business. These partners are contractually obligated to protect your data and may only use it to provide services on our behalf. Examples include:",
        },
        {
          type: "ul",
          items: [
            "Cloud hosting and infrastructure providers",
            "Payment processors (Stripe or equivalent)",
            "Email communication tools",
            "Analytics and product monitoring services",
          ],
        },
        { type: "h4", text: "5.2 White-Label Confidentiality" },
        {
          type: "p",
          html: "Boldteq operates as a white-label backend. Client project details, brand assets, and end-client data you share with us are treated as strictly confidential. We do not disclose them to third parties or use them for any purpose outside of completing your requested work.",
        },
        { type: "h4", text: "5.3 Legal Requirements" },
        {
          type: "p",
          html: "We may disclose your information if required by law, court order, or government authority, or if we believe disclosure is necessary to protect the rights, safety, or property of Boldteq, our users, or the public.",
        },
        { type: "h4", text: "5.4 Business Transfers" },
        {
          type: "p",
          html: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity. We will notify you via email or a notice on our website before any such transfer occurs.",
        },
      ],
    },
    {
      heading: "6. Cookies & Tracking Technologies",
      nodes: [
        {
          type: "p",
          html: "We use cookies and similar technologies to improve your experience on our website. These include:",
        },
        {
          type: "ul",
          items: [
            "Essential cookies — necessary for the website and portal to function correctly",
            "Analytics cookies — help us understand how visitors use our site (e.g., Google Analytics)",
            "Marketing cookies — used to deliver relevant content (only with your consent)",
          ],
        },
        {
          type: "p",
          html: "You can manage your cookie preferences at any time through your browser settings or our cookie consent banner. Note that disabling essential cookies may affect platform functionality.",
        },
      ],
    },
    {
      heading: "7. Data Retention",
      nodes: [
        {
          type: "p",
          html: "We retain your personal data for as long as your account is active or as needed to provide our services. Specifically:",
        },
        {
          type: "ul",
          items: [
            "Account data is retained for the duration of your subscription and up to 2 years after account closure",
            "Project files and task data are retained for 12 months after project completion, unless you request earlier deletion",
            "Financial records are retained for 7 years to comply with tax and legal requirements",
            "Marketing communication data is retained until you unsubscribe",
          ],
        },
      ],
    },
    {
      heading: "8. Data Security",
      nodes: [
        {
          type: "p",
          html: "We take the security of your data seriously. Our practices include:",
        },
        {
          type: "ul",
          items: [
            "Encryption of data in transit using TLS/SSL",
            "Secure access controls and authentication for platform users",
            "Regular security assessments and monitoring",
            "Limited employee access to personal data on a need-to-know basis",
          ],
        },
        {
          type: "p",
          html: 'While we implement strong security measures, no method of electronic transmission or storage is 100% secure. If you suspect unauthorized access, please contact us immediately at <a href="mailto:support@boldteq.com">support@boldteq.com</a>.',
        },
      ],
    },
    {
      heading: "9. Your Rights & Choices",
      nodes: [
        {
          type: "p",
          html: "Depending on your location, you may have the following rights regarding your personal data:",
        },
        {
          type: "ul",
          items: [
            "Access — Request a copy of the data we hold about you",
            "Correction — Request correction of inaccurate or incomplete data",
            "Deletion — Request deletion of your personal data (subject to legal obligations)",
            "Portability — Request transfer of your data to another service",
            "Objection — Object to certain uses of your data (e.g., marketing)",
            "Withdraw consent — Unsubscribe from marketing emails at any time",
          ],
        },
        {
          type: "p",
          html: 'To exercise any of these rights, please email us at <a href="mailto:support@boldteq.com">support@boldteq.com</a>. We will respond within 30 days. We may ask you to verify your identity before processing your request.',
        },
      ],
    },
    {
      heading: "10. International Data Transfers",
      nodes: [
        {
          type: "p",
          html: "Boldteq operates from India and serves clients globally. If you are located in the EEA, UK, or other jurisdictions with data transfer restrictions, we ensure that appropriate safeguards are in place when your data is transferred internationally (e.g., Standard Contractual Clauses where applicable).",
        },
      ],
    },
    {
      heading: "11. Children's Privacy",
      nodes: [
        {
          type: "p",
          html: "Our services are intended exclusively for businesses and professionals. We do not knowingly collect personal information from individuals under the age of 18. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it promptly.",
        },
      ],
    },
    {
      heading: "12. Changes to This Policy",
      nodes: [
        {
          type: "p",
          html: "We may update this Privacy Policy from time to time. When we make material changes, we will:",
        },
        {
          type: "ul",
          items: [
            "Update the 'Last Updated' date at the top of this page",
            "Notify active subscribers by email",
            "Post a banner on our website for 30 days following the update",
          ],
        },
        {
          type: "p",
          html: "Your continued use of our services after changes take effect constitutes acceptance of the updated policy.",
        },
      ],
    },
    {
      heading: "13. Contact Us",
      nodes: [
        {
          type: "p",
          html: "If you have questions, concerns, or requests related to this Privacy Policy, please reach out:",
        },
        { type: "p", html: "<strong>Boldteq — Privacy Team</strong>" },
        {
          type: "p",
          html: '📧&nbsp;&nbsp;<a href="mailto:support@boldteq.com">support@boldteq.com</a>',
        },
        {
          type: "p",
          html: '🌐&nbsp;&nbsp;<a href="https://boldteq.com/contact">https://boldteq.com/contact</a>',
        },
        {
          type: "p",
          html: "We are committed to resolving any concerns and typically respond within 2–5 business days.",
        },
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: "April 2026",
  sections: [
    {
      heading: "Agreement to Terms",
      nodes: [
        {
          type: "p",
          html: "These Terms of Service (&lsquo;Terms&rsquo;) govern your access to and use of Boldteq&rsquo;s website (boldteq.com), client portal (portal.boldteq.com), and all services provided by Boldteq (&lsquo;we,&rsquo; &lsquo;us,&rsquo; or &lsquo;our&rsquo;). By subscribing to any of our plans or accessing our platform, you (&lsquo;Client&rsquo; or &lsquo;Agency&rsquo;) agree to be bound by these Terms. If you do not agree, please do not use our services.",
        },
      ],
    },
    {
      heading: "1. About Boldteq",
      nodes: [
        {
          type: "p",
          html: "Boldteq provides white-label web development, UI/UX design, and graphic design services to digital agencies through a subscription-based model. We act as a delivery infrastructure partner — executing work on your behalf, under your brand, for your clients.",
        },
        {
          type: "p",
          html: "We are not a staffing agency, freelance marketplace, or traditional development agency. Boldteq is a managed delivery service with structured execution, quality assurance, and a dedicated project system.",
        },
      ],
    },
    {
      heading: "2. Eligibility & Account Registration",
      nodes: [
        { type: "p", html: "To use Boldteq&rsquo;s services, you must:" },
        {
          type: "ul",
          items: [
            "Be at least 18 years of age",
            "Operate as a business entity or professional agency",
            "Provide accurate, current, and complete registration information",
            "Maintain the security of your account credentials",
          ],
        },
        {
          type: "p",
          html: 'You are responsible for all activity that occurs under your account. Notify us immediately at <a href="mailto:support@boldteq.com">support@boldteq.com</a> if you suspect unauthorized access.',
        },
      ],
    },
    {
      heading: "3. Subscription Plans & Billing",
      nodes: [
        { type: "h4", text: "3.1 Subscription Tiers" },
        {
          type: "p",
          html: "Boldteq offers the following subscription plans (pricing subject to change with notice):",
        },
        {
          type: "ul",
          items: [
            "Starter — 40 hrs/month, 1 task at a time, single platform",
            "Growth — 80 hrs/month, 2 parallel tasks, multi-platform delivery",
            "Pro — 140 hrs/month, 3 parallel tasks, advanced reporting",
            "Custom — Tailored capacity and turnaround based on your agency's needs",
          ],
        },
        { type: "h4", text: "3.2 Billing Cycles" },
        {
          type: "p",
          html: "Subscriptions are billed on a monthly, quarterly, or annual basis depending on your selected plan. By subscribing, you authorize Boldteq (or its payment processor) to charge your payment method on a recurring basis.",
        },
        {
          type: "ul",
          items: [
            "Monthly subscriptions renew automatically each month",
            "Quarterly and annual plans are billed upfront at a discounted rate",
            "Prices are displayed in USD",
          ],
        },
        { type: "h4", text: "3.3 Taxes" },
        {
          type: "p",
          html: "Subscription fees are exclusive of applicable taxes. You are responsible for all taxes, levies, or duties imposed by your jurisdiction in connection with your subscription.",
        },
        { type: "h4", text: "3.4 Payment Failure" },
        {
          type: "p",
          html: "If a payment fails, we will notify you and attempt to recharge within 5 business days. Access to your account may be suspended if payment cannot be processed after reasonable attempts. Outstanding balances must be settled before service resumes.",
        },
      ],
    },
    {
      heading: "4. Cancellation, Pausing & Refunds",
      nodes: [
        { type: "h4", text: "4.1 Cancellation" },
        {
          type: "p",
          html: 'You may cancel your subscription at any time by notifying us via your client portal or at <a href="mailto:support@boldteq.com">support@boldteq.com</a>. Cancellations take effect at the end of the current billing period. You will retain access to the platform until that date.',
        },
        { type: "h4", text: "4.2 Pausing" },
        {
          type: "p",
          html: "You may pause your subscription at any time. Pausing suspends your billing and delivery activity. Your account and project history remain accessible during the pause period.",
        },
        { type: "h4", text: "4.3 14-Day Satisfaction Guarantee" },
        {
          type: "p",
          html: 'New subscribers are eligible for our 14-day satisfaction guarantee. If you are not satisfied within the first 14 days of your initial subscription, you may request a full refund by contacting us at <a href="mailto:support@boldteq.com">support@boldteq.com</a>. This guarantee applies to first-time subscribers only and is not transferable.',
        },
        { type: "h4", text: "4.4 No Refunds After 14 Days" },
        {
          type: "p",
          html: "After the 14-day guarantee period, all payments are final and non-refundable. Unused delivery hours do not rollover to the next billing cycle unless you are on a plan tier that explicitly includes rollover.",
        },
      ],
    },
    {
      heading: "5. Scope of Services",
      nodes: [
        { type: "h4", text: "5.1 Delivery Hours" },
        {
          type: "p",
          html: "Each subscription includes a defined monthly delivery capacity (measured in hours). These hours cover active execution time spent by Boldteq&rsquo;s team on your submitted tasks, including design, development, revisions, and internal QA.",
        },
        { type: "h4", text: "5.2 Task Submission" },
        {
          type: "p",
          html: "Tasks are submitted through the Boldteq Smart Client Workspace. We begin active work within 12–48 hours of task submission during business days. Turnaround times depend on task complexity and your subscription tier.",
        },
        { type: "h4", text: "5.3 Revisions" },
        {
          type: "p",
          html: "Revisions are included within your monthly delivery hours. Revision requests must be submitted within 7 days of delivery. Requests submitted after this window may consume additional hours or be treated as a new task.",
        },
        { type: "h4", text: "5.4 Out-of-Scope Work" },
        {
          type: "p",
          html: "Tasks that exceed your monthly capacity, require specialized skills outside our current offerings, or fall outside agreed project scope will be flagged before execution. We will discuss options including additional hours or plan upgrades.",
        },
      ],
    },
    {
      heading: "6. Intellectual Property",
      nodes: [
        { type: "h4", text: "6.1 Ownership of Deliverables" },
        {
          type: "p",
          html: "Upon full payment of all applicable fees, Boldteq assigns all intellectual property rights in the deliverables to you. You are free to use, modify, and distribute the work for your clients under your own brand.",
        },
        { type: "h4", text: "6.2 Portfolio Rights" },
        {
          type: "p",
          html: "Boldteq reserves the right to display completed work in our portfolio and marketing materials unless you explicitly request otherwise in writing. Portfolio use will be in a generic, white-label manner that does not identify your end-clients.",
        },
        { type: "h4", text: "6.3 Your Content" },
        {
          type: "p",
          html: "By submitting content, assets, brand guidelines, or files to Boldteq, you represent that you have the right to do so and grant us a limited license to use this material solely for the purpose of completing your requested work.",
        },
        { type: "h4", text: "6.4 Third-Party Assets" },
        {
          type: "p",
          html: "If your project requires third-party fonts, stock images, plugins, or licensed software, you are responsible for obtaining the necessary licenses. Boldteq will flag any third-party assets used and you are responsible for ensuring their proper licensing.",
        },
      ],
    },
    {
      heading: "7. Confidentiality",
      nodes: [
        {
          type: "p",
          html: "Both parties agree to maintain strict confidentiality regarding each other&rsquo;s business information, client data, project details, and proprietary materials. Boldteq will not disclose your clients&rsquo; identities, project details, or materials to any third party without your prior written consent.",
        },
        {
          type: "p",
          html: "This confidentiality obligation survives the termination of your subscription and remains in effect indefinitely.",
        },
      ],
    },
    {
      heading: "8. Prohibited Uses",
      nodes: [
        { type: "p", html: "You agree not to use Boldteq&rsquo;s services to:" },
        {
          type: "ul",
          items: [
            "Develop, promote, or distribute illegal, harmful, or malicious content",
            "Create materials that infringe on any third party's intellectual property rights",
            "Submit spam, phishing content, or deceptive marketing materials",
            "Build platforms that promote hate speech, discrimination, or violence",
            "Circumvent, disable, or interfere with platform security features",
            "Resell or transfer your subscription access without our written consent",
          ],
        },
        {
          type: "p",
          html: "Boldteq reserves the right to refuse, pause, or terminate service without refund if your use violates these terms or harms our reputation or other clients.",
        },
      ],
    },
    {
      heading: "9. Limitation of Liability",
      nodes: [
        {
          type: "p",
          html: "To the maximum extent permitted by applicable law, Boldteq shall not be liable for:",
        },
        {
          type: "ul",
          items: [
            "Indirect, incidental, special, or consequential damages",
            "Loss of revenue, profit, data, or business opportunities",
            "Delays caused by factors outside our reasonable control (e.g., force majeure, third-party platform outages)",
          ],
        },
        {
          type: "p",
          html: "Our total liability to you for any claim arising from or related to these Terms or our services shall not exceed the total fees paid by you in the three (3) months preceding the claim.",
        },
      ],
    },
    {
      heading: "10. Disclaimers",
      nodes: [
        {
          type: "p",
          html: "Boldteq&rsquo;s services are provided &lsquo;as is&rsquo; and &lsquo;as available.&rsquo; We do not warrant that:",
        },
        {
          type: "ul",
          items: [
            "The services will meet every specific requirement or use case",
            "Delivery will be uninterrupted or entirely error-free",
            "Results achieved via our services will meet specific business outcomes",
          ],
        },
        {
          type: "p",
          html: "We are committed to quality and will always work to resolve issues promptly, but we cannot guarantee specific business results from the work delivered.",
        },
      ],
    },
    {
      heading: "11. Dispute Resolution",
      nodes: [
        {
          type: "p",
          html: 'In the event of a dispute, we encourage you to first contact us at <a href="mailto:support@boldteq.com">support@boldteq.com</a> to resolve the matter informally. Most issues are resolved within 5–10 business days through direct communication.',
        },
        {
          type: "p",
          html: "If informal resolution is not achieved, disputes shall be governed by the laws of India and subject to the exclusive jurisdiction of courts located in India. Both parties agree to attempt mediation before pursuing litigation.",
        },
      ],
    },
    {
      heading: "12. Modifications to Terms",
      nodes: [
        {
          type: "p",
          html: "We may update these Terms from time to time. When we make material changes, we will:",
        },
        {
          type: "ul",
          items: [
            "Notify you via email at least 14 days before the changes take effect",
            "Update the 'Last Updated' date at the top of this document",
            "Post a notice on our website",
          ],
        },
        {
          type: "p",
          html: "Continued use of our services after the effective date of changes constitutes your acceptance of the revised Terms.",
        },
      ],
    },
    {
      heading: "13. Termination",
      nodes: [
        {
          type: "p",
          html: "Either party may terminate the subscription at any time in accordance with Section 4. Boldteq reserves the right to immediately suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to our platform or other clients.",
        },
        {
          type: "p",
          html: "Upon termination, your access to the platform will cease at the end of the billing period. You may request an export of your deliverables and project files within 30 days of termination.",
        },
      ],
    },
    {
      heading: "14. Contact",
      nodes: [
        {
          type: "p",
          html: "For questions or concerns regarding these Terms of Service:",
        },
        { type: "p", html: "<strong>Boldteq — Support Team</strong>" },
        {
          type: "p",
          html: '📧&nbsp;&nbsp;<a href="mailto:support@boldteq.com">support@boldteq.com</a>',
        },
        {
          type: "p",
          html: '🌐&nbsp;&nbsp;<a href="https://boldteq.com/contact">https://boldteq.com/contact</a>',
        },
        {
          type: "p",
          html: '📞&nbsp;&nbsp;<a href="https://boldteq.com/book-a-demo">https://boldteq.com/book-a-demo</a>',
        },
      ],
    },
  ],
};
