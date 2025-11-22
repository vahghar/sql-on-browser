'use client';

interface SchemaViewerProps {
  columns: string[];
  tableName?: string;
}

export default function SchemaViewer({ columns, tableName = 'csv_data' }: SchemaViewerProps) {
  if (!columns || columns.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 text-sm">
        <p className="text-zinc-500 dark:text-zinc-400">No columns detected yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
        Table Schema
      </h3>
      
      <div className="bg-white dark:bg-zinc-950/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-zinc-500">Table Name:</span>
          <code className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {tableName}
          </code>
        </div>
        
        <div className="flex justify-between">
          <span className="text-zinc-500">Columns:</span>
          <span className="text-zinc-700 dark:text-zinc-300">{columns.length}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3 text-sm">
          Columns
        </h4>
        <div className="space-y-2">
          {columns.map((column, index) => (
            <div
              key={column}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {column}
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                TEXT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}