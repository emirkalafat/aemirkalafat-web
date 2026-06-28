<template>
  <div class="bg-surface-container-lowest text-on-surface font-body-md min-h-screen flex items-center justify-center px-margin-mobile">
    <div class="w-full max-w-sm border-2 border-primary bg-surface-container-lowest p-gutter">
      <div class="mb-gutter text-center border-b border-primary pb-gutter">
        <h1 class="text-headline-md font-headline-md text-on-surface uppercase">KALAFAT</h1>
        <p class="font-code text-code text-on-surface-variant text-xs mt-2">ADMIN_v1.0.0</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-gutter">
        <div class="flex flex-col">
          <label class="font-code text-code text-on-surface-variant text-xs uppercase mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            class="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border-0 border-b-2 border-on-surface focus:ring-0 focus:border-tertiary py-2 font-body-md transition-colors outline-none"
            required
          />
        </div>

        <div class="flex flex-col">
          <label class="font-code text-code text-on-surface-variant text-xs uppercase mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border-0 border-b-2 border-on-surface focus:ring-0 focus:border-tertiary py-2 font-body-md transition-colors outline-none"
            required
          />
        </div>

        <div v-if="errorMsg" class="bg-error-container text-error px-4 py-2 border border-error text-code text-xs">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-on-surface text-surface py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-tertiary transition-colors disabled:opacity-50 border border-on-surface hover:border-tertiary"
        >
          {{ loading ? 'LOGGING IN...' : 'LOGIN' }}
        </button>
      </form>

      <p class="text-code text-code text-on-surface-variant text-xs mt-gutter text-center">
        Admin access only. No registration available.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    const redirect = route.query.redirect as string || '/admin'
    router.push(redirect)
  } catch (e) {
    errorMsg.value = error.value || 'Login failed'
  }
}
</script>
