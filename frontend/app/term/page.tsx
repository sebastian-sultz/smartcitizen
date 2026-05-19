import PageHero from "@/components/layout/PageHero";

const sections = [
  {
    title: "1. Spirit of Volunteering",
    content: "Global Smart Citizens Foundation is dedicated to promoting awareness, cooperation, and positive social impact. Volunteering is a selfless act aimed at community welfare. Every volunteer is expected to uphold the Foundation's mission with integrity, dedication, and a sense of responsibility."
  },
  {
    title: "2. Positive & Respectful Behaviour",
    content: "Volunteers must maintain a positive, respectful, and professional attitude toward team members, partners, and the community. Any form of discrimination, harassment, or disrespectful behaviour based on gender, religion, caste, race, or background is strictly prohibited and will result in immediate termination of the association."
  },
  {
    title: "3. Representing the Foundation",
    content: "While representing the Foundation, volunteers should prioritize social good. They must not use the Foundation's platform to promote personal agendas, political ideologies, commercial products, or individual interests."
  },
  {
    title: "4. Use of Name & Identity",
    content: "Volunteers may use the Foundation's name and identity only for approved organizational activities. Unauthorized use of the Foundation's name, logo, or reputation for personal gain, private events, or unapproved initiatives is not permitted."
  },
  {
    title: "5. Financial Transparency",
    content: "Volunteers are not authorized to collect donations, sponsorships, or funds in the name of Global Smart Citizens Foundation without written permission from the central management. All financial contributions must be directed through official Foundation channels."
  },
  {
    title: "6. Ethical Communication",
    content: "All communication—whether online, on social media, or in person—should be ethical, accurate, and aligned with the Foundation's values. Avoid spreading misinformation, unverified claims, or any content that could harm the reputation of the Foundation or society."
  },
  {
    title: "7. Safety & Awareness",
    content: "Volunteers should prioritize safety during field activities and awareness programs. They must follow local laws and respect community sensitivities while conducting outreach."
  },
  {
    title: "8. Team Collaboration",
    content: "Volunteering is a team effort. Respect the hierarchy, follow the instructions of coordinators, and collaborate with fellow volunteers to achieve collective goals."
  },
  {
    title: "9. Following Guidelines",
    content: "Every program organized by the Foundation has specific guidelines. Volunteers must adhere to these guidelines to ensure the quality and consistency of our impact."
  },
  {
    title: "10. Voluntary Participation",
    content: "Volunteering is a voluntary commitment. While we value your time and contribution, the Foundation does not provide any financial remuneration, wages, or promise of future employment for volunteer services."
  },
  {
    title: "11. Participation Commitment",
    content: "Active participation is essential for meaningful impact. Volunteers are encouraged to be consistent in their commitment and communicate their availability in advance."
  },
  {
    title: "12. Program Discipline",
    content: "Discipline and punctuality are key during events and programs. Volunteers are expected to be punctual and follow the schedule as decided by the management."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Terms & Conditions" />

      <section className="py-24 bg-white">
        <div className="max-content max-w-4xl mx-auto">
          <div className="space-y-8 mb-16">
            <h2 className="font-display text-3xl font-bold text-text">Volunteer Guidelines & Code of Conduct</h2>
            <p className="text-text-muted leading-relaxed">
              Global Smart Citizens Foundation is dedicated to promoting awareness, cooperation, and positive social impact.
              The following guidelines outline the code of conduct for all volunteers and participants associated with the organization.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-primary">{section.title}</h3>
                <p className="text-text-muted leading-relaxed text-[16px]">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-border space-y-12">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Activity Coordination</h3>
              <p className="text-text-muted leading-relaxed">All activities, programs, and outreach initiatives must be pre-approved by the Foundation management. Volunteers should coordinate with their assigned leads before initiating any program.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Use of Materials</h3>
              <p className="text-text-muted leading-relaxed">Materials, logos, and presentations provided by the Foundation are for awareness purposes and should not be modified or shared for commercial use.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Positive Representation</h3>
              <p className="text-text-muted leading-relaxed">Your actions as a volunteer reflect on the Foundation. We expect you to represent us with dignity and positivity at all times.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Participation Review</h3>
              <p className="text-text-muted leading-relaxed">The Foundation reserves the right to review a volunteer&apos;s participation and terminate the association if guidelines are not followed.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Volunteer Registration Contribution</h3>
              <p className="text-text-muted leading-relaxed">
                A nominal one-time contribution (e.g., ₹100) may be encouraged at the time of volunteer registration to support administrative coordination, resource materials, and social outreach activities.
                This contribution is voluntary in nature and is not a fee for employment or services.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-text">Acceptance</h3>
              <p className="text-text-muted leading-relaxed">By registering as a volunteer or participating in our programs, you agree to follow these guidelines and work toward the Foundation&apos;s vision of an aware and empowered society.</p>
            </div>
          </div>

          <div className="mt-24 text-center">
            <p className="font-display text-xl font-bold text-primary">Global Smart Citizens Foundation — Together for a Better Tomorrow</p>
          </div>
        </div>
      </section>

    </main>
  );
}
