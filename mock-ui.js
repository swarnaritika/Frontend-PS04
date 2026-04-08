import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const uiDir = path.join(srcDir, 'components', 'ui');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const imports = new Set();
walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /from ["']@\/components\/ui\/(.*?)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      imports.add(match[1]);
    }
  }
});

if (!fs.existsSync(uiDir)) {
  fs.mkdirSync(uiDir, { recursive: true });
}

imports.forEach(comp => {
  const filePath = path.join(uiDir, `${comp}.jsx`);
  if (!fs.existsSync(filePath) && comp !== 'button') {
    // Basic component generator based on common use cases
    let content = `import React from 'react';\n\n`;
    
    // Some need providers or specific named exports
    if (comp === 'toaster') {
      content += `export function Toaster() { return <div id="toaster" />; }\n`;
    } else if (comp === 'tooltip') {
      content += `export function TooltipProvider({children}) { return <>{children}</>; }\n`;
      content += `export function Tooltip({children}) { return <>{children}</>; }\n`;
      content += `export function TooltipTrigger({children, asChild}) { return <span className="tooltip-trigger">{children}</span>; }\n`;
      content += `export function TooltipContent({children, className}) { return <div className={className}>{children}</div>; }\n`;
    } else if (comp === 'toast') {
        content += `export function ToastProvider({children}) { return <>{children}</>; }\n`;
        content += `export function ToastViewport() { return null; }\n`;
        content += `export function Toast({children}) { return <div className="toast">{children}</div>; }\n`;
        content += `export function ToastTitle({children}) { return <strong className="toast-title">{children}</strong>; }\n`;
        content += `export function ToastDescription({children}) { return <div className="toast-desc">{children}</div>; }\n`;
        content += `export function ToastClose() { return <button className="toast-close">X</button>; }\n`;
        content += `export function ToastAction() { return <button className="toast-action">Action</button>; }\n`;
    } else if (comp === 'card') {
        content += `export function Card({children, className, ...props}) { return <div className={"neo-card p-4 " + (className||'')} {...props}>{children}</div>; }\n`;
        content += `export function CardHeader({children, className, ...props}) { return <div className={"card-header " + (className||'')} {...props}>{children}</div>; }\n`;
        content += `export function CardTitle({children, className, ...props}) { return <h3 className={"card-title font-bold " + (className||'')} {...props}>{children}</h3>; }\n`;
        content += `export function CardDescription({children, className, ...props}) { return <p className={"card-desc text-sm " + (className||'')} {...props}>{children}</p>; }\n`;
        content += `export function CardContent({children, className, ...props}) { return <div className={"card-content " + (className||'')} {...props}>{children}</div>; }\n`;
        content += `export function CardFooter({children, className, ...props}) { return <div className={"card-footer mt-4 " + (className||'')} {...props}>{children}</div>; }\n`;
    } else if (comp === 'tabs') {
        content += `export function Tabs({children, defaultValue, onValueChange, className}) { return <div className={className}>{children}</div>; }\n`;
        content += `export function TabsList({children, className}) { return <div className={"flex gap-2 " + (className||'')}>{children}</div>; }\n`;
        content += `export function TabsTrigger({children, value, className}) { return <button className={"p-2 border-2 border-black " + (className||'')}>{children}</button>; }\n`;
        content += `export function TabsContent({children, value, className}) { return <div className={className}>{children}</div>; }\n`;
    } else if (comp === 'dialog') {
        content += `export function Dialog({children, open, onOpenChange}) { return open ? <div className="dialog-wrapper">{children}</div> : null; }\n`;
        content += `export function DialogTrigger({children, asChild}) { return <span onClick={() => {}}>{children}</span>; }\n`;
        content += `export function DialogContent({children, className}) { return <div className={"dialog-content bg-white border-4 border-black p-4 z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " + (className||'')}>{children}</div>; }\n`;
        content += `export function DialogHeader({children, className}) { return <div className={className}>{children}</div>; }\n`;
        content += `export function DialogTitle({children, className}) { return <h2 className={"font-bold text-xl " + (className||'')}>{children}</h2>; }\n`;
        content += `export function DialogDescription({children, className}) { return <p className={className}>{children}</p>; }\n`;
        content += `export function DialogFooter({children, className}) { return <div className={className}>{children}</div>; }\n`;
        content += `export function DialogClose({children}) { return <button className="dialog-close">{children}</button>; }\n`;
    } else {
        // Generic fallback component export (capitalize first letter)
        const name = comp.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        content += `export const ${name} = React.forwardRef(({ className, children, ...props }, ref) => (\n`;
        content += `  <div className={className} ref={ref} {...props}>\n`;
        content += `    {children}\n`;
        content += `  </div>\n`;
        content += `));\n`;
        content += `${name}.displayName = '${name}';\n`;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Generated mock for ${comp}`);
  }
});
console.log("Mock generation complete.");
