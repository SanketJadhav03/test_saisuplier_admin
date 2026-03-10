import React, { useEffect, useState } from 'react'
import AuthUser from '../../helpers/Authuser';

const BillHeader = (props) => {
    const { http } = AuthUser();
    const [businessData, setBusinessData] = useState({});
    useEffect(() => {
        http
            .get("/business_index")
            .then((res) => {
                if (res.data.length != 0) {
                    setBusinessData(res.data[0]);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    return (
        <div>
        <div>
          <div className="business-details text-center bg-white p-2">
            <h3>{businessData.business_name ? businessData.business_name : ""}</h3>
            <h5>{businessData.business_billing_address ? businessData.business_billing_address : ""}</h5>
            {businessData.business_gst_no && <b>{"GSTIN No : " + businessData.business_gst_no}</b>}
            <div className="d-flex mt-2 justify-content-center gap-1 border-0">
              {businessData.business_company_phone_no && <b>{"Contact : " + businessData.business_company_phone_no}</b>}
              {businessData.business_company_email && <b>| {"Email : " + businessData.business_company_email}</b>}
            </div>
          </div>
        </div>
        <div>
          <div className="title-header text-center border bg-white p-1">
            <h5>{props.title}</h5>
          </div>
        </div>
      </div>
      
    )
}

export default BillHeader
