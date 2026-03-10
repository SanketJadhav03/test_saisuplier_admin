import React, { useEffect } from 'react';
import { Button, Col, Container, Navbar, Row } from 'reactstrap';
import JsBarcode from 'jsbarcode';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PrintBarcodeCreate = () => {
  const products = useSelector(
    (state) => state.barcodeSlice.products
  );

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Barcode Create - Ajspire Technologies";

    // Generate barcodes using JsBarcode
    products.forEach(data => {
      JsBarcode(`#barcode-${data.barcode}`, data.barcode, {
        format: "CODE128",
        displayValue: true,
        fontSize: 10,
        width: 1.2,
        height: 25,
        margin: 0,
      });
    });
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(document.getElementById('printable-area').innerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.addEventListener('beforeunload', () => {
      navigate('/barcode-print-create')
    });
  };

  return (
    <React.Fragment>
      <div className="page-content" id='hide_scroll' >
        <Button color="primary" onClick={handlePrint}>Print Barcodes</Button>
        <Container>
          <div id="printable-area" style={{ pageBreakAfter: "always", height: "25mm" }} >
            {products.map((data, index) => {
              const renderCount = Math.ceil(data.qty / 2); // Calculate how many times to render based on qty
              return Array.from({ length: renderCount }).map((_, renderIndex) => (
                <div style={{ display: "flex" }} key={`${index}-${renderIndex}`}>
                  {Array.from({ length: 2 }).map((_, innerIndex) => {
                    const dataIndex = renderIndex * 2 + innerIndex;
                    if (dataIndex < data.qty) {
                      return (
                        <div
                          style={{
                            flex: 1,
                            width: "38mm",
                            height: "10mm",
                            marginTop: index === 0 && renderIndex === 0 ? "0px" : "5px",
                            border: "2px solid white",
                            textAlign: "center",
                            marginRight: innerIndex === 0 ? "5mm" : "0", // Apply margin only for the first item in a row
                          }}
                          key={dataIndex}
                        >
                          <small className='fw-bold'>Sai Mart</small> <br />
                          <svg id={`barcode-${data.barcode}`} />
                          <p style={{ fontSize: "10px", fontWeight: "bold", marginTop: "2px" }}>
                            {data.product_name.length > 20 ? data.product_name.substring(0, 20) + '...' : data.product_name}
                          </p>
                          <p style={{ marginTop: "-8px", display: "flex", justifyContent: "space-around" }}>
                            <span style={{ fontSize: "8px", marginTop: "-1px", fontWeight: "bold" }}>
                              Sale &#8377;. <span style={{ fontSize: "14px" }}>{data.salePrice}</span>
                            </span>
                            <span style={{ fontSize: "7px", fontWeight: "bold" }}>Exp : {data.expDate}</span>
                          </p>
                        </div>
                      );
                    } else {
                      return <div style={{ flex: 1, width: "38mm" }} key={dataIndex} />;
                    }
                  })}
                </div>
              ));
            })}
          </div>
        </Container>

      </div>

    </React.Fragment>
  );
};

export default PrintBarcodeCreate;