import Vue from 'vue'
import AuthenticatorDialog from './index.vue'

const SecurityDialog = Vue.extend(AuthenticatorDialog)

AuthenticatorDialog.install = function(data) {
  const instance = new SecurityDialog({
    data
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.open()
  })
}

export default AuthenticatorDialog
