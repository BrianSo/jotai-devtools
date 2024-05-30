import fs from 'fs';
import path from 'path';


function convertRemToPx(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          convertRemToPx(filePath);
        } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.css'))) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              return;
            }

            const newData = data.replace(/(\d*\.?\d+)rem/g, (match, value) => {
              const px = parseFloat(value) * 16;
              return `${px}px`;
            });

            if (newData !== data) {
              fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                  console.error(`Error writing file ${filePath}:`, err);
                  return;
                }
                console.log(`Converted ${filePath} successfully.`);
              });
            }
          });
        }
      });
    });
  });
}

convertRemToPx('.');