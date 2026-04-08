export const Table = ({ children }) => <table className="w-full text-left border-collapse border-2 border-black bg-white">{children}</table>;
export const TableHeader = ({ children }) => <thead className="bg-[#FFCC00] border-b-2 border-black">{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableRow = ({ children }) => <tr className="border-b border-black">{children}</tr>;
export const TableHead = ({ children }) => <th className="p-2 border-r border-black">{children}</th>;
export const TableCell = ({ children }) => <td className="p-2 border-r border-black">{children}</td>;
