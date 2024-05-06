import React from "react";

const ViewJobModal =({details,closeModal})=>{
    console.log("yes");
    return(
      
    <>
        <div className="overlay" onClick={closeModal} ></div>
        <div className="modal">
            <div className="modal-header">
                <h2>Job Description</h2> 
            </div>
            <div className="modal-content">
                <h3 >About Us:</h3>
                <p dangerouslySetInnerHTML={{__html:details}}></p>
            </div>
           
        </div>

    </>
      
    )
}

export default ViewJobModal;