import nodemailer from "nodemailer";

async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  if (process.env.EMAIL_SERVER === "console") {
    console.log("EMAIL (dev)");
    console.log("To: " + to);
    console.log("Subject: " + subject);
    console.log(html);
    return;
  }

  if (!process.env.EMAIL_SERVER) {
    throw new Error("EMAIL_SERVER is not configured");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const transporter = nodemailer.createTransport(
    process.env.EMAIL_SERVER
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL ||
    "fakhriclothes53@gmail.com"
  );
}

export async function sendOtpEmail(
  to: string,
  code: string
) {
  const html =
    "<div style=\"font-family:serif;max-width:480px;margin:auto;border:1px solid #C9A227;padding:32px\">" +
    "<h2 style=\"color:#0B3D2E\">Verify your Fakhri Clothes account</h2>" +
    "<p>Your verification code is:</p>" +
    "<h1 style=\"color:#C9A227;letter-spacing:6px\">" +
    code +
    "</h1>" +
    "<p>This code expires in 10 minutes.</p>" +
    "<p style=\"color:#777;font-size:12px\">- Fakhri Clothes</p>" +
    "</div>";

  await sendEmail(
    to,
    "Your Fakhri Clothes verification code",
    html
  );
}

export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderId: string,
  total: number
) {
  const html =
    "<div style=\"font-family:serif;max-width:480px;margin:auto;border:1px solid #C9A227;padding:32px\">" +
    "<h2 style=\"color:#0B3D2E\">Payment received</h2>" +
    "<p>Dear " +
    name +
    ",</p>" +
    "<p>Your order <b>" +
    orderId +
    "</b> of <b>PKR " +
    total.toLocaleString() +
    "</b> is confirmed and will arrive in <b>5-6 business days</b>.</p>" +
    "<p style=\"color:#777\">- Fakhri Clothes</p>" +
    "</div>";

  await sendEmail(
    to,
    "Order confirmed - " + orderId,
    html
  );
}

export async function sendNewRegistrationEmail(
  name: string,
  email: string
) {
  const html =
    "<div style=\"font-family:serif;max-width:480px;margin:auto;border:1px solid #C9A227;padding:32px\">" +
    "<h2 style=\"color:#0B3D2E\">New Customer Registration</h2>" +
    "<p>A new customer has registered on Fakhri Clothes.</p>" +
    "<p><b>Name:</b> " +
    name +
    "</p>" +
    "<p><b>Email:</b> " +
    email +
    "</p>" +
    "<p style=\"color:#777\">- Fakhri Clothes</p>" +
    "</div>";

  await sendEmail(
    getAdminEmail(),
    "New customer registration - " + name,
    html
  );
}

export async function sendNewOrderAdminEmail(
  orderId: string,
  customerName: string,
  customerEmail: string,
  total: number
) {
  const html =
    "<div style=\"font-family:serif;max-width:480px;margin:auto;border:1px solid #C9A227;padding:32px\">" +
    "<h2 style=\"color:#0B3D2E\">New Order Received</h2>" +
    "<p>A new order has been placed on Fakhri Clothes.</p>" +
    "<p><b>Order ID:</b> " +
    orderId +
    "</p>" +
    "<p><b>Customer:</b> " +
    customerName +
    "</p>" +
    "<p><b>Email:</b> " +
    customerEmail +
    "</p>" +
    "<p><b>Total:</b> PKR " +
    total.toLocaleString() +
    "</p>" +
    "<p><b>Payment:</b> Successful</p>" +
    "<p style=\"color:#777\">- Fakhri Clothes</p>" +
    "</div>";

  await sendEmail(
    getAdminEmail(),
    "New order - " + orderId,
    html
  );
}
