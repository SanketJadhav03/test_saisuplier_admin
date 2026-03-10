
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import CustomerGroupAdd from "../CustomerGroup/CustomerGroupAdd";
import Flatpickr from "react-flatpickr";
const CustomerAdd = (props) => {
  const { http } = AuthUser();
  const [CustomerGroup, setCustomerGroup] = useState();
  const [activeGroup, setActiveGroup] = useState(false);
  const [modalStatess, setModalStatess] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [manageGroup, setManageGroup] = useState(0);
  const handleCallback = (data) => {
    Setcounts(counts + 1);
    setManageGroup(1);
    toast.success(data);
    setModalStatess(false);
  };

  useEffect(() => {
    http
      .get("/all_customer_groups")
      .then(function (response) {
        if (response.data.length == 0) {
          setActiveGroup(false);
        } else {
          setCustomerGroup(response.data);
          setActiveGroup(true);
          setCustomersData(() => ({
            ...CustomersData,
            customer_group_type:
              manageGroup == 0
                ? response.data[0].customer_group_id
                : response.data[response.data.length - 1].customer_group_id,
          }));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts + 1]);
  const [spiKey, setApikey] = useState("");
  const getBarcodeData = () => {
    http
      .get("/barcode_settings/list")
      .then((res) => {
        setApikey(res.data.gtrans);
      }).catch((e) => {
        console.log(e);
      })
  }
  useEffect(() => {
    getBarcodeData()
  }, [])
  const apiKey = `${spiKey}`;
  const translateText = async (inputText) => {

    if (!navigator.onLine) {
      console.log("Internet is off");
      return;
    }
    try {

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: inputText,
            source: "en", // Source language (English)
            target: "mr", // Target language (e.g., French)
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;
        setCustomersData({
          ...CustomersData,
          customer_marathi: translatedText,
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const [CustomersData, setCustomersData] = useState({
    customer_name: "",
    customer_password: "",
    customer_marathi: "",
    customer_adhar_no: "",
    customer_birth_date: "",
    customer_mobile: "",
    customer_email: "",
    customer_gst_no: "",
    customer_pan_no: "",
    customer_opening_balance: "",
    customer_opening_saving_amount: "",
    customer_group_type: "",
    customer_billing_address: "",
    customer_shipping_address: "",
    customer_city: "",
    customer_credit_limit: "",
    customer_credit_period_day: "",
    customer_barcode: "",
    customer_state: 1,
    customer_state_code: "MH",
    customer_dist: 0,
    customer_dist_code: "",
    customer_taluka: 0,
    customer_taluka_code: "",
    customer_village: "",
    customer_village_code: "",
  });
  

  const getCustomerData = (e) => {
    setCustomersData({ ...CustomersData, [e.target.name]: e.target.value });
  };
  const getSelectedGroupValue = (e) => {
    setCustomersData({ ...CustomersData, customer_group_type: e.value });
  };


  const [msg, setMsg] = useState(0);
  const OnSubmited = () => {
    if (CustomersData.customer_name == "") {
      setMsg(1);
    } 
    else {
      http
        .post("/customers/store", CustomersData)
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status, response.data.customer);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const [modal, setModal] = useState(false);

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

  // shortcuts for save and close
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates(false);
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [stateOption, setState] = useState([]);
  const stateData = async () => {
    http
      .get("/state/list")
      .then((res) => {
        setState(res.data.map((data, index) => {
          return ({
            value: data.state_id,
            label: data.state_name + " " + data.state_marathi,
            state_code: data.state_code,
          })
        }));
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const [districtOption, setDistrictOption] = useState([]);
  const disctrictData = async (stateId) => {
    http.get(`/district/list/${stateId}`)
      .then((res) => {
        setDistrictOption(
          res.data.map((data) => ({
            value: data.dist_id,
            label: data.dist_name + " " + data.dist_marathi,
            dist_code: data.dist_code
          }))
        );
      })
      .catch((err) => {
        console.log("Error fetching districts:", err);
      });

  }
  const [talukaOption, setTaluka] = useState([]);
  const talukaData = async (disctrictID) => {

    http
      .get(`/taluka/list/${disctrictID}`)
      .then((res) => {
        setTaluka(res.data.map((data, index) => {
          return ({
            value: data.taluka_id,
            label: data.taluka_name + " " + data.taluka_marathi,
            taluka_code: data.taluka_code,
          })
        }));
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const [villageOption, setVillage] = useState([]);
  const villageData = async (talukaID) => {
    http
      .get(`/village/list/${talukaID}`)
      .then((res) => {
        setVillage(res.data.map((data, index) => {
          return ({
            value: data.village_id,
            label: data.village_name + " " + data.village_marathi,
            village_code: data.village_code,
          })
        }));
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(() => {
    disctrictData(CustomersData.customer_state);
  }, [CustomersData.customer_state]);
  useEffect(() => {
    talukaData(CustomersData.customer_dist);
  }, [CustomersData.customer_dist]);
  useEffect(() => {
    villageData(CustomersData.customer_taluka);
  }, [CustomersData.customer_taluka]);


  useEffect(() => {
    stateData();
  }, [])

  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Create Customer
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label   fw-bold d-flex justify-content-between"
                  >
                    <div>
                      Customer Name<span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{msg == 1 ? "Customer Name cannot be empty!" : ""}</div>
                  </Label>
                  <CustomInput
                    onChange={getCustomerData}
                    onKeyUp={(e)=>{
                      translateText(e.target.value)
                    }}
                    value={CustomersData.user_name}
                    name="user_name"
                    id="customer_name"
                    className="form-control fw-bold"
                    placeholder="Customer Name"
                    type="text"
                  />
                </div>
         

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                    onChange={getCustomerData}
                    name="user_mobile"
                    id="user_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    <div>
                      Customer Email 
                    </div>
                    <div style={{ color: "red" }}>{msg == 2 ? "Customer Email cannot be empty!" : ""}</div>
                  </Label>
                  <Input
                    onChange={getCustomerData}
                    name="user_email"
                    id="user_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="text"
                  />
                </div>
                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    <div>
                      Customer Password 
                    </div>
                    <div style={{ color: "red" }}>{msg == 3 ? "Customer Name cannot be empty!" : ""}</div>

                  </Label>
                  <Input
                    onChange={getCustomerData}
                    name="user_password"
                    id="user_password"
                    className="form-control fw-bold"
                    placeholder="Password"
                    type="text"
                  />
                </div>
         


              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button
                name="close"
                id="close"
                type="button"
                className="btn btn-danger"
                onClick={() => Close()}
              >
                <i className="ri-close-line me-1 align-middle" />
                Close
              </button>
              {activeGroup ? (
                <button
                  type="button"
                  name="sumbit"
                  id="submit"
                  className="btn btn-primary"
                  onClick={() => OnSubmited()}
                  ref={submitButtonRef}
                >
                  <i className="ri-save-3-line align-bottom me-1"></i>
                  Save
                </button>
              ) : (
                <span style={{ color: "red" }}>
                  First fill basic information then save.
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>
      {modalStatess === true ? (
        <CustomerGroupAdd
          modalStates={modalStatess}
          setModalStates={() => {
            setModalStatess(false);
          }}
          checkchang={handleCallback}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default CustomerAdd;
