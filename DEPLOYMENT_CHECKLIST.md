# 🚀 PatchPoint Deployment Checklist

## ✅ Pre-Deployment (Local Testing)

- [x] Frontend builds without errors: `npm run build` ✨
- [x] Backend starts successfully: `npm run dev` ✨
- [x] MongoDB connection works ✨
- [x] Login/Signup functionality tested ✨
- [x] Dashboard loads & fetches potholes ✨
- [x] Map displays with markers ✨
- [x] File upload works ✨
- [x] Comments section functional ✨
- [x] Pi upload endpoint ready ✨
- [x] All code committed to GitHub ✨

---

## 🔄 Frontend Deployment (Choose One)

### **Option A: Vercel (Recommended)**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Import Project"
- [ ] Select GitHub repo: `Keerthiii21/temp`
- [ ] Set Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Set Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.com
  ```
- [ ] Click Deploy
- [ ] ✅ Frontend deployed at `*.vercel.app`

### **Option B: Netlify**
- [ ] Go to [netlify.com](https://netlify.com)
- [ ] Click "New site from Git"
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Publish Directory: `frontend/dist`
- [ ] Set Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.com
  ```
- [ ] Click Deploy
- [ ] ✅ Frontend deployed at `*.netlify.app`

### **After Frontend Deploy:**
- [ ] Note your frontend URL (e.g., `https://patchpoint.vercel.app`)
- [ ] Update backend `CORS_ORIGIN` to include this URL
- [ ] Restart backend with new CORS setting

---

## 🗄️ Backend Deployment (Choose One)

