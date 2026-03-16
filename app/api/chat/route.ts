import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'

const client = new Anthropic()

const SYSTEM_EN = `You are the assistant for Western N Third Building Materials in Wilmington, NC.

## ABOUT THE BUSINESS
- Name: Western N Third Building Materials
- Phone: (910) 555-0123
- Email: info@western-n-third.com
- Address: 123 Western Ave N, Wilmington, NC 28401
- Hours: Mon–Fri 8 AM–6 PM (Fri until 6), Sat 9 AM–4 PM, Closed Sunday

## INVENTORY
We buy, sell, and trade quality industrial building materials:
Lumber & reclaimed wood, steel beams, copper, aluminum, sheet metal, door handles, hinges, locks, hardware, power tools, hand tools, construction equipment, hardwood & vinyl flooring, ceramic tile, exterior and interior doors, window frames, glass panels.

## YOUR ROLE
- Friendly, knowledgeable, and to the point
- Keep responses to 2–3 sentences unless more is needed
- Always end with a clear call to action (call us, stop by, or ask a follow-up)
- Never make up prices — direct to call or visit for current pricing
- Respond in English.`

const SYSTEM_ES = `Eres el asistente de Western N Third Building Materials en Wilmington, NC.

## SOBRE EL NEGOCIO
- Nombre: Western N Third Building Materials
- Teléfono: (910) 555-0123
- Email: info@western-n-third.com
- Dirección: 123 Western Ave N, Wilmington, NC 28401
- Horario: Lun–Vie 8 AM–6 PM, Sáb 9 AM–4 PM, Domingo cerrado

## INVENTARIO
Compramos, vendemos e intercambiamos materiales de construcción industriales:
Madera y madera reciclada, vigas de acero, cobre, aluminio, láminas metálicas, manijas, bisagras, cerraduras, herrajes, herramientas eléctricas y manuales, equipos de construcción, pisos de madera dura y vinilo, azulejos cerámicos, puertas, marcos de ventana, paneles de vidrio.

## TU ROL
- Amigable, conocedor y directo
- Responde en 2–3 oraciones salvo que se necesite más detalle
- Siempre termina con un llamado a la acción (llamar, visitar o preguntar más)
- Nunca inventes precios — dirige a llamar o visitar para precios actuales
- Responde en español.`

export async function POST(req: Request) {
  try {
    const { messages, lang = 'en' } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(
        lang === 'es'
          ? 'El chat no está disponible. Llama al (910) 555-0123.'
          : 'Chat is unavailable. Please call (910) 555-0123.',
        { status: 200, headers: { 'Content-Type': 'text/plain' } }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: lang === 'es' ? SYSTEM_ES : SYSTEM_EN,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta as { type: string; text?: string }
              if (delta.type === 'text_delta' && delta.text) {
                controller.enqueue(encoder.encode(delta.text))
              }
            }
          }
          controller.close()
        } catch {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return new Response(
      'Sorry, something went wrong. Call us at (910) 555-0123!',
      { status: 200, headers: { 'Content-Type': 'text/plain' } }
    )
  }
}
