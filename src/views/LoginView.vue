<template>
    <div class="login-wrapper">
        <div class="login-container">
            <h2 class="brand">Controle de Transações</h2>
            <p class="subtitle">Faça login para continuar</p>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="email" type="email" placeholder="Digite seu email" required autocomplete="email" />
                </div>
                <div class="form-group">
                    <label>Senha</label>
                    <input v-model="password" type="password" placeholder="Digite sua senha" required autocomplete="current-password"/>
                </div>
                <button type="submit" :disabled="loading" class="btn-primary">
                    <span v-if="loading">Entrando...</span>
                    <span v-else>Entrar</span>
                </button>
            </form>
            <transition name="fade">
                <p v-if="error" class="error">{{ error }}</p>
            </transition>
        </div>
    </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/axios'

  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  const router = useRouter()

  const login = async () => {
      loading.value = true
      error.value = ''
      try {
          const response = await api.post('/login', {
              email: email.value,
              password: password.value,
              device_name: 'vue-app'
          })
          localStorage.setItem('token', response.data.token)
          router.push('/dashboard')
      } catch (err) {
          error.value = err.response?.data?.message || 'Email ou senha inválidos'
      } finally {
          loading.value = false
      }
  }
</script>

<style scoped>
.login-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    padding: 20px;
}

.login-container {
    background: white;
    width: 100%;
    max-width: 420px;
    padding: 40px;
    border-radius: 14px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.4s ease;
}

.brand {
    text-align: center;
    margin-bottom: 5px;
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
}

.subtitle {
    text-align: center;
    margin-bottom: 25px;
    font-size: 14px;
    color: #6b7280;
}

label {
    font-size: 13px;
    margin-bottom: 6px;
    color: #374151;
}

input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    transition: all 0.2s ease;
}

input:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.btn-primary {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border-radius: 8px;
    border: none;
    background: #2563eb;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary:hover {
   background: #1d4ed8;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error {
    margin-top: 15px;
    background: #fee2e2;
    color: #b91c1c;
    padding: 10px;
    border-radius: 6px;
    font-size: 14px;
    text-align: center;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 480px) {
    .login-container {
        padding: 25px;
    }
}

.toggle {
    margin-top: 25px;
    font-size: 14px;
    color: #6b7280;
    text-align: center;
}

.link-btn {
    background: transparent;
    border: none;
    padding: 0;
    margin-left: 6px;
    font-weight: 600;
    font-size: 14px;
    color: #2563eb;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s ease;
}

.link-btn:hover {
    color: #1d4ed8;
}

.link-btn::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0%;
    height: 2px;
    background: #1d4ed8;
    transition: width 0.3s ease;
}

.link-btn:hover::after {
   width: 100%;
}
</style>