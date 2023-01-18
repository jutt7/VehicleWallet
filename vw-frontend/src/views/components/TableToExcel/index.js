import React from "react";
import { FileText, Grid, Share } from "react-feather";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

// ** Converts table to CSV
function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

// // ** Downloads Excel
const downloadXLSX = (csvData) => {
  var fileName = "export";
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

// ** Downloads CSV
function downloadCSV(array) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv === null) return;

  const filename = "export.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

const DataTableExportButton = ({ className, style, color, data, t }) => {
  return (
    <UncontrolledButtonDropdown
      className={`${className}` || ""}
      style={style || {}}
      title={t("Export")}
    >
      <DropdownToggle color={color || "secondary"} caret>
        <Share size={13} className="d-inline-block d-md-none" />
        <span className="ms-50 d-none d-md-inline-block">{t("Export")}</span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem className="w-100" onClick={() => downloadCSV(data || [])}>
          <FileText size={13} />
          <span className="align-middle ms-50">{t("CSV")}</span>
        </DropdownItem>
        <DropdownItem
          className="w-100"
          onClick={() => downloadXLSX(data || [])}
        >
          <Grid size={15} />
          <span className="align-middle ms-50">{t("Excel")}</span>
        </DropdownItem>
        {/* <DropdownItem className='w-100'>
                  <File size={15} />
                  <span className='align-middle ms-50'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy size={15} />
                  <span className='align-middle ms-50'>Copy</span>
                </DropdownItem> */}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  );
};

export default DataTableExportButton;
