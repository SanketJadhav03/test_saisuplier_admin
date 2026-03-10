import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import AuthUser from "../../helpers/Authuser";
import { Col, Input, Label, Row } from "reactstrap";

const ProductImport = () => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      readExcelData(file);
    }
  };

  const readExcelData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const newExcelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Remove the header row from both convertedData and childArray
      const convertedData = newExcelData.slice(1).map((item) => ({
        product_english_name: item[0],
        product_marathi_name: item[1],
        product_hsn_code: item[2],
        product_sub_category: item[3],
        product_brand: item[4],
        product_tax_present: item[5],
        product_tax_type: item[6],
        product_primary_unit: item[7],
        product_alternate_unit: item[8],
        product_conversion_factor: item[9],
        product_unit_price: item[10],
      }));

      const childArray = newExcelData.slice(1).map((item) => ({
        price_barcode: item[11],
        price_mrp: item[12],
        price_sales: item[13],
        price_purchase: item[14],
        price_wholesaler: item[15],
        price_distributor: item[16],
        price_online: item[17],
        price_opening_qty: item[18],
        price_opening_value: item[19],
        mfg_date: item[20],
        exp_date: item[21],
      }));

      setExcelData({
        MasterArray: convertedData,
        childArray: childArray,
      });
    };
    reader.readAsBinaryString(file);
  };

  const { http } = AuthUser();
  const Add_Prodcut = () => {
    console.log(excelData);
    // http
    //   .post("/tax/store")
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  return (
    <div className="page-content text-center">
      <Row>
        <Col lg={6}>
          <div>
            <Label htmlFor="formSizeSmall" className="form-label">
              Upload Excel File
            </Label>
            <Input
              className="form-control form-control-md"
              id="formSizeSmall"
              type="file"
              onChange={(e) => handleFileUpload(e)}
            />
          </div>
        </Col>
        <Col lg={6}>
          <div>
            <Label htmlFor="formSizeSmall" className="form-label">
              Demo Excel File Download
            </Label>
            <br />
            <button className="btn btn-info" onClick={Add_Prodcut()}>
              Download
            </button>
          </div>
        </Col>
        <Col lg={12} className="text-center mt-5">
          <button className="btn btn-success" onClick={Add_Prodcut()}>
            ADD PRODCUT
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductImport;
