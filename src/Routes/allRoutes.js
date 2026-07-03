import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
//pages

import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import POSList from "../pages/Pos/POSList";

import TaxView from "../pages/Tax/TaxViews";
import CategoryList from "../pages/Category/CategoryList";
import TaxAdd from "../pages/Tax/TaxAdd";

import CategoryAdd from "../pages/Category/CategoryAdd";

import ProductsList from "../pages/Products/ProductsList";
import UnitView from "../pages/Unit/UnitView";
import Customers from "../pages/Customers/Customers";
import AllComponent from "../pages/AllCompoenent/AllComponent";
import Suppliers from "../pages/Suppliers/Suppliers";
import PaymentModeList from "../pages/PaymentMode/PaymentModeList";
import BankList from "../pages/Bank/BankList";
import CustomerGroupList from "../pages/CustomerGroup/CustomerGroupList";
import SupplierGroupList from "../pages/SupplierGroup/SupplierGroupList";
import PrintBarcodeCreate from "../pages/print_barcodes/PrintBarcodeCreate";
import PrintBarcodeList from "../pages/print_barcodes/PrintBarcodeList";
import UsersList from "../pages/UserManagement/Users/UsersList";
import RolesList from "../pages/UserManagement/Roles/RolesList";
import POSBillDetailsList from "../pages/Pos/POSBIllDetails";
import PurchaseList from "../pages/purchase/PurchaseList";
import PurchaseCreate from "../pages/purchase/PurchaseCreate";
import PurchaseUpdate from "../pages/purchase/PurchaseUpdate";
import PaymentTermList from "../pages/PaymentTerm/PaymentTermList";
import Payment from "../pages/Payment/Payment";
import ExpensesList from "../pages/Expenses/ExpensesList";
import ReceiptList from "../pages/Receipt/ReceiptList";
import Year from "../pages/Year/Yearlist";
import Yearlist from "../pages/Year/Yearlist";
import IndustryTypeList from "../pages/IndustryType/IndustryTypeList";
import BusinessProfile from "../pages/BusinessSetting/BusinessProfile";
import Unauthorized from "../pages/AllCompoenent/Unauthorized";
import StockList from "../pages/Stock/StockList";
import Company from "../pages/CompanyAdd/Company";
import Users from "../pages/CompanyAdd/Users";
import ProdcutImport from "../pages/ProductImport/ProdcutImport";
import PrinterSettings from "../pages/Printer/PrinterSettings";
import BillWiseProfit from "../pages/Report/BillWiseProfit";
import ProductWiseProfit from "../pages/Report/ProductWiseProfit";
import OutStandingReport from "../pages/Report/OutstandingReport";
import Subscription from "../pages/AuthenticationInner/AuthenticationInner/Subscription";
import LedgerReport from "../pages/LedgerReport/LedgerReport";
import POSRegister from "../pages/Report/POSRegister";
import LoyaltyPoints from "../pages/RewardPoints/LoyaltyPoints";
import Sale_List from "../pages/Sale/Sale_List";
import Sale_Create from "../pages/Sale/Sale_Create";
import Sale_Edit from "../pages/Sale/Sale_Edit";
import OtherChargList from "../pages/OtherCharag/OtherChargList";
import OtherChargAdd from "../pages/OtherCharag/OtherChargAdd";
import OtherChargUpdate from "../pages/OtherCharag/OtherChargUpdate";
import EmployeeList from "../pages/EmployeeInfo/EmployeeList";
import BackUp from "../pages/CompanyAdd/BackUp";
import BarcodeSettings from "../pages/Barcode_settings/BarcodeSettings";
import LanguageSettings from "../pages/Billing_Settings/LanguageSettings";
import BillingSettings from "../pages/Barcode_settings/BillingSettings";
import Franchises from "../pages/Franchise/Franchises";
import FranchiseSaleList from "../pages/FranchiseSale/FranchiseSaleList";
import FranchiseSaleAdd from "../pages/FranchiseSale/FranchiseSaleAdd";
import FranchiseSaleEdit from "../pages/FranchiseSale/FranchiseSaleEdit";
import SalesMan from "../pages/Salesman/SalesMan";
import OurBankList from "../pages/OurBank/OurBankList";
import OurClientList from "../pages/OurClient/OurClientList";
import POSLIIst from "../pages/Pos/POSLIIst";
import UserList from "../pages/Users/UserList";
import { components } from "react-select";
import ContactList from "../pages/Contact/ContactList";
import SeoList from "../pages/Seo/SeoList";
import SampleProductList1 from "../pages/Sample Product/SampleProductList1";
import QuotationList from "../pages/purchase/QuotationList";
import QuotationCreate from "../pages/purchase/QuotationCreate";
import QuotationUpdate from "../pages/purchase/QuotationUpdate";
import EmailTemplateList from "../pages/Template/EmailTemplate/EmailTemplateList";
import Sale_List_new from "../pages/Sale/Sale_List_new";
import Sale_List_approval from "../pages/Sale/Sale_List_approval";
import Sale_List_packing from "../pages/Sale/Sale_List_packing";
import Sale_List_dispatch from "../pages/Sale/Sale_List_dispatch";
import Sale_List_rejected from "../pages/Sale/Sale_List_rejected";
import Sale_List_delivered from "../pages/Sale/Sale_List_delivered";
import TransportTypeList from "../pages/TransportType/TransportTypeList";
import OtherChrageList from "../pages/OtherCharge/OtherChrageList";
import WhatsappTemplateList from "../pages/Template/WhatsappTemplate/WhatsappTemplateList";
import CallLogsList from "../pages/Calllogs/CallLogsList";
import StagesView from "../pages/Stages/StagesView";
import SourceView from "../pages/Source/SourceView";
import ReferenceView from "../pages/Reference/ReferenceView";
import PriorityView from "../pages/Priority/PriorityView";
import LeadView from "../pages/Lead/LeadView";
import LeadAdd from "../pages/Lead/LeadAdd";
import LeadDetailView from "../pages/Lead/LeadDetailView";
import LeadUpdate from "../pages/Lead/LeadUpdate";
import FollowUpList from "../pages/Lead/FollowUpList";
import CustomerHistory from "../pages/Users/CustomerHistory";

