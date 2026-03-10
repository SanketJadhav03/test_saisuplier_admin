import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL } from "../../helpers/url_helper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BusinessProfile = () => {
  const { https, http } = AuthUser();
  const [businessProfileData, setBusinessProfileData] = useState({
    business_name: "",
    business_company_phone_no: "",
    business_company_email: "",
    business_billing_address: "",
    business_state: "Maharashtra",
    business_state_code: "27",
    business_pincode: "",
    business_city: "",
    business_gst_no: "",
    business_pan_number: "",
    business_type: "Retailer",
    business_industry_type: 1,
    business_registration_type: "Sole Proprietorship",
    business_bank_name: "",
    business_account_number: "",
    business_ifsc_code: "",
    business_branch_name: "",
    business_terms_conditions: "",
    business_terms_purchase_order: "",
    business_terms_quotation: "",
    business_qr_code: "",
  });
  // 🔹 Refs
  const submitButtonRef = useRef();

  // 🔹 States
  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessSignature, setBusinessSignature] = useState(null);
  const [industryType, setIndustryType] = useState([]);
  const [businessStatus, setBusinessStatus] = useState(false);
  const [stateCode, setStateCode] = useState(27);

  const [validBusinessName, setValidBusinessName] = useState({});

  // 🔹 Dropdown Options
  const businessType = [
    { name: "business_type", label: "Retailer", value: "Retailer" },
    { name: "business_type", label: "Wholesaler", value: "Wholesaler" },
    { name: "business_type", label: "Distributor", value: "Distributor" },
    { name: "business_type", label: "Manufacturer", value: "Manufacturer" },
    { name: "business_type", label: "Services", value: "Services" },
  ];

  const businessRegistrationType = [
    {
      name: "business_registration_type",
      value: "Sole Proprietorship",
      label: "Sole Proprietorship",
    },
    {
      name: "business_registration_type",
      value: "Private Limited Company",
      label: "Private Limited Company",
    },
    {
      name: "business_registration_type",
      value: "Public Limited Company",
      label: "Public Limited Company",
    },
    {
      name: "business_registration_type",
      value: "Partnerships Firm",
      label: "Partnerships Firm",
    },
    {
      name: "business_registration_type",
      value: "Limited Liability Partnership",
      label: "Limited Liability Partnership",
    },
    {
      name: "business_registration_type",
      value: "One Person Company",
      label: "One Person Company",
    },
    {
      name: "business_registration_type",
      value: "Section 8 Company",
      label: "Section 8 Company",
    },
    {
      name: "business_registration_type",
      value: "Business Not Registered",
      label: "Business Not Registered",
    },
  ];

  const stateOption = [
    { value: "27", label: "Maharashtra" },
    { value: "24", label: "Gujarat" },
    { value: "29", label: "Karnataka" },
    { value: "33", label: "Tamil Nadu" },
    { value: "23", label: "Madhya Pradesh" },
    { value: "7", label: "Delhi" },
    { value: "36", label: "Telangana" },
    { value: "30", label: "Goa" },
  ];

  // 🔹 Handlers
  const handleBusinessProfileData = (e) => {
    setBusinessProfileData({
      ...businessProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectOptions = (e) => {
    setBusinessProfileData({ ...businessProfileData, [e.name]: e.value });
  };

  const handleIndustryType = (e) => {
    setBusinessProfileData({
      ...businessProfileData,
      business_industry_type: e.value,
    });
  };

  const handleState = (e) => {
    setBusinessProfileData({
      ...businessProfileData,
      business_state: e.label,
      business_state_code: e.value,
    });
    setStateCode(e.value);
  };

  // 🔹 Submit & Update
  const onSubmit = async () => {
    if (businessProfileData.business_name.trim() === "") {
      toast.error("Business name cannot be empty");
      setValidBusinessName({ borderColor: "red" });
      return;
    }

    try {
      const res = await https.post("/business_store", businessProfileData);
      if (res.data.status === 0) {
        toast.success(res.data.message);
        setBusinessStatus(true);
        getBusinessDetails();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Business store error:", err);
    }
  };

  const onUpdate = async () => {
    try {
      const res = await https.put("/business_update", businessProfileData);
      if (res.data.status === 0) {
        toast.success(res.data.message);
        getBusinessDetails();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Business update error:", err);
    }
  };
  // 🔹 API Calls

  const getBusinessDetails = async () => {
    try {
      const res = await http.get("/business_index");
      if (res.data.length > 0) {
        const singleData = res.data[0];
        setBusinessProfileData({ ...structuredClone(singleData) });
        setBusinessStatus(true);
      }
      const industry = await https.get("/all_industry_types");
      setIndustryType(industry.data);
    } catch (err) {
      console.error("Business details fetch error:", err);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        submitButtonRef.current?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    getBusinessDetails();
  }, []);
  // 🔹 Render
  document.title = "Saisupplier Admin | Business Profile Settings";
  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid>
          <div className="mt-5">
            {/* <img src={progileBg} className="profile-wid-img" alt="" /> */}
          </div>
          <Row>
            <Col xxl={12}>
              <Card className="mt-xxl-n5 ">
                <CardBody className="p-4">
                  <TabContent activeTab={"1"}>
                    <TabPane tabId="1">
                      <form>
                        <Row>
                          <Col lg={4} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label fw-bold"
                              >
                                Business Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                type="text"
                                style={validBusinessName}
                                onKeyUp={() => {
                                  setValidBusinessName({});
                                }}
                                onChange={handleBusinessProfileData}
                                value={businessProfileData.business_name}
                                name="business_name"
                                className="form-control fw-bold"
                                id="lastnameInput"
                                placeholder="Business Name"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="lastnameInput"
                                className="form-label fw-bold"
                              >
                                Business Type
                              </Label>
                              <Select
                                name="business_type"
                                className="fw-bold"
                                placeholder={businessProfileData.business_type}
                                onChange={handleSelectOptions}
                                options={businessType}
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="phonenumberInput"
                                className="form-label fw-bold"
                              >
                                Industry Type
                              </Label>
                              <Select
                                className="fw-bold"
                                placeholder={
                                  industryType[0] == undefined
                                    ? ""
                                    : businessStatus == true
                                    ? businessProfileData.industry_type_name
                                    : industryType[0].industry_type_name
                                }
                                onChange={handleIndustryType}
                                options={industryType.map((it) => ({
                                  label: it.industry_type_name,
                                  value: it.industry_type_id,
                                }))}
                              />
                            </div>
                          </Col>
                          <Col lg={2} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                Registration Type
                              </Label>
                              <Select
                                className="fw-bold"
                                onChange={handleSelectOptions}
                                placeholder={
                                  businessProfileData.business_registration_type
                                }
                                options={businessRegistrationType}
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Company Mobile Number
                              </Label>
                              <Input
                                name="business_company_phone_no"
                                onChange={handleBusinessProfileData}
                                value={
                                  businessProfileData.business_company_phone_no
                                }
                                type="number"
                                className="form-control fw-bold"
                                id="emailInput"
                                placeholder="Mobile Number"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Company Email
                              </Label>
                              <Input
                                type="email"
                                onChange={handleBusinessProfileData}
                                value={
                                  businessProfileData.business_company_email
                                }
                                name="business_company_email"
                                className="form-control fw-bold"
                                id="emailInput"
                                placeholder="Email Address"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                GST No
                              </Label>
                              <Input
                                onChange={handleBusinessProfileData}
                                name="business_gst_no"
                                value={businessProfileData.business_gst_no}
                                type="text"
                                className="form-control fw-bold"
                                id="cityInput"
                                placeholder="GST No"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                PAN No
                              </Label>
                              <Input
                                type="text"
                                onChange={handleBusinessProfileData}
                                value={businessProfileData.business_pan_number}
                                name="business_pan_number"
                                className="form-control fw-bold"
                                id="cityInput"
                                placeholder="PAN No"
                              />
                            </div>
                          </Col>

                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                Pin code
                              </Label>
                              <Input
                                type="number"
                                value={businessProfileData.business_pincode}
                                onChange={handleBusinessProfileData}
                                name="business_pincode"
                                className="form-control fw-bold"
                                id="cityInput"
                                placeholder="Enter the pin code"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                State{" "}
                              </Label>
                              <Select
                                className="fw-bold"
                                placeholder={businessProfileData.business_state}
                                onChange={handleState}
                                options={stateOption}
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="cityInput"
                                className="form-label fw-bold"
                              >
                                State Code
                              </Label>
                              <Input
                                type="text"
                                className="form-control "
                                id="cityInput"
                                value={businessProfileData.business_state_code}
                                readOnly
                                placeholder="State Code"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                City
                              </Label>
                              <Input
                                value={businessProfileData.business_city}
                                onChange={handleBusinessProfileData}
                                name="business_city"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="Enter your City"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Bank Name
                              </Label>
                              <Input
                                value={businessProfileData.business_bank_name}
                                onChange={handleBusinessProfileData}
                                name="business_bank_name"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="Bank name"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Account Number
                              </Label>
                              <Input
                                value={
                                  businessProfileData.business_account_number
                                }
                                onChange={handleBusinessProfileData}
                                name="business_account_number"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="Account Number"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                IFSC Code
                              </Label>
                              <Input
                                value={businessProfileData.business_ifsc_code}
                                onChange={handleBusinessProfileData}
                                name="business_ifsc_code"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="IFSC Code"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Branch Name
                              </Label>
                              <input
                                value={businessProfileData.business_branch_name}
                                onChange={handleBusinessProfileData}
                                name="business_branch_name"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="Branch Name"
                              />
                            </div>
                          </Col>
                          <Col lg={6} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="countryInput"
                                className="form-label fw-bold"
                              >
                                Billing Address
                              </Label>
                              {businessProfileData?.business_billing_address !=
                                undefined && (
                                <CKEditor
                                  key={
                                    businessProfileData.business_billing_address ||
                                    "editor-default"
                                  }
                                  editor={ClassicEditor}
                                  data={
                                    businessProfileData?.business_billing_address
                                  }
                                  onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                  }}
                                  onChange={(e, editor) => {
                                    setBusinessProfileData({
                                      ...businessProfileData,
                                      business_billing_address:
                                        editor.getData(),
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </Col>
                          <Col lg={6} className="mt-3">
                            <div className="">
                              <Label
                                htmlFor="zipcodeInput"
                                className="form-label fw-bold"
                              >
                                Terms & conditions ( Invoice )
                              </Label>
                              {businessProfileData?.business_terms_conditions !=
                                undefined && (
                                <CKEditor
                                  key={
                                    businessProfileData.business_terms_conditions ||
                                    "editor-default"
                                  }
                                  editor={ClassicEditor}
                                  data={
                                    businessProfileData?.business_terms_conditions
                                  }
                                  onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                  }}
                                  onChange={(e, editor) => {
                                    setBusinessProfileData({
                                      ...businessProfileData,
                                      business_terms_conditions:
                                        editor.getData(),
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </Col>
                          <Col lg={6} className="mt-3">
                            <div className="">
                              <Label
                                htmlFor="zipcodeInput"
                                className="form-label fw-bold"
                              >
                                Terms & conditions ( PO )
                              </Label>
                              {businessProfileData.business_terms_purchase_order !=
                                undefined && (
                                <CKEditor
                                  key={
                                    businessProfileData.business_terms_purchase_order ||
                                    "editor-default"
                                  }
                                  editor={ClassicEditor}
                                  data={
                                    businessProfileData.business_terms_purchase_order
                                  }
                                  onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                  }}
                                  onChange={(e, editor) => {
                                    setBusinessProfileData({
                                      ...businessProfileData,
                                      business_terms_purchase_order:
                                        editor.getData(),
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </Col>
                          <Col lg={6} className="mt-3">
                            <div className="">
                              <Label
                                htmlFor="zipcodeInput"
                                className="form-label fw-bold"
                              >
                                Terms & conditions ( Quotation )
                              </Label>
                              {businessProfileData.business_terms_quotation !=
                                undefined && (
                                <CKEditor
                                  key={
                                    businessProfileData.business_terms_quotation ||
                                    "editor-default"
                                  }
                                  editor={ClassicEditor}
                                  data={
                                    businessProfileData.business_terms_quotation ||
                                    ""
                                  }
                                  onChange={(e, editor) => {
                                    setBusinessProfileData({
                                      ...businessProfileData,
                                      business_terms_quotation:
                                        editor.getData(),
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </Col>
                          <Col lg={4} className="mt-3">
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label fw-bold"
                              >
                                Enter UPI Id
                              </Label>
                              <Input
                                value={businessProfileData.business_qr_code}
                                onChange={handleBusinessProfileData}
                                name="business_qr_code"
                                type="text"
                                className="form-control fw-bold"
                                id="textInput"
                                placeholder="UPI ID....."
                              />
                            </div>
                          </Col>
                          <Col lg={4} className="mt-3">
                            <div className="text-center">
                              <div className="profile-user position-relative d-inline-block fw-bold  ">
                                Buisiness Logo <br />
                                <br />
                                {businessLogo != null ? (
                                  <img
                                    id="business_logo"
                                    src={URL.createObjectURL(businessLogo)}
                                    className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                    alt="business_profile_images"
                                  />
                                ) : businessStatus ? (
                                  <img
                                    src={`${IMG_API_URL}/business_images/${businessProfileData.business_logo}`}
                                    className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                    alt="business_profile_images"
                                  />
                                ) : (
                                  <b>
                                    Upload Business
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                    <br /> Profile Here
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  </b>
                                )}
                                <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                  <label
                                    htmlFor="business_logo"
                                    className="profile-photo-edit avatar-xs"
                                  >
                                    <span className="avatar-title rounded-circle bg-light text-body">
                                      <i className="ri-camera-fill"></i>
                                    </span>
                                  </label>
                                  <input
                                    onChange={(e) => {
                                      setBusinessProfileData({
                                        ...businessProfileData,
                                        business_logo: e.target.files[0],
                                      });
                                      setBusinessLogo(e.target.files[0]);
                                    }}
                                    id="business_logo"
                                    defaultValue=""
                                    accept="image/png, image/gif, image/jpeg"
                                    type="file"
                                    className="form-control d-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col lg={4} className="mt-3">
                            <div className="hstack  gap-2 justify-content-center">
                              <div className="text-center ">
                                <div className="fw-bold profile-user position-relative d-inline-block mx-auto  ">
                                  Signature <br />
                                  <br />
                                  {businessSignature != null ? (
                                    <img
                                      id="business_signature"
                                      src={URL.createObjectURL(
                                        businessSignature
                                      )}
                                      className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                      alt="business_signature"
                                    />
                                  ) : businessStatus == true ? (
                                    <img
                                      src={`${IMG_API_URL}/business_images/${businessProfileData.business_signature}`}
                                      className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                      alt="business_signature"
                                    />
                                  ) : (
                                    <b>
                                      Upload Your
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                      <br /> Signature Here
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </b>
                                  )}
                                  <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                    <input
                                      required
                                      onChange={(e) => {
                                        setBusinessProfileData({
                                          ...businessProfileData,
                                          business_signature: e.target.files[0],
                                        });
                                        setBusinessSignature(e.target.files[0]);
                                      }}
                                      id="business_signature"
                                      type="file"
                                      className="profile-img-file-input"
                                    />
                                    <Label
                                      htmlFor="business_signature"
                                      className="profile-photo-edit avatar-xs"
                                    >
                                      <span className="avatar-title rounded-circle bg-light text-body">
                                        <i className="ri-camera-fill"></i>
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col lg={12} className="mt-3">
                            <div className="hstack gap-2 justify-content-end">
                              {businessStatus == false ? (
                                <button
                                  ref={submitButtonRef}
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => onSubmit()}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  ref={submitButtonRef}
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => onUpdate()}
                                >
                                  Update
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </TabPane>
                    <ToastContainer />
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BusinessProfile;
