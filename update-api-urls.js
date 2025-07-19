const fs = require('fs');
const path = require('path');

// Function to recursively find all .js files in src directory
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') && !file.includes('update-api-urls')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update API URLs in a file
function updateAPIUrls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace localhost:5000 with localhost:5001
  const oldPattern = /http:\/\/localhost:5000\/api/g;
  if (content.match(oldPattern)) {
    content = content.replace(oldPattern, '${API_BASE_URL}');
    
    // Add import if not already present
    if (!content.includes("import API_BASE_URL from")) {
      const importPattern = /(import.*from ['"][^'"]*['"];?\n)/;
      const lastImport = content.match(importPattern);
      if (lastImport) {
        const insertIndex = content.lastIndexOf(lastImport[0]) + lastImport[0].length;
        content = content.slice(0, insertIndex) + 
                 "import API_BASE_URL from '../config/api';\n" + 
                 content.slice(insertIndex);
      }
    }
    
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const jsFiles = findJSFiles(srcDir);

console.log('Updating API URLs in React components...');
jsFiles.forEach(updateAPIUrls);
console.log('API URL update complete!');
