import React, { useEffect, useState, useRef } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Input,
    Row,
    Col,
    Card,
} from "reactstrap";
import { toast } from "react-toastify";
import AuthUser from "../../helpers/Authuser";

const SeoEdit = ({ modalStates, setModalStates, edit_data, checkchang }) => {
    const { http } = AuthUser();
    const [modal, setModal] = useState(false);

    const [metaDescription, setMetaDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [canonicalUrl, setCanonicalUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [errorMsg, setErrorMsg] = useState("");

    const Close = () => {
        setModal(false);
        setModalStates(false);
    };

    useEffect(() => {
        if (modalStates && edit_data) {
            setMetaDescription(edit_data.meta_description || "");
            setKeywords(
                Array.isArray(edit_data.keywords)
                    ? edit_data.keywords.join(", ")
                    : edit_data.keywords || ""
            );
            setCanonicalUrl(edit_data.canonical_url || "");
            setIsActive(edit_data.is_active || false);
            setModal(true);
        }
    }, [modalStates, edit_data]);

    const submitButtonRef = useRef();
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey && event.key.toLowerCase() === "escape") {
                event.preventDefault();
                setModalStates(false);
            }
            if (event.altKey && event.key.toLowerCase() === "s") {
                event.preventDefault();
                submitButtonRef.current.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSubmit = async () => {
        if (metaDescription.trim() === "" || keywords.trim() === "") {
            setErrorMsg("Meta description and keywords are required.");
            return;
        }

        const keywordArray = keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k);

        if (keywordArray.length > 5) {
            toast.warn("Maximum 5 keywords allowed.");
            return;
        }

        try {
            const response = await http.put(`/seo/${edit_data.seo_id}`, {
                meta_description: metaDescription,
                keywords: keywordArray,
                canonical_url: canonicalUrl,
                is_active: isActive,
            });
            setModal(false);
            setModalStates(false);
            checkchang(response.data.message, 0);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update SEO.");
        }
    };

    return (
        <Modal isOpen={modal} toggle={Close} centered size="lg">
            <ModalHeader className="bg-light p-3" toggle={Close}>
                Edit SEO
            </ModalHeader>

            <ModalBody>
                <Card className="border card-border-success p-3 shadow-sm">
                    <Row>
                        <Col lg={12}>
                            <div className="mb-3">
                                <Label className="form-label fw-bold d-flex justify-content-between">
                                    <div>
                                        Meta Description<span style={{ color: "red" }}> *</span>
                                    </div>
                                    <div style={{ color: "red" }}>{errorMsg}</div>
                                </Label>
                                <Input
                                    type="textarea"
                                    rows={4}
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
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
                <button type="button" className="btn btn-secondary" onClick={Close}>
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
                    Update
                </button>
            </div>
        </Modal>
    );
};

export default SeoEdit;
