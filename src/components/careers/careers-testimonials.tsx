import Image from "next/image";
import styles from "./careers-testimonials.module.css";

const MAIN_MEMBER = {
  name: "Arjun Mehta",
  role: "Head of Engineering",
  quote: "Quality at Boldteq isn't a final checkpoint — it's built into how we think, plan, and execute every project. Strong systems allow strong professionals to perform.",
  image: "/images/webflow/Rectangle-30835.png",
};

const SIDE_MEMBERS = [
  {
    name: "Sofia Rao",
    role: "Operations Lead",
    quote: "Clarity and accountability define how we work. Every process is designed to support reliable delivery at scale.",
    image: "/images/webflow/Rectangle-30836.png",
  },
  {
    name: "Daniel Brooks",
    role: "Senior Developer",
    quote: "We hire people who take ownership. When responsibility is clear, performance naturally improves.",
    image: "/images/webflow/Rectangle-30837.png",
  },
  {
    name: "Nisha Kapoor",
    role: "Client Success Manager",
    quote: "Our role is to protect client trust. That means disciplined execution, not shortcuts.",
    image: "/images/webflow/Rectangle-30838.png",
  },
];

export function CareersTestimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Voices from Boldteq</h2>
          <p className={styles.subheading}>
            Hear directly from the team shaping our culture, driving delivery standards, and building systems that scale.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {/* Large card — Arjun Mehta */}
          <div className={styles.mainCard}>
            <div className={styles.mainCardImage}>
              <Image
                src={MAIN_MEMBER.image}
                alt={MAIN_MEMBER.name}
                fill
                className={styles.teamImage}
                sizes="(max-width: 767px) 90vw, 480px"
              />
            </div>
            <h3 className={styles.memberName}>{MAIN_MEMBER.name}</h3>
            <p className={styles.memberRole}>{MAIN_MEMBER.role}</p>
            <p className={styles.mainQuote}>&ldquo;{MAIN_MEMBER.quote}&rdquo;</p>
            <span className={styles.continueBtn}>Continue Reading</span>
          </div>

          {/* Right column — 3 smaller cards */}
          <div className={styles.sideColumn}>
            {SIDE_MEMBERS.map((member) => (
              <div key={member.name} className={styles.sideCard}>
                <div className={styles.sideCardImage}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={styles.teamImage}
                    sizes="180px"
                  />
                </div>
                <div className={styles.sideCardText}>
                  <h3 className={styles.memberNameSide}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.sideQuote}>&ldquo;{member.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
