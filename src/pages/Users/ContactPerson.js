import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css"; 
import { FiHash, FiFlag, FiMap, FiGrid, FiMapPin, FiUser, FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import Select from "react-select";
import { toast } from "react-toastify"; 
import { motion } from "framer-motion";
import AuthUser from "../../helpers/Authuser";

const ContactPerson = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
  
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
  // Current Address being filled
  const [contactPerson, setContactPerson] = useState(props.contact);

  // For errors
  const [errors, setErrors] = useState({});

  // For submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For global form message (like in your IndustryType Name example)
  const [msg, setMsg] = useState("");
  const validateForm = () => {
    let newErrors = {};
    if (!contactPerson.child_name) newErrors.child_name = " Name is required";
    if (!contactPerson.child_email) newErrors.child_email = "Email is required";
    if (!contactPerson.child_mobile)
      newErrors.child_mobile = "Mobile is required";
    if (!contactPerson.child_designation)
      newErrors.child_designation = "Designation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactPerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const resetForm = () => {
    setContactPerson({
      child_name: "",
      child_email: "",
      child_mobile: "",
      child_designation: "",
    });
    setErrors({});
    setMsg("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); // clear previous msg

    if (!validateForm()) {
      setMsg("Please fix the errors before submitting.");
      return;
    }   
    try {
      setIsSubmitting(true);
      const res = await http.put("/contact/person", contactPerson);
      props.setModalStates();
      props.setContactCount(props.contactCount + 1);
      toast.success("Address saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      setMsg("Error saving address. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Modal id="showModal" isOpen={modal} size="md" toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Contact Person
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <form className="address-form" onSubmit={handleSubmit}>
                {/* Contact Name */}
                <div className="mb-3">
                  <Label
                    htmlFor="child_name"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      <FiUser className="me-2" /> Contact Name{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{errors.child_name}</div>
                  </Label>
                  <input
                    id="child_name"
                    name="child_name"
                    type="text"
                    value={contactPerson.child_name}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="Enter Name"
                  />
                </div>

                {/* Contact Email */}
                <div className="mb-3">
                  <Label
                    htmlFor="child_email"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      <FiMail className="me-2" /> Contact Email{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{errors.child_email}</div>
                  </Label>
                  <input
                    id="child_email"
                    name="child_email"
                    type="text"
                    value={contactPerson.child_email}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="Enter Email"
                  />
                </div>

                {/* Contact Mobile */}
                <div className="mb-3">
                  <Label
                    htmlFor="child_mobile"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      <FiPhone className="me-2" /> Contact Mobile{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{errors.child_mobile}</div>
                  </Label>
                  <input
                    id="child_mobile"
                    name="child_mobile"
                    type="text"
                    value={contactPerson.child_mobile}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="Enter Mobile"
                  />
                </div>

                {/* Contact Designation */}
                <div className="mb-3">
                  <Label
                    htmlFor="child_designation"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      <FiBriefcase className="me-2" /> Contact Designation{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>
                      {errors.child_designation}
                    </div>
                  </Label>
                  <input
                    id="child_designation"
                    name="child_designation"
                    type="text"
                    value={contactPerson.child_designation}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="Enter Designation"
                  />
                </div>

                {/* Form Actions */}
                <div className="d-flex justify-content-end gap-3">
                  <motion.button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="spinner" viewBox="0 0 50 50">
                          <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            strokeWidth="5"
                          ></circle>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Contact"
                    )}
                  </motion.button>
                </div>
              </form>
            </Card>
          </ModalBody>
        </span>
      </Modal>
    </div>
  );
};

export default ContactPerson;
