import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL } from "../../helpers/url_helper";

const ReceiptView = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [businessProfileData, setBusinessProfileData] = useState([]);
  useEffect(() => {
    http
      .get("/business_index")
      .then(function (response) {
        setBusinessProfileData(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);
  const [ReceiptData, setReceiptData] = useState(props.edit_data);

  const OnSubmited = () => {};

  const [modal, setModal] = useState(false);

  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

  useEffect(() => {
    setModal(false);
    toggle();
  }, [props.modalStates]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal]);

  const SubmitData = () => {
    props.checkchang("Tax Create Successfully !!");
  };
  const handlePrint = () => {
    const printableArea = document.getElementById("printable-area");
    const clonedContent = printableArea.cloneNode(true);
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);
    printFrame.onload = () => {
      const printDocument =
        printFrame.contentDocument || printFrame.contentWindow.document;
      const styleElement = document.createElement("style");
      styleElement.textContent = `
      @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css');

        .formss {
            border: 1px solid black;
        }
  
        .invocess {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 2px;
        }
  
        #per {
            padding-top: 0px;
            padding-bottom: 0px;
            text-align: right;
        }
  
        .header {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 0px auto;
        }
      `;
      printDocument.head.appendChild(styleElement);
      printDocument.body.appendChild(clonedContent);
      printFrame.contentWindow.print();
    };
    printFrame.src = "about:blank";
  };
  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <div className="tablelist-form " >
          <ModalBody>
            <Card className="formss card-border-dark  p-3 mt-3 shadow-lg" id="printable-area">
              <div className="row border-bottom p-2">
                <div className="col-2 ">
                  <img
                    style={{ marginLeft: "30px" }}
                    height={"150px"}
                    width={"150px"}
                    src={
                      businessProfileData[0] ==
                      undefined
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Sz8WqoF30NokKOk2vbC1XuvcHfmHkvl3Jw"
                        : `${IMG_API_URL}/business_images/${
                            businessProfileData[0]
                              .business_logo
                          }`
                    }
                    alt="business_logo"
                  />
                </div>
                <div className="col-10 text-center fw-bold mt-4">
                  <h3>
                    {businessProfileData[0] ==
                    undefined
                      ? ""
                      : businessProfileData[0]
                          .business_name}
                  </h3>
                  <>Customer Receipt Invoice</>
                </div>
              </div>
              <div className="row mt-3 border-bottom p-2">
                <div className="col-4 ">
                  <ul style={{ listStyleType: "none" }}>
                    <li className="fw-bold">From</li>
                    <li>
                      Name:{" "}
                      {businessProfileData[0] ==
                      undefined
                        ? ""
                        : businessProfileData[0]
                            .business_name}
                    </li>
                    <li>
                      City:{" "}
                      {businessProfileData[0] ==
                      undefined
                        ? ""
                        : businessProfileData[0]
                            .business_city}
                    </li>
                    <li>
                      Mobile:{" "}
                      {businessProfileData[0] ==
                      undefined
                        ? ""
                        : businessProfileData[0]
                            .business_company_phone_no}
                    </li>
                    <li>
                      Email:{" "}
                      {businessProfileData[0] ==
                      undefined
                        ? ""
                        : businessProfileData[0]
                            .business_company_email}
                    </li>
                    <li>
                      GST No:
                      {businessProfileData[0] ==
                      undefined
                        ? ""
                        : businessProfileData[0]
                            .business_gst_no}
                    </li>
                  </ul>
                </div>
                <div className="col-4">
                  <ul style={{ listStyleType: "none" }}>
                    <li className="fw-bold">To</li>
                    <li>Name: {ReceiptData.customer_name}</li>
                    <li>Mobile:{ReceiptData.customer_mobile} </li>
                    <li>GST No:{ReceiptData.customer_gst_no}</li>
                    <li>Payment Mode: {ReceiptData.payment_type}</li>
                  </ul>
                </div>
                <div className="col-4 d-flex justify-content-end">
                  Receipt No. 0{ReceiptData.receipt_id}
                  <br />
                  Date: {ReceiptData.receipt_date}
                </div>
              </div>
              <div className="row mt-3 border-bottom p-2">
                <div className="col-12 fw-bold ">
                  <div className="table border  text-center ">
                    <div className="row col-12 mt-2">
                      <div className="col-4">Total Amount</div>
                      <div className="col-4">Paid Amount</div>
                      <div className="col-4">Remaining Amount</div>
                    </div>
                    <div className="row col-12 mt-2">
                      <div className="col-4">{ReceiptData.receipt_credit_amount}/-</div>
                      <div className="col-4">{ReceiptData.receipt_total_amount} /-</div>
                      <div className="col-4">{ReceiptData.receipt_credit_amount==0?0:ReceiptData.receipt_credit_amount - ReceiptData.receipt_total_amount}/-</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-8">
                  <div className="fw-bold">
                    Terms And Conditions,
                    <br />
                    <div dangerouslySetInnerHTML={{
                      __html: 
                        businessProfileData[0] ==
                          undefined
                          ? ""
                          : businessProfileData[0]
                            .business_terms_conditions
                      
                    }}></div>
                  </div>
                </div>
                <div className="col-4 mt-5 d-flex justify-content-end">
                  <div className="fw-bold mt-2">
                    Signature:
                    <br />
                    <img
                      style={{ marginLeft: "30px" }}
                      height={"50px"}
                      width={"150px"}
                      src={
                        businessProfileData[0] ==
                        undefined
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Sz8WqoF30NokKOk2vbC1XuvcHfmHkvl3Jw"
                          : `${IMG_API_URL}/business_images/${
                              businessProfileData[
                                0
                              ].business_signature
                            }`
                      }
                      alt="signature"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </ModalBody>
            <div className="hstack gap-2 justify-content-center my-2">
              <button
                name="close"
                id="close"
                type="button"
                className="btn btn-danger"
                onClick={() => Close()}
              >
                <i className="ri-close-line me-1 align-middle" />
                Close
              </button>
              <button
              type="submit"
              className="btn btn-primary"
              onClick={() => handlePrint()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Print
            </button>
            </div>
          </div>
        
      </Modal>
    </div>
  );
};

export default ReceiptView;
