import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Inicializamos Resend aquí dentro para evitar que falle durante el proceso de compilación
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { userEmail, userName, items, total } = await request.json();

    // Generamos las filas de la tabla dinámicamente para el correo HTML
    const itemsHtml = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: center; color: #4a5568;">${item.quantity || 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #4a5568;">$${Number(item.price || 0).toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: bold; color: #2d3748;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const data = await resend.emails.send({
      from: "E-commerce <onboarding@resend.dev>",
      to: userEmail,
      subject: "Factura de tu compra en E-commerce",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7fafc; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
            
            <div style="background-color: #2563eb; padding: 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900;">E-commerce</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Comprobante de compra electrónico</p>
            </div>

            <div style="padding: 30px;">
              <h2 style="color: #1a202c; font-size: 20px; margin-top: 0;">¡Gracias por tu compra, ${userName}!</h2>
              <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                Aquí tienes el desglose de tu factura electrónica de E-commerce.
              </p>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0;">Producto</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e2e8f0;">Cant.</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Precio</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="text-align: right; border-top: 2px solid #edf2f7; padding-top: 16px; margin-bottom: 30px;">
                <span style="font-size: 16px; font-weight: bold; color: #2d3748;">Total Pagado: </span>
                <span style="font-size: 20px; font-weight: 900; color: #2563eb;">$${Number(total).toFixed(2)}</span>
              </div>

              <div style="text-align: center; color: #a0aec0; font-size: 12px; border-top: 1px solid #edf2f7; pt: 20px;">
                <p style="margin: 20px 0 0 0;">E-commerce - Todos los derechos reservados</p>
              </div>
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
  }
}