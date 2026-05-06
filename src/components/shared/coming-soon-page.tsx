import { PageHero } from "@/components/shared/page-hero";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { BetaCta } from "@/components/shared/beta-cta";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Bell } from "lucide-react";

export function ComingSoonPage({
  serviceName,
  description,
}: {
  serviceName: string;
  description: string;
}) {
  return (
    <>
      <PageHero
        title={serviceName}
        subtitle={description}
        badge="Coming Soon"
      />

      <SectionWrapper className="text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan/10">
            <Bell className="h-8 w-8 text-brand-cyan" />
          </div>
          <h2 className="text-xl font-bold">Get Notified When We Launch</h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;re building something great. Sign up to be the first to
            know when {serviceName} is available.
          </p>
          <div className="mt-8">
            <NewsletterSignup />
          </div>
        </div>
      </SectionWrapper>

      <BetaCta />
    </>
  );
}
