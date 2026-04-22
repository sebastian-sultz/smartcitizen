import PageHero from "@/components/layout/PageHero";

const refundPolicies = [
  {
    title: "1. Nature of Payment",
    content: "All payments, contributions, and donations made to Global Smart Citizens Foundation are voluntary in nature and intended to support the organization's social awareness, charitable initiatives, and community development programs. The Foundation is a non-profit entity and does not engage in any commercial sale of products or services."
  },
  {
    title: "2. Strict No Refund Policy",
    content: "As the funds are utilized for social welfare activities, grassroots programs, and operational costs of awareness campaigns, all contributions, donations, and administrative support amounts are final and non-refundable under any circumstances."
  },
  {
    title: "3. Limited Exception (Technical Error Only)",
    content: "A refund request may only be considered in the case of a technical error during the transaction, such as a double payment or an unauthorized deduction caused by a system glitch on the Foundation's payment gateway."
  },
  {
    title: "4. Mandatory Conditions for Request",
    content: "Any such request must be submitted via email within 48 hours of the transaction. The request must include valid proof of payment, transaction ID, and a clear explanation of the error. Requests made after 48 hours will not be entertained."
  },
  {
    title: "5. Verification & Discretion",
    content: "The Foundation will verify the claim with its bank and payment gateway partner. The decision of the Foundation's management regarding the validity of the refund request shall be final and absolute."
  },
  {
    title: "6. Processing Clause",
    content: "If a refund is approved due to a verified technical error, the amount will be processed back to the original payment source within 15 to 30 working days, subject to banking procedures."
  },
  {
    title: "7. No Obligation Clause",
    content: "The Foundation is not obligated to provide any reason for the rejection of a refund request that does not meet the specified criteria of a technical error."
  },
  {
    title: "8. No Commercial Intent",
    content: "Since the Foundation does not sell commercial services or products, there is no provision for 'cancellation' or 'return' as applicable in commercial e-commerce platforms."
  },
  {
    title: "9. Acceptance",
    content: "By making a payment or contribution to Global Smart Citizens Foundation, you acknowledge that you have read, understood, and agreed to this Refund Policy."
  }
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Refund Policy" />

      <section className="py-24 bg-white">
        <div className="max-content max-w-4xl mx-auto">
          <div className="space-y-12">
            {refundPolicies.map((policy, i) => (
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
