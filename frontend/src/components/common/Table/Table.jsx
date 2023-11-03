import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import "./Table.scss";
import { TableText } from "../../../i18n/TableText";

export default function Table({
  rows = [],
  headers = [],
  isPaginated = false,
  handlePageChange = () => {},
  rowsPerPage = 5,
  pageNo = 0,
  totalItems = rows.length,
  noRecordsText = TableText.noRecordsText
}) {
  return (
    <div className="table-container">
      <TableContainer>
        <MuiTable sx={{ minWidth: 650 }} aria-label={TableText.ariaLabelText}>
          <TableHead>
            <TableRow>
              {headers.map((cell, index) => (
                <TableCell sx={{ flexGrow: 1 }} key={index}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              <>
                {(isPaginated ? rows.slice(pageNo * rowsPerPage, pageNo * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {row.map((cell, idx) => (
                      <TableCell key={idx} component="th" scope="row">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <div className="no-records d-flex align-items-center justify-content-center">
                    <div>{noRecordsText}</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
        {isPaginated && (
          <div className="d-flex align-items-center justify-content-between pagination-container">
            <p className="records-count">
              {TableText.displaying} {rows.length} {TableText.of} {totalItems} {TableText.records}
            </p>
            <TablePagination
              component="div"
              count={totalItems}
              rowsPerPageOptions={[]}
              rowsPerPage={rowsPerPage}
              page={pageNo}
              onPageChange={handlePageChange}
              labelDisplayedRows={() => `${rows.length > 0 ? pageNo + 1 : 0} of ${Math.ceil(totalItems / rowsPerPage)}`}
              showFirstButton
              showLastButton
            />
          </div>
        )}
      </TableContainer>
    </div>
  );
}
