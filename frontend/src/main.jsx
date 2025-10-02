import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles.css'
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')).render(
	<AuthProvider>
		<App />
	</AuthProvider>
)
