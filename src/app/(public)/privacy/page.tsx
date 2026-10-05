export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="section-title">Privacy Policy</h1>
      <span className="gold-underline" />
      <div className="mt-8 space-y-5 text-emerald/80 leading-relaxed text-sm md:text-base">
        <p><em>(Draft — to be reviewed and approved by the client before going live.)</em></p>
        <p><strong>1. Information we collect.</strong> When you create an account we collect your name, email, and phone number. At checkout we collect your delivery address and verify your phone number via OTP. Payment details are handled entirely by our bank payment gateway — we never see or store your card or bank information.</p>
        <p><strong>2. How we use it.</strong> We use your information to process orders, deliver your purchases, contact you about your order, and send order confirmations by email or WhatsApp.</p>
        <p><strong>3. Sharing.</strong> We share your delivery details only with our courier partner (PostEx) so your order can be shipped. We never sell your personal information.</p>
        <p><strong>4. Security.</strong> Passwords are stored using industry-standard hashing (bcrypt). All payment traffic is processed over HTTPS by the payment gateway.</p>
        <p><strong>5. Your rights.</strong> You may request correction or deletion of your personal data at any time by contacting us at 0321-3611921.</p>
      </div>
    </div>
  );
}