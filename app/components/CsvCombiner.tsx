"use client";

"use client";

import React, { useState } from "react";
import * as Papa from "papaparse";
import { saveAs } from "file-saver";
import Log from "./Log";

const CsvCombiner = () => {
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [dataFiles, setDataFiles] = useState<FileList | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDataFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFiles(e.target.files);
  };

  const handleCombine = async () => {
    if (!headerFile || !dataFiles) return;

    let combinedData: string[][] = [];
    let headers: string[] = [];
    const newLogMessages: string[] = [];

    // Step 1: Parse the header file
    const parseHeaderFile = (): Promise<void> => {
      return new Promise((resolve) => {
        Papa.parse(headerFile, {
          complete: (results) => {
            headers = results.data[0] as string[];
            combinedData.push(headers);
            resolve();
          },
        });
      });
    };

    // Step 2: Parse the data files
    const parseDataFile = (file: File): Promise<void> => {
      return new Promise((resolve) => {
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data as string[][];
            const currentHeaders = data[0];
            const dataIndexes = currentHeaders.map((header) =>
              headers.indexOf(header)
            );

            if (dataIndexes.includes(-1)) {
              const unknownColumn = currentHeaders[dataIndexes.indexOf(-1)];
              newLogMessages.push(
                `Warning: File ${file.name} has columns that do not match the header file. Column name is '${unknownColumn}' in ${file.name}`
              );
            }

            const reorderedData = data.slice(1).map((row) => {
              return headers.map((header) => {
                const columnIndex = currentHeaders.indexOf(header);
                return columnIndex !== -1 ? row[columnIndex] : "";
              });
            });

            combinedData.push(...reorderedData);
            resolve();
          },
        });
      });
    };

    await parseHeaderFile();

    const parsePromises = Array.from(dataFiles).map((file) =>
      parseDataFile(file)
    );

    await Promise.all(parsePromises);

    // Step 3: Filter out empty rows and generate the final CSV
    const filteredData = combinedData.filter((row) =>
      row.some((cell) => cell && cell.trim() !== "")
    );
    const csv = Papa.unparse({
      fields: headers,
      data: filteredData,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "combined.csv");
    setLogMessages(newLogMessages);
  };

  return (
    <div>
      <div>
        <h3>Step 1: Upload Header CSV</h3>
        <input type="file" accept=".csv" onChange={handleHeaderFileChange} />
      </div>
      <div>
        <h3>Step 2: Upload Data CSVs</h3>
        <input
          type="file"
          accept=".csv"
          multiple
          onChange={handleDataFilesChange}
        />
      </div>
      <button
        onClick={handleCombine}
        className="border rounded-lg mt-4 border-white p-1 font-semibold text-lg"
      >
        Combine CSVs
      </button>
      <Log messages={logMessages} />
    </div>
  );
};

export default CsvCombiner;
