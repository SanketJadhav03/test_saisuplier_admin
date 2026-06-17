import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const EmailRequiredModal = ({
  isOpen,
  toggle,
  onSave,
  defaultEmail = "",
}) => {
  const [email, setEmail] = useState(defaultEmail);

  const handleSave = () => {
    onSave(email);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Email Required
      </ModalHeader>

      <ModalBody>
        <label className="form-label">Email Address</label>

        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </ModalBody>

      <ModalFooter>
        <button className="btn btn-light" onClick={toggle}>
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!email}
        >
          Save & Continue
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default EmailRequiredModal;