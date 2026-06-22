import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card, Modal, ModalHeader, ModalBody,
  Label, Input, Row, Col, Button, Badge,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import { API_URL, sendMail, sendWhatsApp } from "../../helpers/url_helper";


const EMPTY_CONTACT = { child_name: "", child_email: "", child_mobile: "", child_designation: "" };

const EMPTY_USER = {
  user_name: "", user_type: 1, user_mobile: "", user_email: "",
  master_ifsc: "", master_branch_name: "", master_branch_code: "",
  master_name: "", master_mobile: "", master_email: "",
  master_address: "", master_gst: "", master_pincode: "",
  master_state: "", master_district: "", master_taluka: "", master_city: "",
};

const USER_TYPE_OPTIONS = [
  { value: 2, label: "Vendor" },
  { value: 3, label: "Bank" },
];

const UserAddModal = (props) => {
  const { http } = AuthUser();
  const [modal, setModal] = useState(false);
  const submitButtonRef = useRef();

  const [UserData, setUserData] = useState(EMPTY_USER);
  const [errors, setErrors] = useState({});
  const [personalContacts, setPersonalContacts] = useState([{ ...EMPTY_CONTACT }]);
  const [addedContacts, setAddedContacts] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (!UserData.user_name.trim()) newErrors.user_name = "User name is required";

    if (UserData.user_mobile && !/^\+?[1-9]\d{9,14}$/.test(UserData.user_mobile))
      newErrors.user_mobile = "Enter valid mobile number (with or without country code)";

    if (UserData.user_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(UserData.user_email))
      newErrors.user_email = "Enter valid email address";

    if (UserData.master_gst && UserData.master_gst.toUpperCase().length !== 15)
      newErrors.master_gst = "GST must be 15 characters long";

    if (UserData.user_type === 3 && UserData.master_ifsc &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(UserData.master_ifsc.toUpperCase()))
      newErrors.master_ifsc = "Invalid IFSC code";

    if (UserData.master_pincode && !/^\d{6}$/.test(UserData.master_pincode))
      newErrors.master_pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-fill from pincode
  useEffect(() => {
    if (UserData.master_pincode?.length === 6) {
      fetch(`${API_URL}/pincode/${UserData.master_pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice?.[0];
            setUserData((prev) => ({
              ...prev,
              master_state: postOffice.State,
              master_district: postOffice.District,
              master_taluka: postOffice.Block || "Not Available",
              cities: data[0].PostOffice || [],
            }));
          }
        })
        .catch(() => console.log("Error fetching pincode data"));
    } else {
      setUserData((prev) => ({
        ...prev,
        master_state: "", master_district: "", master_taluka: "", cities: [],
      }));
    }
  }, [UserData.master_pincode]);

  // Auto-fill from IFSC
  useEffect(() => {
    if (UserData.master_ifsc?.length === 11) {
      fetch(`https://ifsc.razorpay.com/${UserData.master_ifsc}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          setUserData((prev) => ({
            ...prev,
            master_name: data.BANK || "",
            master_branch_name: data.BRANCH || "",
            master_mobile: data.CONTACT || "",
            master_branch_code: data?.IFSC ? data.IFSC.slice(-6) : "",
            master_address: data.ADDRESS || "",
          }));
        })
        .catch(() => {
          console.log("Error fetching IFSC data");
          setUserData((prev) => ({
            ...prev,
            master_name: "", master_branch_name: "",
            master_branch_code: "", master_mobile: "", master_address: "",
          }));
        });
    }
  }, [UserData.master_ifsc]);

  const getUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (name === "user_name") handleContactChange(0, "child_name", value);
    if (name === "user_email") handleContactChange(0, "child_email", value);
    if (name === "user_mobile") handleContactChange(0, "child_mobile", value);
  };

  const handleContactChange = (index, field, value) => {
    setPersonalContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUserTypeChange = (selectedOption) => {
    setUserData((prev) => ({ ...prev, user_type: selectedOption.value }));
    if (selectedOption.value === 1) {
      setPersonalContacts([{ ...EMPTY_CONTACT }]);
      setAddedContacts([]);
    }
  };

  const addContactToList = () => {
    const { child_name, child_email, child_mobile } = personalContacts[0];
    const name = child_name?.trim();
    const email = child_email?.trim();
    const mobile = child_mobile?.trim();

    if (!name && !email && !mobile) return toast.error("Please fill at least one contact detail!");
    if (!name) return toast.error("Name cannot be empty.");
    if (!email) return toast.error("Email is required.");
    if (!mobile) return toast.error("Mobile number is required.");

    setAddedContacts((prev) => [...prev, personalContacts[0]]);
    setPersonalContacts([{ ...EMPTY_CONTACT }]);
  };

  const removeContactFromList = (index) => {
    setAddedContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const OnSubmited = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors before Submitting", {
        draggable: true, theme: "colored", position: "top-center",
      });
      return;
    }

    if (!UserData.user_mobile) return toast.error("Mobile Number is not empty!");
    if (props.Status === 1 && !UserData.user_email) return toast.error("Email Cannot not empty!");

    if (UserData.user_type === 2) {
      if (!UserData.master_name) return toast.error("Business Name cannot be empty!");
      if (!UserData.master_mobile) return toast.error("Business Mobile cannot be empty!");
      if (!UserData.master_email) return toast.error("Business Email cannot be empty!");
      if (!UserData.master_address) return toast.error("Business Address cannot be empty!");
    }

    if (UserData.user_type === 3) {
      if (!UserData.master_ifsc) return toast.error("Bank Ifsc cannot be empty!");
      if (!UserData.master_name) return toast.error("Bank Name cannot be empty!");
      if (!UserData.master_mobile) return toast.error("Bank Mobile cannot be empty!");
      if (!UserData.master_address) return toast.error("Bank Address cannot be empty!");
    }

    if (!UserData.master_pincode) return toast.error("Pincode is required!");
    if (!UserData.master_city) return toast.error("City is required!");
    if (!UserData.master_address) return toast.error("Address cannot be empty!");
    if (addedContacts.length === 0) return toast.error("At least one contact detail is required.");

    const dataToSubmit = { ...UserData, contact_persons: addedContacts,createdBy_id:true };

    await http
      .post("/admin/register/user", dataToSubmit)
      .then((response) => {
        props.checkchang(response.data.message);
        sendMail("customer", { Name: UserData.user_name }, UserData.user_email);
        sendWhatsApp(UserData.user_mobile, [UserData.user_name], "welcome_5m");
        Close();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const Close = () => {
    setModal(false);
    setAddedContacts([]);
    setPersonalContacts([{ ...EMPTY_CONTACT }]);
    setUserData(EMPTY_USER);
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

  const citySelectOptions = UserData.cities?.map((city) => ({
    value: city.Name,
    label: city.Name,
  })) || [];

  const citySelectOptionsWithStatus = UserData.cities?.map((city) => ({
    value: city.Name,
    label: `${city.Name} ( ${city.DeliveryStatus} )`,
  })) || [];

  const handleCityChange = (selectedOption) =>
    setUserData((prev) => ({ ...prev, master_city: selectedOption.value }));

  const cityValue = UserData.master_city
    ? { value: UserData.master_city, label: UserData.master_city }
    : null;

  const renderError = (field) =>
    errors[field] && <div className="invalid-feedback">{errors[field]}</div>;

  return (
    <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
      <ModalHeader className="text-white p-3" toggle={toggle}>
        Create New User
      </ModalHeader>
      <div className="tablelist-form">
        <ModalBody>
          <Card className="border card-border-primary p-4 shadow-sm">
            {/* Basic Info */}
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">User Name <span className="text-danger">*</span></Label>
                  <Input onChange={getUserData} value={UserData.user_name} name="user_name"
                    className={`form-control ${errors.user_name ? "is-invalid" : ""}`}
                    placeholder="Enter full name" />
                  {renderError("user_name")}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">Mobile No <span className="text-danger">*</span></Label>
                  <Input onChange={getUserData} name="user_mobile" placeholder="Enter mobile number"
                    className={`form-control ${errors.user_mobile ? "is-invalid" : ""}`} />
                  {renderError("user_mobile")}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    Email Address <span className="text-danger">{props.status === 1 ? "*" : ""}</span>
                  </Label>
                  <Input onChange={getUserData} name="user_email" placeholder="Enter email" type="email"
                    className={`form-control ${errors.user_email ? "is-invalid" : ""}`} />
                  {renderError("user_email")}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">User Type <span className="text-danger">*</span></Label>
                  <Select options={USER_TYPE_OPTIONS} onChange={handleUserTypeChange} className="basic-select" />
                </div>
              </Col>
            </Row>

            <Row><Col lg="12"><hr className="shadow-lg fw-bold border border-primary" /></Col></Row>

            {/* Vendor Fields */}
            {UserData.user_type === 2 && (
              <Row>
                <Col lg={4}>
                  <Label className="fw-bold">Business Name <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_name" value={UserData.master_name}
                    placeholder="Enter business name" onChange={getUserData}
                    className={`form-control ${errors.master_name ? "is-invalid" : ""}`} />
                  {renderError("master_name")}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">Mobile Number <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_mobile" value={UserData.master_mobile}
                    placeholder="Enter mobile number" onChange={getUserData}
                    className={`form-control ${errors.master_mobile ? "is-invalid" : ""}`} />
                  {renderError("master_mobile")}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">Email Address <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_email" value={UserData.master_email}
                    placeholder="Enter Email Address" onChange={getUserData}
                    className={`form-control ${errors.master_email ? "is-invalid" : ""}`} />
                  {renderError("master_email")}
                </Col>
                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">Address <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_address" value={UserData.master_address}
                    placeholder="Enter Address" onChange={getUserData}
                    className={`form-control ${errors.master_address ? "is-invalid" : ""}`} />
                  {renderError("master_address")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">GST ( Optional )</Label>
                  <Input type="text" name="master_gst" value={UserData.master_gst}
                    placeholder="Enter GST Number" onChange={getUserData}
                    className={`form-control ${errors.master_gst ? "is-invalid" : ""}`} />
                  {renderError("master_gst")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Pincode <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_pincode" value={UserData.master_pincode}
                    placeholder="Enter Pincode" onChange={getUserData}
                    className={`form-control ${errors.master_pincode ? "is-invalid" : ""}`} />
                  {renderError("master_pincode")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">State</Label>
                  <Input type="text" name="master_state" value={UserData.master_state}
                    placeholder="Enter State" onChange={getUserData}
                    className={`form-control ${errors.master_state ? "is-invalid" : ""}`} />
                  {renderError("master_state")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">District</Label>
                  <Input type="text" name="master_district" value={UserData.master_district}
                    className="form-control" placeholder="Enter District" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input type="text" name="master_taluka" value={UserData.master_taluka}
                    className="form-control" placeholder="Enter Taluka" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">City <span className="text-danger">*</span></Label>
                  <Select options={citySelectOptions} onChange={handleCityChange}
                    className="basic-select" placeholder="Select City" value={cityValue} />
                </Col>
              </Row>
            )}

            {/* Customer Fields */}
            {UserData.user_type === 1 && (
              <Row>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">Pincode <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_pincode" value={UserData.master_pincode}
                    placeholder="Enter Pincode" onChange={getUserData}
                    className={`form-control ${errors.master_pincode ? "is-invalid" : ""}`} />
                  {renderError("master_pincode")}
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">State</Label>
                  <Input type="text" name="master_state" value={UserData.master_state}
                    placeholder="Enter State" onChange={getUserData}
                    className={`form-control ${errors.master_state ? "is-invalid" : ""}`} />
                  {renderError("master_state")}
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">District</Label>
                  <Input type="text" name="master_district" value={UserData.master_district}
                    className="form-control" placeholder="Enter District" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input type="text" name="master_taluka" value={UserData.master_taluka}
                    className="form-control" placeholder="Enter Taluka" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">City <span className="text-danger">*</span></Label>
                  <Select options={citySelectOptions} onChange={handleCityChange}
                    className="basic-select" placeholder="Select City" value={cityValue} />
                </Col>
                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">Address <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_address" value={UserData.master_address}
                    placeholder="Enter Address" onChange={getUserData}
                    className={`form-control ${errors.master_address ? "is-invalid" : ""}`} />
                  {renderError("master_address")}
                </Col>
              </Row>
            )}

            {/* Bank Fields */}
            {UserData.user_type === 3 && (
              <Row>
                <Col lg={4}>
                  <Label className="fw-bold">IFSC Code <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_ifsc" value={UserData.master_ifsc}
                    placeholder="Enter Ifsc Code" onChange={getUserData}
                    className={`form-control ${errors.master_ifsc ? "is-invalid" : ""}`} />
                  {renderError("master_ifsc")}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">Bank Name <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_name" value={UserData.master_name}
                    placeholder="Enter bank name" onChange={getUserData}
                    className={`form-control ${errors.master_name ? "is-invalid" : ""}`} />
                  {renderError("master_name")}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">Mobile Number <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_mobile" value={UserData.master_mobile}
                    placeholder="Enter mobile number" onChange={getUserData}
                    className={`form-control ${errors.master_mobile ? "is-invalid" : ""}`} />
                  {renderError("master_mobile")}
                </Col>
                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">Address <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_address" value={UserData.master_address}
                    placeholder="Enter Address" onChange={getUserData}
                    className={`form-control ${errors.master_address ? "is-invalid" : ""}`} />
                  {renderError("master_address")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Email Address <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_email" value={UserData.master_email}
                    placeholder="Enter Email" onChange={getUserData}
                    className={`form-control ${errors.master_email ? "is-invalid" : ""}`} />
                  {renderError("master_email")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Branch Name <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_branch_name" value={UserData.master_branch_name}
                    placeholder="Enter Branch Name" onChange={getUserData}
                    className={`form-control ${errors.master_branch_name ? "is-invalid" : ""}`} />
                  {renderError("master_branch_name")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Branch Code <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_branch_code" value={UserData.master_branch_code}
                    placeholder="Enter Branch Code" onChange={getUserData}
                    className={`form-control ${errors.master_branch_code ? "is-invalid" : ""}`} />
                  {renderError("master_branch_code")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">GST <span>(Optional)</span></Label>
                  <Input type="text" name="master_gst" value={UserData.master_gst}
                    placeholder="Enter GST Number" onChange={getUserData}
                    className={`form-control ${errors.master_gst ? "is-invalid" : ""}`} />
                  {renderError("master_gst")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Pincode <span className="text-danger">*</span></Label>
                  <Input type="text" name="master_pincode" value={UserData.master_pincode}
                    placeholder="Enter Pincode" onChange={getUserData}
                    className={`form-control ${errors.master_pincode ? "is-invalid" : ""}`} />
                  {renderError("master_pincode")}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">State</Label>
                  <Input type="text" name="master_state" value={UserData.master_state}
                    readOnly className="form-control" placeholder="Enter State" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">District</Label>
                  <Input type="text" name="master_district" value={UserData.master_district}
                    readOnly className="form-control" placeholder="Enter District" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input type="text" name="master_taluka" value={UserData.master_taluka}
                    readOnly className="form-control" placeholder="Enter Taluka" onChange={getUserData} />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">City <span className="text-danger">*</span></Label>
                  <Select options={citySelectOptionsWithStatus} onChange={handleCityChange}
                    className="basic-select" placeholder="Select City" value={cityValue} />
                </Col>
              </Row>
            )}

            <Row><Col lg="12" className="py-2"><hr className="shadow-lg fw-bold border border-primary" /></Col></Row>

            {/* Personal Contacts Section */}
            <h5 className="mb-4 text-primary">Add Personal Contacts</h5>
            {personalContacts.map((contact, index) => (
              <Row key={`input-${index}`} className="mb-3">
                <Col md={4}>
                  <div className="mb-2">
                    <Label>Name <span className="text-danger">*</span></Label>
                    <Input value={contact.child_name} placeholder="Name"
                      onChange={(e) => handleContactChange(index, "child_name", e.target.value)} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-2">
                    <Label>Email <span className="text-danger">*</span></Label>
                    <Input value={contact.child_email} placeholder="Email" type="email"
                      onChange={(e) => handleContactChange(index, "child_email", e.target.value)} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-2">
                    <Label>Phone <span className="text-danger">*</span></Label>
                    <Input value={contact.child_mobile} placeholder="Phone"
                      onChange={(e) => handleContactChange(index, "child_mobile", e.target.value)} />
                  </div>
                </Col>
                <Col md={5}>
                  <div className="mb-2">
                    <Label>Designation</Label>
                    <Input value={contact.child_designation} placeholder="Designation"
                      onChange={(e) => handleContactChange(index, "child_designation", e.target.value)} />
                  </div>
                </Col>
                <Col md={4} className="mt-4">
                  <Button color="success" className="me-2" onClick={addContactToList}>
                    Save Contacts
                  </Button>
                </Col>
              </Row>
            ))}

            {/* Saved Contacts Table */}
            {addedContacts.length > 0 && (
              <div className="mt-4">
                <h5 className="mb-3 text-primary">Saved Contacts</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th><th>Email</th><th>Phone</th><th>Designation</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedContacts.map((contact, index) => (
                        <tr key={`saved-${index}`}>
                          <td>{contact.child_name || <Badge color="secondary">Not provided</Badge>}</td>
                          <td>{contact.child_email || <Badge color="secondary">Not provided</Badge>}</td>
                          <td>{contact.child_mobile || <Badge color="secondary">Not provided</Badge>}</td>
                          <td>{contact.child_designation || <Badge color="secondary">Not provided</Badge>}</td>
                          {index !== 0 && (
                            <td>
                              <Button color="danger" size="sm" onClick={() => removeContactFromList(index)}>
                                <i className="ri-delete-bin-5-fill fs-16" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </ModalBody>
        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <Button color="danger" onClick={Close}>Close</Button>
            <Button color="success" onClick={OnSubmited} innerRef={submitButtonRef}>Save User</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserAddModal;