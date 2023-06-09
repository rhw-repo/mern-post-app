# **Demo App**

Experiments using MERN stack for an app designed to help users store and manage documents like text (or links to Google Docs) for blog and social media posts. 

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

### **Globally**
1) Upgrade to latest version of react-router = complete in mern-migrate-router repo, now adding features
2) Test migration from Create React App to Vite 


### **Home Page** 

1) Create an "add" functionality for users to be able to tag (label) their content

    a.) allow selection of tags instead of inputting them by typing 
    
    b.) to allow creation or editing tags by typing them

2) Edit Tags feature.


### **Auth**
1) Potentially SSO to replace current JWT email & password system


### **Earlier concepts**


 Earlier concepts and frontend designs [here](https://github.com/rhw-repo/content_simple).




