import React from "react";

const BookingItem = props =>(
    <div>

        <li className="events__list-item">
            <div>
                <h1>{props.booking.event.title}</h1>
                <h2>${props.booking.event.price} - {new Date(props.booking.event.date).toLocaleDateString()}</h2>
            </div>
            <div>
                <button className="btn" onClick={()=>props.deleteBooking(props.booking.event._id)}>Delete Booking</button>
            </div>
        </li>
    </div>
    )


export default BookingItem;
