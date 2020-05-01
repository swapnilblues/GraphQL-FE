import React, {Component} from 'react';
import './Events.css'
import Modal from "../Modal/Modal";
import AuthContext from "../../Context/auth-context";
import BackDropComponent from "../BackDrop/BackDropComponent";
import EventItem from "./EventItem";
class EventComponent extends Component {

    state={
        createEvent:false,
        event_data:[],
        isLoading:false
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.dateEl = React.createRef();
        this.priceEl = React.createRef();
    }

    showEventModel = () =>{
        this.setState({
            createEvent:true
        })
    };

    getAllEvents = () =>{
        let requestBody ={
            query: `query{
            events {
            _id,
            title,
            description,
            date,
            price,
            creator{
            _id,
            email
            }
            }
            }`
        }

        fetch('http://localhost:3000/graphql',{
            method:'POST',
            body:JSON.stringify(requestBody),
            headers:{
                "Content-Type":'application/json'
            }
        }).then(res=>res.json())
            .then(data=>{
                // console.log(data.data.events)
                this.setState({
                event_data:data.data.events
            })})
            .catch(err=>console.log(err))
    }


    componentDidMount() {
        this.getAllEvents();
    }

    confirmEvent = () =>{
        let title = this.titleEl.current.value;
        let description = this.descriptionEl.current.value;
        let price = +this.priceEl.current.value;
        let date = this.dateEl.current.value;
        const token = this.context.token;
        let date_iso = new Date(date).toISOString();
        let today = new Date().toISOString();
        console.log(token)
        if(title.trim().length===0 ||price<0||date.trim().length===0||description.trim().length===0||date_iso<today){
            alert("Please check the Event details")
        }
        else{
            this.setState({
                createEvent:false
            });


            let requestBody = {
                query:`
                    mutation{
                        createEvent(eventInput:{title:"${title}",description:"${description}",price:${price},date:"${date}"}){
                        _id
                        title
                        description
                        price
                        date
                        creator{
                        _id
                        email
                        }
                            }
                        }      `
            };

            fetch('http://localhost:3000/graphql',{
                method:'POST',
                body:JSON.stringify(requestBody),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token
                }
            }).then(res=>{
                if(res.status!==201 && res.status!==200)
                    throw new Error('Failed!');
                return res.json();
            }).then(resData=>{
                    this.getAllEvents();
            }).catch(err=>console.log(err));

        }

    }

    closeModel = () =>{
        this.setState({
            createEvent:false
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.createEvent && <BackDropComponent/>}
                {this.state.createEvent && <Modal confirmEvent={this.confirmEvent} closeModal={this.closeModel} title="Add Event" canCancel canConfirm>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleEl}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="float" id="price" ref={this.priceEl}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateEl}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="desc">Description</label>
                            <textarea rows="4" id="desc" ref={this.descriptionEl}/>
                        </div>
                    </form>
                </Modal>}
                {this.context.token && <div className="events-control">
                    <h2 style={{fontFamily:"inherit"}}>Create an Event !</h2>
                    <button className="btn" onClick={this.showEventModel}> Create Event</button>
                </div>}
                    <ul className="events__list">
                        {this.state.event_data.length>0 && this.state.event_data.map(event=>
                            <EventItem key={event.id} event={event} authUserId={this.context.userId}/>
                        )}

                    </ul>
            </React.Fragment>
        );
    }
}

export default EventComponent;
