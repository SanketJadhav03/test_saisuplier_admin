import React, { useEffect, useState, useCallback, useRef } from "react";
import classnames from "classnames";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Col,
  TabContent,
  TabPane,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const EmployeeView = (props) => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const { http } = AuthUser();


  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");


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

  function tog_fullscreen1() {
    setModal(!modal);
  }

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  // Types of leaves
  const levesTypes = [
    {
      name: "leaves_type",
      value: "unpaid",
      label: "paid"
    },
    {
      name: "leaves_type",
      value: "personal",
      label: "personal"
    },
  ]

  // Form Submitted
  const [employeeData, setEmployeeData] = useState(props.edit_data);
  const handleInputChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "basic_firstname") {
      setCheckStatus({});
      setMsg("");
    }
  }
  const onSubmited = () => {
    http
      .post("/employee/store", employeeData)
      .then((response) => {
        props.checkchang(response.data.message, response.data.status);
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      {/* Fullscreen Responsive Modals */}
      <Modal
        size="xl"
        isOpen={modal}
        toggle={() => {
          tog_fullscreen1();
        }}
        className="modal-fullscreen"
        id="fullscreeexampleModal"
      >
        <ModalHeader
          className="modal-title"
          id="fullscreeexampleModalLabel"
        // toggle={() => {
        //   tog_fullscreen1();
        // }}
        >
          Add Employee
        </ModalHeader>
        <ModalBody>
          <Card className="border card-border-success shadow-lg">
            <Nav className="nav-tabs nav-tabs-custom nav-success shadow p-2 pb-0 bg-light">
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Basic Information
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "2",
                  })
                  }
                  onClick={() => {
                    toggleTab("2");
                  }}
                >
                  Employment Advance Information
                </NavLink>
              </NavItem>
            </Nav>
            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold d-flex justify-content-between"
                      >
                        <div>
                          First Name<span style={{ color: "red" }}> *</span>
                        </div>
                        <div style={{ color: "red" }}>
                          {msg}
                        </div>
                      </Label>
                      <Input
                        checkNameStatus={checkNameStatus}
                        name="basic_firstname"
                        id="basic_firstname"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.basic_firstname}
                        className="form-control fw-bold"
                        placeholder="First Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Middle Name
                      </Label>
                      <Input
                        name="basic_middlename"
                        id="basic_middlename"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.basic_middlename}
                        className="form-control fw-bold"
                        placeholder="Middle Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Last Name
                      </Label>
                      <Input
                        name="basic_lastname"
                        id="basic_lastname"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.basic_lastname}
                        className="form-control fw-bold"
                        placeholder="Last Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Date Of Birth
                      </Label>
                      <Input
                      name="basic_dob"
                        id="basic_dob"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.basic_dob}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Gender
                      </Label>
                      <Input
                        name="basic_gender"
                        id="basic_gender"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.basic_gender}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>


                  </Row>
                </TabPane>

                <TabPane tabId="2">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2  fw-bold"
                      >

                        Employee Id
                      </Label>
                      <Input
                        name="employment_id"
                        id="employment_id"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_id}
                        className="form-control fw-bold"
                        placeholder="Employee Id"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Job Title
                      </Label>
                      <Input
                        name="employment_job_title"
                        id="employment_job_title"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_job_title}
                        className="form-control fw-bold"
                        placeholder="Job Title"
                        type="text"
                      />
                    </div>
                    <div className="col-4 ">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Department
                      </Label>
                      <Input
                        name="employment_department"
                        id="employment_department"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_department}
                        className="form-control fw-bold"
                        placeholder="Employee Department"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Employment Status
                      </Label>
                      <Input
                        name="employment_status"
                        id="employment_status"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_status}
                        className="form-control fw-bold"
                        placeholder="Employeement Status"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Hire Date
                      </Label>
                      <Input 
                      name="employment_hire_date"
                        id="employment_hire_date"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_hire_date}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Termination Date <span className="text-info">(if applicable)</span>
                      </Label>
                      <Input 
                      name="employment_termination_date"
                        id="employment_termination_date"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.employment_termination_date}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>
                  </Row>
                </TabPane>
              </TabContent>


            </ModalBody>
            <Nav className="nav-tabs   shadow p-2 pb-0 bg-light">
              <NavItem>
                {activeTab == 1 ? (<NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Contact Information
                </NavLink>) :

                  (<NavLink
                    href="#"
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Emergency Contact

                  </NavLink>)}
              </NavItem>
            </Nav>
            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label fw-bold mt-2"
                      >
                        <div>
                          Address ( Home / Current )
                        </div>

                      </Label>
                      <Input
                        name="contact_address"
                        id="contact_address"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.contact_address}
                        className="form-control fw-bold"
                        placeholder="Address"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Mobile Number
                      </Label>
                      <Input
                        name="contact_mob"
                        id="contact_mob"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.contact_mob}
                        className="form-control fw-bold"
                        placeholder="Mobile Number"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Email Address
                      </Label>
                      <Input
                        name="contact_email"
                        id="contact_email"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.contact_email}
                        className="form-control fw-bold"
                        placeholder="Email Address"
                        type="email"
                      />
                    </div>

                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        <div>
                          Name
                        </div>

                      </Label>
                      <Input
                        name="emergency_name"
                        id="emergency_name"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.emergency_name}
                        className="form-control fw-bold"
                        placeholder="Enter Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Relationship
                      </Label>
                      <Input
                        name="emergency_relationship"
                        id="emergency_relationship"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.emergency_relationship}
                        className="form-control fw-bold"
                        placeholder="Relationship"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Phone Number
                      </Label>
                      <Input
                        name="emergency_mob"
                        id="emergency_mob"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.emergency_mob}
                        className="form-control fw-bold"
                        placeholder="Mobile Number"
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
            <Nav className="nav-tabs   shadow p-2 pb-0 bg-light">
              <NavItem>
                {activeTab == 1 ? (<NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Education and Qualifications
                </NavLink>) :

                  (<NavLink
                    href="#"
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Dependents

                  </NavLink>)}
              </NavItem>
            </Nav>
            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        <div>
                          Highest Education Level Attained
                        </div>

                      </Label>
                      <Input
                        name="education_highest_attend"
                        id="education_highest_attend"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.education_highest_attend}
                        className="form-control fw-bold"
                        placeholder="Highest Education"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Institutions Attended
                      </Label>
                      <Input
                        name="education_institute_attend"
                        id="education_institute_attend"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.education_institute_attend}
                        className="form-control fw-bold"
                        placeholder="Instituetion Attended"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Degrees Earned
                      </Label>
                      <Input
                        name="education_degree_earned"
                        id="education_degree_earned"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.education_degree_earned}
                        className="form-control fw-bold"
                        placeholder="Degree Earned"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Certifications or Licenses
                      </Label>
                      <Input
                        name="education_certificate_licenses"
                        id="education_certificate_licenses"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.education_certificate_licenses}
                        className="form-control fw-bold"
                        placeholder="Certification"
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        <div>
                          Name
                        </div>

                      </Label>
                      <Input
                        name="dependents_name"
                        id="dependents_name"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.dependents_name}
                        className="form-control fw-bold"
                        placeholder="Middle Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Date of birth
                      </Label>
                      <Input 
                      name="dependents_dob"
                        id="dependents_dob"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.dependents_dob}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Relationship (Spouse, Child, etc.)
                      </Label>
                      <Input
                        name="dependents_relationship"
                        id="dependents_relationship"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.dependents_relationship}
                        className="form-control fw-bold"
                        placeholder="Email Address"
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
            <Nav className="nav-tabs shadow p-2 pb-0 bg-light ">
              <NavItem>
                {activeTab == 1 ? (<NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Leave and Time Off

                </NavLink>) :

                  (<NavLink
                    href="#"
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Work Histroy
                  </NavLink>)}
              </NavItem>
            </Nav>
            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        <div>
                          Vacation Leave Balance
                        </div>

                      </Label>
                      <Input
                        name="leave_vacation_balance"
                        id="leave_vacation_balance"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.leave_vacation_balance}
                        className="form-control fw-bold"
                        placeholder="Middle Name"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Sick Leave Balance
                      </Label>
                      <Input
                        name="leave_sick_balance"
                        id="leave_sick_balance"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.leave_sick_balance}
                        className="form-control fw-bold"
                        placeholder="Mobile Number"
                        type="text"
                      />
                    </div>
                    <div className="col-4" >
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Types of leaves
                      </Label>
                      <Input
                        name="leave_type"
                        id="leave_type"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.leave_type}
                        className="form-control fw-bold"
                        placeholder="Leave Type"
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label fw-bold mt-2"
                      >
                        <div>
                          Previous Employers
                        </div>

                      </Label>
                      <Input
                        name="work_previous_employers"
                        id="work_previous_employers"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.work_previous_employers}
                        className="form-control fw-bold"
                        placeholder="Previous Employers"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Job Titles
                      </Label>
                      <Input
                        name="work_job_title"
                        id="work_job_title"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.work_job_title}
                        className="form-control fw-bold"
                        placeholder="Job Title"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Responseibilities
                      </Label>
                      <Input
                        name="work_responsibilities"
                        id="work_responsibilities"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.work_responsibilities}
                        className="form-control fw-bold"
                        placeholder="Job Responsibilities"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Start Date
                      </Label>
                      <Input 
                      name="work_start_date"
                        id="work_start_date"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.work_start_date}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        End Date
                      </Label>
                      <Input 
                      name="work_end_date"
                        id="work_end_date"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.work_end_date}
                        className="form-control fw-bold"
                        placeholder="Gender"
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
            <Nav className="nav-tabs shadow p-2 pb-0 bg-light ">
              <NavItem>
                {activeTab == 1 ? (<NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Compensation Details
                </NavLink>) :

                  (<NavLink
                    href="#"
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Documents and Attachments
                  </NavLink>)}
              </NavItem>
            </Nav>
            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label fw-bold mt-2"
                      >
                        <div>
                          Salary ( Home / Current )
                        </div>

                      </Label>
                      <Input
                        name="compensation_salary"
                        id="compensation_salary"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.compensation_salary}
                        className="form-control fw-bold"
                        placeholder="Salary"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Pay frequency  (e.g., weekly, bi-weekly, monthly)
                      </Label>
                      <Input
                        name="compensation_pay_frequency"
                        id="compensation_pay_frequency"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.compensation_pay_frequency}
                        className="form-control fw-bold"
                        placeholder="Pay Frequency"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Account Number
                      </Label>
                      <Input
                        name="compensation_account_number"
                        id="compensation_account_number"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.compensation_account_number}
                        className="form-control fw-bold"
                        placeholder="Account Number"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        IFSC Code
                      </Label>
                      <Input
                        name="compensation_ifsc_code"
                        id="compensation_ifsc_code"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.compensation_ifsc_code}
                        className="form-control fw-bold"
                        placeholder="IFSC Code"
                        type="text"
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Account Holder Name
                      </Label>
                      <Input
                        name="compensation_holder_name"
                        id="compensation_holder_name"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.compensation_holder_name}
                        className="form-control fw-bold"
                        placeholder="Account Holder Name"
                        type="text"
                      />
                    </div>

                  </Row>

                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        <div>
                          Resume
                        </div>

                      </Label>
                      <Input
                        name="document_resume"
                        id="document_resume"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.document_resume}
                        className="form-control fw-bold"
                        placeholder="Resume"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        ID
                      </Label>
                      <Input
                        name="document_id"
                        id="document_id"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.document_id}
                        className="form-control fw-bold"
                        placeholder="ID"
                        type="text"
                      />
                    </div>
                    <div className="col-4">
                      <Label
                        htmlFor="customername-field"
                        className="form-label  fw-bold mt-2"
                      >
                        Certification
                      </Label>
                      <Input
                        name="document_certification"
                        id="document_certification"
                        onChange={(e) => handleInputChange(e)}
                        readOnly
                        value={employeeData.document_certification}
                        className="form-control fw-bold"
                        placeholder="Certification "
                        type="text"
                      />
                    </div>

                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>

            <div className="hstack gap-2 justify-content-center mt-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  tog_fullscreen1();
                }}
                className="btn btn-danger"
              >
                <i className="ri-close-line me-1 align-middle" />
                Close
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  console.log("Hii", employeeData.basic_firstname);
                  if (employeeData.basic_firstname == "") {
                    setMsg("Category connot be empty!");
                    setCheckStatus({
                      borderColor: "red",
                      borderStyle: "groove",
                    });
                  } else {
                    activeTab === "1" ? toggleTab("2") : toggleTab("1");
                  }
                }}
              >

                {activeTab === "1" ? "Next" : "Prev"}
              </button>
            </div>

          </Card>
        </ModalBody>

      </Modal>
    </div>
  );
};

export default EmployeeView;
