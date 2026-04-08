import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dirPath));
  });
}

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove or replace rounded classes
    content = content.replace(/\brounded-(2xl|3xl|xl|lg|md|sm|full)\b/g, 'rounded-none');
    
    // Remove backdrop-blur
    content = content.replace(/\bbackdrop-blur-(md|sm|lg|xl)\b/g, '');
    
    // Replace semi-transparent white/black backgrounds
    content = content.replace(/\bbg-white\/[0-9]+\b/g, 'bg-white');
    content = content.replace(/\bbg-black\/[0-9]+\b/g, 'bg-black');
    content = content.replace(/\bbg-primary\/[0-9]+\b/g, 'bg-primary');
    
    // Convert to solid borders
    content = content.replace(/\bborder-white\/[0-9]+\b/g, 'border-black');
    content = content.replace(/\bborder-white\b/g, 'border-black');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log("Migration script complete.");
