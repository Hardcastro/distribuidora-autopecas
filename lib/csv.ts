/**
 * Parser de CSV escrito à mão — sem dependência externa.
 * Lida com campo entre aspas, vírgula dentro de campo entre aspas,
 * aspas literais escapadas como "" e quebra de linha \r\n ou \n.
 */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\r") {
      // ignorado — o \n que acompanha fecha a linha
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

/** Converte linhas de CSV em objetos usando a primeira linha como cabeçalho. */
export function csvToRecords(input: string): Record<string, string>[] {
  const rows = parseCsv(input);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => {
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = (r[idx] ?? "").trim();
    });
    return record;
  });
}
