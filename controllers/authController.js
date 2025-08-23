import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import khokhaEntryModel from '../models/KhokhaEntryModel.js';

dotenv.config();
const user = {
  username: process.env.ADMIN_EMAIL,
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
};
console.log('User credentials:', user.username, user.passwordHash);


export const getLoginPage = (req, res) => {
  if(req.session.user) {
    return res.redirect('/v1/admin/login');
  }
  res.render('login', { error: null });
};

export const login = (req, res) => {
  const { username, password } = req.body;
    console.log('Login attempt:', username, password);
  if (username === user.username && bcrypt.compareSync(password, user.passwordHash)) {
    req.session.user = username;
    res.redirect(process.env.BASE_URL + '/v1/admin/');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
};


export const getHomePage = async(req, res) => {
   const entries = await khokhaEntryModel.find().sort('-createdAt');
    if (!req.session.user) {
        return res.redirect(process.env.BASE_URL +'/v1/admin/login');
    }
    res.render('index', {files:[] , entries,  user: req.session.user });  
    }



export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect(process.env.BASE_URL + '/v1/admin/login');
  });
};

export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect(process.env.BASE_URL + '/v1/admin/login');
  }
};
export default {
  getLoginPage,
  login,
  logout,
  isAuthenticated,
};
