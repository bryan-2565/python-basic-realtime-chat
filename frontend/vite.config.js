import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel:{
        // dude... this plugin is a total life saver... idek if it's workign atp but not one lag spike even when filled w messages...
        plugins: [["babel-plugin-react-compiler"]],
      }
    })
  ],
  server: {
    host: true
  }
})
