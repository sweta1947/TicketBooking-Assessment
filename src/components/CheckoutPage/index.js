import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import CardDetailsSection from "../CardDetailsSection";
import { clearUserStatus, editCardDetails } from "../../data/userSlice";
import Snackbar from '@mui/material/Snackbar';
import { addFinalBookingDetails, clearBillStatus } from "../../data/billSlice";
import "./style.scss";

const CheckoutPage = () =>{

    const showDetails = useSelector(store=>store.bill.reservedShowDetails);
    const {user, cardNumber, expiryDate, securityCode, id} = useSelector(store=>store.user.cardDetails[0]);
    const {serviceFees, deliveryFees, orderProcessingFees} = useSelector(store=>store.bill.otherCharges);
    const cardDetailsUpdateStatus = useSelector(store=>store.user.status);
    const orderPlacementStatus = useSelector(store=>store.bill.status);
    const [quantity, setQuantity] = useState(showDetails.quantity);
    const allowedBuyQuantity = [1,2,3,4,5,7,8,9,10];
    const [finalTotal, setFinalTotal] = useState(0);
    const [isTermsAgreed, setTermsAgreed] = useState(false);
    const [isCardDetailsEditable, setIsCardDetailsEditable] = useState(false);
    const [message, setMessage ]= useState("");
    const dispatch = useDispatch();

    const [cardDetails, setCardDetails] = useState({
        cardNumber: cardNumber,
        user: user,
        expiryDate: expiryDate,
        securityCode: securityCode,
        id: id
    });

    useEffect(()=>{
       if(orderPlacementStatus==="success"){
            setMessage("Order has been placed successfully");
       }
    },[orderPlacementStatus]);

    useEffect(()=>{
        if(cardDetailsUpdateStatus==="success"){
            setMessage("Card details have been successfully updated");
        }
     },[cardDetailsUpdateStatus])

    useEffect(()=>{
        setFinalTotal((showDetails.perTicketPrice * quantity) + ((serviceFees * quantity)*2) + (deliveryFees)); 
    },[quantity, deliveryFees, serviceFees, showDetails.perTicketPrice])

    const handleChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleChangeOfTermsConsent = () =>{
        setTermsAgreed(!isTermsAgreed);
    }

    const handlePlaceOrderBtn = () =>{
        dispatch(addFinalBookingDetails({
            showName: showDetails.name,
            quantity: quantity,
            date: showDetails.date,
            totalValue: finalTotal
        }));
    }

    const handleEditCardDetails = () =>{
        setIsCardDetailsEditable(!isCardDetailsEditable);
        if(isCardDetailsEditable){
            dispatch(editCardDetails(cardDetails));
        }
    }

    const updateCardDetailsStateValue = (e) =>{
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    }

    const handleSnackbarClose = () =>{
        setMessage("");
        dispatch(clearUserStatus());
        dispatch(clearBillStatus());
    }

    return (
        <>
            <div className="checkout_container">
                {/* Booking Details Section */}
                <div className="sub_section_container">
                    <label className="header">
                        Booking Details
                    </label>
                    <div className="booked_show_details">
                        <div className="checkout_show_details">
                            <label className="sub_header">{showDetails.name}</label>
                            <label className="show_price">Price per ticket: ${showDetails.perTicketPrice || "-"}</label>
                            <label className="internal_details">Will be held on: {showDetails.date || "-"}</label>
                        </div>
                        <div className="qty_cta_container">
                            <label className="internal_details">Quantity</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={quantity}
                                label="Quantity"
                                onChange={handleChange}
                            >
                                {allowedBuyQuantity.map(item=>{
                                    return <MenuItem key={item} value={item}>{item}</MenuItem>
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="checkout_summary">
                    <div className="miscelleneous_details">
                        {/* Delivery Details Section */}
                        <div className="sub_section_container">
                            <label className="header">
                                Delivery
                            </label>
                            <label className="sub_header">Mobile Entry - Free</label>
                            <div className="sub_summary">
                                <label className="internal_details">
                                    Ticket available by Sunday April 23, 2022
                                </label>
                            </div>
                            <label className="delivery_info internal_details">These mobile tickets will be transfered directly to you from a trusted seller. 
                            We'll email you instructions on how to accept them on the original ticket provider's mobile app</label>
                        </div>
                        {/* Card Details Section */}
                        <div className="sub_section_container">
                            <label className="header">
                                Payment
                            </label>
                            <label className="sub_header">Use Credit / Debit Card</label>
                            <CardDetailsSection 
                                    cardDetails={cardDetails}
                                    updateCardDetailsStateValue={updateCardDetailsStateValue}
                                    isCardDetailsEditable={isCardDetailsEditable}
                            />
                            <button className="edit_class_details" onClick={handleEditCardDetails}>
                                { isCardDetailsEditable ? "Save" : "Edit" }
                            </button>
                            <label className="sub_header">Or Pay With</label>
                            <div className="terms_container">
                            <label className="terms_label"> By using a digital wallet and continuing past this page, you have read and accepting the <button className="terms_of_use">Terms Of Use</button></label>
                            </div>
                        </div>
                    </div>
                    {/* Total Details Section */}
                    <div className="total_bill_container sub_section_container">
                        <div className="final_total">
                            <label className="header">Total</label>
                            <label className="header">${finalTotal}</label>
                        </div>
                        <label className="sub_header">Tickets</label>
                        <div className="sub_summary">
                            <label className="internal_details">
                                Resale Tickets: ${showDetails.perTicketPrice} X {quantity}
                            </label>
                            <label className="internal_details">{showDetails.perTicketPrice*quantity}$</label>
                        </div>
                        <label className="sub_header">Notes From Seller</label>
                        <label className="internal_details">
                            xfr XFER proof of atleast one dose of COVID-19 vacccination for ages 5 to 11 and guest ages 12 and up will be required to show proof
                            of two COVID-19 vaccine dose or one dose of the Jhonson & Jhonson vaccine. Masks must be worn.
                        </label>
                        <label className="sub_header">Fees</label>
                        <div className="sub_summary">
                            <label className="internal_details">
                                Service Fees: ${serviceFees} X {quantity}
                            </label>
                            <label className="internal_details">{serviceFees*2}$</label>
                            </div>
                            <div className="sub_summary">
                            <label className="internal_details">
                                Order Processing Fees: ${orderProcessingFees}
                            </label>
                            <label className="internal_details">{serviceFees*2}$</label>
                        </div>
                        <label className="sub_header"> Delivery</label>
                        <div className="sub_summary">
                            <label className="internal_details">Mobile Entry</label>
                            <label className="internal_details">{deliveryFees ? `$${deliveryFees}` : "Free"}</label>
                        </div>
                        <label className="sub_header"> *All Sales Final - No Refunds</label>
                        <div className="terms_container">
                            <Checkbox
                                checked={isTermsAgreed}
                                onChange={handleChangeOfTermsConsent}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <label className="terms_label"> I have read and agree to the <button className="terms_of_use">Terms Of Use</button></label>
                        </div>
                        <button onClick={handlePlaceOrderBtn} className="place_order_btn" disabled={!isTermsAgreed}>Place Order</button>
                        <label className="disclaimer">*Exemptions may apply, see our terms of Use</label>
                    </div>
                </div>
            </div>
            <Snackbar
                open={message.length>0}
                autoHideDuration={1700}
                onClose={handleSnackbarClose}
                message={message}
            />
        </>
    )
}

export default CheckoutPage;