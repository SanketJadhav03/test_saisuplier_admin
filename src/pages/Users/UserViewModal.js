import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Badge,
  Input,
  Label,
} from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import Select from "react-select";

const UserViewModal = (props) => {
  const { http } = AuthUser();
  const [modal, setModal] = useState(false);

  const userTypeOptions = [
    { value: 1, label: "Customer" },
    { value: 2, label: "Vendor" },
    { value: 3, label: "Bank" },
  ];

  const [UserData, setUserData] = useState(props.edit_data || {});

  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

  useEffect(() => {
    setModal(props.modalStates);
  }, [props.modalStates]);

  const toggle = useCallback(() => {
    setModal(!modal);
    props.setModalStates();
  }, [modal]);

  const getUserTypeLabel = (value) => {
    const option = userTypeOptions.find((opt) => opt.value == value);
    return option ? option.label : "Unknown";
  };

  const renderValue = (value) =>
    value ? (
      value
    ) : (
      <Badge color="secondary" pill>
        Not provided
      </Badge>
    );

  const SectionDivider = ({ title }) => (
    <Row>
      <Col lg="12" className="mt-3 mb-2">
        <h5 className="text-primary fw-bold">{title}</h5>
        <hr className="shadow-sm border border-primary opacity-50" />
      </Col>
    </Row>
  );

  const renderPincodeBlock = () => (
    <>
      {[
        { label: "Pincode", key: "master_pincode" },
        { label: "State", key: "master_state" },
        { label: "District", key: "master_district" },
        { label: "Taluka", key: "master_taluka" },
        { label: "City", key: "master_city", col: 4 },
      ].map((item, index) => (
        <Col className="mt-3" lg={item.col || 3} key={index}>
          <Label className="fw-bold">{item.label}</Label>
          <div className="form-control bg-light border rounded p-2">
            {renderValue(UserData[item.key])}
          </div>
        </Col>
      ))}
    </>
  );

  return (
    <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
      <ModalHeader className="bg-  text-white p-3" toggle={toggle}>
        View User Details
      </ModalHeader>
      <ModalBody className="px-4">
        <Card className="border-0 shadow-sm px-4">

          {/* ========= BASIC DETAILS ========= */}
          <SectionDivider title="Basic Details" />

          <Row className="gy-2">
            <Col md={4}>
              <Label className="fw-bold">UID</Label>
              <div className="form-control bg-light border rounded p-2">
                {renderValue(UserData.user_unique_id)}
              </div>
            </Col>

            <Col md={4}>
              <Label className="fw-bold">User Name</Label>
              <div className="form-control bg-light border rounded p-2">
                {renderValue(UserData.user_name)}
              </div>
            </Col>

            <Col md={4}>
              <Label className="fw-bold">Mobile No</Label>
              <div className="form-control bg-light border rounded p-2">
                {renderValue(UserData.user_mobile)}
              </div>
            </Col>

            <Col md={4}>
              <Label className="fw-bold">Email Address</Label>
              <div className="form-control bg-light border rounded p-2">
                {renderValue(UserData.user_email)}
              </div>
            </Col>

            <Col md={4}>
              <Label className="fw-bold">User Type</Label>
              <div className="form-control bg-light border rounded p-2">
                {getUserTypeLabel(UserData.user_type)}
              </div>
            </Col>
          </Row>

          {/* ========= CUSTOMER DETAILS ========= */}
          {UserData.user_type == 1 && (
            <>
              <SectionDivider title="Customer Address Details" />

              <Row className="gy-3">
                {renderPincodeBlock()}

                <Col lg={8}>
                  <Label className="fw-bold">Address</Label>
                  <div className="form-control bg-light border rounded p-2">
                    {renderValue(UserData.master_address)}
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* ========= VENDOR DETAILS ========= */}
          {UserData.user_type == 2 && (
            <>
              <SectionDivider title="Vendor Information" />
              <Row className="gy-3">
                {[
                  { label: "Business Name", key: "master_name" },
                  { label: "Mobile Number", key: "master_mobile" },
                  { label: "Email Address", key: "master_email" },
                  { label: "Address", key: "master_address", col: 8 },
                  { label: "Pincode", key: "master_pincode" },
                  { label: "State", key: "master_state" },
                  { label: "District", key: "master_district" },
                  { label: "Taluka", key: "master_taluka" },
                  { label: "City", key: "master_city" },
                  { label: "GST", key: "master_gst" },
                ].map((item, index) => (
                  <Col lg={item.col || 4} key={index}>
                    <Label className="fw-bold">{item.label}</Label>
                    <div className="form-control bg-light border rounded p-2">
                      {renderValue(UserData[item.key])}
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* ========= BANK DETAILS ========= */}
          {UserData.user_type == 3 && (
            <>
              <SectionDivider title="Bank Information" />

              <Row className="gy-3">
                {[
                  { label: "IFSC Code", key: "master_ifsc" },
                  { label: "Bank Name", key: "master_name" },
                  { label: "Mobile Number", key: "master_mobile" },
                  { label: "Address", key: "master_address", col: 8 },
                  { label: "Email Address", key: "master_email" },
                  { label: "Branch Name", key: "master_branch_name" },
                  { label: "Branch Code", key: "master_branch_code" },
                  { label: "Pincode", key: "master_pincode" },
                  { label: "State", key: "master_state" },
                  { label: "District", key: "master_district" },
                  { label: "Taluka", key: "master_taluka" },
                  { label: "City", key: "master_city" },
                  { label: "GST", key: "master_gst" },
                ].map((item, index) => (
                  <Col lg={item.col || 4} key={index}>
                    <Label className="fw-bold">{item.label}</Label>
                    <div className="form-control bg-light border rounded p-2">
                      {renderValue(UserData[item.key])}
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* ========= CONTACT PERSONS ========= */}
          <SectionDivider title="Contact Persons" />

          {props.contact_persons && props.contact_persons.length > 0 ? (
            <div className="table-responsive mt-2">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {props.contact_persons.map((c, i) => (
                    <tr key={i}>
                      <td>{renderValue(c.child_name)}</td>
                      <td>{renderValue(c.child_email)}</td>
                      <td>{renderValue(c.child_mobile)}</td>
                      <td>{renderValue(c.child_designation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3">
              <Badge color="info" pill>
                No contact persons available
              </Badge>
            </div>
          )}
        </Card>
      </ModalBody>

      <div className="modal-footer">
        <button className="btn btn-danger px-4" onClick={Close}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default UserViewModal;
