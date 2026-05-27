"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";

const PaymentPreviewModal = ({ isOpen, toggle, payment }) => {
  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        Payment Details
      </ModalHeader>

      <ModalBody>
      <Table bordered size="sm" responsive>
  <tbody>
 
    
    <tr>
      <th>Order ID</th>
      <td className="text-break">
        {payment.transaction_order_id || "-"}
      </td>
    </tr>
    <tr>
      <th>UTR No</th>
      <td className="text-break">
        {payment.transaction_utr_no || "-"}
      </td>
    </tr>
     <tr>
      <th>Date</th>
      <td>
        {payment.transaction_date
          ? new Date(payment.transaction_date).toLocaleString("en-IN")
          : "-"}
      </td>
    </tr>
    <tr>
      <th className="w-25">Method</th>
      <td>
        {payment.payment_type === "UPI" ? (
          <span className="text-success fw-bold">UPI</span>
        ) : (
          <span className="fw-semibold">
            {payment.payment_type || "-"}
          </span>
        )}
      </td>
    </tr>

    <tr>
      <th>Amount</th>
      <td className="fw-bold text-primary">
        ₹ {payment.transaction_paid_amount}
      </td>
    </tr>




    <tr>
      <th>Status</th>
      <td>
        {payment.transaction_status == 1 ? (
          <span className="badge bg-success">Success</span>
        ) : (
          <span className="badge bg-danger">Failed</span>
        )}
      </td>
   
    </tr>
    <tr>
      <th>Signature</th>
      <td className="text-break">
        {payment.transaction_signature || "-"}
      </td>
    </tr>

  </tbody>
</Table>

      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentPreviewModal;
