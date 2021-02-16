import { createApp } from 'vue'
import VueGtag from 'vue-gtag-next'
import App from './App.vue'
import './index.css'

let app = createApp(App)
app.use(VueGtag, {
  property: {
    id: 'G-2D1PTRRNPB'
  }
})
app.mount('#app')
