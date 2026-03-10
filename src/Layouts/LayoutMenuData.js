import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthUser from "../helpers/Authuser";

const Navdata = () => {
  const history = useNavigate();
  const { permission } = AuthUser();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isBarcodePrint, setIsBarcodePrint] = useState(false);
  const [isPaymentAndReciept, setIsPaymentAndReciept] = useState(false);
  const [isRewardPoints, setisRewardPoints] = useState(false);
  const [isHrDepartment, setisHrDepartment] = useState(false);
  const [isProfitBook, setIsProfitBook] = useState(false);
  const [isCategories, setIsCategories] = useState(false);
  const [isProdcut, setIsProdcut] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [isTax, setIsTax] = useState(false);
  const [isUnits, setIsUnits] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isUserManagement, setIsUserManagement] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }
  const permissionsList = useSelector(
    (state) => state.permissionsSlice.permissionsList
  );
  const [isAdmin, setIsAdmin] = useState(false);

  // CHECKING IF THE LOGGED IN USER IS AN ADMIN OR NOT
  const checkIsAdmin = () => {
    const data = sessionStorage.getItem("authUser");
    const jsonData = JSON.parse(data);
    if (jsonData.user.email == "admin") {
      setIsAdmin(true);
    }
  };
  useEffect(() => {
    checkIsAdmin();
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Print Barcodes") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Categories") {
      setIsCategories(false);
    }
    if (iscurrentState !== "units") {
      setIsUnits(false);
    }
    if (iscurrentState !== "prodcut") {
      setIsProdcut(false);
    }
    if (iscurrentState !== "Tax") {
      setIsTax(false);
    }
    if (iscurrentState !== "Profile") {
      setIsProfile(false);
    }
    if (iscurrentState !== "userManagement") {
      setIsUserManagement(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isCategories,
    isTax,
    isUserManagement,
  ]);

  const menuItemsList = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "DASHBOARD",
      label: "Dashboard",
      icon: "mdi mdi-speedometer",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "DASHBOARD",
      label: "Call Logs",
      icon: "mdi mdi-cart",
      link: "/call-logs",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },

    // {
    //   id: "PURCHASE",
    //   label: "Purchase",
    //   icon: "mdi mdi-cart",
    //   link: "/purchase-list",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    {
      id: "PURCHASEORDER",
      label: "Purchase Order (PO)",
      icon: "mdi mdi-cart",
      link: "/purchase-list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "QUOTATION",
      label: "Quotation ",
      icon: "mdi mdi-cart-check",
      link: "/quotation-list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    // {
    //   id: "DASHBOARD",
    //   label: "Orders",
    //   icon: "mdi mdi-calculator",
    //   link: "/pos/list",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    {
      id: "INVOICE",
      label: "Invoice",
      icon: "mdi mdi-chart-line",
      link: "/invoice",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "ORDERTRACKING",
      label: "Order Tracking",
      icon: "mdi mdi-chart-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsInvoice(!isInvoice);
        setIscurrentState("prodcut");
        updateIconSidebar(e);
      },
      stateVariables: isInvoice,
      subItems: [
        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "1"
        )
          ? [
              {
                id: "category_list",
                label: "All Orders",
                link: "/all-orders",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "2"
        )
          ? [
              {
                id: "category_list",
                label: "New Order",
                link: "/new-order",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "3"
        )
          ? [
              {
                id: "category_list",
                label: "Approval Order",
                link: "/approval-order",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "4"
        )
          ? [
              {
                id: "category_list",
                label: "Packing Order",
                link: "/packing-order",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "5"
        )
          ? [
              {
                id: "category_list",
                label: "Dispatch Order",
                link: "/dispatch-order",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "6"
        )
          ? [
              {
                id: "category_list",
                label: "Rejected Order",
                link: "/rejected-order",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (p) => p.permission_category === "ORDERTRACKING" && p.permission_path === "7"
        )
          ? [
              {
                id: "category_list",
                label: "Delivered Order",
                link: "/delivered-order",
                parentId: "apps",
              },
            ]
          : []),
      ],
    },
    {
      id: "OURBANK",
      label: "Our Bank",
      icon: "mdi mdi-bank",
      link: "/our-bank",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Our Bank");
        updateIconSidebar(e);
      },
    },
    {
      id: "OURCLIENTS",
      label: "Our Clients",
      icon: "mdi mdi-account-multiple",
      link: "/client-list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Our Client");
        updateIconSidebar(e);
      },
    },
    // {
    //   id: "DASHBOARD",
    //   label: "Franchise Sale",
    //   icon: "mdi mdi-store-plus",
    //   link: "/franchise-sale",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    {
      id: "PRODUCTS",
      label: "Products",
      icon: "bx bx-layout",
      link: "/product-list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "SAMPLEPRODUCTS",
      label: "Sample Products",
      icon: "bx bx-layout",
      link: "/sample-product-list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "CUSTOMER",
      label: "Customers",
      icon: "bx bx-user-circle",
      link: "/user/list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "CONTACTUS",
      label: "Contact Us",
      icon: "bx bx-user-circle",
      link: "/contact/list",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    // {
    //   id: "DASHBOARD",
    //   label: "Salesman",
    //   icon: "mdi mdi-account-tie",
    //   link: "/salesman-list",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    // {
    //   id: "SUPPLIER",
    //   label: "Suppliers",
    //   icon: "bx bxs-user-detail",
    //   link: "/supplier-list",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    // {
    //   id: "STOCK",
    //   label: "Stock",
    //   icon: "mdi mdi-warehouse",
    //   link: "/stock-list",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },
    // {
    //   id: "BARCODEPRINT",
    //   label: "Barcode Print",
    //   icon: "mdi mdi-barcode-scan",
    //   link: "/barcode-print-create",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //   },
    // },

    {
      id: "TEMPLATE",
      label: "Template",
      icon: "bx bx-aperture",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsTemplate(!isTemplate);
        setIscurrentState("prodcut");
        updateIconSidebar(e);
      },
      stateVariables: isTemplate,
      subItems: [
        ...(permission.find(
          (permission) =>
            permission.permission_category === "TEMPLATE" &&
            permission.permission_path === "1"
        )
          ? [
              {
                id: "category_list",
                label: " Whatsapp Template",
                link: "/whatsapp-template",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "TEMPLATE" &&
            permission.permission_path === "2"
        )
          ? [
              {
                id: "category_list",
                label: " Email Template",
                link: "/email-template",
                parentId: "apps",
              },
            ]
          : []),
      ],
    },
    {
      id: "SETTINGS",
      label: "CRM Settings",
      icon: "bx bx-aperture",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsProdcut(!isProdcut);
        setIscurrentState("prodcut");
        updateIconSidebar(e);
      },
      stateVariables: isProdcut,
      subItems: [
      
        {
          id: "Reference",
          label: "Reference",
          link: "/source-list",
          parentId: "apps",
        },
        {
          id: "Priotity",
          label: "Priotity",
          link: "/priority-list",
          parentId: "apps",
        },
        {
          id: "Stages",
          label: "Stages",
          link: "/stages-list",
          parentId: "apps",
        },
      ],
    },
    {
      id: "SETTINGS",
      label: "Settings",
      icon: "bx bx-aperture",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsProdcut(!isProdcut);
        setIscurrentState("prodcut");
        updateIconSidebar(e);
      },
      stateVariables: isProdcut,
      subItems: [
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "1"
        )
          ? [
              {
                id: "category_list",
                label: "Category",
                link: "/category-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "2"
        )
          ? [
              {
                id: "Sub Category",
                label: "Sub Category",
                link: "/sub-category",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "3"
        )
          ? [
              {
                id: "Tax List",
                label: "Taxes",
                link: "/tax-list",
                parentId: "apps",
              },
            ]
          : []),
        ,
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "4"
        )
          ? [
              {
                id: "unit-List",
                label: "Units",
                link: "/unit-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "5"
        )
          ? [
              {
                id: "Expenses List",
                label: "Expenses Type",
                link: "/expenses-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "6"
        )
          ? [
              {
                id: "Transport Type",
                label: "Transport Types",
                link: "/transport-types",
                parentId: "apps",
              },
            ]
          : []),

        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "7"
        )
          ? [
              {
                id: "othercharg List",
                label: "Other Charges",
                link: "/other-charg-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "8"
        )
          ? [
              {
                id: "PaymentMode",
                label: "Payment Modes",
                link: "/paymentmode-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "9"
        )
          ? [
              {
                id: "PaymentTerm",
                label: "Payment Terms",
                link: "/payment-term-list",
                parentId: "apps",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "11"
        )
          ? [
              {
                id: "BarcodeSettings",
                label: "Barcode Settings",
                icon: "mdi mdi-printer",
                link: "/barcode-settings",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "12"
        )
          ? [
              {
                id: "PrinterSettings",
                label: "Printer Settings",
                icon: "mdi mdi-printer",
                link: "/printer-settings",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "13"
        )
          ? [
              {
                id: "BillingSettings",
                label: "Billing Settings",
                icon: "mdi mdi-printer",
                link: "/billing-settings",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "SETTINGS" &&
            permission.permission_path === "14"
        )
          ? [
              {
                id: "BillingSettings",
                label: "Language Settings",
                icon: "mdi mdi-printer",
                link: "/language-settings",
              },
            ]
          : []),

        // {
        //   id: "Industry Type",
        //   label: "Industry Types",
        //   link: "/industry-type-list",
        //   parentId: "apps",
        // },
      ],
    },
    {
      id: "PAYMENT-RECEIPT",
      label: "Payment / Receipt",
      icon: "mdi mdi-receipt",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsPaymentAndReciept(!isPaymentAndReciept);
        setIscurrentState("PAYMENT-RECEIPT");
        updateIconSidebar(e);
      },
      stateVariables: isPaymentAndReciept,
      subItems: [
        ...(permission.find(
          (permission) =>
            permission.permission_category === "PAYMENT-RECEIPT" &&
            permission.permission_path === "1"
        )
          ? [
              {
                id: "Payment",
                label: "Payment",
                link: "/payment-list",
                stateVariables: isDashboard,
                click: function (e) {
                  e.preventDefault();
                  setIsDashboard(!isDashboard);
                  setIscurrentState("Payment");
                  updateIconSidebar(e);
                },
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "PAYMENT-RECEIPT" &&
            permission.permission_path === "2"
        )
          ? [
              {
                id: "Receipt",
                label: "Receipt",
                link: "/receipt-list",
                stateVariables: isDashboard,
                click: function (e) {
                  e.preventDefault();
                  setIsDashboard(!isDashboard);
                  setIscurrentState("Payment");
                  updateIconSidebar(e);
                },
              },
            ]
          : []),
      ],
    },
    // {
    //   id: "REWARDS-POINT",
    //   label: "Rewards Points",
    //   icon: "mdi mdi-star",
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setisRewardPoints(!isRewardPoints);
    //     setIscurrentState("REWARDS-POINT");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isRewardPoints,
    //   subItems: [
    //     ...(permission.find(permission => permission.permission_category === "REWARDS-POINT" && permission.permission_path === "0") ? [{
    //       id: "loyalityPoints",
    //       label: "LoyaltyPoints",
    //       link: "/loyalty-points",
    //       stateVariables: isDashboard,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsDashboard(!isDashboard);
    //         setIscurrentState("loyaltyPints");
    //         updateIconSidebar(e);
    //       },
    //     }] : []),
    //   ],
    // },
    // {
    //   id: "HR-DEPARTMENT",
    //   label: "HR Department",
    //   icon: "mdi mdi-account-star",
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setisHrDepartment(!isHrDepartment);
    //     setIscurrentState("HR-DEPARTMENT");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isHrDepartment,
    //   subItems: [
    //     ...(permission.find(permission => permission.permission_category === "HR-DEPARTMENT" && permission.permission_path === "0") ? [{
    //       id: "hrDepartment",
    //       label: "Employee",
    //       link: "/employee-list",
    //       stateVariables: isDashboard,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsDashboard(!isDashboard);
    //         setIscurrentState("hrDepartment");
    //         updateIconSidebar(e);
    //       },
    //     }] : []),

    //   ],
    // },
    // {
    //   id: "REPORTS",
    //   label: "Reports",
    //   icon: "mdi mdi-book",
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsProfitBook(!isProfitBook);
    //     setIscurrentState("paymentReceipt");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isProfitBook,
    //   subItems: [
    //     ...(permission.find(permission => permission.permission_category === "REPORTS" && permission.permission_path === "1") ? [{
    //       id: "BillWiseProfit",
    //       label: "Bill Wise Profit",
    //       link: "/bill-wise-profit",
    //       stateVariables: isDashboard,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsDashboard(!isDashboard);
    //         setIscurrentState("Payment");
    //         updateIconSidebar(e);
    //       },
    //     }] : []),
    // {
    //   id: "ProductWiseProfit",
    //   label: "Product Wise Profit",
    //   link: "/product-wise-profit",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Payment");
    //     updateIconSidebar(e);
    //   },
    // },
    // ...(permission.find(permission => permission.permission_category === "SETTINGS" && permission.permission_path === "2") ? [{
    //   id: "outstandingReport",
    //   label: "Outstanding Report",
    //   link: "/outstanding-report",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Payment");
    //     updateIconSidebar(e);
    //   },
    // }] : []),
    // ...(permission.find(permission => permission.permission_category === "SETTINGS" && permission.permission_path === "3") ? [{
    //   id: "outstandingReport",
    //   label: "Ledger Report",
    //   link: "/ledger-report",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Payment");
    //     updateIconSidebar(e);
    //   },
    // }] : []),
    //     ...(permission.find(permission => permission.permission_category === "SETTINGS" && permission.permission_path === "4") ? [{
    //       id: "outstandingReport",
    //       label: "POS Register Report",
    //       link: "/pos-register-report",
    //       stateVariables: isDashboard,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsDashboard(!isDashboard);
    //         setIscurrentState("Payment");
    //         updateIconSidebar(e);
    //       },
    //     }] : []),
    //   ],
    // },
    {
      id: "USER-MANAGEMENT",
      label: "Users Management",
      icon: "mdi mdi-view-grid-plus-outline",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsUserManagement(!isUserManagement);
        setIscurrentState("userManagement");
        updateIconSidebar(e);
      },
      stateVariables: isUserManagement,
      subItems: [
        ...(permission.find(
          (permission) =>
            permission.permission_category === "USER-MANAGEMENT" &&
            permission.permission_path === "1"
        )
          ? [
              {
                id: "roles_list",
                label: "Roles",
                link: "/roles-list",
                parentId: "userManagement",
              },
            ]
          : []),
        ...(permission.find(
          (permission) =>
            permission.permission_category === "USER-MANAGEMENT" &&
            permission.permission_path === "2"
        )
          ? [
              {
                id: "users_list",
                label: "Users",
                link: "/users-list",
                parentId: "userManagement",
              },
            ]
          : []),
      ],
    },
  ];
  menuItemsList.filter((data, index) => index == 1);

  const filteredMenuItems = menuItemsList.filter((menuItem) => {
    // Check if any permission in the permission array matches the menuItem.id
    return permission.some(
      (dataItem) => menuItem.id === dataItem.permission_category
    );
  });

  return (
    <React.Fragment>
      {filteredMenuItems.filter((item) => item !== null)}
    </React.Fragment>
  );
};
export default Navdata;
