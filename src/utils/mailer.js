import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPurchaseEmail = async (userEmail, ticket) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Confirmación de Compra',
      html: `
        <h2>Gracias por tu compra</h2>
        <p>Hemos recibido tu pedido. Aquí están los detalles:</p>
        <ul>
          ${ticket.products.map(item => `<li>${item.quantity} x ${item.product}</li>`).join('')}
        </ul>
        <p><strong>Total: $${ticket.totalAmount}</strong></p>
        <p>¡Gracias por confiar en nosotros!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado');
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};
