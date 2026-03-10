import React, { useCallback, useEffect, useRef, useState } from "react";
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
  FormFeedback,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import ContactPerson from "./ContactPerson";

/**
 * UserEditModal
 * - Keeps original variable & function names where possible (UserData, personalContacts, addedContacts, etc.)
 * - Uses reactstrap + react-select
 * - Debounces pincode & IFSC API calls to avoid spamming requests
 * - Adds `errors` state for validation (prevents undefined errors usage)
 * - Cleans duplicate JSX by rendering type-specific blocks via helper renderers
 */

const UserEditModal = (props) => {
  const { http } = AuthUser();

  // basic UI states
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState(0);
  const submitButtonRef = useRef();

  // delete/contact modal
  const [deleteModal, setDeleteModal] = useState(0);
  const [contactModal, setContactModal] = useState({});

  // user types
  const userTypeOptions = [
    { value: 1, label: "Customer" },
    { value: 2, label: "Vendor" },
    { value: 3, label: "Bank" },
  ];

  // main user data state (initialized from props.edit_data)
  const [UserData, setUserData] = useState(
    props.edit_data || {
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
      cities: [],
    }
  );

  // errors state (used where earlier `errors` was referenced)
  const [errors, setErrors] = useState({});

  // personal contact UI & lists
  const [personalContacts, setPersonalContacts] = useState([
    {
      child_name: "",
      child_email: "",
      child_mobile: "",
      child_designation: "",
    },
  ]);
  const [addedContacts, setAddedContacts] = useState([]);

  // counter used to refresh contact list from server
  const [contactCount, setContactCount] = useState(1);

  // refs for debouncing network calls
  const pincodeTimerRef = useRef(null);
  const ifscTimerRef = useRef(null);

  // Keep UserData in sync when props.edit_data changes (e.g., when modal opens with new data)
  useEffect(() => {
    if (props.edit_data) {
      setUserData((prev) => ({ ...prev, ...props.edit_data }));
    }
  }, [props.edit_data]);

  // Fetch added contacts from server for this master (uses contactCount to refresh)
  const getaddedContacts = async () => {
    if (!UserData.master_id) {
      // No master id yet — clear added contacts
      setAddedContacts([]);
      return;
    }
    try {
      const res = await http.get(`/contact/persons/${UserData.master_id}`);
      setAddedContacts(res.data || []);
    } catch (err) {
      console.log("Error fetching added contacts:", err);
      setAddedContacts([]);
    }
  };

  useEffect(() => {
    getaddedContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactCount, UserData.master_id]);

  // ---------------------------
  // Helper: debounce pincode fetch
  // ---------------------------
  useEffect(() => {
    // clear any previous timer
    if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);

    const pincode = UserData.master_pincode;
    if (pincode && pincode.length === 6) {
      pincodeTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = await res.json();
          if (data?.[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice?.[0] || {};
            setUserData((prev) => ({
              ...prev,
              master_state: postOffice.State || "",
              master_district: postOffice.District || "",
              master_taluka:
                postOffice.Block || postOffice.Taluk || "Not Available",
              cities: data[0].PostOffice || [],
            }));
            setErrors((prev) => ({ ...prev, master_pincode: null }));
          } else {
            // reset the fields if pincode invalid
            setUserData((prev) => ({
              ...prev,
              master_state: "",
              master_district: "",
              master_taluka: "",
              cities: [],
              master_city: "",
            }));
            setErrors((prev) => ({
              ...prev,
              master_pincode: "Invalid pincode",
            }));
          }
        } catch (e) {
          console.log("Error fetching pincode data", e);
        }
      }, 600); // debounce 600ms
    } else {
      // clear derived fields
      setUserData((prev) => ({
        ...prev,
        master_state: "",
        master_district: "",
        master_taluka: "",
        cities: [],
        master_city: "",
      }));
      if (pincode && pincode.length > 0) {
        setErrors((prev) => ({
          ...prev,
          master_pincode: "Pincode must be 6 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, master_pincode: null }));
      }
    }

    return () => {
      if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserData.master_pincode]);

  // ---------------------------
  // Helper: debounce IFSC fetch
  // ---------------------------
  useEffect(() => {
    if (ifscTimerRef.current) clearTimeout(ifscTimerRef.current);

    const ifsc = UserData.master_ifsc;
    if (ifsc && ifsc.length === 11) {
      ifscTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
          if (!res.ok) throw new Error("IFSC fetch failed");
          const data = await res.json();
          setUserData((prev) => ({
            ...prev,
            master_name: data.BANK || "",
            master_branch_name: data.BRANCH || "",
            master_mobile: data.CONTACT || "",
            master_branch_code: data?.IFSC ? data.IFSC.slice(-6) : "",
            master_address: data.ADDRESS || "",
          }));
          setErrors((prev) => ({ ...prev, master_ifsc: null }));
        } catch (err) {
          console.log("Error fetching IFSC data:", err);
          setUserData((prev) => ({
            ...prev,
            master_name: "",
            master_branch_name: "",
            master_branch_code: "",
            master_mobile: "",
            master_address: "",
          }));
          setErrors((prev) => ({ ...prev, master_ifsc: "Invalid IFSC" }));
        }
      }, 600);
    } else {
      // clear IFSC derived fields if length not 11
      setUserData((prev) => ({
        ...prev,
        master_name: prev.master_name || "",
        master_branch_name: prev.master_branch_name || "",
        master_branch_code: prev.master_branch_code || "",
        master_mobile: prev.master_mobile || "",
        master_address: prev.master_address || "",
      }));
      if (ifsc && ifsc.length > 0 && ifsc.length !== 11) {
        setErrors((prev) => ({
          ...prev,
          master_ifsc: "IFSC must be 11 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, master_ifsc: null }));
      }
    }

    return () => {
      if (ifscTimerRef.current) clearTimeout(ifscTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserData.master_ifsc]);

  // ---------------------------
  // Contact handling
  // ---------------------------
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...personalContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setPersonalContacts(updatedContacts);
  };

  const addContactToList = () => {
    const validContacts = personalContacts.filter(
      (contact) =>
        (contact.child_name || "").trim() !== "" ||
        (contact.child_email || "").trim() !== "" ||
        (contact.child_mobile || "").trim() !== ""
    );

    if (validContacts.length === 0) {
      toast.error("Please enter at least one contact detail");
      return;
    }

    setAddedContacts((prev) => [...prev, ...validContacts]);

    // reset personalContacts to single empty row
    setPersonalContacts([
      {
        child_name: "",
        child_email: "",
        child_mobile: "",
        child_designation: "",
      },
    ]);
  };

  const removeContactFromList = (index) => {
    const updatedContacts = [...addedContacts];
    updatedContacts.splice(index, 1);
    setAddedContacts(updatedContacts);
  };

  // delete contact (server) handler triggered by DeleteModal.
  const handleDeleteOrder = (data) => {
    // DeleteModal returns the synthetic event name in data._reactName when clicking confirm
    if (data && data._reactName === "onClick" && deleteModal) {
      http
        .delete(`/contact/single/${deleteModal}`)
        .then(function (response) {
          if (response.data?.status === 0) {
            toast.success(response.data.message);
          } else {
            toast.warn(response.data.message);
          }
          setContactCount((c) => c + 1); // refresh contacts
        })
        .catch(function (error) {
          console.log("Error deleting contact", error);
          toast.error("Failed to delete contact");
        });
    }
    setDeleteModal(0);
  };

  // ---------------------------
  // Main user data handling
  // ---------------------------
  const getUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (selectedOption) => {
    const newType = selectedOption?.value || 1;
    setUserData((prev) => ({ ...prev, user_type: newType }));

    // If switching to Customer (1) reset contact lists
    if (newType === 1) {
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

  // ---------------------------
  // Submit form
  // ---------------------------
  const OnSubmited = async () => {
    // basic validation for user_name
    if (!UserData.user_name || UserData.user_name.trim() === "") {
      setMsg(1);
      return;
    }

    setMsg(0); // reset

    // additional field validation (pincode & address required for customers)
    const localErrors = {};
    if (UserData.user_type == 1) {
      if (!UserData.master_pincode)
        localErrors.master_pincode = "Pincode is required";
      if (!UserData.master_city) localErrors.master_city = "City is required";
      if (!UserData.master_address)
        localErrors.master_address = "Address is required";
    }
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      toast.warn("Please fix validation errors");
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
      if (UserData.master_email == "") {
        toast.error("Bank Email cannot be empty!");
        return;
      }
      if (UserData.master_address == "") {
        toast.error("Bank Address cannot be empty!");
        return;
      }
      if (UserData.master_gst == "") {
        toast.error("GST Number cannot be empty!");
        return;
      }
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
      contact_persons: addedContacts,
    };

    try {
      const response = await http.put("/admin/register/update", dataToSubmit);
      // call parent callback to indicate change
      if (props.checkchang) props.checkchang(response.data.message);
      Close();
    } catch (error) {
      console.log("Submit error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  // ---------------------------
  // Modal control & reset
  // ---------------------------
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
      cities: [],
    });
    setErrors({});
    setMsg(0);
    if (props.setModalStates) props.setModalStates();
  };

  // sync modal open/close with parent prop
  useEffect(() => {
    // When parent toggles props.modalStates, open/close modal accordingly:
    // This mirrors your original behavior: setModal(false); toggle();
    setModal(false);
    toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.modalStates]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      if (props.setModalStates) props.setModalStates();
    } else {
      setModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  // --------------------------------
  // Render helper for repeated blocks
  // --------------------------------
  const renderPincodeBlock = () => (
    <>
      <Col className="mt-3" lg={3}>
        <Label className="fw-bold">
          Pincode{" "}
          {UserData.user_type === 1 && <span className="text-danger"> *</span>}
        </Label>
        <Input
          type="text"
          name="master_pincode"
          value={UserData.master_pincode || ""}
          className={`form-control ${
            errors.master_pincode ? "is-invalid" : ""
          }`}
          placeholder="Enter pincode"
          onChange={getUserData}
        />
        {errors.master_pincode && (
          <div className="invalid-feedback">{errors.master_pincode}</div>
        )}
      </Col>

      <Col className="mt-3" lg={3}>
        <Label className="fw-bold">State</Label>
        <Input
          type="text"
          name="master_state"
          value={UserData.master_state || ""}
          readOnly
          className="form-control"
          placeholder="State"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={3}>
        <Label className="fw-bold">District</Label>
        <Input
          type="text"
          name="master_district"
          value={UserData.master_district || ""}
          readOnly
          className="form-control"
          placeholder="District"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={3}>
        <Label className="fw-bold">Taluka</Label>
        <Input
          type="text"
          name="master_taluka"
          value={UserData.master_taluka || ""}
          readOnly
          className="form-control"
          placeholder="Taluka"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">
          City{" "}
          {UserData.user_type === 1 && <span className="text-danger"> *</span>}
        </Label>
        <Select
          options={
            (UserData.cities || []).map((city) => ({
              value: city.Name,
              label: city.Name,
            })) || []
          }
          onChange={(selectedOption) =>
            setUserData((prev) => ({
              ...prev,
              master_city: selectedOption?.value || "",
            }))
          }
          className="basic-select"
          placeholder="Select City"
          value={
            UserData.master_city
              ? { value: UserData.master_city, label: UserData.master_city }
              : null
          }
        />
      </Col>
    </>
  );

  const renderVendorBlock = () => (
    <>
      <Col lg={4}>
        <Label className="fw-bold">Business Name</Label>
        <Input
          type="text"
          name="master_name"
          value={UserData.master_name || ""}
          className="form-control"
          placeholder="Enter business name"
          onChange={getUserData}
        />
      </Col>
      <Col lg={4}>
        <Label className="fw-bold">Mobile Number</Label>
        <Input
          type="text"
          name="master_mobile"
          value={UserData.master_mobile || ""}
          className="form-control"
          placeholder="Enter mobile number"
          onChange={getUserData}
        />
      </Col>
      <Col className={UserData.user_type == 3 ? "mt-3" : ""} lg={4}>
        <Label className="fw-bold">Email Address</Label>
        <Input
          type="text"
          name="master_email"
          value={UserData.master_email || ""}
          className="form-control"
          placeholder="Enter Email Address"
          onChange={getUserData}
        />
      </Col>
      <Col className="mt-3" lg={8}>
        <Label className="fw-bold">Address</Label>
        <Input
          type="text"
          name="master_address"
          value={UserData.master_address || ""}
          className={`form-control ${
            errors.master_address ? "is-invalid" : ""
          }`}
          placeholder="Enter Address"
          onChange={getUserData}
        />
        {errors.master_address && (
          <div className="invalid-feedback">{errors.master_address}</div>
        )}
      </Col>
      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">GST ( Optional )</Label>
        <Input
          type="text"
          name="master_gst"
          value={UserData.master_gst || ""}
          className="form-control"
          placeholder="Enter GST"
          onChange={getUserData}
        />
      </Col>

      {/* pincode block */}
      {renderPincodeBlock()}
    </>
  );

  const renderBankBlock = () => (
    <>
      <Col lg={4}>
        <Label className="fw-bold">IFSC Code</Label>
        <Input
          type="text"
          name="master_ifsc"
          value={UserData.master_ifsc || ""}
          className={`form-control ${errors.master_ifsc ? "is-invalid" : ""}`}
          placeholder="Enter IFSC Code"
          onChange={getUserData}
        />
        {errors.master_ifsc && (
          <div className="invalid-feedback">{errors.master_ifsc}</div>
        )}
      </Col>

      <Col lg={4}>
        <Label className="fw-bold">Bank Name</Label>
        <Input
          type="text"
          name="master_name"
          value={UserData.master_name || ""}
          className="form-control"
          placeholder="Enter bank name"
          onChange={getUserData}
        />
      </Col>

      <Col lg={4}>
        <Label className="fw-bold">Mobile Number</Label>
        <Input
          type="text"
          name="master_mobile"
          value={UserData.master_mobile || ""}
          className="form-control"
          placeholder="Enter mobile number"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={8}>
        <Label className="fw-bold">Address</Label>
        <Input
          type="text"
          name="master_address"
          value={UserData.master_address || ""}
          className="form-control"
          placeholder="Enter Address"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">Email Address</Label>
        <Input
          type="text"
          name="master_email"
          value={UserData.master_email || ""}
          className="form-control"
          placeholder="Enter Email"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">Branch Name</Label>
        <Input
          type="text"
          name="master_branch_name"
          value={UserData.master_branch_name || ""}
          className="form-control"
          placeholder="Enter Branch Name"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">Branch Code</Label>
        <Input
          type="text"
          name="master_branch_code"
          value={UserData.master_branch_code || ""}
          className="form-control"
          placeholder="Enter Branch Code"
          onChange={getUserData}
        />
      </Col>

      <Col className="mt-3" lg={4}>
        <Label className="fw-bold">GST ( Optional )</Label>
        <Input
          type="text"
          name="master_gst"
          value={UserData.master_gst || ""}
          className="form-control"
          placeholder="Enter GST Number"
          onChange={getUserData}
        />
      </Col>

      {/* pincode block */}
      {renderPincodeBlock()}
    </>
  );

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
      <DeleteModal
        show={deleteModal !== 0}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(0)}
      />

      <ModalHeader className="text-white p-3" toggle={toggle}>
        Update User
      </ModalHeader>

      <div className="tablelist-form">
        <ModalBody>
          <Card className="border card-border-primary p-4 shadow-sm">
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    User Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    onChange={getUserData}
                    value={UserData.user_name || ""}
                    name="user_name"
                    className="form-control"
                    placeholder="Enter full name"
                  />
                  {msg === 1 && (
                    <div className="text-danger small mt-1">
                      User name cannot be empty!
                    </div>
                  )}
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">Mobile No</Label>
                  <Input
                    value={UserData.user_mobile || ""}
                    onChange={getUserData}
                    name="user_mobile"
                    className="form-control"
                    placeholder="Enter mobile number"
                  />
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">Email Address</Label>
                  <Input
                    value={UserData.user_email || ""}
                    onChange={getUserData}
                    name="user_email"
                    className="form-control"
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3">
                  <Label className="form-label fw-bold">
                    User Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    value={userTypeOptions.find(
                      (option) => option.value == UserData.user_type
                    )}
                    options={userTypeOptions}
                    onChange={handleUserTypeChange}
                    className="basic-select"
                  />
                </div>
              </Col>
            </Row>

            {/* Separator when not a customer */}

            <Row>
              <Col lg="12">
                <hr className="shadow-lg fw-bold border border-primary" />
              </Col>
            </Row>

            {/* Vendor */}
            {UserData.user_type == 2 && <Row>{renderVendorBlock()}</Row>}

            {/* Customer */}
            {UserData.user_type == 1 && (
              <Row>
                {renderPincodeBlock()}

                <Col className="mt-3" lg={8}>
                  <Label className="fw-bold">
                    Address <span className="text-danger"> *</span>
                  </Label>
                  <Input
                    type="text"
                    name="master_address"
                    value={UserData.master_address || ""}
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

            {/* Bank */}
            {UserData.user_type == 3 && <Row>{renderBankBlock()}</Row>}

            <Row>
              <Col lg="12" className="py-2">
                <hr className="shadow-lg fw-bold border border-primary" />
              </Col>
            </Row>

            {/* Contacts */}

            <h5 className="mb-4 text-primary">Add Personal Contacts</h5>

            {personalContacts.map((contact, index) => (
              <Row key={`input-${index}`} className="mb-3">
                <Col md={4}>
                  <div className="mb-2">
                    <Label>Contact Name</Label>
                    <Input
                      value={contact.child_name}
                      onChange={(e) =>
                        handleContactChange(index, "child_name", e.target.value)
                      }
                      placeholder="Name"
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <div className="mb-2">
                    <Label>Email</Label>
                    <Input
                      value={contact.child_email}
                      onChange={(e) =>
                        handleContactChange(
                          index,
                          "child_email",
                          e.target.value
                        )
                      }
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <div className="mb-2">
                    <Label>Phone</Label>
                    <Input
                      value={contact.child_mobile}
                      onChange={(e) =>
                        handleContactChange(
                          index,
                          "child_mobile",
                          e.target.value
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
                          e.target.value
                        )
                      }
                      placeholder="Designation"
                    />
                  </div>
                </Col>

                <Col md={4} className="mt-4">
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
                          <td>
                            <Button
                              className="me-1"
                              color="info"
                              size="sm"
                              onClick={() => setContactModal(contact)}
                            >
                              <i className="ri-pencil-fill fs-16" />
                            </Button>
                            {/* only allow delete on non-first items if child_id is not undefined (server records) */}

                            {index != 0 &&
                              (contact.child_id ? (
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteModal(contact.child_id)
                                  }
                                >
                                  <i className="ri-delete-bin-5-fill fs-16" />
                                </Button>
                              ) : (
                                // allow client-side remove for items without child_id
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => removeContactFromList(index)}
                                >
                                  <i className="ri-delete-bin-5-fill fs-16" />
                                </Button>
                              ))}
                          </td>
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
            <Button color="danger" onClick={Close}>
              Close
            </Button>
            <Button
              color="success"
              onClick={OnSubmited}
              innerRef={submitButtonRef}
            >
              Update User
            </Button>
          </div>
        </div>
      </div>

      {/* ContactPerson modal for edit (keeps original integration) */}
      {contactModal &&
      contactModal.child_id !== undefined &&
      contactModal.child_id !== null ? (
        <ContactPerson
          modalStates={contactModal.child_id !== undefined}
          setModalStates={() => {
            setContactCount((c) => c + 1);
            setContactModal({});
          }}
          setContactCount={setContactCount}
          contactCount={contactCount}
          contact={contactModal}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

export default UserEditModal;
