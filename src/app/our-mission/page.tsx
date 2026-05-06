import { createMetadata } from '@/lib/seo/metadata';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld';
import { GradientPageBg } from '@/components/shared/page-bg';
import { MissionHero } from '@/components/our-mission/mission-hero';
import { DeliveryStandards } from '@/components/our-mission/delivery-standards';
import { MissionDelivery } from '@/components/our-mission/mission-delivery';
import { CtaBanner } from '@/components/shared/cta-banner';

export const metadata = createMetadata({
  title: 'About Boldteq | White-Label Web Dev Partner for Agencies',
  description:
    'Boldteq is a white-label web development partner for digital agencies. Founded to eliminate delivery chaos with dedicated dev teams on subscription.',
  path: '/our-mission',
  ogImage:
    'https://cdn.prod.website-files.com/68ee3857579ec95674c7dd80/69d64240db9eab6baa328bb5_69817a5c48d4bad1a9bb52b2_Group%2047047.png',
});

const breadcrumbs = breadcrumbSchema([
  { name: 'About', path: '/our-mission' },
]);

export default function OurMissionPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} id="schema-breadcrumbs" />
      <GradientPageBg />
      <MissionHero />
      <DeliveryStandards />
      <MissionDelivery />
      <CtaBanner
        align="left"
        title="Ready to Deliver This Level of Work Under Your Brand?"
        subtitle="Partner with Boldteq as your dedicated backend delivery team and gain a reliable, scalable foundation for your technology initiatives."
        bullets={[
          'Agencies with fluctuating demand',
          'Large monthly task volumes',
          'Multiple brands or clients',
        ]}
        primaryCta={{ label: 'Book a Demo', href: '/book-a-demo' }}
        secondaryCta={{ label: 'View Plans', href: '/pricing' }}
      />
    </>
  );
}
