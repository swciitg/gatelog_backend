 //require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});
 import dotenv from 'dotenv';
 dotenv.config();
 import formidableMiddleware from 'express-formidable';
 import AdminJS from 'adminjs';
 import AdminJSExpress from '@adminjs/express';
 import * as AdminJSMongoose from '@adminjs/mongoose';
 import KhokhaEntryModel from './models/khokhaEntryModel.js';
// const express=require('express');
import express from 'express';
import http from 'http';
// const http = require("http");
import {WebSocketServer} from 'ws';

import { connect } from 'mongoose';

// const WebSocket = require("ws");
// const { connectionHandler } = require('./handlers/websocketHandler');
import { connectionHandler } from './handlers/websocketHandler.js';

import khokhaEntryRouter from './routers/khokhaEntryRouter.js';
// const khokhaEntryRouter = require('./routers/khokhaEntryRouter');
// const { errorHandler } = require("./middlewares/errorHandler");
import {errorHandler} from './middlewares/errorHandler.js';
// const mongoose=require("mongoose");
import mongoose from 'mongoose';
// const securityKeyMiddleware = require("./middlewares/securityKeyMiddleware");
import securityKeyMiddleware from './middlewares/securityKeyMiddleware.js';
// const { isConnectedHelper, closeConnectionHelper, sendMessageToSocketHelper } = require('./helpers/websocketHelper');
import {isConnectedHelper,closeConnectionHelper,sendMessageToSocketHelper} from './helpers/websocketHelper.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// UPGRADES HTTP CONNECTION TO WS FOR THE WEBSOCKET ENDPOINT
server.on('upgrade', (req, socket, head) => {
    if(req.url === process.env.WEBSOCKET_CONNECTION_PATH){
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

app.use((req, res, next) => {
    console.log(req.method + '\t' + req.url);
    next();
});
app.use(express.json());
app.use(securityKeyMiddleware);

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
  }
  
  const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
  }
  
  app.use(formidableMiddleware());
  
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
  
  const deleteMultipleRequestsHandler = async (request, response, data) => {
    const { recordIds } = request.body;
  
    try {
      // Validate if recordIds is an array
      if (!Array.isArray(recordIds)) {
        throw new Error('Invalid recordIds format');
      }
  
      // Use deleteMany to delete multiple records
      const obj = await Request.deleteMany({ _id: { $in: recordIds } });
      console.log(obj);
  
      // Return an array of deleted record IDs in the expected format
      return { obj };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  const adminOptions = {
    resources: [
      KhokhaEntryModel
      // {
      //   resource: Request,
      //   options: {
      //     actions: {
      //       delete: {
      //         handler: async (request, response, data) => {
      //           await Request.findByIdAndDelete(request.params.recordId);
      //           return { record: data.record.toJSON(data.currentAdmin) };
      //         },
      //       },
      //       bulkDelete:{
      //         isVisible:false
      //       }
      //     },
      //   },
      // },
      // {
      //   resource: User,
      //   options: {
      //     actions: {
      //       delete: {
      //         handler: async (request, response, data) => {
      //           await User.findByIdAndDelete(request.params.recordId);
      //           return { record: data.record.toJSON(data.currentAdmin) };
      //         },
      //       },
      //       bulkDelete:{
      //         isVisible:false
      //       }
      //     },
      //   },
      // },
      // {
      //   resource: Admins,
      //   options: {
      //     actions: {
      //       delete: {
      //         handler: async (request, response, data) => {
      //           await Admins.findByIdAndDelete(request.params.recordId);
      //           return { record: data.record.toJSON(data.currentAdmin) };
      //         },
      //       },
      //       bulkDelete:{
      //         isVisible:false
      //       }
      //     },
      //   },
      // },
    ],
    authenticate
    // authenticate: async (email, password) => {
    //   const user = await User.findOne({ email });
    //   if (user && bcrypt.compareSync(password, user.encryptedPassword)) {
    //     return user;
    //   }
    //   return null;
    // },
  };
  
  const admin = new AdminJS(adminOptions);
  
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    cookieName: 'adminjs',
    cookiePassword: 'complicatedsecurepassword',
    authenticate
    // authenticate: async (email, password, next) => {
    //   const user = await User.findOne({ email });
    //   if (user) {
    //     const matched = await bcrypt.compare(password, user.password);
    //     if (matched) {
    //       return user; 
    //     }
    //   }
    //   return false;
    // },
  });
  
  admin.watch();
  
  
// app.use(process.env.BASE_URL, khokhaEntryRouter);
app.use('/', khokhaEntryRouter);
app.use(errorHandler);
connect('mongodb+srv://123:123@cluster0.enwbfbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.use(admin.options.rootPath, adminRouter)
wss.on('connection', connectionHandler);

export const sendMessageToSocket = (id, data) => sendMessageToSocketHelper(wss, id, data);
export const isConnected = (id) => isConnectedHelper(wss, id);
export const closeConnection = (id) => closeConnectionHelper(wss, id);


server.listen(process.env.PORT, async() => {
    // try{
    //     await mongoose.connect(process.env.DATABASE_URI);
    //     console.log("Connected to database");
    // }catch(e){
    //     console.log(e.message);
    // }
    console.log(`Server running on port ${process.env.PORT}`);
});