const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix Grid2 import back to Grid
  if (content.includes("from '@mui/material/Grid2'")) {
    content = content.replace("from '@mui/material/Grid2'", "from '@mui/material/Grid'");
    changed = true;
  }

  // Pattern: <Grid item xs={N} sm={N} md={N}>
  // Replace item + individual breakpoint props with size prop
  const gridItemPattern = /<Grid\s+item\s+((?:xs|sm|md|lg|xl|spacing|container|alignItems)={[^}]+}\s*)*>/g;
  
  // Simpler approach: replace all patterns
  // <Grid item xs={12} sm={6} md={4}> -> <Grid size={{ xs: 12, sm: 6, md: 4 }}>
  // <Grid item xs={12}> -> <Grid size={12}>
  // <Grid item xs={12} sm={6}> -> <Grid size={{ xs: 12, sm: 6 }}>

  // Match <Grid item with props
  content = content.replace(/<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s+sx=\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s*>/g, 
    '<Grid size={{ xs: $1, sm: $2, md: $3 }} sx={$4}>');

  content = content.replace(/<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}>/g, 
    '<Grid size={{ xs: $1, sm: $2, md: $3 }}>');

  content = content.replace(/<Grid\s+item\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}>/g, 
    '<Grid size={{ xs: $1, sm: $2 }}>');

  content = content.replace(/<Grid\s+item\s+xs=\{(\d+)\}>/g, 
    '<Grid size={$1}>');

  // Also fix <Grid container spacing={N} sx={...} alignItems="..."> patterns (should be fine as is)
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && f !== 'node_modules' && f !== '.next') {
      walkDir(full);
    } else if (f.endsWith('.tsx')) {
      fixFile(full);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done!');
