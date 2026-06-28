<template>
  <div class="p-gutter md:p-margin-desktop flex justify-center items-start pt-12">
    <div class="w-full max-w-lg border border-on-surface bg-surface-container-lowest">
      <!-- Header -->
      <div class="bg-on-surface text-surface px-6 py-4 border-b-2 border-on-surface flex items-center gap-3">
        <span class="material-symbols-outlined text-[20px]">mail</span>
        <h1 class="font-headline-md text-headline-md uppercase">CONTACT</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="sendEmail" class="p-6 space-y-6">
        <!-- Email Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code text-xs text-on-surface-variant uppercase tracking-wider">EMAIL</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="example@email.com"
            required
            class="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border-b-2 border-on-surface focus:border-tertiary font-body-md py-3 px-0 outline-none transition-colors"
          />
        </div>

        <!-- Subject Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code text-xs text-on-surface-variant uppercase tracking-wider">SUBJECT</label>
          <input
            v-model="formData.subject"
            type="text"
            placeholder="Message subject"
            required
            class="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border-b-2 border-on-surface focus:border-tertiary font-body-md py-3 px-0 outline-none transition-colors"
          />
        </div>

        <!-- Message Field -->
        <div class="flex flex-col gap-2">
          <label class="font-code text-xs text-on-surface-variant uppercase tracking-wider">MESSAGE</label>
          <textarea
            v-model="formData.message"
            placeholder="Write your message here..."
            required
            rows="6"
            class="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant border-b-2 border-on-surface focus:border-tertiary font-body-md py-3 px-0 outline-none resize-none transition-colors"
          />
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" :class="[
          'p-3 border-l-4 font-code text-sm',
          isSending ? 'border-l-tertiary text-tertiary' : 'border-l-error text-error'
        ]">
          {{ statusMessage }}
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="isSending"
            class="flex-1 bg-on-surface text-surface py-3 font-label-md uppercase tracking-widest border border-on-surface hover:bg-tertiary hover:border-tertiary transition-colors disabled:opacity-50"
          >
            {{ isSending ? 'SENDING...' : 'SEND' }}
          </button>
          <RouterLink
            to="/"
            class="flex-1 bg-surface-container-highest text-on-surface py-3 font-label-md uppercase tracking-widest border border-on-surface hover:bg-surface-container transition-colors text-center"
          >
            CANCEL
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const formData = ref({
  email: '',
  subject: '',
  message: '',
})

const isSending = ref(false)
const statusMessage = ref('')

async function sendEmail() {
  isSending.value = true
  statusMessage.value = ''

  try {
    // mailto link açma alternatifi - gerçek backend implementasyonunda
    // burada API çağrısı yapılacak
    const mailtoLink = `mailto:ahmet.emir.kalafat@talsen.team?subject=${encodeURIComponent(formData.value.subject)}&body=${encodeURIComponent(
      `Ad/E-posta: ${formData.value.email}\n\n${formData.value.message}`
    )}`

    window.location.href = mailtoLink

    statusMessage.value = '✓ Opening email client...'

    // Clear form
    setTimeout(() => {
      formData.value = { email: '', subject: '', message: '' }
      statusMessage.value = ''
      isSending.value = false
    }, 2000)
  } catch (error) {
    statusMessage.value = '✗ Error: ' + (error as any).message
    isSending.value = false
  }
}
</script>
