import { getWhatsAppConfig } from '@/lib/actions/whatsapp'
import { WhatsAppForm } from '@/components/admin/WhatsAppForm'

export default async function WhatsAppView({ tenantId }: { tenantId: string }) {
  const config = await getWhatsAppConfig()

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-green-500 flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.395 0 0 5.395 0 12.031C0 14.655 0.852 17.086 2.274 19.141L.486 24L5.437 22.257C7.4 23.513 9.638 24.161 12.031 24.161C18.667 24.161 24.062 18.766 24.062 12.031C24.062 5.395 18.667 0 12.031 0ZM18.789 16.924C18.428 17.945 16.711 18.825 15.694 18.995C14.935 19.124 13.916 19.261 10.871 18.006C7.03 16.417 4.545 12.481 4.354 12.228C4.163 11.975 2.766 10.119 2.766 8.196C2.766 6.273 3.75 5.337 4.148 4.939C4.546 4.541 5.093 4.417 5.568 4.417C5.727 4.417 5.869 4.425 5.996 4.432C6.413 4.453 6.621 4.476 6.896 5.139C7.243 5.981 8.093 8.053 8.195 8.271C8.297 8.489 8.358 8.76 8.231 9.013C8.104 9.266 8.019 9.429 7.828 9.646C7.637 9.863 7.429 10.045 7.26 10.262C7.069 10.498 6.852 10.748 7.098 11.171C7.344 11.594 8.188 12.971 9.431 14.076C11.036 15.5 12.35 15.955 12.816 16.155C13.282 16.355 13.805 16.29 14.153 15.918C14.582 15.461 15.112 14.678 15.666 13.882C16.064 13.303 16.634 13.228 17.165 13.428C17.696 13.628 20.518 15.025 21.069 15.297C21.62 15.569 21.981 15.704 22.109 15.921C22.237 16.138 22.237 17.189 21.854 18.21C21.493 19.169 19.15 15.953 18.789 16.924Z"/></svg>
          Módulo de Mensajería WhatsApp
        </h2>
        <p className="text-neutral-400 mt-2">Configura un CTA directo hacia tu teléfono para leads de alta prioridad.</p>
      </div>

      <WhatsAppForm initialData={config} tenantId={tenantId} />
    </div>
  )
}
