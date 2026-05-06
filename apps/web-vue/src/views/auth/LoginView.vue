<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const router = useRouter()

const isDisabled = computed(() => !email.value || !password.value)

async function handleSubmit() {
  error.value = null

  try {
    console.log({ email: email.value, password: password.value })
  } catch (err) {
    error.value = (err as Error).message ?? 'Something went wrong'
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Sign in</h1>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Email" />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@layer components {
  .page {
    min-block-size: 100dvh;
    display: grid;
    place-items: center;
    background-color: light-dark(var(--color-bg));

    .card {
      inline-size: min(400px, 100% - 2rem);
      padding: clamp(var(--space-4), 5vi, calc(var(--space-4) * 2));

      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;

      display: grid;
      gap: var(--space-4);

      container-type: inline-size;

      h1 {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 8cwq, 2.5rem);
        font-weight: 600;
        color: var(--color-text);
        text-shadow: 0 0 20px oklch(from var(--color-accent) l c h / 0.2);
        line-height: 1;
      }

      form {
        display: grid;
        gap: var(--space-4);

        .field {
          display: grid;
          gap: calc(var(--space-1) * 0.5);

          &:has(input:user-invalid) {
            --color-border: var(--color-error);
            --color-accent: var(--color-error);
          }

          &:has(input:focus) label {
            color: var(--color-accent);
          }

          label {
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--color-text-muted);
          }

          input {
            field-sizing: content;
            padding: 0.6em;

            background: oklch(from var(--color-bg) l c h / 0.5);
            border: 1px solid var(--color-border);
            border-radius: 6px;

            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &:focus-visible {
              outline: 2px solid var(--color-accent);
              outline-offset: 2px;
              border-color: transparent;
            }

            &::placeholder {
              color: var(--color-text-subtle);
            }
          }
        }

        button {
          padding-block: 1em;
          background: var(--color-accent);
          color: oklch(from var(--color-accent) calc(l - 0.6) c h);

          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;

          transition:
            transform 0.1s active,
            filter 0.2s;

          &:hover {
            filter: brightness(1.1) saturate(1.2);
          }

          &:active {
            transform: scale(0.98);
          }
        }
      }
    }
  }
}
</style>
