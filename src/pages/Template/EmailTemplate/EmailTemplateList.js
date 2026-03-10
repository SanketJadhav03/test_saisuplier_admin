import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Label } from "reactstrap";
import { toast } from "react-toastify";
import { useEffect } from "react";
import AuthUser from "../../../helpers/Authuser";
import CustomInput from "../../Unit/Input";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Switch } from "@mui/material";

const EmailTemplateList = () => {
  const { http, user } = AuthUser();
  const [Email, SetEmail] = useState({
    email_name: "",
    email_subject: "",
    email_body: "",
    email_status: 1
  });
  const [EmailData, SetEmailData] = useState([]);
  const templateData = [
    {
      title: "Account Opening",
      options: [
        { label: "Customer", value: "customer", user_type: 1 },
        { label: "Business Registration", value: "business_registration" },
        { label: "Business Employee", value: "business_employee" },
      ],
    },
    {
      title: "Inquiry",
      options: [
        { label: "General Inquiry", value: "general_inquiry" },
      ],
    },
    {
      title: "Quotation",
      options: [
        { label: "Send Quotation", value: "send_quotation" },
      ],
    },
    {
      title: "Design Approval",
      options: [
        { label: "Design Sent", value: "design_sent" },
        { label: "Design Approved", value: "design_approved" },
      ],
    },
    {
      title: "Invoice",
      options: [
        { label: "Send Invoice", value: "send_invoice" },
      ],
    },
    {
      title: "Dispatch Confirmation",
      options: [
        { label: "Dispatched", value: "dispatched" },
      ],
    },
    {
      title: "Tracking of Parcel",
      options: [
        { label: "Tracking Link Sent", value: "tracking_sent" },
      ],
    },
    {
      title: "Payment Follow-up",
      options: [
        { label: "Pending Payment", value: "pending_payment" },
        { label: "Follow-up Reminder", value: "followup_reminder" },
      ],
    },
    {
      title: "Thank You Message for Order",
      options: [
        { label: "Thank You", value: "thank_you" },
      ],
    },
  ];

  const [counts, setCounts] = useState(0);
  useEffect(() => {
    document.title = "Email Template | CRM";
    http
      .get(`/email/list`)
      .then(function (response) {
        SetEmailData(response.data);
        if (response.data.length > 0 && counts == 0) {
          SetEmail({ ...response.data[0] });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  const [checkStatus, setCheckStatus] = useState({});
  const SubmitData = () => {
    if (Email.email_name === "") {
      setCheckStatus(1);
    } else if (Email.email_language == "") {
      setCheckStatus(2);
    } else if (Email.email_body == "") {
      setCheckStatus(3);
    } else if (Email.email_image == "") {
      setCheckStatus(4);
    } else {
      http
        .put("/email/update", Email)
        .then((response) => {
          toast.success(response.data.message);
          setCounts(counts + 1);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={3}>
            <div
              className="card custom-scroll shadow-sm rounded"
              style={{
                maxHeight: "calc(100vh - 20px)",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              <div className="px-4 pt-4 mb-4">
                {templateData.map((section, index) => (
                  <div key={index} className="mt-4">
                    <h5 className="fw-bold text-dark">{section.title}</h5>
                    <hr className="text-success" />
                    {section.options.map((option, idx) => {
                      const isSelected = Email.email_name === option.value;
                      return (
                        <div
                          key={idx}
                          className={`px-3 py-2 mb-2 rounded cursor-pointer transition-all ${isSelected
                            ? "bg-primary text-white shadow-sm"
                            : "bg-light text-dark"
                            }`}
                          style={{
                            border: isSelected
                              ? "1px solid #0d6efd"
                              : "1px solid #dee2e6",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const selectedEmail = EmailData.find(
                              (temp) => temp.email_name === option.value
                            );
                            if (selectedEmail) {
                              SetEmail((prevState) => ({
                                ...prevState,
                                ...selectedEmail,
                              }));
                            }
                          }}
                        >
                          {option.label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col lg={9}>
            <Card>
              <CardBody className="p-4">
                {Email.email_name && (
                  <Row>
                    
                    <Col lg="12" className="mt-3">
                      <Label className="form-label fw-bold d-flex align-items-center">
                        <div> Activation </div>
                      </Label>
                      <Switch
                        checked={Email.email_status == 1 ? true : false}
                        onClick={() => {
                          SetEmail({
                            ...Email,
                            email_status: Email.email_status == 1 ? 0 : 1,
                          });
                        }}
                      ></Switch>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label
                          htmlFor="email-field"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <div>
                            {" "}
                            Subject<span style={{ color: "red" }}> *</span>{" "}
                          </div>
                          <div style={{ color: "red" }}>
                            {checkStatus == 1 ? "Name Cannot be empty!" : ""}
                          </div>
                        </Label>
                        <CustomInput
                          name="email_name"
                          id="email-field"
                          className="form-control fw-bold"
                          placeholder="Name"
                          type="text"
                          value={Email.email_subject || ""}
                          onChange={(e) => {
                            SetEmail({
                              ...Email,
                              email_subject: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label
                          htmlFor="email-field"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <div>
                            {" "}
                            Body<span style={{ color: "red" }}> *</span>{" "}
                          </div>
                          <div style={{ color: "red" }}>
                            {checkStatus == 3
                              ? "Email Body Cannot be empty!"
                              : ""}
                          </div>
                        </Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={Email.email_body || ""}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            SetEmail((prevState) => ({
                              ...prevState,
                              email_body: data,
                            }));
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={SubmitData}
                          className="text-end btn btn-success"
                        >
                          <i className="fa fa-cog"></i> Update Settings
                        </button>
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmailTemplateList;
