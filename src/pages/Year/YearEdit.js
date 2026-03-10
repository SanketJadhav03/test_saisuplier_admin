import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import ExpensesAdd from "../Expenses/ExpensesAdd";

const YearEdit = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [AllYearData, Set_AllYearData] = useState(props.edit_data);
  const [modalStatess, setModalStatess] = useState(false);
  const handleCallback = (data) => {
    toast.success(data);
    setModalStatess(false);
  };

  const OnSubmited = () => {
    http
      .put("/year/update", AllYearData)
      .then(function (response) {
        props.checkchang(response.data.message, response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Year
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Invoice Initials
                  </Label>
                  <Input
                    name="intial_latter"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Enter Invoice Initials Letter"
                    type="text"
                    value={AllYearData.intial_latter}
                    onChange={(e) =>
                      Set_AllYearData({
                        ...AllYearData,
                        intial_latter: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Year Start Date (1-April)
                  </Label>
                  <Flatpickr
                    className="form-control"
                    options={{
                      dateFormat: "d/m/Y",
                      defaultDate: "today",
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];
                      const formattedDate = selectedDate.toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      );
                      Set_AllYearData({
                        ...AllYearData,
                        start_year_date: formattedDate,
                      });
                    }}
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Year End Date (31-March)
                  </Label>
                  <Flatpickr
                    className="form-control"
                    options={{
                      dateFormat: "d/m/Y",
                      defaultDate: "today",
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];
                      const formattedDate = selectedDate.toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      );
                      Set_AllYearData({
                        ...AllYearData,
                        end_year_date: formattedDate,
                      });
                    }}
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
            </div>
          </div>
        </div>
      </Modal>
      {modalStatess === true ? (
        <ExpensesAdd
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

export default YearEdit;
