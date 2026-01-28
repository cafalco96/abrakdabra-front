<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <v-container class="py-12" max-width="900">
    <h1 class="text-h4 mb-2">
      Política de Privacidad
    </h1>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Última actualización: {{ new Date().toLocaleDateString('es-ES') }}
    </p>

    <v-card variant="flat" class="mb-6">
      <v-card-text class="prose prose-sm">
        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            1. Introducción
          </h2>
          <p class="mb-4">
            Abrakdabra (en adelante "la Plataforma", "nosotros" o "nuestro") respeta tu privacidad y está comprometida con la protección de tus datos personales conforme a la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> de la República del Ecuador y demás normativa vigente.
          </p>
          <p class="mb-4">
            Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos tus datos personales cuando accedes a nuestro sitio web, aplicación móvil y servicios.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            2. Responsable del Tratamiento de Datos
          </h2>
          <p class="mb-4">
            <strong>Abrakdabra Cia. Ltda.</strong><br>
            Dirección: Retro Lens Optical, Quito, Ecuador<br>
            Correo de contacto: privacidad@abrakdabra.ec<br>
            Teléfono: +593 2 1234567
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            3. Datos Personales que Recopilamos
          </h2>
          <p class="mb-4">
            Recopilamos información que proporcionas directamente:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Datos de Registro:</strong> nombre completo, correo electrónico, contraseña, teléfono</li>
            <li><strong>Datos de Compra:</strong> información de tarjeta de crédito/débito (procesada por Stripe), dirección de envío</li>
            <li><strong>Perfil:</strong> foto de perfil, preferencias de eventos, historial de compras</li>
            <li><strong>Datos de Navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, hora de acceso</li>
            <li><strong>Cookies:</strong> información sobre tu actividad en la plataforma</li>
            <li><strong>Datos de Contacto:</strong> si nos escribes, guardaremos tu mensaje y correspondencia</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            4. Finalidad del Tratamiento de Datos
          </h2>
          <p class="mb-4">
            Utilizamos tus datos personales para:
          </p>
          <ul class="ml-4 mb-4">
            <li>Procesar tu registro y crear tu cuenta</li>
            <li>Procesar transacciones y pagos de forma segura</li>
            <li>Emitir y entregar tus tickets digitales</li>
            <li>Enviar confirmaciones de compra y notificaciones de eventos</li>
            <li>Mejorar la experiencia de usuario en la plataforma</li>
            <li>Prevenir fraude y garantizar seguridad</li>
            <li>Cumplir con obligaciones legales y regulatorias ecuatorianas</li>
            <li>Enviar promociones y ofertas (solo si aceptaste recibir comunicaciones de marketing)</li>
            <li>Atender consultas y reclamos de soporte</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            5. Base Legal para el Tratamiento
          </h2>
          <p class="mb-4">
            El tratamiento de tus datos personales se basa en:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Consentimiento:</strong> que proporcionaste al registrarte y aceptar esta política</li>
            <li><strong>Ejecución de Contrato:</strong> necesario para procesar tu compra y entrega de tickets</li>
            <li><strong>Obligación Legal:</strong> para cumplir con leyes ecuatorianas (SRI, sistemas de pago, etc.)</li>
            <li><strong>Interés Legítimo:</strong> para mejorar nuestros servicios y prevenir fraude</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            6. Derechos de los Titulares de Datos (LOPDP)
          </h2>
          <p class="mb-4">
            Conforme a la Ley Orgánica de Protección de Datos Personales, tienes los siguientes derechos:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Derecho de Acceso:</strong> acceder a tus datos personales en nuestro poder</li>
            <li><strong>Derecho de Rectificación:</strong> corregir datos inexactos o incompletos</li>
            <li><strong>Derecho de Supresión ("Derecho al Olvido"):</strong> solicitar la eliminación de tus datos en ciertos casos</li>
            <li><strong>Derecho de Portabilidad:</strong> recibir tus datos en un formato estructurado</li>
            <li><strong>Derecho de Oposición:</strong> oponerte al procesamiento de tus datos para ciertos fines</li>
            <li><strong>Derecho a la Limitación:</strong> solicitar que limitemos el uso de tus datos</li>
            <li><strong>Derecho a Revocar Consentimiento:</strong> retirar tu consentimiento en cualquier momento</li>
          </ul>
          <p class="mb-4">
            Para ejercer cualquiera de estos derechos, contacta a: <strong>privacidad@abrakdabra.ec</strong>
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            7. Compartición de Datos
          </h2>
          <p class="mb-4">
            Compartimos tus datos personales solo con:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Proveedores de Pagos:</strong> Stripe (procesamiento seguro de tarjetas)</li>
            <li><strong>Organizadores de Eventos:</strong> nombre e email para coordinación de evento</li>
            <li><strong>Autoridades Ecuatorianas:</strong> cuando lo requiera la ley (SRI, policía, etc.)</li>
            <li><strong>Socios Técnicos:</strong> hosting, análisis y seguridad (solo bajo acuerdos de confidencialidad)</li>
          </ul>
          <p class="mb-4">
            <strong>No vendemos ni alquilamos tu información a terceros para marketing.</strong>
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            8. Seguridad de Datos
          </h2>
          <p class="mb-4">
            Implementamos medidas de seguridad técnicas y organizacionales para proteger tus datos:
          </p>
          <ul class="ml-4 mb-4">
            <li>Encriptación SSL/TLS en todas las conexiones</li>
            <li>Bases de datos encriptadas</li>
            <li>Control de acceso mediante autenticación fuerte</li>
            <li>Monitoreo continuo de seguridad</li>
            <li>Acceso restringido a datos personales (solo personal autorizado)</li>
            <li>Cumplimiento con estándares internacionales de seguridad</li>
          </ul>
          <p class="mb-4">
            Sin embargo, ningún sistema es 100% seguro. Si experimentas una violación de seguridad, 
            te notificaremos según lo requiera la ley ecuatoriana.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            9. Cookies y Tecnologías Similares
          </h2>
          <p class="mb-4">
            Utilizamos cookies para:
          </p>
          <ul class="ml-4 mb-4">
            <li>Mantener tu sesión activa</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar comportamiento de usuarios (Google Analytics)</li>
            <li>Mejorar la experiencia de navegación</li>
          </ul>
          <p class="mb-4">
            Puedes controlar cookies desde tu navegador. La desactivación de cookies puede afectar 
            el funcionamiento de la plataforma.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            10. Retención de Datos
          </h2>
          <p class="mb-4">
            Conservamos tus datos personales durante:
          </p>
          <ul class="ml-4 mb-4">
            <li><strong>Datos de Cuenta:</strong> mientras tu cuenta esté activa + 3 años tras cancelación (por obligación legal)</li>
            <li><strong>Datos de Transacciones:</strong> 7 años (según legislación tributaria ecuatoriana)</li>
            <li><strong>Datos de Navegación:</strong> máximo 1 año</li>
            <li><strong>Cookies:</strong> según su configuración (típicamente 1-2 años)</li>
          </ul>
          <p class="mb-4">
            Después del período de retención, eliminamos o anonimizamos tus datos, excepto cuando 
            exista obligación legal de mantenerlos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            11. Transferencias Internacionales
          </h2>
          <p class="mb-4">
            Algunos proveedores (como Stripe para pagos) pueden procesar datos fuera de Ecuador. 
            Estos transferencias:
          </p>
          <ul class="ml-4 mb-4">
            <li>Solo ocurren con proveedores que cumplen estándares internacionales de seguridad</li>
            <li>Se amparan en contratos de protección de datos (Data Processing Agreements)</li>
            <li>Cumplen con la LOPDP ecuatoriana</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            12. Derechos de Menores
          </h2>
          <p class="mb-4">
            Abrakdabra no está dirigida a menores de 18 años. Si eres menor, solicita consentimiento 
            de tus padres/tutores antes de usar la plataforma. Si descubrimos que has proporcionado 
            datos siendo menor, eliminaremos tu cuenta y datos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            13. Cambios en esta Política
          </h2>
          <p class="mb-4">
            Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. 
            Los cambios entran en vigencia al publicarlos. Tu uso continuado de la plataforma implica 
            aceptación de los cambios. Para cambios significativos, notificaremos vía correo electrónico.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            14. Contacto y Solicitudes de Privacidad
          </h2>
          <p class="mb-4">
            Para:
          </p>
          <ul class="ml-4 mb-4">
            <li>Ejercer tus derechos de privacidad</li>
            <li>Reportar una violación de privacidad</li>
            <li>Hacer preguntas sobre esta política</li>
            <li>Presentar una queja</li>
          </ul>
          <p class="mb-4">
            <strong>Contacta a:</strong><br>
            Correo: <a href="mailto:privacidad@abrakdabra.ec" class="text-primary">privacidad@abrakdabra.ec</a><br>
            Teléfono: +593 2 1234567<br>
            Dirección: Retro Lens Optical, Quito, Ecuador
          </p>
          <p class="mb-4">
            Responderemos tu solicitud en un máximo de <strong>10 días hábiles</strong> conforme a la LOPDP.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-h6 mb-3">
            15. Derechos ante Autoridad de Control
          </h2>
          <p class="mb-4">
            Si consideras que el tratamiento de tus datos personales infringe la ley, puedes presentar 
            una denuncia ante la <strong>Superintendencia de la Economía Popular y Solidaria (SEPS)</strong> 
            o la autoridad competente ecuatoriana.
          </p>
        </section>

        <section>
          <h2 class="text-h6 mb-3">
            16. Cumplimiento Legal
          </h2>
          <p class="mb-4">
            Esta Política de Privacidad cumple con:
          </p>
          <ul class="ml-4 mb-4">
            <li>Ley Orgánica de Protección de Datos Personales (LOPDP)</li>
            <li>Código Orgánico Integral Penal (COIP)</li>
            <li>Ley de Comercio Electrónico, Firmas y Mensajes de Datos</li>
            <li>Regulaciones del SRI (Servicio de Rentas Internas)</li>
          </ul>
          <p class="mb-4 text-body-2 text-medium-emphasis">
            <strong>Al usar Abrakdabra, reconoces haber leído y entendido esta Política de Privacidad y aceptas el tratamiento de tus datos conforme a la misma.</strong>
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
