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
} from "reactstrap";
import { toast } from "react-toastify";
import AuthUser from "../../helpers/Authuser";

const SeoAdd = (props) => {
  const { http } = AuthUser();
  const [modal, setModal] = useState(false);

  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");

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

  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates(false);
      }
      if ((event.altKey && event.key.toLowerCase() === "s")) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async () => {
    if (metaDescription.trim() === "" || keywords.trim() === "") {
      setErrorMsg("Meta description and keywords are required.");
      return;
    }

    const keywordArray = keywords.split(",").map((k) => k.trim());

    try {
      const response = await http.post("/seo", {
        meta_description: metaDescription,
        keywords: keywordArray,
        canonical_url: canonicalUrl,
        is_active: isActive,
      });

      props.checkchang(response.data.message || "SEO created", 0);
    } catch (error) {
      toast.error("Failed to create SEO entry.");
      console.log(error);
    }
  };

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Create SEO
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <Label className="form-label fw-bold d-flex justify-content-between">
                      <div>
                        Meta Description <span style={{ color: "red" }}> *</span>
                      </div>
                      <div style={{ color: "red" }}>{errorMsg}</div>
                    </Label>
                    <Input
                      type="textarea"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="form-control"
                      placeholder="Enter meta description"
                    />
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="mb-3">
                    <Label className="form-label fw-bold">
                      Keywords (comma separated)<span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="form-control"
                      placeholder="e.g. tools, buy online, cheap tools"
                    />
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="mb-3">
                    <Label className="form-label fw-bold">Canonical URL</Label>
                    <Input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="form-control"
                      placeholder="https://example.com/page"
                    />
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="form-check form-switch form-switch-success mb-3">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                      id="isActiveSwitch"
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="isActiveSwitch"
                    >
                      Active
                    </Label>
                  </div>
                </Col>
              </Row>
            </Card>
          </ModalBody>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => Close()}
            >
              <i className="ri-close-line me-1 align-middle" />
              Close
            </button>
            <button
              ref={submitButtonRef}
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Save
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};

export default SeoAdd;
