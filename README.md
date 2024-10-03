# **Demo App**

Experiments using MERN stack for an app designed to help users store and manage online marketing documents. 

- create account, login / logout (currently JSON Web Tokens in development phase)
- protected API routes = after succesful login, user may now access just their own set of documents 
- CRUD functionality for their documents
- dotenv module and .env file for sensitive data
- formatting with ESLint & Prettier 

## **Stack:**
- MongoDB with Mongoose 
- Express
- Node.js 
- React.js 
- originally using Create React App, now migrated to Vite in a separate branch

- Testing requests: Postman API Platform
- Original design files: Figma


## **Next ToDos: work in progress** 

### **Globally**
1) Complete a11y audits (using tools such as Wave and NVDA screen reader). 
2) Add frontend and backend input sanitization (validator.js / DOM Purify & express-validator). 
3) Self-host fonts using woff & woff2 files.
3) Testing and performance audit.

### **Home Page** 

1) Add bulk delete feature for table if client requests.

### **Auth**
1) SSO to replace current development phase JWT email & password system

### **Documentation**
1) Review development phase comments for refactor using JSDoc library.


### **Earlier concepts**
 Earlier concepts and frontend designs [here](https://github.com/rhw-repo/content_simple).




