# **Demo App**

Experiments using MERN stack for an app designed to help users store and manage documents like text (or links to Google Docs) for blog and social media posts. 

https://github.com/rhw-repo/mern-post-app/assets/85512549/cce600fc-0cbe-4871-ab85-71407813daf9

- create account, login / logout (JSON Web Tokens)
- protected API routes = after succesful login, user may now access just their own set of documents 
- create new document, on submit added to the database and renders to the "dashboard" 
- dotenv module and .env file for sensitive data

## **Stack:**
MongoDB with Mongoose 
Express
Node.js 
React.js (using Create React App)

Testing requests: Postman API Platform
Original design files: Figma


## **Next ToDos: work in progress** 

### **CSS**
1) Currently adding responsiveness for display across different devices (tablet, mobile, etc).

### **Features**
1) Consider adding multiple document delete option.
2) Consider adding WYSIWYG for input inside app.

### **Testing** 
1) Currently working on unit testing, with view to adding integration then e2e testing. 

### **Auth**
1) SSO to replace current JWT email & password system.

### **Deployment**
1) Final aim: deploy frontend with mock 'database backend' (example: possibly Mirage.js). 
2) Evaluate whether to continue to deploy backend and using which method (containerise or not).

### **Earlier concepts**
Earlier concepts and frontend designs [here](https://github.com/rhw-repo/content_simple).




