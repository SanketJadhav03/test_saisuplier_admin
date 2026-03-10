import React, { useEffect, useRef, useState } from "react";
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

//import images
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { API_URL, IMG_API_URL } from "../../helpers/url_helper";
import AuthUser from "../../helpers/Authuser";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Company = () => {
  const { https, http } = AuthUser();
  const redirect = useNavigate();
  const [Count, SetCount] = useState(1);

  useEffect(() => {
    http
      .get(`/check/nows`)
      .then(function (response) {
        if (response.data.status) {
          redirect("/subscription");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [Count]);
  const [activeTab, setActiveTab] = useState("1");
  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessQrCode, setBusinessQrCode] = useState(null);
  const [businessSignature, setBusinessSignature] = useState(null);
  const [counts, setCounts] = useState(1);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const [industryType, setIndustryType] = useState([]);
  useEffect(() => {
    https
      .get("/all_industry_types")
      .then(function (response) {
        setIndustryType(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  const [businessStatus, setBusinessStatus] = useState(false);
  const [businessProfileData, setBusinessProgilrData] = useState({
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
  });
  useEffect(() => {
    http
      .get("/business_index")
      .then(function (response) {
        if (response.data.length > 0) {
          setBusinessStatus(true);
          setBusinessProgilrData(response.data[0]);
        }
      })
      .catch(function (response) {
        console.log(response);
      });
  }, []);
  const businessType = [
    { name: "business_type", label: "Retailer", value: "Retailer" },
    { name: "business_type", label: "Wholesaler", value: "Wholesaler" },
    { name: "business_type", label: "Distributor", value: "Distributor" },
    { name: "business_type", label: "Manufacturer", value: "Manufacturer" },
    { name: "business_type", label: "Services", value: "Services" },
  ];
  const handleIndustryType = (e) => {
    setBusinessProgilrData({
      ...businessProfileData,
      business_industry_type: e.value,
    });
  };
  const handleSelectOptions = (e) => {
    setBusinessProgilrData({ ...businessProfileData, [e.name]: e.value });
  };

  document.title = "Saisupplier Admin | Business Profile Settings";
  const stateOption = [
    { value: "1", label: "Jammu and Kashmir" },
    { value: "2", label: "Himachal Pradesh" },
    { value: "3", label: "Punjab" },
    { value: "4", label: "Chandigarh" },
    { value: "5", label: "Uttarakhand" },
    { value: "6", label: "Haryana" },
    { value: "7", label: "Delhi" },
    { value: "8", label: "Rajasthan" },
    { value: "9", label: "Uttar Pradesh" },
    { value: "10", label: "Bihar" },
    { value: "11", label: "Sikkim" },
    { value: "12", label: "Arunanchal Pradesh" },
    { value: "13", label: "Nagaland" },
    { value: "14", label: "Manipur" },
    { value: "15", label: "Mizoram" },
    { value: "16", label: "Tripura" },
    { value: "17", label: "Meghalaya" },
    { value: "18", label: "Assam" },
    { value: "19", label: "West Bengal" },
    { value: "20", label: "Jharkhand" },
    { value: "21", label: "Odisha" },
    { value: "22", label: "Chattisgarh" },
    { value: "23", label: "Madhya Pradesh" },
    { value: "24", label: "Gujarat" },
    { value: "26", label: "Dadra And Nagar Haveli And Daman And  Diu " },
    { value: "27", label: "Maharashtra" },
    { value: "28", label: "Andhra Pradesh" },
    { value: "29", label: "Karnataka" },
    { value: "30", label: "Goa" },
    { value: "31", label: "Lakshadweep" },
    { value: "32", label: "Kerela" },
    { value: "33", label: "Tamil Nadu" },
    { value: "34", label: "Puducherry" },
    { value: "35", label: "Andaman and Nicobar Islands" },
    { value: "36", label: "Telangana" },
    { value: "37", label: "Andhra Pradesh" },
    { value: "38", label: "Ladakh" },
    { value: "97", label: "Other Territory" },
  ];
  const [stateCode, setStateCode] = useState(27);
  const handleState = (e) => {
    setBusinessProgilrData({
      ...businessProfileData,
      business_state: e.label,
      business_state_code: e.value,
    });
    setStateCode(e.value);
  };

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

  const handleBusinessProfileData = (e) => {
    setBusinessProgilrData({
      ...businessProfileData,
      [e.target.name]: e.target.value,
    });
  };

  //
  const [validImage, setValidImage] = useState({});
  const [validBusinessName, setValidBusinessName] = useState({});
  const validationBusiness = () => {
    setValidImage({
      color: "red",
    });
  };
  const OnSubmited = () => {
    if (businessStatus === false) {
      if (businessProfileData.business_name === "") {
        toast.error("Business name cannot be empty");
        setValidBusinessName({
          borderColor: "red",
        });
      } else {
        const formData = {
          ...businessProfileData,
          business_logo: businessLogo,
          business_qr_code: businessQrCode,
          businessSignature: businessSignature,
        }
        console.log("Testing: ", formData);
        https
          .post("/business_store", formData)
          .then(async function (response) {
            if (response.data.status == 0) {
              toast.success(response.data.message);

              redirect("/users");
            } else {
              toast.err(response.data.message);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    } else if (businessStatus === true) {
      const formData = new FormData();
      if (businessLogo != null) {
        formData.append("business_logo", businessLogo);
      }
      if (businessSignature != null) {
        formData.append("business_signature", businessSignature);
      }
      if (businessQrCode != null) {
        formData.append("business_qr_code", businessQrCode);
      }
      // Append other fields from businessProfileData
      Object.entries(businessProfileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      https
        .post("/business_update", formData)
        .then(function (response) {
          if (response.data.status == 0) {
            toast.success(response.data.message);
          } else {
            toast.err(response.data.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };
  return (
    <React.Fragment>
      <div className="text-center">
        <img
          src={require("../../assets/images/logo-light2.png")}
          className="profile-wid-img"
          alt=""
        />
      </div>
      <Container fluid className="mt-5">
        <Row>
          <Col xxl={12}>
            <Card className="mt-xxl-n5 ">
              <CardBody className="p-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <form>
                      <Row>
                        <Col lg={2}>
                          <div className="text-center">
                            <div className="profile-user position-relative d-inline-block fw-bold  ">
                              Buisiness Logo{" "}
                              <span style={{ color: "red" }}>*</span>
                              <br />
                              <br />
                              {businessLogo ? (
                                <img
                                  id="business_logo"
                                  accept="image/png, image/gif, image/jpeg"
                                  src={
                                    businessLogo
                                      ? URL.createObjectURL(businessLogo)
                                      : ""
                                  }
                                  style={{ width: "100px" }}
                                  alt="business_profile_images"
                                />
                              ) : businessStatus == true ? (
                                <img
                                  accept="image/png, image/gif, image/jpeg"
                                  src={
                                    `${IMG_API_URL}/business_images/` +
                                    businessProfileData.business_logo
                                  }
                                  style={{ width: "100px" }}
                                  alt="business_profile_images"
                                />
                              ) : (
                                <b style={validImage}>
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
                                    setBusinessProgilrData({
                                      ...businessProfileData,
                                      business_logo: e.target.files[0].name,
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
                        <Col lg={2} className="mt-3">
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
                        <Col lg={2} className="mt-3">
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
                              value={businessProfileData.business_company_email}
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
                              type="text"
                              value={businessProfileData.business_pincode}
                              onChange={handleBusinessProfileData}
                              name="business_pincode"
                              className="form-control fw-bold"
                              id="cityInput"
                              placeholder="Select Registration type"
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
                            <textarea
                              onChange={handleBusinessProfileData}
                              value={
                                businessProfileData.business_billing_address
                              }
                              name="business_billing_address"
                              className="form-control fw-bold"
                              rows={14}
                              placeholder="Enter the billing address"
                            />
                          </div>
                        </Col>
                        <Col lg={6} className="mt-3">
                          <div className="">
                            <Label
                              htmlFor="zipcodeInput"
                              className="form-label fw-bold"
                            >
                              Terms & conditions
                            </Label>
                            <CKEditor
                              editor={ClassicEditor}
                              data={
                                businessProfileData.business_terms_conditions !=
                                  null
                                  ? businessProfileData.business_terms_conditions
                                  : ""
                              }
                              onReady={(editor) => {
                                // You can store the "editor" and use when it is needed.
                              }}
                              onChange={(e, editor) => {
                                setBusinessProgilrData({
                                  ...businessProfileData,
                                  business_terms_conditions: editor.getData(),
                                });
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg={6} className="mt-3">
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
                        <Col lg={6} className="mt-3">
                          <div className="hstack  gap-2 justify-content-center">
                            <div className="text-center ">
                              <div className="fw-bold profile-user position-relative d-inline-block mx-auto  ">
                                Signature{" "}
                                <span style={{ color: "red" }}>*</span>
                                <br />
                                <br />
                                {businessSignature ? (
                                  <img
                                    id="business_signature"
                                    accept="image/png, image/gif, image/jpeg"
                                    src={URL.createObjectURL(businessSignature)}
                                    className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                    alt="business_signature"
                                  />
                                ) : businessStatus == true ? (
                                  <img
                                    accept="image/png, image/gif, image/jpeg"
                                    src={
                                      `${IMG_API_URL}/business_images/` +
                                      businessProfileData.business_signature
                                    }
                                    className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                                    alt="business_signature"
                                  />
                                ) : (
                                  <b style={validImage}>
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
                                      setBusinessProgilrData({
                                        ...businessProfileData,
                                        business_signature:
                                          e.target.files[0].name,
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
                        <Col lg={6} className="text-center">
                          <div className="hstack gap-2 justify-content-center mt-5">
                            <button
                              ref={submitButtonRef}
                              type="button"
                              className="btn btn-success"
                              onClick={() => OnSubmited()}
                            >
                              Save and Proceed
                            </button>
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
    </React.Fragment>
  );
};

export default Company;
