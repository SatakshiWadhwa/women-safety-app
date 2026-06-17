import sgMail from "@sendgrid/mail";

const sendEmail = async (to, subject, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  await sgMail.send({
    to,
    from: "satakshiwadhwa23@gmail.com",
    subject,
    html,
  });
};

export default sendEmail;
