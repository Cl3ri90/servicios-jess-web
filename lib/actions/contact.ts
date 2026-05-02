'use server'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name')
  const company = formData.get('company')
  const email = formData.get('email')
  const message = formData.get('message')

  // Validation
  if (!name || !email || !message) {
    return { error: 'Faltan campos obligatorios' }
  }

  try {
    // Si tuviéramos un modelo de base de datos "Lead", lo insertaríamos aquí:
    // await prisma.lead.create({ data: { name, company, email, text: message } })

    // Por ahora simulamos el procesamiento:
    console.log(`[LEAD] Nuevo Contacto de ${name} (${company}) - ${email}: ${message}`)
    
    // Simula un delay de API para el UI loading state
    await new Promise(res => setTimeout(res, 1500))

    return { success: true, message: 'Solicitud enviada correctamente. Un ingeniero se contactará.' }
  } catch (err) {
    return { error: 'Ocurrió un error grabando tu solicitud. Intenta por WhatsApp.' }
  }
}
