import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove glass-specific styling that contradicts Neo-Brutalism
    content = content.replace(/glass-card/g, '');
    content = content.replace(/hover:glass-strong/g, 'hover:-translate-y-1 hover:shadow-none');
    content = content.replace(/glass-strong/g, '');
    content = content.replace(/glass/g, '');
    content = content.replace(/shadow-glass/g, 'shadow-[4px_4px_0_0_#000]');
    content = content.replace(/bg-gradient-hero/g, 'bg-[#FFCC00]');
    content = content.replace(/text-gradient/g, 'text-black');
    content = content.replace(/border-none/g, ''); // We want borders now
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Cleaned up ${filePath}`);
    }
  }
});
console.log("Cleanup complete.");
