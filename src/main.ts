import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBasketball,
  faTrophy,
  faCalendar,
  faUser,
  faBars,
  faSignInAlt,
  faUserPlus,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
  faInfoCircle,
  faExclamationCircle,
  faTimes,
  faClipboardList,
  faCalendarAlt,
  faClock,
  faDollarSign,
  faUsers,
  faUserShield,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faListAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(
  faBasketball,
  faTrophy,
  faCalendar,
  faUser,
  faBars,
  faSignInAlt,
  faUserPlus,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
  faInfoCircle,
  faExclamationCircle,
  faTimes,
  faClipboardList,
  faCalendarAlt,
  faClock,
  faDollarSign,
  faUsers,
  faUserShield,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faListAlt,
  faExclamationTriangle,
  faFacebook,
  faTwitter,
  faInstagram,
)

// Import Tailwind CSS
import './assets/styles/main.css'

const app = createApp(App)

// Register Font Awesome component globally
app.component('FontAwesomeIcon', FontAwesomeIcon)

// Use plugins
app.use(createPinia())
app.use(router)

app.mount('#app')
