import { ref } from 'vue'

export function PasswordVisibility(){
  const showPwd = ref(false)
  const showRPwd = ref(false)

  function togglePassword(field: 'main' | 'repeat'){
    if(field === 'main') showPwd.value = !showPwd.value
    else showRPwd.value = !showRPwd.value
  }

  return {
    showPwd,
    showRPwd,
    togglePassword
  }
}