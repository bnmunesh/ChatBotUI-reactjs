import React, { useEffect, useState } from 'react';
import './CustomerSupportForm.css'; // Import the stylesheet
import { useLocation } from 'react-router-dom';

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

// To handle form response
  useEffect(()=>{
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
    <div className="form-container">
      <h2 className="form-title">Customer Support Report Form</h2>
      <form className="customer-support-form">
      <div className="form-group">
          <label htmlFor="conversationId">Conversation ID:</label>
          <input type="text" id="conversationId" name="conversationId" value={formData.conversationId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="executiveName">Executive Name:</label>
          <input type="text" id="executiveName" name="executiveName" value={formData.executiveName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="executiveId">Executive ID:</label>
          <input type="text" id="executiveId" name="executiveId" value={formData.executiveId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Customer Name:</label>
          <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Customer Email:</label>
          <input type="email" id="customerEmail" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="querySummary">Customer Query Summary:</label>
          <textarea id="querySummary" name="querySummary" value={formData.querySummary} onChange={handleChange} rows="4" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="queryAnswered">Was the query answered with a solution?</label>
          <select id="queryAnswered" name="queryAnswered" value={formData.queryAnswered} onChange={handleChange} required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.queryAnswered === 'yes' ? (
          <div className="form-group">
            <label htmlFor="solutionSummary">Summary of the Solution Provided:</label>
            <textarea id="solutionSummary" name="solutionSummary" value={formData.solutionSummary} onChange={handleChange} rows="4"></textarea>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="noQueryReason">Reason for Not Providing a Solution:</label>
            <textarea id="noQueryReason" name="noQueryReason" value={formData.noQueryReason} onChange={handleChange} rows="4"></textarea>
          </div>
        )}

        <div className="form-buttons">
          <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
          <button type="button" onClick={handleClear} className="clear-button">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSupportForm;
