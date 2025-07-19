# 🔍 DATA CHECK COMMANDS REFERENCE

## 🚀 QUICK DATA CHECK (RECOMMENDED)

### Simple Command:
```bash
cd backend
node check-data.js
```

This will show you:
- ✅ All users (admin & students)
- ✅ All courses with details
- ✅ Student enrollments
- ✅ Learning progress
- ✅ Summary statistics

---

## 🗄️ MONGODB SHELL COMMANDS

### Connect to Database:
```bash
mongosh mongodb://localhost:27017/LMS
```

### Basic Data Queries:
```javascript
// Show all collections
show collections

// Count documents
db.users.countDocuments()
db.courses.countDocuments()
db.studentdetails.countDocuments()
db.progresses.countDocuments()

// View all data
db.users.find().pretty()
db.courses.find().pretty()
db.studentdetails.find().pretty()
db.progresses.find().pretty()
```

### Specific Queries:
```javascript
// Find admin users
db.users.find({"role": "admin"})

// Find student users
db.users.find({"role": "student"})

// Find completed courses
db.progresses.find({"isCompleted": true})

// Find courses by category
db.courses.find({"category": "Data Science"})

// Exit MongoDB shell
exit
```

---

## 🌐 API ENDPOINTS TO CHECK DATA

### Test with PowerShell:
```powershell
# Get all courses
Invoke-WebRequest -Uri "http://localhost:5002/api/courses" -Method GET

# Get specific course
Invoke-WebRequest -Uri "http://localhost:5002/api/courses/COURSE_ID" -Method GET
```

### Test with curl (if available):
```bash
# Get all courses
curl http://localhost:5002/api/courses

# Get specific course
curl http://localhost:5002/api/courses/COURSE_ID
```

---

## 🎯 WEB INTERFACE DATA CHECK

### Admin Panel:
1. Go to: http://localhost:3002
2. Login: admin@edulearn.com / admin123
3. Click "Admin Panel"
4. Click "View Database" tab
5. See all data in tables

### Student Dashboard:
1. Login as any student
2. Go to Dashboard
3. See enrolled courses and progress

---

## 📊 CURRENT DATA STATUS

Based on latest check:

### Users: 5 Total
- **1 Admin**: santhosh katakam (admin@edulearn.com)
- **4 Students**: Including John Student, pandu, etc.

### Courses: 10 Total
- Python for Data Science
- Digital Marketing Mastery
- Mobile App Development
- UI/UX Design Fundamentals
- Cybersecurity Essentials
- Cloud Computing with AWS
- AI Fundamentals
- Blockchain Development
- Photography Masterclass
- Data Science (custom)

### Enrollments: 4 Total
- Students enrolled in various courses
- All with complete student details

### Progress: 4 Records
- Video watching tracked
- Quiz scores recorded
- Completion percentages calculated

---

## 🔧 TROUBLESHOOTING

### If MongoDB Shell Not Available:
```bash
# Use the Node.js script instead
cd backend
node check-data.js
```

### If Backend Not Running:
```bash
cd backend
npm run dev
```

### If Frontend Not Showing Data:
1. Check browser console for errors
2. Verify backend is running on port 5002
3. Check network tab for API calls

---

## 💡 QUICK TIPS

### Most Useful Commands:
1. **Quick Overview**: `node check-data.js`
2. **Admin View**: Login to Admin Panel → View Database
3. **MongoDB Direct**: `mongosh mongodb://localhost:27017/LMS`

### What to Look For:
- ✅ User count increasing after signups
- ✅ Course enrollments after student details submission
- ✅ Progress records after video watching
- ✅ Quiz scores after quiz completion

**Use `node check-data.js` for the easiest and most comprehensive data check!**
