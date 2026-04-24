import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import AuthUser from "../../helpers/Authuser";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function FollowUpUpdate(props) {
  const { modalStates, setModalStates, lead_id, leadData } = props;
  const [modal, setModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const { http, user } = AuthUser();
  const [employees, setEmployees] = useState([]);
  // Form State
  const [formData, setFormData] = useState(
    props.followUp || {
      followup_user_id: user.user?.user_id || 1,
      followup_customer_id: leadData?.customer_id || "",
    },
  );

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
      const response = await http.put(`/followup/update/${formData.followup_id}`, formData);
      if (response.data.status === 1 || response.data.success) {
        toast.success(response.data.message || "Follow-up Updated!");
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
  useEffect(() => {
    try {
      http
        .get("/user/list")
        .then((res) => {
          setEmployees(res.data?.users || []);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Modal isOpen={modalStates} toggle={setModalStates} centered>
      <ModalHeader toggle={setModalStates}>Update Follow Up</ModalHeader>
      <ModalBody>
        <Card className="border border-primary p-3 shadow">
          <Row>
            {/* Next Date */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">
                Next Follow Up Date <span className="text-danger">*</span>
              </Label>
              <Flatpickr
                name="followup_next_date"
                value={formData.followup_next_date}
                className={`form-control fw-bold ${errors.followup_next_date ? "is-invalid" : ""}`}
                style={
                  errors.followup_next_date
                    ? { borderColor: "red", borderStyle: "groove" }
                    : {}
                }
                options={{
                  dateFormat: "Y-m-d",
                  minDate: "today", // Prevents picking dates in the past
                  altInput: true,
                  altFormat: "F j, Y",
                }}
                onChange={([date]) => {
                  // Bridge to your handleChange or manual state update
                  handleChange({
                    target: {
                      name: "followup_next_date",
                      value: date, // Flatpickr returns a Date object
                    },
                  });
                }}
                placeholder="Select follow up date"
              />
              {errors.followup_next_date && (
                <small className="text-danger">This field is required</small>
              )}
            </Col>

            {/* Assign To */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">Assign To (Staff ID)</Label>
              <Select
                value={
                  employees
                    .filter(
                      (emp) => emp.user_id == formData.followup_assignto_id,
                    )
                    .map((emp) => ({
                      label: emp.full_name,
                      value: emp.user_id,
                    }))[0] || null
                }
                options={employees.map((employee) => ({
                  label: employee.full_name,
                  value: employee.user_id,
                }))}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    followup_assignto_id: e.value,
                  }));
                }}
              />
            </Col>

            {/* Notes */}
            <Col md={12} className="mb-3">
              <Label className="form-label fw-bold">Description / Notes</Label>
              I
              <CKEditor
                editor={ClassicEditor}
                data={formData.followup_description || ""} // Your state value
                onReady={(editor) => {
                  // Set a minimum height to match your previous rows="3"
                  editor.editing.view.change((writer) => {
                    writer.setStyle(
                      "min-height",
                      "120px",
                      editor.editing.view.document.getRoot(),
                    );
                  });
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();

                  // Manually trigger your existing handleChange
                  handleChange({
                    target: {
                      name: "followup_description",
                      value: data,
                    },
                  });
                }}
                config={{
                  placeholder: "Details of conversation...",
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "undo",
                    "redo",
                  ],
                }}
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
              <i className="ri-save-3-line align-bottom me-1"></i> Update
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

export default FollowUpUpdate;