### **Option A: Render (Easiest)**
- [ ] Go to [render.com](https://render.com)
- [ ] Create Account & Verify Email
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub Repository
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Name: `patchpoint-backend`
- [ ] Runtime: `Node`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Set Environment Variables:
  ```
  PORT=5000
  MONGO_URI=<your_mongodb_uri>
  JWT_SECRET=<your_jwt_secret>
  CORS_ORIGIN=https://your-frontend-domain.com
  CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
  CLOUDINARY_API_KEY=<your_cloudinary_key>
  CLOUDINARY_API_SECRET=<your_cloudinary_secret>
  ```
- [ ] Click Deploy
- [ ] ✅ Backend deployed at `*.render.com`

### **Option B: Railway**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Create Account
- [ ] New Project → Deploy from GitHub
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Add Variables (same as Render above)
- [ ] Set Root Directory: `backend`
- [ ] ✅ Backend deployed

### **Option C: Heroku**
- [ ] Go to [heroku.com](https://heroku.com)
- [ ] Create Account
- [ ] New App → `patchpoint-backend`
- [ ] Connect GitHub
- [ ] Select repo & enable auto-deploy
- [ ] Go to Settings → Config Vars (add same env vars as Render)
- [ ] Deploy
- [ ] ✅ Backend deployed at `*.herokuapp.com`

### **After Backend Deploy:**
- [ ] Note your backend URL (e.g., `https://patchpoint-backend.render.com`)
- [ ] Update frontend `VITE_API_URL` to this URL
- [ ] Trigger frontend re-deploy (push to main or manual redeploy)

---

## 🗄️ Database Setup

- [ ] Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- [ ] Create Free Tier Cluster
- [ ] Create Database User with strong password
- [ ] Whitelist your backend IP (or 0.0.0.0 for Render/Heroku)
- [ ] Get Connection String: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
- [ ] Add to backend environment variables as `MONGO_URI`
- [ ] ✅ Database accessible from backend

---

## ☁️ Image Storage Setup

- [ ] Go to [cloudinary.com](https://cloudinary.com)
- [ ] Create Free Account
- [ ] Get your Cloud Name from dashboard
- [ ] Go to Settings → API Keys
- [ ] Copy API Key and API Secret
- [ ] Add to backend environment variables:
  ```
  CLOUDINARY_CLOUD_NAME=<your_cloud_name>
  CLOUDINARY_API_KEY=<your_api_key>
  CLOUDINARY_API_SECRET=<your_api_secret>
  ```
- [ ] ✅ Image uploads working

---

## 🧪 Post-Deployment Testing

### Test Frontend
- [ ] Frontend loads: `https://your-frontend-domain.com` ✅
- [ ] Login page appears (no CORS errors) ✅
- [ ] Can sign up new account ✅
- [ ] Can login with account ✅
- [ ] Dashboard loads & shows stats ✅
- [ ] Map displays potholes ✅
- [ ] Can upload image ✅

### Test Backend API
```bash
# Get all potholes
curl https://your-backend-url.com/api/potholes

# Test signup
curl -X POST https://your-backend-url.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Test Pi Upload
```bash
curl -X POST https://your-backend-url.com/api/potholes/pi-upload \
  -F "image=@/path/to/image.jpg" \
  -F "lat=37.7749" \
  -F "lon=-122.4194" \
  -F "depth=8.5" \
  -F "timestamp=$(date +%s)000"
```

---

## 📱 Raspberry Pi Deployment

- [ ] Update `FINAL_INTEGRATION_STORED_VIDEO.py`:
  ```python
  BACKEND_URL = "https://your-backend-url.com/api/potholes/pi-upload"
  ```
- [ ] Install Python dependencies:
  ```bash
  pip3 install requests
  ```
- [ ] Test upload:
  ```bash
  python3 FINAL_INTEGRATION_STORED_VIDEO.py
  ```
- [ ] Integrate into detection pipeline:
  ```python
  from FINAL_INTEGRATION_STORED_VIDEO import send_to_backend
  send_to_backend(image_path, lat, lon, depth_cm, timestamp_ms)
  ```
- [ ] ✅ Pi auto-uploading to backend

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files (check `.gitignore`)
- [ ] Use strong `JWT_SECRET` (min 32 chars in production)
- [ ] Cloudinary credentials are secret (not in code)
- [ ] MongoDB whitelist includes backend IP only
- [ ] Frontend `VITE_API_URL` uses HTTPS in production
- [ ] Backend `CORS_ORIGIN` restricted to frontend domain
- [ ] All environment variables set in deployment platform
- [ ] No sensitive data in GitHub commits

---

## 🎯 Verification Links

After deployment, check these:

- [ ] Frontend: `https://your-frontend-domain.com`
- [ ] Backend API: `https://your-backend-url.com/` (should return JSON)
- [ ] API Docs: `https://your-backend-url.com/api/potholes` (should list potholes)
- [ ] GitHub: `https://github.com/Keerthiii21/temp` (all commits visible)

---

## 🚨 If Something Goes Wrong

### CORS Error in Frontend
- [ ] Check backend `CORS_ORIGIN` includes frontend URL
- [ ] Restart backend deployment (redeploy)
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### "Cannot POST" Error
- [ ] Verify backend is running
- [ ] Check API URL is correct in frontend `.env`
- [ ] Verify frontend has been redeployed after env change

### MongoDB Connection Error
- [ ] Check `MONGO_URI` is correct
- [ ] Whitelist backend IP in MongoDB Atlas
- [ ] Verify network access is enabled

### Image Upload Fails
- [ ] Check Cloudinary credentials are correct
- [ ] Verify Cloudinary folder `patchpoint/pi` exists
- [ ] Check storage quota (free tier has limits)

---

## 📊 Monitoring Checklist

### After 24 Hours of Production:
- [ ] Check Render/Railway/Heroku dashboard for errors
- [ ] Monitor MongoDB Atlas for storage usage
- [ ] Check Cloudinary for image uploads
- [ ] Verify frontend page loads are fast (<3s)
- [ ] Check GitHub Actions if any CI/CD configured

### Weekly Maintenance:
- [ ] Review error logs in deployment platform
- [ ] Check database growth in MongoDB
- [ ] Verify all API endpoints are responsive
- [ ] Test Pi uploads are working
- [ ] Update frontend cache (CDN invalidation if needed)

---

## ✨ Deployment Complete!

Once all checkboxes are ✅, your PatchPoint system is production-ready:

```
🌐 Frontend  → vercel.app or netlify.app
📡 Backend   → render.com or railway.app  
🗄️  Database  → MongoDB Atlas
☁️  Images    → Cloudinary
📱 Pi        → Running and uploading
🔒 Secure    → All secrets protected
```

**Congratulations! PatchPoint is live! 🎉**

---

## 🔗 Quick Links

- GitHub Repo: https://github.com/Keerthiii21/temp
- QUICKSTART.md: Local development guide
- DEPLOYMENT.md: Detailed deployment steps
- README.md: Full project documentation

**Next: Monitor your application and celebrate! 🚀**
