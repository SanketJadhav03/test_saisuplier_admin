import React from "react";
import AuthUser from "../../../helpers/Authuser";
import axios from "axios";

const WhatsAppButtonWapify = ({ billDetails, color }) => {
  const { http } = AuthUser();
  const sendWhatsAppMessage = async () => {
    try {
      const companyDetailsResponse = await http.get("/business_index");

      const message = `${companyDetailsResponse.data[0].business_name}मध्ये खरेदी केल्याबद्दल धन्यवाद.
      आपले बिल_क्र. ${billDetails.master_invoice_no} आणि
      बिल रक्कम रु. ${billDetails.master_total_bill_amt}
      बचत रक्कम रु. ${billDetails.master_total_bill_mrp - billDetails.master_total_bill_amt}
      शुभ दिवस पुन्हा भेट द्या!`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = billDetails.customer_mobile;

      const response = await axios.post('https://app.wapify.net/api/text-message.php', {
        number: phoneNumber,
        msg: encodedMessage,
        apikey: 'bfb304ad038dc9753f98dbb848d5d4b90eba0c37',
        instance: 'ulQdqO2NI9RpJSx',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000', // Set the origin of your React app
        },
      });

      console.log(response);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={sendWhatsAppMessage}
      className="btn btn-sm btn-success ml-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={color} className="bi bi-whatsapp" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.920l-.240-.144-2.494.654.666-2.433-.156-.251a6.560 6.560 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.560 6.560 0 0 1 4.660 1.931 6.557 6.557 0 0 1 1.928 4.660c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.170-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.430.050-.197-.100-.836-.308-1.592-.985-.590-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.100-.114.133-.198.198-.330.065-.134.034-.248-.015-.347-.050-.099-.445-1.076-.612-1.470-.160-.389-.323-.335-.445-.340-.114-.007-.247-.007-.380-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.710 1.916.810 2.049.098.133 1.394 2.132 3.383 2.992.470.205.840.326 1.129.418.475.152.904.129 1.246.080.380-.058 1.171-.480 1.338-.943.164-.464.164-.860.114-.943-.049-.084-.182-.133-.380-.232z" />
      </svg>
    </button >
  );
};

export default WhatsAppButtonWapify;