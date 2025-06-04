const fs = require('fs');
const path = require('path');

// Recursively search for .ts and .tsx files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git')) {
      findTsFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      (file.endsWith('.ts') || file.endsWith('.tsx')) && 
      !file.endsWith('.d.ts')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Remove all references to next-auth/react
function removeNextAuthImports(files) {
  let totalOccurrences = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Remove import statements for next-auth/react
    const importRegex = /import\s+.*?from\s+['"]next-auth\/react['"].*?;?/g;
    content = content.replace(importRegex, '// next-auth import removed');
    
    // Remove SessionProvider components
    const sessionProviderRegex = /<SessionProvider[^>]*>([\s\S]*?)<\/SessionProvider>/g;
    content = content.replace(sessionProviderRegex, '$1');
    
    // Remove useSession hooks
    const useSessionRegex = /const\s+\{.*?\}\s+=\s+useSession\(\);?/g;
    content = content.replace(useSessionRegex, '// useSession removed');
    
    // Count changes
    const fileOccurrences = 
      (originalContent.match(importRegex) || []).length + 
      (originalContent.match(sessionProviderRegex) || []).length + 
      (originalContent.match(useSessionRegex) || []).length;
    
    totalOccurrences += fileOccurrences;
    
    if (content !== originalContent) {
      console.log(`Modified: ${file} (${fileOccurrences} occurrences)`);
      fs.writeFileSync(file, content, 'utf8');
    }
  });
  
  return totalOccurrences;
}

console.log('Searching for TypeScript files...');
const files = findTsFiles('./src');
console.log(`Found ${files.length} TypeScript files.`);

console.log('Removing next-auth/react references...');
const totalOccurrences = removeNextAuthImports(files);
console.log(`Removed ${totalOccurrences} references to next-auth/react.`);

console.log('Done!'); 