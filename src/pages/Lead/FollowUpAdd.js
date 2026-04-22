import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Card, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import AuthUser from "../../helpers/Authuser";

function FollowUpAdd(props) {
    const { modalStates, setModalStates, lead_id } = props;
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { http, user } = AuthUser();
    
  // Form State
  const [formData, setFormData] = useState({
    followup_user_id: user.user?.user_id || 1,
    followup_customer_id: "",
    followup_next_date: "",
    followup_assignto_id: "",
    followup_description: "",
    followup_lead_id: lead_id || "",
  });

  // Validation State
  const [errors, setErrors] = useState({});

  const dateInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Sync internal modal state with props
  useEffect(() => {
    if (modalStates) {
      setModal(true);
      // Small timeout to ensure DOM is ready for focus
      setTimeout(() => dateInputRef.current?.focus(), 100);
    } else {
      setModal(false);
    }
  }, [modalStates]);

  const toggle = useCallback(() => {
    setModal(!modal);
    setModalStates();
  }, [modal, setModalStates]);

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: false })); // Reset error on change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SubmitData = async () => {
    // Validation
    if (!formData.followup_next_date) {
      setErrors({ followup_next_date: true });
      toast.error("Next follow-up date is required!");
      return;
    }

    setLoading(true);
    try {
      const response = await http.post("/followup/store", formData);
      if (response.data.status === 1 || response.data.success) {
        toast.success(response.data.message || "Follow-up Saved!");
        // Refresh list if parent has checkchang function
        if (props.checkchang) {
          props.checkchang(response.data.message, response.data.status);
        }
        toggle();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard Shortcuts (Alt+S for Save, Alt+Esc for Close)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        toggle();
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);
  return (
    <Modal isOpen={modalStates} toggle={setModalStates} centered>
      <ModalHeader toggle={setModalStates}>Add New Follow Up</ModalHeader>
      <ModalBody>
        <Card className="border card-border-primary p-3 shadow-sm">
          <Row>
            {/* Next Date */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">
                Next Follow Up Date <span className="text-danger">*</span>
              </Label>
              <Input
                name="followup_next_date"
                type="date"
                innerRef={dateInputRef}
                className="form-control fw-bold"
                style={
                  errors.followup_next_date
                    ? { borderColor: "red", borderStyle: "groove" }
                    : {}
                }
                onChange={handleChange}
              />
            </Col>

            {/* Assign To */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">Assign To (Staff ID)</Label>
              <Input
                name="followup_assignto_id"
                type="number"
                placeholder="Enter Staff ID"
                className="form-control"
                onChange={handleChange}
              />
            </Col>

            {/* Notes */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">Description / Notes</Label>
              <Input
                name="followup_description"
                type="textarea"
                rows="3"
                placeholder="Details of conversation..."
                className="form-control"
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Card>
      </ModalBody>

      <div className="modal-footer">
        <button type="button" className="btn btn-danger" onClick={toggle}>
          <i className="ri-close-line me-1 align-middle" /> Close
        </button>
        <button
          type="button"
          ref={submitButtonRef}
          className="btn btn-primary"
          disabled={loading}
          onClick={SubmitData}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <i className="ri-save-3-line align-bottom me-1"></i> Save
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

export default FollowUpAdd;
