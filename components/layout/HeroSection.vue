<script setup lang="ts">
const props = defineProps<{
  background: string
  title: string
  subtitle?: string
  chip?: string
  ctaLabel?: string
  ctaTo?: string
}>()

const isMp4 = computed(() => props.background.endsWith('.mp4'))

const isYouTube = computed(() =>
  props.background.includes('youtube.com') ||
  props.background.includes('youtu.be')
)

const youtubeEmbedUrl = computed(() => {
  if (!isYouTube.value) return ''

  // Acepta tanto enlaces tipo watch como youtu.be
  // Ejemplos:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  const url = new URL(props.background)
  let videoId = ''

  if (url.hostname.includes('youtu.be')) {
    videoId = url.pathname.replace('/', '')
  } else {
    videoId = url.searchParams.get('v') || ''
  }

  if (!videoId) return ''

  // URL de embed con autoplay, mute, loop y sin sugeridos
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playsinline=1&playlist=${videoId}`
})
</script>

<template>
  <section class="hero-section">
    <!-- Fondo IMAGEN -->
    <v-img
      v-if="!isMp4 && !isYouTube"
      :src="background"
      class="hero-bg"
      cover
    >
      <div class="hero-overlay" />
      <div class="hero-content">
        <div class="hero-chip" v-if="chip">
          <v-chip color="primary" variant="flat" size="small">
            {{ chip }}
          </v-chip>
        </div>

        <h1 class="hero-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="hero-subtitle">
          {{ subtitle }}
        </p>

        <div class="hero-actions" v-if="ctaLabel && ctaTo">
          <v-btn
            color="primary"
            size="large"
            :to="ctaTo"
          >
            {{ ctaLabel }}
          </v-btn>
        </div>
      </div>
    </v-img>

    <!-- Fondo VIDEO .mp4 -->
    <div v-else-if="isMp4" class="hero-video-wrapper">
      <video
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
      >
        <source :src="background" type="video/mp4" />
      </video>

      <div class="hero-overlay" />
      <div class="hero-content">
        <div class="hero-chip" v-if="chip">
          <v-chip color="primary" variant="flat" size="small">
            {{ chip }}
          </v-chip>
        </div>

        <h1 class="hero-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="hero-subtitle">
          {{ subtitle }}
        </p>

        <div class="hero-actions" v-if="ctaLabel && ctaTo">
          <v-btn
            color="primary"
            size="large"
            :to="ctaTo"
          >
            {{ ctaLabel }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Fondo VIDEO YouTube -->
    <div v-else-if="isYouTube && youtubeEmbedUrl" class="hero-video-wrapper">
      <div class="hero-yt-container">
        <iframe
          class="hero-yt-iframe"
          :src="youtubeEmbedUrl"
          title="Abrakdabra hero video"
          frameborder="0"
          allow="autoplay; fullscreen; muted; picture-in-picture"
          allowfullscreen
        />
      </div>

      <div class="hero-overlay" />
      <div class="hero-content">
        <div class="hero-chip" v-if="chip">
          <v-chip color="primary" variant="flat" size="small">
            {{ chip }}
          </v-chip>
        </div>

        <h1 class="hero-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="hero-subtitle">
          {{ subtitle }}
        </p>

        <div class="hero-actions" v-if="ctaLabel && ctaTo">
          <v-btn
            color="primary"
            size="large"
            :to="ctaTo"
          >
            {{ ctaLabel }}
          </v-btn>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-section {
  position: relative;
  border-bottom: 1px solid rgba(148, 27, 52, 0.3);
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.hero-bg {
  height: 320px;
  width: 100%;

  @media (min-width: 960px) {
    height: 420px;
  }
}

.hero-video-wrapper {
  position: relative;
  height: 320px;
  width: 100%;

  @media (min-width: 960px) {
    height: 420px;
  }

  @media (min-width: 1280px) {
    height: 480px; // un poco más alto en pantallas grandes
  }
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-yt-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* "cover" manual del iframe para que llene todo */
.hero-yt-iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;   /* más ancho que el contenedor */
  height: 125%;  /* más alto que el contenedor */
  transform: translate(-50%, -50%);
  border: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(239, 68, 68, 0.35), transparent 55%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(12, 10, 10, 0.96));
}

.hero-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;

  @media (min-width: 960px) {
    padding: 0 48px;
  }
}

.hero-chip {
  margin-bottom: 12px;
}

.hero-title {
  font-size: 2rem;
  line-height: 1.1;
  margin: 0 0 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (min-width: 960px) {
    font-size: 2.6rem;
  }
}

.hero-subtitle {
  max-width: 560px;
  margin: 0 0 20px;
  font-size: 0.98rem;
  color: #d1d5db;
}

.hero-actions {
  display: flex;
  gap: 12px;
}
</style>
