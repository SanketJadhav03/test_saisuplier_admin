import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Row,
  Col,
  Button,
  Badge,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import { API_URL, sendMail, sendWhatsApp } from "../../helpers/url_helper";

const UserAddModal = (props) => {
  const { http } = AuthUser();
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState(0);
  const submitButtonRef = useRef();

  // User types options with numeric values
  const userTypeOptions = [
    { value: 2, label: "Vendor" },
    { value: 3, label: "Bank" },
  ];

  // Main user data state
  const [UserData, setUserData] = useState({
    user_name: "",
    user_type: 1,
    user_mobile: "",
    user_email: "",

    master_ifsc: "",

    master_branch_name: "",
    master_branch_code: "",

    master_name: "",
    master_mobile: "",
    master_email: "",
    master_address: "",
    master_gst: "",

    master_pincode: "",
    master_state: "",
    master_district: "",
    master_taluka: "",
    master_city: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let valid = true;

    // User Name
    if (!UserData.user_name.trim()) {
      newErrors.user_name = "User name is required";
      valid = false;
    }

    // Mobile (global format, min 10 digits)
    if (
      UserData.user_mobile &&
      !/^\+?[1-9]\d{9,14}$/.test(UserData.user_mobile)
    ) {
      newErrors.user_mobile =
        "Enter valid mobile number (with or without country code)";
      valid = false;
    }

    // Email
    if (
      UserData.user_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(UserData.user_email)
    ) {
      newErrors.user_email = "Enter valid email address";
      valid = false;
    }

    // GST (optional but validate if entered)
    if (UserData.master_gst) {
      const gst = UserData.master_gst.toUpperCase();
      if (gst.length !== 15) {
        newErrors.master_gst = "GST must be 15 characters long";
        valid = false;
      }
    }

    // IFSC (for banks)
    if (UserData.user_type === 3 && UserData.master_ifsc) {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(UserData.master_ifsc.toUpperCase())) {
        newErrors.master_ifsc = "Invalid IFSC code";
        valid = false;
      }
    }

    // Pincode
    if (UserData.master_pincode && !/^\d{6}$/.test(UserData.master_pincode)) {
      newErrors.master_pincode = "Enter valid 6-digit pincode";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    if (UserData.master_pincode?.length === 6) {
      fetch(`${API_URL}/pincode/${UserData.master_pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice?.[0];
            setUserData({
              ...UserData,
              master_state: postOffice.State,
              master_district: postOffice.District,
              master_taluka: postOffice.Block || "Not Available", // sometimes Block gives Taluka
              cities: data[0].PostOffice || [],
            });
          }
        })
        .catch(() => {
          console.log("Error fetching pincode data");
        });
    } else {
      setUserData({
        ...UserData,
        master_state: "",
        master_district: "",
        master_taluka: "",
        cities: [],
      });
    }
  }, [UserData.master_pincode]);

  useEffect(() => {
    if (UserData.master_ifsc?.length === 11) {
      fetch(`https://ifsc.razorpay.com/${UserData.master_ifsc}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setUserData({
            ...UserData,
            master_name: data.BANK || "",
            master_branch_name: data.BRANCH || "",
            master_mobile: data.CONTACT || "",
            master_branch_code: data?.IFSC ? data.IFSC.slice(-6) : "",
            master_address: data.ADDRESS || "",
          });
        })
        .catch(() => {
          console.log("Error fetching IFSC data");
          setUserData({
            ...UserData,
            master_name: "",
            master_branch_name: "",
            master_branch_code: "",
            master_mobile: "",
            master_address: "",
          });
        });
    }
  }, [UserData.master_ifsc]);
  // Personal contacts state
  const [personalContacts, setPersonalContacts] = useState([
    {
      child_name: "",
      child_email: "",
      child_mobile: "",
      child_designation: "",
    },
  ]);

  // Added contacts state
  const [addedContacts, setAddedContacts] = useState([]);

  // Handle personal contact changes
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...personalContacts];
    updatedContacts[index][field] = value;
    setPersonalContacts(updatedContacts);
  };

  // Add contact to the list
  const addContactToList = () => {
    const contact = personalContacts[0]; // You are adding ONE row at a time

    const name = contact.child_name?.trim() || "";
    const email = contact.child_email?.trim() || "";
    const mobile = contact.child_mobile?.trim() || "";

    // CASE 1 → All Empty
    if (name == "" && email == "" && mobile == "") {
      toast.error("Please fill at least one contact detail!");
      return;
    }

    // CASE 2 → Name present but others missing
    if (name == "") {
      toast.error("Name cannot be empty.");
      return;
    }

    // CASE 3 → Email present only
    if (email == "") {
      toast.error("Email is required.");
      return;
    }

    // CASE 4 → Mobile present only
    if (mobile == "") {
      toast.error("Mobile number is required.");
      return;
    }

    // CASE 5 → All Good → Add Contact
    setAddedContacts([...addedContacts, contact]);

    // Reset fields
    setPersonalContacts([
      {
        child_name: "",
        child_email: "",
        child_mobile: "",
        child_designation: "",
      },
    ]);
  };

  // Remove contact from list
  const removeContactFromList = (index) => {
    const updatedContacts = [...addedContacts];
    updatedContacts.splice(index, 1);
    setAddedContacts(updatedContacts);
  };

  // Handle main user data changes
  const getUserData = (e) => {
    setUserData({ ...UserData, [e.target.name]: e.target.value });
    if (e.target.name == "user_name") {
      handleContactChange(0, "child_name", e.target.value);
    }
    if (e.target.name == "user_email") {
      handleContactChange(0, "child_email", e.target.value);
    }
    if (e.target.name == "user_mobile") {
      handleContactChange(0, "child_mobile", e.target.value);
    }
  };

  // Handle user type selection
  const handleUserTypeChange = (selectedOption) => {
    setUserData({ ...UserData, user_type: selectedOption.value });

    // Reset contacts when changing user type to customer
    if (selectedOption.value === 1) {
      setPersonalContacts([
        {
          child_name: "",
          child_email: "",
          child_mobile: "",
          child_designation: "",
        },
      ]);
      setAddedContacts([]);
    }
  };

  // Check if personal contacts section should be shown
  const showPersonalContacts = () => {
    return true; // Vendor (2) or Bank (3)
  };

  // Form submission
  const OnSubmited = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors before Submitting", {
        draggable: true,
        theme: "colored",
        position: "top-center",
      });
      return;
    }
    if (UserData.user_mobile == "") {
      toast.error("Mobile Number is not empty!");
      return;
    }
    if (UserData.user_email == "") {
      toast.error("Email Cannot not empty!");
      return;
    }
    if (UserData.user_type == 2) {
      if (UserData.master_name == "") {
        toast.error("Business Name cannot be empty!");
        return;
      }
      if (UserData.master_mobile == "") {
        toast.error("Business Mobile cannot be empty!");
        return;
      }
      if (UserData.master_email == "") {
        toast.error("Business Email cannot be empty!");
        return;
      }
      if (UserData.master_address == "") {
        toast.error("Business Address cannot be empty!");
        return;
      }
    }
    if (UserData.user_type == 3) {
      if (UserData.master_ifsc == "") {
        toast.error("Bank Ifsc cannot be empty!");
        return;
      }
      if (UserData.master_name == "") {
        toast.error("Bank Name cannot be empty!");
        return;
      }
      if (UserData.master_mobile == "") {
        toast.error("Bank Mobile cannot be empty!");
        return;
      }
      // if (UserData.master_email == "") {
      //   toast.error("Bank Email cannot be empty!");
      //   return;
      // }
      if (UserData.master_address == "") {
        toast.error("Bank Address cannot be empty!");
        return;
      }
      // if (UserData.master_gst == "") {
      //   toast.error("GST Number cannot be empty!");
      //   return;
      // }
    }
    if (UserData.master_pincode == "") {
      toast.error("Pincode is required!");
      return;
    }
    if (UserData.master_city == "") {
      toast.error("City is required!");
      return;
    }
    if (UserData.master_address == "") {
      toast.error("  Address cannot be empty!");
      return;
    }
    if (addedContacts.length == 0) {
      toast.error("At least one contact detail is required.");
      return;
    }
    const dataToSubmit = {
      ...UserData,
      contact_persons: showPersonalContacts() ? addedContacts : [],
    };

    await http
      .post("/admin/register/user", dataToSubmit)
      .then(function (response) {
        props.checkchang(response.data.message);
        sendMail(
          "customer",
          {
            Name: UserData.user_name,
          },
          UserData.user_email,
        );
        sendWhatsApp(UserData.user_mobile, [UserData.user_name], "welcome_5m");
        Close();
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  // Modal control
  const Close = () => {
    setModal(false);
    setAddedContacts([]);
    setPersonalContacts([
      {
        child_name: "",
        child_email: "",
        child_mobile: "",
        child_designation: "",
      },
    ]);
    setUserData({
      user_name: "",
      user_type: 1,
      user_mobile: "",
      user_email: "",

      master_ifsc: "",

      master_branch_name: "",
      master_branch_code: "",

      master_name: "",
      master_mobile: "",
      master_email: "",
      master_address: "",
      master_gst: "",

      master_pincode: "",
      master_state: "",
      master_district: "",
      master_taluka: "",
      master_city: "",
    });
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

  return (
    <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
      <ModalHeader className=" text-white p-3" toggle={toggle}>
        Create New User
      </ModalHeader>
      <div className="tablelist-form">
        <ModalBody>
          <Card className="border card-border-primary p-4 shadow-sm">
            {/* <h5 className="mb-4 text-primary">Basic Information</h5> */}
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    User Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    onChange={getUserData}
                    value={UserData.user_name}
                    name="user_name"
                    className={`form-control ${
                      errors.user_name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.user_name && (
                    <div className="invalid-feedback">{errors.user_name}</div>
                  )}
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    Mobile No <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    onChange={getUserData}
                    name="user_mobile"
                    placeholder="Enter mobile number"
                    className={`form-control ${
                      errors.user_mobile ? "is-invalid" : ""
                    }`}
                  />
                  {errors.user_mobile && (
                    <div className="invalid-feedback">{errors.user_mobile}</div>
                  )}
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    Email Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    onChange={getUserData}
                    name="user_email"
                    placeholder="Enter email"
                    type="email"
                    className={`form-control ${
                      errors.user_email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.user_email && (
                    <div className="invalid-feedback">{errors.user_email}</div>
                  )}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    User Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    options={userTypeOptions}
                    onChange={handleUserTypeChange}
                    className="basic-select"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg="12">
                <hr className="shadow-lg fw-bold border border-primary" />
              </Col>
            </Row>
            {UserData.user_type == 2 && (
              <Row>
                <Col lg={4}>
                  <Label className="fw-bold">
                    Business Name <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_name"
                    value={UserData.master_name}
                    placeholder="Enter business name"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_name && (
                    <div className="invalid-feedback">{errors.master_name}</div>
                  )}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">
                    Mobile Number <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_mobile"
                    value={UserData.master_mobile}
                    placeholder="Enter mobile number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_mobile ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_mobile && (
                    <div className="invalid-feedback">
                      {errors.master_mobile}
                    </div>
                  )}
                </Col>
                <Col className={UserData.user_type == 3 ? "mt-3" : ""} lg={4}>
                  <Label className="fw-bold">
                    Email Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_email"
                    value={UserData.master_email}
                    placeholder="Enter Email Address"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_email && (
                    <div className="invalid-feedback">
                      {errors.master_email}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">
                    Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_address"
                    value={UserData.master_address}
                    placeholder="Enter Address"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_address ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_address && (
                    <div className="invalid-feedback">
                      {errors.master_address}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">GST ( Optional )</Label>
                  <Input
                    type="text"
                    name="master_gst"
                    value={UserData.master_gst}
                    placeholder="Enter GST Number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_gst ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_gst && (
                    <div className="invalid-feedback">{errors.master_gst}</div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    Pincode <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_pincode"
                    value={UserData.master_pincode}
                    placeholder="Enter mobile number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_pincode ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_pincode && (
                    <div className="invalid-feedback">
                      {errors.master_pincode}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">State</Label>
                  <Input
                    type="text"
                    name="master_state"
                    value={UserData.master_state}
                    readOnly
                    placeholder="Enter State"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_state ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_state && (
                    <div className="invalid-feedback">
                      {errors.master_state}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">District</Label>
                  <Input
                    type="text"
                    name="master_district"
                    value={UserData.master_district}
                    readOnly
                    className="form-control"
                    placeholder="Enter District"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input
                    type="text"
                    name="master_taluka"
                    value={UserData.master_taluka}
                    readOnly
                    className="form-control"
                    placeholder="Enter Taluka"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    City <span className="text-danger"> *</span>
                  </Label>
                  <Select
                    options={
                      UserData.cities?.map((city) => ({
                        value: city.Name,
                        label: city.Name,
                      })) || []
                    }
                    onChange={(selectedOption) =>
                      setUserData({
                        ...UserData,
                        master_city: selectedOption.value,
                      })
                    }
                    className="basic-select"
                    placeholder="Select City"
                    value={
                      UserData.master_city
                        ? {
                            value: UserData.master_city,
                            label: UserData.master_city,
                          }
                        : null
                    }
                  />
                </Col>
              </Row>
            )}

            {UserData.user_type == 1 && (
              <Row>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">
                    Pincode <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_pincode"
                    value={UserData.master_pincode}
                    placeholder="Enter mobile number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_pincode ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_pincode && (
                    <div className="invalid-feedback">
                      {errors.master_pincode}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">State</Label>
                  <Input
                    type="text"
                    name="master_state"
                    value={UserData.master_state}
                    readOnly
                    placeholder="Enter State"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_state ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_state && (
                    <div className="invalid-feedback">
                      {errors.master_state}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">District</Label>
                  <Input
                    type="text"
                    name="master_district"
                    value={UserData.master_district}
                    readOnly
                    className="form-control"
                    placeholder="Enter District"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={3}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input
                    type="text"
                    name="master_taluka"
                    value={UserData.master_taluka}
                    readOnly
                    className="form-control"
                    placeholder="Enter Taluka"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    City <span className="text-danger"> *</span>
                  </Label>
                  <Select
                    options={
                      UserData.cities?.map((city) => ({
                        value: city.Name,
                        label: city.Name,
                      })) || []
                    }
                    onChange={(selectedOption) =>
                      setUserData({
                        ...UserData,
                        master_city: selectedOption.value,
                      })
                    }
                    className="basic-select"
                    placeholder="Select City"
                    value={
                      UserData.master_city
                        ? {
                            value: UserData.master_city,
                            label: UserData.master_city,
                          }
                        : null
                    }
                  />
                </Col>
                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">
                    Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_address"
                    value={UserData.master_address}
                    placeholder="Enter Address"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_address ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_address && (
                    <div className="invalid-feedback">
                      {errors.master_address}
                    </div>
                  )}
                </Col>
              </Row>
            )}
            {UserData.user_type == 3 && (
              <Row>
                <Col lg={4}>
                  <Label className="fw-bold">
                    IFSC Code <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_ifsc"
                    value={UserData.master_ifsc}
                    placeholder="Enter Ifsc Code"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_ifsc ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_ifsc && (
                    <div className="invalid-feedback">{errors.master_ifsc}</div>
                  )}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">
                    Bank Name <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_name"
                    value={UserData.master_name}
                    placeholder="Enter bank name"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_name && (
                    <div className="invalid-feedback">{errors.master_name}</div>
                  )}
                </Col>
                <Col lg={4}>
                  <Label className="fw-bold">
                    Mobile Number <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_mobile"
                    value={UserData.master_mobile}
                    placeholder="Enter mobile number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_mobile ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_mobile && (
                    <div className="invalid-feedback">
                      {errors.master_mobile}
                    </div>
                  )}
                </Col>

                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">
                    Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_address"
                    value={UserData.master_address}
                    placeholder="Enter Address"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_address ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_address && (
                    <div className="invalid-feedback">
                      {errors.master_address}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    Email Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_email"
                    value={UserData.master_email}
                    placeholder="Enter Email"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_email && (
                    <div className="invalid-feedback">
                      {errors.master_email}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    Branch Name <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_branch_name"
                    value={UserData.master_branch_name}
                    placeholder="Enter Branch Name"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_branch_name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_branch_name && (
                    <div className="invalid-feedback">
                      {errors.master_branch_name}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    Branch Code <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_branch_code"
                    value={UserData.master_branch_code}
                    placeholder="Enter Branch Code"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_branch_code ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_branch_code && (
                    <div className="invalid-feedback">
                      {errors.master_branch_code}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    GST <span>(Optional)</span>{" "}
                  </Label>
                  <Input
                    type="text"
                    name="master_gst"
                    value={UserData.master_gst}
                    placeholder="Enter GST Number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_gst ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_gst && (
                    <div className="invalid-feedback">{errors.master_gst}</div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    Pincode <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_pincode"
                    value={UserData.master_pincode}
                    placeholder="Enter mobile number"
                    onChange={getUserData}
                    className={`form-control ${
                      errors.master_pincode ? "is-invalid" : ""
                    }`}
                  />
                  {errors.master_pincode && (
                    <div className="invalid-feedback">
                      {errors.master_pincode}
                    </div>
                  )}
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">State</Label>
                  <Input
                    type="text"
                    name="master_state"
                    value={UserData.master_state}
                    readOnly
                    className="form-control"
                    placeholder="Enter State"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">District</Label>
                  <Input
                    type="text"
                    name="master_district"
                    value={UserData.master_district}
                    readOnly
                    className="form-control"
                    placeholder="Enter District"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">Taluka</Label>
                  <Input
                    type="text"
                    name="master_taluka"
                    value={UserData.master_taluka}
                    readOnly
                    className="form-control"
                    placeholder="Enter Taluka"
                    onChange={getUserData}
                  />
                </Col>
                <Col className="mt-3" lg={4}>
                  <Label className="fw-bold">
                    City <span className="text-danger"> *</span>
                  </Label>
                  <Select
                    options={
                      UserData.cities?.map((city) => ({
                        value: city.Name,
                        status: city.DeliveryStatus,
                        label: `${city.Name} ( ${city.DeliveryStatus} )`,
                      })) || []
                    }
                    onChange={(selectedOption) =>
                      setUserData({
                        ...UserData,
                        master_city: selectedOption.value,
                      })
                    }
                    className="basic-select"
                    placeholder="Select City"
                    value={
                      UserData.master_city
                        ? {
                            value: UserData.master_city,
                            label: UserData.master_city,
                          }
                        : null
                    }
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col lg="12" className="py-2">
                <hr className="shadow-lg fw-bold border border-primary" />
              </Col>
            </Row>
            {/* Personal Contacts Section - Only shown for vendor (2) or bank (3) */}
            {showPersonalContacts() && (
              <>
                <h5 className="mb-4  text-primary">Add Personal Contacts</h5>
                {personalContacts.map((contact, index) => (
                  <Row key={`input-${index}`} className="mb-3">
                    <Col md={4}>
                      <div className="mb-2">
                        <Label>
                          {" "}
                          Name <span className="text-danger"> *</span>
                        </Label>
                        <Input
                          value={contact.child_name}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "child_name",
                              e.target.value,
                            )
                          }
                          placeholder="Name"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-2">
                        <Label>
                          Email <span className="text-danger"> *</span>
                        </Label>
                        <Input
                          value={contact.child_email}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "child_email",
                              e.target.value,
                            )
                          }
                          placeholder="Email"
                          type="email"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-2">
                        <Label>
                          Phone <span className="text-danger"> *</span>
                        </Label>
                        <Input
                          value={contact.child_mobile}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "child_mobile",
                              e.target.value,
                            )
                          }
                          placeholder="Phone"
                        />
                      </div>
                    </Col>
                    <Col md={5}>
                      <div className="mb-2">
                        <Label>Designation</Label>
                        <Input
                          value={contact.child_designation}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "child_designation",
                              e.target.value,
                            )
                          }
                          placeholder="Designation"
                        />
                      </div>
                    </Col>
                    <Col md={4} className=" mt-4">
                      <Button
                        color="success"
                        className="me-2"
                        onClick={addContactToList}
                      >
                        Save Contacts
                      </Button>
                    </Col>
                  </Row>
                ))}

                {/* Display added contacts in a table */}
                {addedContacts.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-3 text-primary">Saved Contacts</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Designation</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedContacts.map((contact, index) => (
                            <tr key={`saved-${index}`}>
                              <td>
                                {contact.child_name || (
                                  <Badge color="secondary">Not provided</Badge>
                                )}
                              </td>
                              <td>
                                {contact.child_email || (
                                  <Badge color="secondary">Not provided</Badge>
                                )}
                              </td>
                              <td>
                                {contact.child_mobile || (
                                  <Badge color="secondary">Not provided</Badge>
                                )}
                              </td>
                              <td>
                                {contact.child_designation || (
                                  <Badge color="secondary">Not provided</Badge>
                                )}
                              </td>
                              {index != 0 && (
                                <td>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => removeContactFromList(index)}
                                  >
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
              </>
            )}
          </Card>
        </ModalBody>
        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <Button color="danger" onClick={Close}>
              Close
            </Button>
            <Button
              color="success"
              onClick={OnSubmited}
              innerRef={submitButtonRef}
            >
              Save User
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserAddModal;
