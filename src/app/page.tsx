"use client";

import { useState } from "react";
import { useSQL } from "@/hooks/useSql";
import SchemaViewer from "@/components/schemaViewer";

// Your existing SVG icons remain the same
const UploadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
);
const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" /><path d="M12 12.75c2.685 0 5.19-.778 7.07-2.125.266.363.43.75.43 1.158 0 2.692-4.03 4.875-9 4.875S3 14.467 3 11.783c0-.408.164-.795.43-1.158 1.88 1.347 4.385 2.125 7.07 2.125Z" /><path d="M12 19.125c2.685 0 5.19-.778 7.07-2.125.266.363.43.75.43 1.158 0 2.692-4.03 4.875-9 4.875S3 20.842 3 18.158c0-.408.164-.795.43-1.158 1.88 1.347 4.385 2.125 7.07 2.125Z" /></svg>
);
const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
);
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
);

export default function Home() {
  // Use our real SQL hook
  const { loadCSV, runQuery } = useSQL();

  // UI States
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("SELECT * FROM csv_data LIMIT 10;");
  const [result, setResult] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  // Handle file upload with real SQL processing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setIsProcessing(true);

      try {
        const loadResult = await loadCSV(selectedFile);
        console.log('Load result:', loadResult);

        if (loadResult.success) {
          // The columns are now stored in the hook state
          // Let's run a test query to verify everything works
          const initialResult = runQuery("SELECT * FROM csv_data LIMIT 5;");
          console.log('Initial query result:', initialResult);

          if (initialResult.error) {
            setError(initialResult.error);
          } else {
            setResult(initialResult.values);
            // Don't setColumns here - they come from the hook
          }
        } else {
          setError(loadResult.error || "Failed to load file");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsProcessing(false);
      }
    } else {
      setError("Please upload a CSV file");
    }
  };

  // Run query with real SQL.js
  const executeQuery = () => {
    if (!file) {
      setError("Please upload a CSV or Excel file first to run queries.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
      try {
        const queryResult = runQuery(query);

        if (queryResult.error) {
          setError(queryResult.error);
          setResult(null);
        } else {
          setResult(queryResult.values);
          setColumns(queryResult.columns);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsProcessing(false);
      }
    }, 10);
  };

  // Remove file and reset state
  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setColumns([]);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-emerald-500/30 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden">

      {/* --- Background Elements for Modern Feel --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>

      {/* --- Header --- */}
      <header className="sticky top-0 z-20 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <DatabaseIcon className="h-5 w-5" />
            </div>
            <span>Data<span className="text-emerald-600 dark:text-emerald-400">Forge</span></span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="https://github.com/vahghar/sql-on-browser" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">github</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">

        {/* --- Hero Section --- */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            Your CSVs, now powered by <span className="text-emerald-600 dark:text-emerald-400">SQL</span>.
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Zero setup. Total privacy.
            Just drop your file and start querying.
          </p>
        </div>


        {/* --- Main App "Glass" Container --- */}
        <div className="relative rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 overflow-hidden">

          {/* Decorative top bar */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>

          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/50 dark:divide-zinc-800/50 min-h-[600px]">

            {/* --- Left Sidebar: Upload & Context --- */}
            <div className="lg:col-span-4 p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-bold">1</span>
                  Source Data
                </h2>
                <p className="text-sm text-zinc-500 mb-4">Upload a CSV or Excel file to create an in-memory database table.</p>

                {!file ? (
                  // Empty State Upload
                  <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-white dark:bg-zinc-950/50 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-950/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                      <UploadIcon className="w-10 h-10 mb-3 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                      <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Drop CSV/Excel file here, or click to browse
                      </p>
                      <p className="text-xs text-zinc-500">Max size 50MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                    />
                  </label>
                ) : (
                  // File Loaded State
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <DatabaseIcon className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold truncate text-zinc-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {isProcessing ? 'Processing...' : 'Ready for querying'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      disabled={isProcessing}
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {file && !isProcessing && (

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SchemaViewer columns={columns} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Quick Info</h3>
                  <div className="bg-white dark:bg-zinc-950/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Table Name:</span>
                      <code className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">csv_data</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        In Memory
                      </span>
                    </div>
                    {columns.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Columns:</span>
                          <span className="text-zinc-700 dark:text-zinc-300">{columns.length}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                          <div className="text-xs text-zinc-500 mb-2">Detected columns:</div>
                          <div className="flex flex-wrap gap-1">
                            {columns.map((col, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-xs font-mono"
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Query Suggestions */}
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Try These Queries</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setQuery("SELECT * FROM csv_data LIMIT 10;")}
                        className="w-full text-left p-2 text-sm rounded-lg border border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        Show first 10 rows
                      </button>
                      <button
                        onClick={() => {
                          const firstCol = columns[0] || 'column1';
                          setQuery(`SELECT COUNT(*) as total_count FROM csv_data;`);
                        }}
                        className="w-full text-left p-2 text-sm rounded-lg border border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        Count total rows
                      </button>
                      {columns.length > 0 && (
                        <button
                          onClick={() => setQuery(`SELECT ${columns.slice(0, 3).join(', ')} FROM csv_data LIMIT 5;`)}
                          className="w-full text-left p-2 text-sm rounded-lg border border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 transition-colors"
                        >
                          Show first 3 columns
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- Right Area: Editor & Results --- */}
            <div className="lg:col-span-8 flex flex-col h-full">

              {/* Editor Section */}
              <div className="flex-none p-6 sm:p-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-bold">2</span>
                    Query Editor
                  </h2>
                  <button
                    onClick={executeQuery}
                    disabled={isProcessing || !file}
                    className="flex items-center cursor-pointer gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isProcessing ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                    {isProcessing ? 'Running...' : 'Run Query'}
                  </button>
                </div>

                <div className="relative group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 overflow-hidden shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                  <div className="absolute top-3 right-4 text-xs text-zinc-500 font-mono pointer-events-none">SQL</div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-40 bg-transparent p-5 font-mono text-base text-zinc-100 resize-none border-0 focus:ring-0 leading-relaxed"
                    spellCheck={false}
                    placeholder="SELECT * FROM csv_data LIMIT 10;"
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <XMarkIcon className="w-5 h-5 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="flex-1 p-6 sm:p-8 bg-zinc-50/30 dark:bg-zinc-900/30 overflow-hidden flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 shrink-0">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-bold">3</span>
                  Results
                </h2>

                <div className="flex-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden relative flex flex-col">
                  {result ? (
                    <>
                      <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 sticky top-0 z-10">
                            <tr>
                              {columns.map((header) => (
                                <th key={header} className="px-5 py-3.5 font-semibold capitalize tracking-wider text-xs whitespace-nowrap">
                                  {header.replace(/_/g, ' ')}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                            {result.map((row, i) => (
                              <tr key={i} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors even:bg-zinc-50/50 dark:even:bg-zinc-800/30">
                                {row.map((cell: any, j: number) => (
                                  <td key={j} className="px-5 py-3 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                    {cell !== null && cell !== undefined ? String(cell) : 'NULL'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="shrink-0 border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 flex justify-between items-center">
                        <span>{result.length} row{result.length !== 1 ? 's' : ''} returned</span>
                        <span className="text-emerald-600 dark:text-emerald-400">Query successful</span>
                      </div>
                    </>
                  ) : (
                    // Empty Results State
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-4 p-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <DatabaseIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">No results yet</p>
                        <p className="text-sm mt-1 max-w-xs mx-auto">
                          {file
                            ? 'Run a query to see your data appear here.'
                            : 'Upload a file and run a query to see your data appear here.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}