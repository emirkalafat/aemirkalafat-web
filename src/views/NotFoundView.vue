<template>
  <div class="bg-surface-container-lowest text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center px-margin-mobile gap-8">

    <!-- 404 -->
    <div class="flex flex-col gap-6 items-start max-w-lg w-full">
      <div class="inline-block border border-error px-4 py-2">
        <span class="glitch font-code text-code text-error" data-text="⚠ ROUTE_NOT_FOUND">⚠ ROUTE_NOT_FOUND</span>
      </div>

      <h1 class="font-display leading-none">
        <span class="text-transparent" style="-webkit-text-stroke: 2px rgb(var(--color-on-surface)); font-size: clamp(5rem, 20vw, 10rem);">404</span>
      </h1>

      <div class="border-l-4 border-error pl-4">
        <p class="font-code text-code text-error mb-1">[FATAL] {{ randomMessage }}</p>
      </div>

      <button @click="navigate"
        class="bg-primary text-on-primary border border-primary font-label-md text-label-md px-8 py-4 uppercase hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#BD00FF] transition-all duration-100 flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">{{ canGoBack ? 'arrow_back' : 'home' }}</span>
        {{ canGoBack ? 'Go Back' : 'Go Home' }}
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const canGoBack = window.history.length > 1

const messages = [
  'The page you\'re looking for is in another castle.',
  'It\'s dangerous to go alone — and apparently, to type URLs too.',
  'You died. Would you like to return to the last bonfire?',
  'This page has left the map. Here be dragons.',
  'The cake is a lie. So is this URL.',
  'Error 404: A wizard did it.',
  'You have been eaten by a grue.',
  'No loot found at this location. Try a different dungeon.',
  'Respawning... just kidding, there\'s nothing here.',
  'The Triforce of this page is missing.',
]

const randomMessage = messages[Math.floor(Math.random() * messages.length)]

function navigate() {
  if (canGoBack) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.glitch {
  position: relative;
  display: inline-block;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glitch::before {
  color: #ff0040;
  animation: glitch-top 2s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
}

.glitch::after {
  color: #4cd6ff;
  animation: glitch-bot 2s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
}

@keyframes glitch-top {
  0%, 80%  { transform: none; opacity: 0; }
  81%      { transform: translateX(-3px); opacity: 1; }
  83%      { transform: translateX(3px); opacity: 1; }
  85%      { transform: translateX(-2px) skewX(5deg); opacity: 1; }
  87%, 100% { transform: none; opacity: 0; }
}

@keyframes glitch-bot {
  0%, 82%  { transform: none; opacity: 0; }
  83%      { transform: translateX(3px); opacity: 1; }
  85%      { transform: translateX(-3px); opacity: 1; }
  87%      { transform: translateX(2px) skewX(-5deg); opacity: 1; }
  89%, 100% { transform: none; opacity: 0; }
}
</style>
