import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  Input,
  Card,
} from "reactstrap";

const SeoView = ({ modalStates, setModalStates, edit_data }) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setModal(false);
    toggle();
  }, [modalStates]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setModalStates(false);
    } else {
      setModal(true);
    }
  };

  return (
    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
      <ModalHeader className="bg-light p-3" toggle={toggle}>
        SEO Details
      </ModalHeader>

      <ModalBody>
        <Card className="border card-border-success p-3 shadow-sm">
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <Label className="form-label fw-bold">Meta Description:</Label>
                <Input
                  type="textarea"
                  value={edit_data?.meta_description || ""}
                  readOnly
                  rows={4}
                />
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <Label className="form-label fw-bold">Keywords:</Label>
                <Input
                  type="text"
                  value={
                    Array.isArray(edit_data?.keywords)
                      ? edit_data.keywords.join(", ")
                      : edit_data?.keywords || ""
                  }
                  readOnly
                />
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <Label className="form-label fw-bold">Canonical URL:</Label>
                <Input
                  type="text"
                  value={edit_data?.canonical_url || ""}
                  readOnly
                />
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <Label className="form-label fw-bold">Status:</Label>
                <Input
                  type="text"
                  value={edit_data?.is_active ? "Active" : "Inactive"}
                  readOnly
                />
              </div>
            </Col>
          </Row>
        </Card>
      </ModalBody>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setModal(false);
            setModalStates(false);
          }}
        >
          <i className="ri-close-line me-1 align-middle" />
          Close
        </button>
      </div>
    </Modal>
  );
};

export default SeoView;
