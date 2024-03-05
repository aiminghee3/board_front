
const TestPage = () => {

    const submit = () =>{
        const token = document.cookie;
        console.log(token)
    }

    return(
        <>
            <div>
                <button className = "w-32 h-32 bg-amber-300" onClick={submit}></button>
            </div>
        </>
    )
}

export default TestPage;

