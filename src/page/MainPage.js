import Man  from "../components/main/Man"
import Girl from "../components/main/Girl"
import Meeting from "../components/main/Meeting"
import Student from "../components/main/Student"
import Worker from "../components/main/Worker"
import ManData from ".././data/man.json"
import GirlData from ".././data/girl.json"
import MeetingData from ".././data/meeting.json"
import {Link} from 'react-router-dom';
import Main from "../components/main/Main"

const MainPage = () =>{

    return(
        <>
        <div className = "max-w-4xl mx-auto w-full h-full p-10 flex flex-col pt-6">
             <Main/>
        </div>
        </>
    )
}
export default MainPage;