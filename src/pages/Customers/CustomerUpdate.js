
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import CustomerGroupAdd from "../CustomerGroup/CustomerGroupAdd";
import Flatpickr from "react-flatpickr";
const CustomerUpdate = (props) => {
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

  const [CustomersData, setCustomersData] = useState(props.edit_data);
  

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
        .put("/customers/update", CustomersData)
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
          Update Customer
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
                    value={CustomersData.customer_name}
                    name="customer_name"
                    id="customer_name"
                    className="form-control fw-bold"
                    placeholder="Customer Name"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label  fw-bold d-flex justify-content-between"
                  >
                    <div>
                      Customer Marathi Name
                    </div>
                  </Label>
                  <Input
                    value={CustomersData.customer_marathi}
                    onChange={getCustomerData}
                    name="customer_marathi"
                    id="customer_marathi"
                    className="form-control fw-bold"
                    placeholder="Customer Marathi Name"
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
                    value={CustomersData.customer_mobile}
                    name="customer_mobile"
                    id="customer_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>

                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Birth Date
                  </Label>
                  <Flatpickr
                    className="form-control"
                    placeholder="Select Your Birth Date"
                    options={{
                      dateFormat: "d/m/Y",
                    }}
                    name="customer_birth_date"
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];
                      const day = selectedDate
                        .getDate()
                        .toString()
                        .padStart(2, "0");
                      const month = (selectedDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const year = selectedDate.getFullYear();
                      const formattedDate = `${day}/${month}/${year}`;
                      console.log(formattedDate)
                    }}
                  />
                </div>
                <div className="col-3 mt-2">
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
                    value={CustomersData.customer_email}
                    name="customer_email"
                    id="customer_email"
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
                  value={CustomersData.customer_password}
                    onChange={getCustomerData}
                    name="customer_password"
                    id="customer_password"
                    className="form-control fw-bold"
                    placeholder="Password"
                    type="password"
                  />
                </div>
                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Group Type
                    <button
                      className="btn btn-success btn-sm px-1"
                      style={{ padding: "0px" }}
                      onClick={() => setModalStatess(!false)}
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </button>
                  </Label>
                  {activeGroup ? (
                    <Select
                      onChange={getSelectedGroupValue}
                      options={CustomerGroup.map((group) => ({
                        value: group.customer_group_id,
                        label: group.customer_group_name,
                      }))}
                      name="customer_group_type"
                      id="customer_group_type"
                      className=" fw-bold"
                      placeholder={CustomersData?.customer_group_name}
                    />
                  ) : (
                    <Input
                      type="text"
                      readOnly
                      className="form-control fw-bold "
                      style={{ color: "red" }}
                      value="First Fill the Customer Group *"
                      placeholder=""
                    />
                  )}
                </div>


                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    State
                  </Label>
                  <Select
                    className="fw-bold"
                    options={stateOption}
                    value={stateOption.filter((data,index)=>data.value == CustomersData.customer_state)[0]}
                    onChange={(e) => {
                      setCustomersData({
                        ...CustomersData,
                        customer_state: e.value,
                        customer_state_code: e.state_code
                      })
                    }}
                  />
                </div>
                <div className="col-2 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    State Code
                  </Label>
                  <Input
                    readOnly
                    value={stateOption.filter((data,index)=>data.value == CustomersData.customer_state)[0]?.state_code}
                    name="customer_state_code"
                    id="customer_state_code"
                    className="form-control fw-bold"
                    placeholder="State Code"
                    type="text"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    District
                  </Label>
                  <Select
                    className="fw-bold"
                    options={districtOption}
                    value={districtOption.filter((data,index)=>data.value == CustomersData.customer_dist)[0]}
                    onChange={(e) => {
                      setCustomersData({
                        ...CustomersData,
                        customer_dist: e.value,
                        customer_dist_code: e.dist_code
                      })
                    }}
                  />
                </div>
                <div className="col-2 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Dictrict Code
                  </Label>
                  <Input
                    readOnly
                    value={districtOption.filter((data,index)=>data.value == CustomersData.customer_dist)[0]?.dist_code}
                    name="customer_district_code"
                    id="customer_district_code"
                    className="form-control fw-bold"
                    placeholder="Disctrict Code"
                    type="text"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Taluka
                  </Label>
                  <Select
                    className="fw-bold"
                    options={talukaOption}
                    value={talukaOption.filter((data,index)=>data.value == CustomersData.customer_taluka)[0]}
                    onChange={(e) => {
                      setCustomersData({
                        ...CustomersData,
                        customer_taluka: e.value,
                        customer_taluka_code: e.taluka_code
                      })
                    }}
                  />
                </div>
                <div className="col-2 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Taluka Code
                  </Label>
                  <Input
                    value={talukaOption.filter((data,index)=>data.value == CustomersData.customer_taluka)[0]?.taluka_code}
                    name="customer_taluka_code"
                    id="customer_taluka_code"
                    className="form-control fw-bold"
                    placeholder="Taluka Code"
                    type="text"
                    readOnly
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Village
                  </Label>
                  <Select
                    className="fw-bold"
                    options={villageOption}
                    value={villageOption.filter((data,index)=>data.value == CustomersData.customer_village)[0]}
                    onChange={(e) => {
                      setCustomersData({
                        ...CustomersData,
                        customer_village: e.value,
                        customer_village_code: e.village_code
                      })
                    }}
                  />
                </div>
                <div className="col-2 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Village Code
                  </Label>
                  <Input
                    readOnly
                    value={villageOption.filter((data,index)=>data.value == CustomersData.customer_village)[0]?.village_code}
                    name="customer_village_code"
                    id="customer_village_code"
                    className="form-control fw-bold"
                    placeholder="Village Code"
                    type="text"
                  />
                </div>
                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Adhar No.
                  </Label>
                  <Input
                  value={CustomersData.customer_adhar_no}
                    onChange={getCustomerData}
                    name="customer_adhar_no"
                    id="customer_adhar_no"
                    className="form-control fw-bold"
                    placeholder="Adhar No"
                    type="text"
                  />
                </div>
                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pan No.
                  </Label>
                  <Input
                  value={CustomersData.customer_pan_no}
                    onChange={getCustomerData}
                    name="customer_pan_no"
                    id="customer_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
                    type="text"
                  />
                </div>
                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    GST No.
                  </Label>
                  <Input
                  value={CustomersData.customer_gst_no}
                    onChange={getCustomerData}
                    name="customer_gst_no"
                    id="customer_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>

                <div className="col-3 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pin Code
                  </Label>
                  <Input
                  value={CustomersData.customer_pin_code}
                    onChange={getCustomerData}
                    name="customer_pin_code"
                    id="customer_pin_code"
                    className="form-control fw-bold"
                    placeholder="Pin Code"
                    type="text"
                  />
                </div>



                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Balance
                  </Label>
                  <Input
                  value={CustomersData.customer_opening_balance}
                    onChange={getCustomerData}
                    name="customer_opening_balance"
                    id="customer_opening_balance"
                    className="form-control fw-bold"
                    placeholder="Opening Balance"
                    type="number"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Saving Amount
                  </Label>
                  <Input
                  value={CustomersData.customer_opening_saving_amount}
                    onChange={getCustomerData}
                    name="customer_opening_saving_amount"
                    id="customer_opening_saving_amount"
                    className="form-control fw-bold"
                    placeholder="Opening Saving Amount"
                    type="number"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Limit
                  </Label>
                  <Input
                  value={CustomersData.customer_credit_limit}
                    onChange={getCustomerData}
                    name="customer_credit_limit"
                    id="customer_credit_limit"
                    className="form-control fw-bold"
                    placeholder="Credit Limit"
                    type="text"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Period(days)
                  </Label>
                  <Input
                  value={CustomersData.customer_credit_period_day}
                    onChange={getCustomerData}
                    name="customer_credit_period_day"
                    id="customer_credit_period_day"
                    className="form-control fw-bold"
                    placeholder="Credit Period(days)"
                    type="text"
                  />
                </div>
                <div className="col-4 mt-2">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Customer Barcode
                  </Label>
                  <Input
                  value={CustomersData.customer_barcode}
                    onChange={getCustomerData}
                    name="customer_barcode"
                    id="customer_barcode"
                    className="form-control fw-bold"
                    placeholder="Customer Barcode"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Billing Address
                  </Label>
                  <textarea
                    onChange={getCustomerData}
                    rows={3}
                    placeholder="Enter billing address"
                    className="form-control fw-bold"
                    name="customer_billing_address"
                    id="customer_billing_address"
                    value={CustomersData.customer_billing_address}
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">  Shipping Address</div>
                    <div> <input type="checkbox" onClick={(obj) => {
                      if (obj.target.checked) {
                        setCustomersData({ ...CustomersData, customer_shipping_address: CustomersData.customer_billing_address });
                      } else {
                        setCustomersData({ ...CustomersData, customer_shipping_address: "" });
                      }
                    }} /> same as billing address</div>
                  </Label>
                  <textarea
                    onChange={getCustomerData}
                    rows={3}
                    placeholder="Enter shipping address"
                    className="form-control fw-bold"
                    name="customer_shipping_address"
                    id="customer_shipping_address"
                    value={CustomersData.customer_shipping_address}
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
export default CustomerUpdate;
 