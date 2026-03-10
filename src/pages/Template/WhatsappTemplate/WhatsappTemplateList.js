import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import AuthUser from "../../../helpers/Authuser";
import CustomInput from "../../Unit/Input";
import { Switch } from "@mui/material";

const WhatsappTemplateList = () => {
  const { http, user } = AuthUser();

  const [Whatsapp, SetWhatsapp] = useState({
    whatsapp_id: "",
    whatsapp_name: "",
    whatsapp_language: "",
    whatsapp_file_name: "",
    whatsapp_image: "",
    whatsapp_business_admin: 1,
    whatsapp_business_manager: 1,
    whatsapp_business_team_member: 1,
    whatsapp_status: 1,
  });

  const [WhatsappData, SetWhatsappData] = useState([]);

  // LEFT SIDEBAR TEMPLATE OPTIONS
  const templateData = [
    {
      title: "Welcome Templates",
      options: [
        { label: "Welcome Message", value: "welcome" },
        { label: "Greetings", value: "greetings" },
      ],
    },
    {
      title: "Order Templates",
      options: [
        { label: "Order Placed", value: "order_placed" },
        { label: "Order Shipped", value: "order_shipped" },
      ],
    },
    {
      title: "Payment Templates",
      options: [
        { label: "Payment Received", value: "payment_received" },
        { label: "Payment Pending", value: "payment_pending" },
      ],
    },
  ];

  const [counts, setCounts] = useState(0);

  // FETCH ALL WHATSAPP TEMPLATES
  useEffect(() => {
    document.title = "WhatsApp Template | CRM";
    http
      .get(`/whatsapp/list`)
      .then((response) => {
        SetWhatsappData(response.data);

        if (response.data.length > 0 && counts === 0) {
          SetWhatsapp({ ...response.data[0] });
        }
      })
      .catch((error) => console.log(error));
  }, [counts]);

  const SubmitData = () => {
    if (Whatsapp.whatsapp_name === "")
      return toast.error("Template Name Required");
    if (Whatsapp.whatsapp_language === "")
      return toast.error("Language Required");

    // Check if record exists (has an ID)
    const isUpdate = Whatsapp.whatsapp_id && Whatsapp.whatsapp_id !== "";

    let formData = new FormData();
    Object.keys(Whatsapp).forEach((key) => {
      formData.append(key, Whatsapp[key]);
    });

    if (isUpdate) {
      // UPDATE QUERY
      http
        .put("/whatsapp/update", formData)
        .then((response) => {
          toast.success("Template Updated Successfully!");
          setCounts(counts + 1);
        })
        .catch((error) => console.log(error));
    } else {
      // INSERT QUERY
      http
        .post("/whatsapp/store", formData)
        .then((response) => {
          toast.success("Template Created Successfully!");

          // set ID after insert
          SetWhatsapp((prev) => ({
            ...prev,
            whatsapp_id: response.data.whatsapp_id,
          }));

          setCounts(counts + 1);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* LEFT SIDEBAR */}
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
                      const isSelected =
                        Whatsapp.whatsapp_name === option.value;

                      return (
                        <div
                          key={idx}
                          className={`px-3 py-2 mb-2 rounded cursor-pointer transition-all ${
                            isSelected
                              ? "bg-success text-white shadow-sm"
                              : "bg-light text-dark"
                          }`}
                          style={{
                            border: isSelected
                              ? "1px solid green"
                              : "1px solid #dee2e6",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const selected = WhatsappData.find(
                              (temp) => temp.whatsapp_name === option.value
                            );
                            if (selected) {
                              SetWhatsapp({
                                ...selected,
                              });
                            } else {
                              // If not found, set blank template
                              SetWhatsapp({
                                whatsapp_id: "",
                                whatsapp_name: option.value,
                                whatsapp_language: "",
                                whatsapp_file_name: "",
                                whatsapp_image: "",
                                whatsapp_business_admin: 1,
                                whatsapp_business_manager: 1,
                                whatsapp_business_team_member: 1,
                                whatsapp_status: 1,
                              });
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

          {/* RIGHT SIDE FORM */}
          <Col lg={9}>
            <Card>
              <CardBody className="p-4">
                {Whatsapp.whatsapp_name && (
                  <Row>
                    {/* STATUS */}
                    <Col lg="12" className="mb-3">
                      <Label className="form-label fw-bold d-flex align-items-center">
                        Activation
                      </Label>
                      <Switch
                        checked={Whatsapp.whatsapp_status == 1}
                        onClick={() =>
                          SetWhatsapp({
                            ...Whatsapp,
                            whatsapp_status:
                              Whatsapp.whatsapp_status == 1 ? 0 : 1,
                          })
                        }
                      />
                    </Col>

                    {/* LANGUAGE */}
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Language <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          className={"form-control"}
                          type="text"
                          placeholder="Language (e.g. en, hi)"
                          value={Whatsapp.whatsapp_language || ""}
                          onChange={(e) =>
                            SetWhatsapp({
                              ...Whatsapp,
                              whatsapp_language: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Col>

                    {/* FILE NAME */}
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">File Name</Label>
                        <Input
                          type="text"
                          placeholder="Template File Name"
                          value={Whatsapp.whatsapp_file_name || ""}
                          onChange={(e) =>
                            SetWhatsapp({
                              ...Whatsapp,
                              whatsapp_file_name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Col>

                    {/* IMAGE UPLOAD */}
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Image (Optional)
                        </Label>
                        <Input
                          className="form-control"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            SetWhatsapp({
                              ...Whatsapp,
                              whatsapp_image: e.target.files[0],
                            })
                          }
                        />
                      </div>
                    </Col>

                    {/* UPDATE BUTTON */}
                    <Col lg={12}>
                    <hr />
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={SubmitData}
                          className="btn btn-primary shadow"
                        >
                          <i className="fa fa-save"></i> Save Template
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

export default WhatsappTemplateList;
