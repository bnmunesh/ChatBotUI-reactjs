import React, { useEffect, useState } from 'react';
import './CustomerSupportForm.css'; // Import the stylesheet
import { useLocation, useNavigate } from 'react-router-dom';

const CustomerSupportForm = ({socket}) => {
  const {state} = useLocation();
  const [formData, setFormData] = useState({
    conversationId: state?.conversationID ? state?.conversationID : "",
    executiveName: '',
    executiveId: '',
    customerName: '',
    customerEmail: '',
    querySummary: '',
    queryAnswered: 'yes',
    solutionSummary: '',
    noQueryReason: '',
  });
  
  const navigate = useNavigate();

// To handle form response
  useEffect(()=>{
    const loginStatus = localStorage.getItem("executiveID");
    if(loginStatus == null){
      navigate("/login")
    }
    socket.on('form-response', (data)=>{
      if(data.success){
        alert('Form submitted successfully!');
        window.close()
      }else alert('Form Submission Failed!')
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Perform form validation and data submission to the database
    // You can use a state management library like Redux or send data via API
    socket.emit("form-submission", {convoID: formData.conversationId, executiveName: formData.executiveName, executiveID: formData.executiveId, customerName: formData.customerName, customerEmail: formData.customerEmail, customerQuery: formData.querySummary, resolved: formData.queryAnswered === "yes" ? true : false, solution:formData.solutionSummary, reason: formData.noQueryReason})
  };

  const handleClear = () => {
    setFormData({
      conversationId: '',
      executiveName: '',
      executiveId: '',
      customerName: '',
      customerEmail: '',
      querySummary: '',
      queryAnswered: 'yes',
      solutionSummary: '',
      noQueryReason: '',
    });
  };

  return (
    <div className='page-Form'>
      <h2 className="form-title">Customer Interaction Report Form</h2>
    <div className="form-container">
      <form className="customer-support-form">
      <div className="form-group">
          <label htmlFor="conversationId">Conversation ID:<span class="required">*</span></label>
          <input type="text" id="conversationId" name="conversationId" value={formData.conversationId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="executiveName">Executive Name:<span class="required">*</span></label>
          <input type="text" id="executiveName" name="executiveName" value={formData.executiveName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="executiveId">Executive ID:<span class="required">*</span></label>
          <input type="text" id="executiveId" name="executiveId" value={formData.executiveId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Customer Name:<span class="required">*</span></label>
          <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Customer Email:<span class="required">*</span></label>
          <input type="email" id="customerEmail" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="querySummary">Customer Query Summary:<span class="required">*</span></label>
          <textarea id="querySummary" name="querySummary" value={formData.querySummary} onChange={handleChange} rows="4" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="queryAnswered">Was the query answered with a solution?<span class="required">*</span></label>
          <select id="queryAnswered" name="queryAnswered" value={formData.queryAnswered} onChange={handleChange} required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.queryAnswered === 'yes' ? (
          <div className="form-group">
            <label htmlFor="solutionSummary">Summary of the Solution Provided:<span class="required">*</span></label>
            <textarea id="solutionSummary" name="solutionSummary" value={formData.solutionSummary} onChange={handleChange} rows="4"></textarea>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="noQueryReason">Reason for Not Providing a Solution:<span class="required">*</span></label>
            <textarea id="noQueryReason" name="noQueryReason" value={formData.noQueryReason} onChange={handleChange} rows="4"></textarea>
          </div>
        )}

        <div className="form-buttons">
          <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
          <button type="button" onClick={handleClear} className="clear-button">Clear</button>
        </div>
      </form>
    </div>
    <div className='infoend'></div>
    </div>
  );
};

export default CustomerSupportForm;