const authProtectedRoutes = [
  // Unauthorized
  { path: "/unauthorized", component: <Unauthorized /> },

  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/call-logs", component: <CallLogsList /> },
  // { path: "/pos/list", component: <POSList /> },
  { path: "/pos-bill-details/:billId", component: <POSBillDetailsList /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/pos/list", component: <POSLIIst /> },
  { path: "/seo/list", component: <SeoList /> },
  { path: "/user/list", component: <UserList /> },
  { path: "/user/history", component: <CustomerHistory /> },
  { path: "/contact/list", component: <ContactList /> },

  //Whatsapp Template Routes
  { path: "/whatsapp-template", component: <WhatsappTemplateList /> },

  //Email Template Routes
  { path: "/email-template", component: <EmailTemplateList /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },

  // Tax Routes Starts
  { path: "/tax-list", component: <TaxView /> },
  { path: "/tax-add", component: <TaxAdd /> },
  
  // 
  { path: "/leads-list", component: <LeadView /> },
  { path: "/add-leads/", component: <LeadAdd /> },
  { path: "/add-leads/:stages_id", component: <LeadAdd /> },
  { path: "/update-leads/:lead_id", component: <LeadUpdate /> },
  { path: "/lead-details/:id", component: <LeadDetailView /> },
  { path: "/follow-up/:lead_id", component: <FollowUpList /> },
  
  
  { path: "/source-list", component: <SourceView /> },
  { path: "/reference-list", component: <ReferenceView /> },
  { path: "/priority-list", component: <PriorityView /> },
  { path: "/stages-list", component: <StagesView /> },
  
  //Category Routes
  { path: "/category-list", component: <CategoryList /> },

  { path: "/category-add", component: <CategoryAdd /> },

  // Product LIst
  { path: "/product-list", component: <ProductsList /> },
  { path: "/sample-product-list", component: <SampleProductList1 /> },

  // Unit Routes
  { path: "/unit-list", component: <UnitView /> },

  // Customer Routes
  { path: "/customer-list", component: <Customers /> },
  // Franchise Routes
  { path: "/franchise-list", component: <Franchises /> },
  // SalesMan Routes
  { path: "/salesman-list", component: <SalesMan /> },

  // Supplier Routes
  { path: "/supplier-list", component: <Suppliers /> },
  // PaymentMode Routes
  { path: "/expenses-list", component: <ExpensesList /> },
  { path: "/transport-types", component: <TransportTypeList /> },
  // PaymentMode Routes
  { path: "/paymentmode-list", component: <PaymentModeList /> },

  // payment term routes
  { path: "/payment-term-list", component: <PaymentTermList /> },
  // Bank Routes
  { path: "/sub-category", component: <BankList /> },
  { path: "/our-bank", component: <OurBankList /> },
  { path: "/client-list", component: <OurClientList /> },
  // customer Group Type Routes
  { path: "/customer-group-list", component: <CustomerGroupList /> },
  // Supplier Group Type Routes
  { path: "/supplier-group-list", component: <SupplierGroupList /> },
  // Component
  { path: "/component-list", component: <AllComponent /> },

  //  PRINTING BARCODES
  { path: "/barcode-print-create", component: <PrintBarcodeCreate /> },
  { path: "/barcode-print-list", component: <PrintBarcodeList /> },

  // ROLES AND PERMISSIONS ROUTES | USERS
  { path: "/users-list", component: <UsersList /> },

  // ROLES AND PERMISSIONS ROUTES | ROLES
  { path: "/roles-list", component: <RolesList /> },

  // ROLES AND PERMISSIONS ROUTES | ROLES
  { path: "/purchase-list", component: <PurchaseList /> },
  { path: "/purchase-create", component: <PurchaseCreate /> },
  { path: "/purchase-create/:lead_id", component: <PurchaseCreate /> },
  { path: "/purchase-edit/:id", component: <PurchaseUpdate /> },

  // ROLES AND PERMISSIONS ROUTES | ROLES
  { path: "/quotation-list", component: <QuotationList /> },
  { path: "/quotation-create", component: <QuotationCreate /> },
  { path: "/quotation-create/:lead_id", component: <QuotationCreate /> },
  { path: "/quotation-edit/:id", component: <QuotationUpdate status={2} /> },
  { path: "/generate-invoice/:id", component: <QuotationUpdate status={3} /> },

  // PAYMENT AND RECEIPT ROUTES
  { path: "/payment-list", component: <Payment /> },
  { path: "/receipt-list", component: <ReceiptList /> },

  // reward points
  { path: "/loyalty-points", component: <LoyaltyPoints /> },

  // reward points
  { path: "/employee-list", component: <EmployeeList /> },

  // Profile book and report
  { path: "/bill-wise-profit", component: <BillWiseProfit /> },
  { path: "/product-wise-profit", component: <ProductWiseProfit /> },
  { path: "/outstanding-report", component: <OutStandingReport /> },

  // PRINTER SETTINGS
  { path: "/printer-settings", component: <PrinterSettings /> },

  // BILLING SETTINGS
  { path: "/language-settings", component: <LanguageSettings /> },

  // BILLING SETTINGS

  // BARCODE SETTINGS
  { path: "/barcode-settings", component: <BarcodeSettings /> },
  { path: "/billing-settings", component: <BillingSettings /> },

  // Year Maintain ROUTES
  { path: "/yearmaintain", component: <Yearlist /> },

  //  Industry types Routes
  { path: "/industry-type-list", component: <IndustryTypeList /> },

  // Business setting
  { path: "/business-setting", component: <BusinessProfile /> },
  // prodcut improt
  { path: "/prodcut-improt", component: <ProdcutImport /> },
  // Ledger Report
  { path: "/ledger-report", component: <LedgerReport /> },
  { path: "/pos-register-report", component: <POSRegister /> },
  // Sale Route
  { path: "/invoice", component: <Sale_List /> },
  { path: "/all-orders", component: <Sale_List /> },
  { path: "/new-order", component: <Sale_List_new /> },
  { path: "/approval-order", component: <Sale_List_approval /> },
  { path: "/packing-order", component: <Sale_List_packing /> },
  { path: "/dispatch-order", component: <Sale_List_dispatch /> },
  { path: "/rejected-order", component: <Sale_List_rejected /> },
  { path: "/delivered-order", component: <Sale_List_delivered /> },

  { path: "/franchise-sale", component: <FranchiseSaleList /> },

  { path: "/franchise-sale-create", component: <FranchiseSaleAdd /> },

  { path: "/sale-create", component: <Sale_Create /> },
  { path: "/sale-create/:lead_id", component: <Sale_Create /> },

  { path: "/sale-edit/:id", component: <Sale_Edit /> },

  { path: "/franchise-sale-edit/:id", component: <FranchiseSaleEdit /> },
  // Sale Route
  { path: "/other-charg-list", component: <OtherChrageList /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/company", component: <Company /> },
  // { path: "/", component: <Users /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
  { path: "/subscription", component: <Subscription /> },
  // BACK UP
  { path: "/back-up", component: <BackUp /> },
];

export { authProtectedRoutes, publicRoutes };
