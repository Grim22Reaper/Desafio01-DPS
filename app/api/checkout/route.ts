import { NextResponse } from "next/server";
// Importa tu cliente de correo preferido, por ejemplo: resend o nodemailer
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { userEmail, userName, items, total } = await request.json();

    if (!userEmail || !items || items.length === 0) {
      return NextResponse.json({ message: "Datos de compra incompletos" }, { status: 400 });
    }

    // 1. Generar HTML de la Factura
    const invoiceHTML = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">¡Gracias por tu compra, ${userName}!</h2>
        <p style="text-align: center; color: #666;">Aquí tienes el detalle de tu factura electrónica.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8fafc; text-align: left;">
              <th style="padding: 10px; border-bottom: 1px solid #ddd;">Producto</th>
              <th style="padding: 10px; border-bottom: 1px solid #ddd;">Cant.</th>
              <th style="padding: 10px; border-bottom: 1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item: any) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h3 style="text-align: right; margin-top: 20px; color: #111;">Total Pagado: $${total.toFixed(2)}</h3>
        <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">TiendaOnline - Todos los derechos reservados</p>
      </div>
    `;

    /* 
      2. Enviar el correo usando tu servicio de preferencia:
      Ejemplo con Resend:
      await resend.emails.send({
        from: 'Facturación <onboarding@resend.dev>',
        to: userEmail,
        subject: `Factura de tu compra en TiendaOnline`,
        html: invoiceHTML,
      });
    */

    // Simulamos el envío exitoso por ahora
    console.log(`Factura enviada exitosamente a: ${userEmail}`);

    return NextResponse.json({ success: true, message: "Compra procesada y factura enviada." });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}