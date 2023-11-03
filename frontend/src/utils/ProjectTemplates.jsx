export const filterByTemplateType = (allTableRows) => {
  const { createdTableRows, uploadedTableRows } = allTableRows.reduce(
    (result, tableRow) => {
      if (tableRow.template_creation_type.toLowerCase() === "created") {
        result.createdTableRows.push(tableRow);
      } else {
        result.uploadedTableRows.push(tableRow);
      }
      return result;
    },
    { createdTableRows: [], uploadedTableRows: [] }
  );

  return { createdTableRows, uploadedTableRows };
};
