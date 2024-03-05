import Man  from "../components/main/Man"
import Girl from "../components/main/Girl"
import Meeting from "../components/main/Meeting"
import Student from "../components/main/Student"
import Worker from "../components/main/Worker"
import ManData from ".././data/man.json"
import GirlData from ".././data/girl.json"
import MeetingData from ".././data/meeting.json"
import {Link} from 'react-router-dom';

const MainPage = () =>{
    return(
        <>
        <div className = "max-w-md mx-auto w-full h-full pl-1 flex flex-col pt-6">
            <Man data = {ManData}/>
            <Girl data = {GirlData}/>
            <Student data = {ManData}/>
            <Worker data = {GirlData}/>
            <Meeting data = {MeetingData}/>
            <Link to = {"/write"} className="w-14 h-14 rounded-xl flex fixed right-5 bottom-5 mb-7 z-10 bg-white align-middle">
                <img src = "https://img.icons8.com/?size=80&id=CoTsnH1VAqb5&format=png" className = "w-full h-full"/>
            </Link>
        </div>
        </>
    )
}
export default MainPage;