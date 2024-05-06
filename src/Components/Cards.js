import React from "react";
import "./Cards.css"
function truncate(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) ; // Truncate the text 
  }
  return text; // Return the original text if it's shorter than maxLength
}

const Cards = ({jobs}) =>{

    if(!jobs.length){
       return <div className="noresults">No Results found for selected options !! </div>
    }
    

    return (
        <div className="card-container">
           {jobs.map((job) => (
            <div key={job.jdUid} className="job-card">
                <div className="time-ago">
                    <span>⌛</span> Posted 10 days ago
                </div>
                <div className="job-header">
                {job.logoUrl && <img src={job.logoUrl} alt={`${job.companyName} logo`} className="company-logo" />}
                  <div className='job-content'>
          
                      <div className='company-name'>{job.companyName && <p>{job.companyName}</p>}</div>
                      <div className='job-role'>{job.jobRole && <p>{job.jobRole}</p>}</div>
                      <div className='job-location'>{job.location && <p>{job.location}</p>}</div>
                  
                  </div>
                </div>
                
             
                <div className="job-salary">
                  <p>Estimated Salary: ${job.minJdSalary || "N/A"}  - ${job.maxJdSalary || 'N/A'} ✅</p>
                </div>
              
              
            <div className='About-dec'>
                <div className='About-company'>About Company:</div>
                <div className='About-us'>About us</div>
              {job.jobDetailsFromCompany && (
              <div className="job-description" dangerouslySetInnerHTML={{ __html: truncate(job.jobDetailsFromCompany, 400) }}></div>
            )}
            </div>
           

            <div className='exp'>
                <p  className='job-salary'>Minimum Experience</p>
                <div className='job-years'> {job.minExp || "N/A"} years</div>
            </div>

            <div>
            {job.jdLink && (
                <a href={job.jdLink} target="_blank" rel="noopener noreferrer" className="apply-button">⚡Easy Apply</a>
              )}
            <div> {job.jdLink && (
                <a href={job.jdLink} target="_blank" rel="noopener noreferrer" className="referral-button">
                <img style={{ borderRadius: '50%', filter: 'blur(3px)' }}  src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-06.jpg" width="30" height="30" alt="Philip Harbach"/>
                    <img style={{ borderRadius: '50%', filter: 'blur(3px)' }} src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="30" height="30" alt="Profile of Alex Shatov - Click to unlock referral asks" />
                  Unlock referral asks
                </a>
                )}
              </div>

            </div>
          </div>
        ))}
      
        </div>
    )
    
}

export default Cards