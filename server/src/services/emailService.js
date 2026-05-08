const { Resend } = require('resend');

// Inicializar Resend con la API key del entorno
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@bokaspets.com';

/**
 * Genera la estructura HTML base del email con los colores de marca.
 * Se centraliza aquí para garantizar consistencia visual en todos los emails.
 */
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4e7a5e, #3a5c46); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px 32px; color: #333333; }
    .body h2 { color: #4e7a5e; font-size: 22px; margin-top: 0; }
    .body p { line-height: 1.6; color: #555555; font-size: 15px; }
    .cta-btn { display: inline-block; background: #4e7a5e; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0; }
    .benefit { display: flex; align-items: flex-start; gap: 12px; margin: 16px 0; }
    .benefit-icon { font-size: 24px; flex-shrink: 0; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    .status-processing { background: #e3f2fd; color: #1565c0; }
    .status-delivered { background: #e8f5e9; color: #2e7d32; }
    .points-box { background: linear-gradient(135deg, #4e7a5e15, #8c6b5d15); border: 1px solid #4e7a5e30; border-radius: 8px; padding: 16px 24px; margin: 20px 0; text-align: center; }
    .points-number { font-size: 36px; font-weight: 800; color: #4e7a5e; }
    .alert-box { background: #fff3e0; border-left: 4px solid #f57c00; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .footer { background: #f4f6f8; padding: 24px 32px; text-align: center; border-top: 1px solid #e0e0e0; }
    .footer p { color: #999999; font-size: 13px; margin: 0; }
    .paw { color: #8c6b5d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 BokasPets</h1>
      <p>Alimentación natural para tu mejor amigo</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} BokasPets — Todos los derechos reservados</p>
      <p style="margin-top: 8px;">Si tienes preguntas, responde este email y te ayudamos.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Envía email de bienvenida al registrarse.
 * Incluye beneficios de la comida natural y CTA a los planes.
 */
const sendWelcomeEmail = async (user) => {
  const content = `
    <h2>¡Bienvenido a BokasPets, ${user.name}! 🎉</h2>
    <p>Estamos muy emocionados de tenerte en nuestra familia. Tu perro está a punto de descubrir lo que es la alimentación de verdad.</p>
    
    <p><strong>¿Por qué la comida natural hace la diferencia?</strong></p>
    
    <div class="benefit">
      <span class="benefit-icon">✨</span>
      <div><strong>Ingredientes 100% reales</strong><p style="margin: 4px 0 0;">Sin colorantes, sin conservantes, sin rellenos artificiales.</p></div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">💪</span>
      <div><strong>Más energía y vitalidad</strong><p style="margin: 4px 0 0;">Notarás la diferencia en semanas: pelo brillante, más activo.</p></div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">🏥</span>
      <div><strong>Mejor digestión</strong><p style="margin: 4px 0 0;">Formulado para el sistema digestivo específico de tu perro.</p></div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">🎯</span>
      <div><strong>Personalizado para tu perro</strong><p style="margin: 4px 0 0;">Calculamos la porción exacta según peso, edad y raza.</p></div>
    </div>
    
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/planes" class="cta-btn">
        Ver planes disponibles →
      </a>
    </div>
    
    <p style="color: #999; font-size: 13px;">Como nuevo miembro, acumulas puntos de fidelidad en cada pedido. ¡Más órdenes, más beneficios! 🐶</p>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: user.email,
    subject: '¡Bienvenido a BokasPets! 🐾',
    html: emailWrapper(content),
  });
};

/**
 * Envía notificación cuando el estado de un pedido cambia.
 * Solo se llama para status 'processing' y 'delivered'.
 */
const sendOrderStatusEmail = async (user, order) => {
  const planName = order.items?.map((i) => i.name).join(', ') || 'tu plan';
  
  const subjects = {
    processing: 'Tu pedido está en camino 🚚',
    delivered: '¡Tu pedido fue entregado! 🎉',
  };

  const statusBadges = {
    processing: '<span class="status-badge status-processing">🔵 En Proceso</span>',
    delivered: '<span class="status-badge status-delivered">🟢 Entregado</span>',
  };

  const pointsSection = order.status === 'delivered' && order.pointsEarned > 0
    ? `
      <div class="points-box">
        <p style="margin: 0 0 8px; color: #555;">Puntos ganados en esta compra</p>
        <div class="points-number">+${order.pointsEarned}</div>
        <p style="margin: 8px 0 0; color: #777; font-size: 13px;">Se acreditaron a tu cuenta automáticamente</p>
      </div>
    `
    : '';

  const content = `
    <h2>${order.status === 'processing' ? '¡Tu pedido está en camino!' : '¡Tu pedido llegó!'}</h2>
    <p>Hola <strong>${user.name}</strong>, aquí está la actualización de tu pedido:</p>
    
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 12px;"><strong>Plan:</strong> ${planName}</p>
      <p style="margin: 0 0 12px;"><strong>Estado actual:</strong> ${statusBadges[order.status] || order.status}</p>
      <p style="margin: 0;"><strong>Total:</strong> $${order.totalPrice?.toFixed(2) || '0.00'}</p>
    </div>
    
    ${pointsSection}
    
    ${order.status === 'processing' ? '<p>Tu pedido está siendo preparado con mucho cariño. Lo recibirás pronto 🐾</p>' : '<p>¡Esperamos que tu perro lo disfrute muchísimo! No olvides dejar tu reseña.</p>'}
    
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/dashboard" class="cta-btn">
        Ver mis pedidos →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: user.email,
    subject: subjects[order.status] || 'Actualización de tu pedido',
    html: emailWrapper(content),
  });
};

/**
 * Envía aviso de seguridad cuando el usuario cambia su contraseña.
 * Incluye fecha y hora para que el usuario pueda detectar accesos no autorizados.
 */
const sendPasswordChangedEmail = async (user) => {
  const now = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const content = `
    <h2>Tu contraseña fue actualizada 🔒</h2>
    <p>Hola <strong>${user.name}</strong>, te informamos que la contraseña de tu cuenta fue cambiada exitosamente.</p>
    
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Fecha y hora del cambio:</strong><br>${now}</p>
    </div>
    
    <div class="alert-box">
      <strong>⚠️ Si no fuiste tú, contáctanos inmediatamente.</strong>
      <p style="margin: 8px 0 0; font-size: 14px;">Responde este correo o escríbenos a través de la plataforma. Tu seguridad es nuestra prioridad.</p>
    </div>
    
    <p style="color: #999; font-size: 13px; margin-top: 24px;">Este es un mensaje automático de seguridad. Si fuiste tú, no necesitas hacer nada más.</p>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Tu contraseña fue actualizada 🔒',
    html: emailWrapper(content),
  });
};

module.exports = { sendWelcomeEmail, sendOrderStatusEmail, sendPasswordChangedEmail };
