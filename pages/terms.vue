<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <v-container class="py-12" max-width="900">
    <h1 class="text-h4 mb-2">
      Términos y Condiciones
    </h1>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Última actualización: {{ new Date().toLocaleDateString('es-ES') }}
    </p>

    <v-card variant="flat" class="mb-6">
      <v-card-text class="prose prose-sm">
        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            1. Aceptación de Términos
          </h2>
          <p class="mb-4">
            Al acceder y utilizar la plataforma Abrakdabra (en adelante "el Servicio"), aceptas completamente estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar el Servicio.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            2. Descripción del Servicio
          </h2>
          <p class="mb-4">
            Abrakdabra es una plataforma digital de venta de entradas para eventos (conciertos, deportes, teatro, cine y otros). Ofrecemos:
          </p>
          <ul class="ml-4 mb-4">
            <li>Búsqueda y compra de entradas</li>
            <li>Procesamiento seguro de pagos</li>
            <li>Emisión y gestión de tickets digitales</li>
            <li>Códigos de descuento y promociones</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            3. Elegibilidad
          </h2>
          <p class="mb-4">
            Para usar el Servicio debes:
          </p>
          <ul class="ml-4 mb-4">
            <li>Tener al menos 18 años de edad</li>
            <li>Ser residente legal en Ecuador o estar autorizado para hacer compras en línea</li>
            <li>Proporcionar información válida y exacta durante el registro</li>
            <li>Mantener actualizada tu información de cuenta</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            4. Registro de Cuenta
          </h2>
          <p class="mb-4">
            Para comprar entradas, debes crear una cuenta proporcionando:
          </p>
          <ul class="ml-4 mb-4">
            <li>Nombre completo</li>
            <li>Correo electrónico válido</li>
            <li>Contraseña segura</li>
          </ul>
          <p class="mb-4">
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad en tu cuenta. Si sospechas uso no autorizado, notifica inmediatamente a soporte@abrakdabra.ec
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            5. Compra de Entradas
          </h2>
          <h3 class="text-body-2 font-semibold mb-2">
            5.1 Disponibilidad
          </h3>
          <p class="mb-4">
            Las entradas están sujetas a disponibilidad. Los precios y disponibilidad pueden cambiar sin previo aviso. No garantizamos disponibilidad de entradas hasta que el pago sea procesado exitosamente.
          </p>

          <h3 class="text-body-2 font-semibold mb-2">
            5.2 Proceso de Compra
          </h3>
          <p class="mb-4">
            Al completar una compra, aceptas:
          </p>
          <ul class="ml-4 mb-4">
            <li>La cantidad y tipo de entradas seleccionadas</li>
            <li>Los términos del evento específico</li>
            <li>Los términos de cancelación del vendedor</li>
          </ul>

          <h3 class="text-body-2 font-semibold mb-2">
            5.3 Código de Descuento
          </h3>
          <p class="mb-4">
            Los códigos de descuento son de uso único (salvo excepciones) y válidos solo para las transacciones especificadas. No son transferibles ni canjeables por efectivo.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            6. Pagos y Transacciones
          </h2>
          <p class="mb-4">
            Utilizamos Stripe para procesar pagos de forma segura. Al proporcionar información de pago, aceptas:
          </p>
          <ul class="ml-4 mb-4">
            <li>Que eres el titular autorizado de la tarjeta o cuenta</li>
            <li>Que la información es exacta y completa</li>
            <li>Que no violarás leyes aplicables en Ecuador</li>
          </ul>
          <p class="mb-4">
            Todos los precios incluyen impuestos según legislación ecuatoriana vigente. Las transacciones rechazadas no generarán cargos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            7. Entradas y Tickets
          </h2>
          <h3 class="text-body-2 font-semibold mb-2">
            7.1 Emisión
          </h3>
          <p class="mb-4">
            Tras confirmar el pago, recibirás un enlace de descarga en tu correo con los tickets en formato digital (PDF con código QR).
          </p>

          <h3 class="text-body-2 font-semibold mb-2">
            7.2 Responsabilidad
          </h3>
          <p class="mb-4">
            Eres responsable de:
          </p>
          <ul class="ml-4 mb-4">
            <li>Descargar y guardar tu entrada de forma segura</li>
            <li>Presentar la entrada (digital o impresa) al evento</li>
            <li>No compartir, revender ni transferir la entrada sin autorización</li>
            <li>Cumplir con políticas del recinto del evento</li>
          </ul>

          <h3 class="text-body-2 font-semibold mb-2">
            7.3 No Transferencia
          </h3>
          <p class="mb-4">
            Las entradas están vinculadas al comprador. No se permiten cambios de nombre ni transferencias a terceros sin consentimiento explícito del organizador.
          </p>

          <h3 class="text-body-2 font-semibold mb-2">
            7.4 Reembolsos y Cambios
          </h3>
          <p class="mb-4">
            Los reembolsos se rigen por la política de cada evento. Abrakdabra no es responsable de reembolsos no autorizados por el organizador. Si un evento se cancela, el organizador determinará la política de reembolso.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            8. Restricciones de Uso
          </h2>
          <p class="mb-4">
            No debes:
          </p>
          <ul class="ml-4 mb-4">
            <li>Usar scripts o bots automatizados para acceder al Servicio</li>
            <li>Intentar acceso no autorizado a servidores o sistemas</li>
            <li>Vender, revender o traficar con entradas fuera de la plataforma</li>
            <li>Utilizar datos de otros usuarios sin consentimiento</li>
            <li>Publicar contenido difamatorio, ofensivo o ilegal</li>
            <li>Cometer fraude, phishing o estafas</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            9. Propiedad Intelectual
          </h2>
          <p class="mb-4">
            Abrakdabra y su contenido (logos, imágenes, código, diseño) están protegidos por derechos de autor. No puedes reproducir, distribuir o modificar el contenido sin autorización explícita.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            10. Privacidad y Datos Personales
          </h2>
          <p class="mb-4">
            El tratamiento de datos personales se rige por nuestra Política de Privacidad. Al usar el Servicio, autorizas la recopilación y uso de datos según dicha política.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            11. Limitación de Responsabilidad
          </h2>
          <p class="mb-4">
            Abrakdabra actúa como intermediaria. No somos responsables de:
          </p>
          <ul class="ml-4 mb-4">
            <li>Cancelación, postergación o cambios en eventos</li>
            <li>Acciones u omisiones de organizadores o recintos</li>
            <li>Pérdida o daño de entradas digitales (es responsabilidad del usuario hacer copias de seguridad)</li>
            <li>Interrupciones técnicas o caídas del servicio</li>
            <li>Daños indirectos o consecuentes derivados del uso del Servicio</li>
          </ul>
          <p class="mb-4">
            La responsabilidad total de Abrakdabra no excederá el monto pagado por la entrada en cuestión.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            12. Modificación de Términos
          </h2>
          <p class="mb-4">
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios entran en vigencia al publicarlos. El uso continuado del Servicio implica aceptación de los nuevos términos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            13. Suspensión o Cancelación
          </h2>
          <p class="mb-4">
            Podemos suspender o cancelar tu cuenta si:
          </p>
          <ul class="ml-4 mb-4">
            <li>Violas estos Términos</li>
            <li>Detectamos fraude o actividad sospechosa</li>
            <li>Incumples leyes aplicables</li>
          </ul>
          <p class="mb-4">
            En caso de cancelación, retenemos derechos sobre entradas y transacciones previas.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            14. Ley Aplicable
          </h2>
          <p class="mb-4">
            Estos Términos se rigen conforme a las leyes de la República del Ecuador. Cualquier disputa será resuelta en los juzgados de la ciudad de Quito (o la corresponda por domicilio del usuario).
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            15. Contacto y Soporte
          </h2>
          <p class="mb-4">
            Para consultas, reclamos o más información:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Correo:</strong> soporte@abrakdabra.ec</li>
            <li><strong>Teléfono:</strong> +593 996610024</li>
            <li><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00 (hora Ecuador)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-h6 mb-3">
            16. Disposiciones Generales
          </h2>
          <p class="mb-4">
            Si alguna disposición de estos Términos se considera inválida, las demás disposiciones permanecen vigentes. Nuestra falta de cumplimiento en algún punto no constituye renuncia de derechos.
          </p>
          <p class="mb-4 text-body-2 text-medium-emphasis">
            <strong>Al usar Abrakdabra, reconoces haber leído, entendido y aceptado completamente estos Términos y Condiciones.</strong>
          </p>
        </section>
      </v-card-text>
    </v-card>

    <div class="text-center mb-4">
      <NuxtLink to="/" class="text-primary">
        Volver al inicio
      </NuxtLink>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.prose {
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    line-height: 1.6;
  }

  h2 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
