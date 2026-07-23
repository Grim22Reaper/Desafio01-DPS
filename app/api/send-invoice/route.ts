import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { userEmail, userName, items, total } = await request.json();

    if (!userEmail || !items || items.length === 0) {
      return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
    }

    const itemsHtml = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price || 0).toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    await resend.emails.send({
      from: "E-commerce <onboarding@resend.dev>",
      to: userEmail,
      subject: "Factura de tu compra en E-commerce",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">¡Gracias por tu compra, ${userName}!</h2>
          <p style="text-align: center; color: #666;">Aquí tienes el desglose de tu factura electrónica de E-commerce.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left;">
                <th style="padding: 10px; border-bottom: 1px solid #ddd;">Producto</th>
                <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">Cant.</th>
                <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Precio</th>
                <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <h3 style="text-align: right; margin-top: 20px; color: #111;">Total Pagado: $${total.toFixed(2)}</h3>
          <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">E-commerce - Todos los derechos reservados</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ message: "Error al enviar el correo" }, { status: 500 });
  }
}