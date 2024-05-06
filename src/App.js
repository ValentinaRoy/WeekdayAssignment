import React, { useState, useEffect } from 'react';
import './App.css';
import  Cards  from './Components/Cards';
import Multiselect from 'multiselect-react-dropdown';
import './Components/searchBar.css';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [companyFilter,setCompanyFilter] =useState('');
  // const [total,setTotal] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myHeaders = new Headers({
          "Content-Type": "application/json"
        });

        const body = JSON.stringify({
          "limit": 10,
          "offset": 0
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: body
        };

        const response = await fetch('https://api.weekday.technology/adhoc/getSampleJdJSON', requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // setTotal( data.totalCount);
        if (!data.jdList || !Array.isArray(data.jdList)) {
          throw new Error('Data format error: expected an array of jobs');
        }
        setJobs(data.jdList);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMoreData = async () => {
    try {

      const myHeaders = new Headers({
        "Content-Type": "application/json"
      });
      const body = JSON.stringify({
        "limit": 10,
        "offset": jobs.length
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body
      };
      const response = await fetch(`https://api.weekday.technology/adhoc/getSampleJdJSON`,requestOptions);
      const data = await response.json();
      if (!data.jdList || !Array.isArray(data.jdList)) {
        throw new Error('Data format error: expected an array of jobs');
      }
      setJobs(prevJobs => [...prevJobs, ...data.jdList]);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    }
  };
  const filteredJobs = jobs.filter(job => {
    if (selectedRole && job.jobRole !== selectedRole.label) return false;
    if (selectedExperience && (job.minExp === null || job.maxExp === null || 
        (job.minExp > selectedExperience.label || job.maxExp < selectedExperience.label))) return false;
    if (selectedSalary && (job.minJdSalary === null || job.maxJdSalary === null || 
        (job.minJdSalary > selectedSalary.label || job.maxJdSalary < selectedSalary.label))) return false;
    if (selectedLocation && job.location !== selectedLocation.label) return false;
    if (companyFilter && job.companyName && !job.companyName.toLowerCase().includes(companyFilter.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const roleOptions = Array.from(new Set(jobs.map(job => job.jobRole).filter(Boolean)))
    .sort()
    .map(role => ({ label: role, value: role }));

  const experienceOptions = Array.from(new Set(jobs.flatMap(job => [job.minExp, job.maxExp])
    .filter(exp => exp !== null && exp !== undefined)
    .map(exp => exp.toString())))
    .sort((a, b) => a - b)
    .map(exp => ({ label: exp, value: exp }));

  const salaryOptions = Array.from(new Set(jobs.flatMap(job => {
    if (job.minJdSalary !== null && job.minJdSalary !== undefined && job.maxJdSalary !== null && job.maxJdSalary !== undefined) {
      return [
        { salary: job.minJdSalary, currency: job.salaryCurrencyCode },
        { salary: job.maxJdSalary, currency: job.salaryCurrencyCode }
      ];
    }
    return [];
  }).map(s => JSON.stringify(s))))
    .map(str => JSON.parse(str))
    .sort((a, b) => a.salary - b.salary)
    .map(s => ({ label: `${s.salary} ${s.currency}`, value: s.salary.toString() }));
    

  const locationOptions = Array.from(new Set(jobs.map(job => job.location).filter(Boolean)))
    .sort()
    .map(location => ({label:location,value:location}));

  return (
    
    <div className='app'>
      <div className="filter-bar">
        <div className="filter-item">
          <Multiselect
            options={roleOptions}
            displayValue="label"
            placeholder="Roles"
            onSelect={(selectedList) => setSelectedRole(selectedList[0])}
            onRemove={() => setSelectedRole(null)}
          />
          
        </div>
        <div className="filter-item">
          <Multiselect
            options={experienceOptions}
            displayValue="label"
            placeholder="Experience"
            onSelect={(selectedList) => setSelectedExperience(selectedList[0])}
            onRemove={() => setSelectedExperience(null)}
          />
        </div>
        <div className="filter-item">
          <Multiselect
            options={salaryOptions}
            displayValue="label"
            placeholder=" Min Salary"
            onSelect={(selectedList) => setSelectedSalary(selectedList[0])}
            onRemove={() => setSelectedSalary(null)}
          />
        </div>
        
        <div className='filter-item'>
          <Multiselect 
            options={locationOptions}
            displayValue="label"
            placeholder=" Location"
            onSelect={(selectedList) =>{ console.log("Selected locations:", selectedList); 
            setSelectedLocation(selectedList.length > 0 ? selectedList[0] : null)}}
            onRemove={() => setSelectedLocation(null)}
          />
        </div>
        
        <div className='filter-item'>
          
          <input 
            type='text'
            label='Company'
            placeholder='Company Name'
            style={{ 
              
              border: '0.5px solid #ccc',
              borderRadius: '4px',
              height:'32px',
              padding: '8px 0 8px 20px',
              minWidth: '170px',
              
            }}
            value={companyFilter}
            onChange={(e) => {
              
              setCompanyFilter(e.target.value);}}
          /> 
         </div>
        
      </div>
      
      <InfiniteScroll
        dataLength={filteredJobs.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more jobs to load</b>
          </p>
        }
      >
        <div className='cards'>
          <Cards jobs={filteredJobs} />
        </div>
      </InfiniteScroll>
    </div>
    
  );
}

export default App;
