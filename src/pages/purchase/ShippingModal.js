import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import { FiHash, FiFlag, FiMap, FiGrid, FiMapPin } from "react-icons/fi";
import Select from "react-select";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import { motion } from "framer-motion";
import { API_URL } from "../../helpers/url_helper";

const ShippingModal = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
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
  // Current Address being filled
  const [currentAddress, setCurrentAddress] = useState({
    pincode: "",
    state: "",
    district: "",
    taluka: "",
    city: "",
    cities: [],
    user_id: props.purchase_customer_ids
      ? props.purchase_customer_ids
      : props.master_customer_ids,
    addressLine1: "",
    addressLine2: "",
    addressType: "home", // default
    defaultAddress: false,
    country: "India", // default
  });
  useEffect(() => {
    if (currentAddress.pincode?.length === 6) {
      fetch(`${API_URL}/pincode/${currentAddress.pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice?.[0];

            setCurrentAddress({
              ...currentAddress,
              state: postOffice.State,
              district: postOffice.District,
              taluka: postOffice.Block || "Not Available", // sometimes Block gives Taluka
              cities: data[0].PostOffice || [],
            });
          }
        })
        .catch(() => {
          console.log("Error fetching pincode data");
        });
    }
  }, [currentAddress.pincode]);
  const cityOptions = currentAddress?.cities?.map((city) => ({
    value: city.Name,
    label: (
      <div className="d-flex justify-content-between w-100">
        <span>{city.Name}</span>
        <span
          style={{
            color: city.DeliveryStatus === "Delivery" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {city.DeliveryStatus}
        </span>
      </div>
    ),
  }));
  // For errors
  const [errors, setErrors] = useState({});

  // For submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For global form message (like in your IndustryType Name example)
  const [msg, setMsg] = useState("");
  const validateForm = () => {
    let newErrors = {};
    if (!currentAddress.pincode) newErrors.pincode = "Pincode is required";
    if (!currentAddress.addressLine1)
      newErrors.addressLine1 = "Street Address is required";
    if (!currentAddress.city) newErrors.city = "City is required";
    if (!currentAddress.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const resetForm = () => {
    setCurrentAddress({
      pincode: "",
      state: "",
      district: "",
      taluka: "",
      city: "",
      cities: [],
      addressLine1: "",
      addressLine2: "",
      addressType: "home",
      defaultAddress: false,
      country: "India",
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
      const res = await http.post("/addresses", currentAddress);
      props.setModalStates(!props.modalStates);
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
      <Modal id="showModal" isOpen={modal} size="lg" toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Shipping Address
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <form className="address-form" onSubmit={handleSubmit}>
                {/* Pincode */}
                <div className="mb-3">
                  <Label
                    htmlFor="pincode"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      <FiHash className="me-2" /> Pincode{" "}
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{errors.pincode}</div>
                  </Label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={currentAddress.pincode}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="Enter Pincode"
                  />
                </div>

                {/* State, District, Taluka */}
                <div className="mb-3 d-lg-flex justify-content-between gap-3">
                  <div className="flex-fill">
                    <Label htmlFor="state" className="form-label fw-bold">
                      <FiFlag className="me-2" /> State
                    </Label>
                    <input
                      id="state"
                      name="state"
                      style={{
                        cursor: "not-allowed",
                      }}
                      type="text"
                      value={currentAddress?.state || ""}
                      readOnly
                      className="form-control"
                      placeholder="Loading..."
                    />
                  </div>
                  <div className="flex-fill">
                    <Label htmlFor="district" className="form-label fw-bold">
                      <FiMap className="me-2" /> District
                    </Label>
                    <input
                      id="district"
                      name="district"
                      style={{
                        cursor: "not-allowed",
                      }}
                      type="text"
                      value={currentAddress?.district || ""}
                      readOnly
                      className="form-control"
                      placeholder="Loading..."
                    />
                  </div>
                  <div className="flex-fill">
                    <Label htmlFor="taluka" className="form-label fw-bold">
                      <FiGrid className="me-2" /> Taluka
                    </Label>
                    <input
                      id="taluka"
                      name="taluka"
                      style={{
                        cursor: "not-allowed",
                      }}
                      type="text"
                      value={currentAddress?.taluka || ""}
                      readOnly
                      className="form-control"
                      placeholder="Loading..."
                    />
                  </div>
                </div>

                {/* City dropdown */}
                {currentAddress?.cities?.length > 0 && (
                  <div className="mb-3">
                    <Label htmlFor="city" className="form-label fw-bold">
                      <FiMapPin className="me-2" /> City
                    </Label>
                    <Select
                      name="city"
                      options={cityOptions}
                      value={cityOptions.find(
                        (option) => option.value === currentAddress.city,
                      )}
                      onChange={(selected) =>
                        setCurrentAddress({
                          ...currentAddress,
                          city: selected.value,
                        })
                      }
                      className="w-100"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      getOptionLabel={(option) => (
                        <div className="flex justify-between w-full">
                          <span>{option.label}</span>
                          <span
                            style={{
                              color:
                                option.status === "Delivery" ? "green" : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {option.status}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Address Line 1 */}
                <div className="mb-3">
                  <Label
                    htmlFor="addressLine1"
                    className="form-label fw-bold d-flex justify-content-between"
                  >
                    <div>
                      Street Address <span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{errors.addressLine1}</div>
                  </Label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    value={currentAddress.addressLine1}
                    onChange={handleChange}
                    className="form-control fw-bold"
                    placeholder="123 Main St"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="mb-3">
                  <Label htmlFor="addressLine2" className="form-label fw-bold">
                    Apt, Suite, Building (Optional)
                  </Label>
                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    value={currentAddress.addressLine2}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Apt 4B"
                  />
                </div>

                {/* Address Type */}
                <div className="mb-3">
                  <Label className="form-label fw-bold">Address Type</Label>
                  <div
                    className="btn-group d-flex"
                    role="group"
                    aria-label="Address Type"
                  >
                    {["home", "work", "other"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`btn flex-fill text-capitalize ${
                          currentAddress.addressType === type
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() =>
                          setCurrentAddress((prev) => ({
                            ...prev,
                            addressType: type,
                          }))
                        }
                      >
                        {type === "home" && "🏠 Home"}
                        {type === "work" && "🏢 Work"}
                        {type === "other" && "📍 Other"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default checkbox */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input border border-dark shadow "
                    id="defaultAddress"
                    checked={currentAddress.defaultAddress}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        defaultAddress: e.target.checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="defaultAddress"
                    className="form-check-label fw-bold ms-2"
                  >
                    Set as default shipping address
                  </Label>
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
                    Cancel
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
                      "Save Address"
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

export default ShippingModal;
