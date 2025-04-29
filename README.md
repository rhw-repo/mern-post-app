# **Demo App**

Update: See the subsequent MVP [here](https://frontend-production-d277.up.railway.app). The code for this is in a private repo. 

This mern-post-app repo contains early experiments using MERN stack, with explanatory comments: concepts for an app designed to help users store and manage online marketing documents. From these early experiments, the project was taken forward to create a custom dashboard style app featuring custom filtering for a marketing team in the financial trading sector (in private repo). This early project allowed for testing of concepts:

- React hooks/custom hooks, context
- react-dom-router
- Tanstack Table (Javascript v7 version, "react-table")
- connecting library components from different libraries to "play nicely together"
- custom styling for library components, responsive design
- accesibility (aria, aria-live, minimum font-sizing & touchpads, contrast, keyboard support)
- migrating frontend from create-react-app to vite

- signup, login / logout (simple JSON Web Tokens in development phase)
- protected API routes = after succesful login, user accesses only their own set of documents
- CRUD functionality for their documents
- dotenv module and .env file for sensitive data

## **Technologies**

- MongoDB
- Mongoose
- Express
- Node.js
- React.js
- originally Create React App, later migrated to Vite in a separate branch

- Testing requests: Postman API Platform
- Formatting: ESLint & Prettier
- Accessibility testing: WAVE, NVDA screen reader
- Original design files: Figma

## **TODOs: completed in the subsequent project**

### **Globally**

1) Add frontend and backend input sanitization (validator.js, DOM Purify & express-validator).
2) Self-host fonts using woff & woff2 files.
3) Testing and performance audit.

### **Home Page**

1) Add bulk delete feature for table if client requests.

### **Auth**

1) SSO to replace current development phase JWT email & password system.

### **Documentation**

1) Review development phase comments for refactor using JSDoc library.

### **Earlier concepts**

 Earlier concepts and frontend designs [here](https://github.com/rhw-repo/content_simple).
