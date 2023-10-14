import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import JSZip from "jszip";
import { importTermBank } from "./model/imports/importTermBank";
import database from "./database";

// This function will open a file selector to unzip & import a dictionary
const handleClick = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".zip"; // Only accept .zip files

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Create a FileReader object to read the file
      const reader = new FileReader();

      // Add an event listener to handle file read
      reader.addEventListener("load", async () => {
        const zip = new JSZip();
        const contents = await zip.loadAsync(reader.result);
        const fileArray = [];

        // Iterate through each file and perform actions
        for (const filename of Object.keys(contents.files)) {
          if (!contents.files[filename].dir) {
            // Skip directories
            const fileData = await contents.file(filename).async("string"); // Use 'uint8array' for binary files
            console.log(`File: ${filename}`);
            fileArray.push({ filename, content: fileData });
          }
        }

        // Now we have a fileArray that can be used for import
        if (fileArray.length > 0) {
          // call the necessary import function
          await importTermBank(fileArray);
        }
      });

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    }
  });

  input.click();
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App database={database} handleClick={handleClick} />
  </React.StrictMode>
);
