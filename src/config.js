export default {
    // Default config - can be overwritten with environment variables (.env file)
    DEV_HOST_IP: 'localhost', // needed for cors setup on developing
    DEV_PORT_FRONTEND: 3000, // developing port for frontend
    DEV_PORT_BACKEND: 3001, // developing port for backend
    PORT_PRODUCTION: 8800 // port for production (used for both - frontend and backend)
}
