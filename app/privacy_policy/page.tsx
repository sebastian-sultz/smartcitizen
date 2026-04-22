import PageHero from "@/components/layout/PageHero";

const policies = [
  {
    title: "1. About the Organization",
    content: "Global Smart Citizens Foundation is a registered non-profit organization established under Section 8 of the Companies Act, 2013. The organization operates with the primary objective of social welfare, community development, and public awareness."
  },
  {
    title: "2. Aim & Objectives",
    content: "Our mission is to educate and empower citizens on critical social issues including environmental sustainability, health & wellness, digital safety, legal rights, child protection, financial literacy, and social ethics. All programs are designed to benefit society and build a more informed community."
  },
  {
    title: "3. Nature of Services",
    content: "All services, awareness programs, guidance, and support provided by the Foundation are offered on a voluntary, non-commercial, and best-effort basis. The information provided is for general awareness and does not constitute professional, legal, medical, or financial advice."
  },
  {
    title: "4. Contribution / Donation Policy",
    content: "Contributions made to the Foundation are used strictly for charitable purposes, awareness campaigns, and community development projects. All donations are voluntary. Donors are advised to verify details before making any contribution."
  },
  {
    title: "5. Refund Policy",
    content: "As a non-profit organization conducting charitable activities, all contributions, donations, and administrative support amounts are final and non-refundable. Please refer to our detailed Refund Policy page for more information."
  },
  {
    title: "6. Privacy Policy",
    content: "We respect the privacy of our volunteers, donors, and participants. Any personal information shared with the Foundation is used only for organizational communication, program coordination, and statutory compliance. We do not sell or share your data with third parties for commercial purposes."
  },
  {
    title: "7. Disclaimer",
    content: "The Foundation and its experts provide guidance based on general knowledge. We do not guarantee specific outcomes or accuracy. Users are encouraged to seek professional consultation for specific legal, medical, or financial matters."
  },
  {
    title: "8. Volunteer & Participation Policy",
    content: "Participation in Foundation activities is voluntary. Volunteers must follow the organizational code of conduct and guidelines. The Foundation reserves the right to manage and review volunteer associations."
  },
  {
    title: "9. Legal Compliance",
    content: "Global Smart Citizens Foundation operates in full compliance with the laws of India. We maintain transparency in our operations and follow all statutory regulations applicable to Section 8 non-profit companies."
  },
  {
    title: "10. Platform Rights",
    content: "The Foundation reserves the right to update its programs, policies, and guidelines as needed to better serve its social mission. Any changes will be updated on the official website."
  },
  {
    title: "11. Acceptance of Policies",
    content: "By accessing our website, participating in our programs, or supporting our cause, you acknowledge and agree to abide by the policies and guidelines of Global Smart Citizens Foundation."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Privacy Policy" />

      <section className="py-24 bg-white">
        <div className="max-content max-w-4xl mx-auto">
          <div className="space-y-12">
            {policies.map((policy, i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-primary">{policy.title}</h3>
                <p className="text-text-muted leading-relaxed text-[16px]">{policy.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
