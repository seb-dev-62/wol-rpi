import { ref } from 'vue'

export function messageToast(){

  const toast = useToast()

  const message = ref('')

  function showMessage(type: 'error' | 'warning' | 'success', message: string){

    switch (type) {
      case 'error':
        toast.add({
          title: 'Error',
          description: message,
          color: 'error'
        })
        break;
      
      case 'warning':
        toast.add({
          title: 'Warning',
          description: message,
          color: 'warning'
        })
        break;
      
      case 'success':
        toast.add({
          title: 'Success',
          description: message,
          color: 'success'
        })
        break;
      
      
      default:
        toast.add({
          title: 'Nothing',
          description: 'Nothing to see here!',
          color: 'neutral'
        })
        break;
    }
  }

  return{
    message,
    showMessage
  }
}