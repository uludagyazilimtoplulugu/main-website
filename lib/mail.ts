import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationCode(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: `"Uludağ Yazılım Topluluğu" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "E-posta Doğrulama Kodunuz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a1a1a; text-align: center;">Uludağ Yazılım Topluluğu</h2>
          <p style="color: #555; text-align: center;">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${code}</span>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center;">Bu kod 10 dakika geçerlidir. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error("Mail gönderme hatası:", error)
    return false
  }
}
