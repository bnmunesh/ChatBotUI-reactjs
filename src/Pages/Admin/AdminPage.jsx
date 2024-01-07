import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [faqs, setFaqs] = useState([])
  const navigate = useNavigate()
  
  useEffect(()=>{
    const loginStatus = localStorage.getItem("adminID");
    if(loginStatus == null){
      navigate("/login")
    }

    axios.get("http://localhost:3000/admin/faq/all-waiting").then(res=>{
      if(res.data.success){
        setFaqs(res.data.data)
      }
    })
  },[])

  // Placeholder data for the Admin profile
  const adminData = {
    name: "John Doe",
    id: "123456",
    email: "john.doe@example.com",
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
    localStorage.removeItem('adminID')
    navigate("/login")
  };

  // Placeholder data for User Queries
  const initialUserQueries = [
    {
      id: 1,
      userQuery: "How do I reset my password?",
      assistantResponse: "You can reset your password by...",
    },
    {
      id: 2,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi error voluptatum odit est doloribus consequuntur, non dolorum quidem. Consectetur at maxime dolorem fugit, neque aspernatur perspiciatis veniam porro ducimus culpa animi totam quos! Maiores eligendi consequatur ratione eos voluptatem exercitationem similique debitis officia, et earum, adipisci aliquam doloribus quas architecto reprehenderit necessitatibus esse fugiat nemo quae? Mollitia illo repudiandae pariatur sit perspiciatis maxime hic ipsa, rem quisquam facilis. Laborum architecto optio pariatur aliquid ipsum explicabo, consequatur labore reiciendis illo est facilis repellendus. Magnam alias sint facere. Consequatur, laboriosam ipsam. Esse unde hic mollitia aliquam. Officia deserunt delectus explicabo dolores ducimus?",
    },
    {
      id: 3,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus consequatur aut officiis. Assumenda, explicabo ut. Facilis, tempore labore. Ab maxime eius dicta perferendis!",
    },
    {
      id: 4,
      userQuery: "How do I reset my password?",
      assistantResponse: "You can reset your password by...",
    },
    {
      id: 5,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi error voluptatum odit est doloribus consequuntur, non dolorum quidem. Consectetur at maxime dolorem fugit, neque aspernatur perspiciatis veniam porro ducimus culpa animi totam quos! Maiores eligendi consequatur ratione eos voluptatem exercitationem similique debitis officia, et earum, adipisci aliquam doloribus quas architecto reprehenderit necessitatibus esse fugiat nemo quae? Mollitia illo repudiandae pariatur sit perspiciatis maxime hic ipsa, rem quisquam facilis. Laborum architecto optio pariatur aliquid ipsum explicabo, consequatur labore reiciendis illo est facilis repellendus. Magnam alias sint facere. Consequatur, laboriosam ipsam. Esse unde hic mollitia aliquam. Officia deserunt delectus explicabo dolores ducimus?",
    },
    {
      id: 6,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus consequatur aut officiis. Assumenda, explicabo ut. Facilis, tempore labore. Ab maxime eius dicta perferendis!",
    },
    {
      id: 7,
      userQuery: "How do I reset my password?",
      assistantResponse: "You can reset your password by...",
    },
    {
      id: 8,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi error voluptatum odit est doloribus consequuntur, non dolorum quidem. Consectetur at maxime dolorem fugit, neque aspernatur perspiciatis veniam porro ducimus culpa animi totam quos! Maiores eligendi consequatur ratione eos voluptatem exercitationem similique debitis officia, et earum, adipisci aliquam doloribus quas architecto reprehenderit necessitatibus esse fugiat nemo quae? Mollitia illo repudiandae pariatur sit perspiciatis maxime hic ipsa, rem quisquam facilis. Laborum architecto optio pariatur aliquid ipsum explicabo, consequatur labore reiciendis illo est facilis repellendus. Magnam alias sint facere. Consequatur, laboriosam ipsam. Esse unde hic mollitia aliquam. Officia deserunt delectus explicabo dolores ducimus?",
    },
    {
      id: 9,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus consequatur aut officiis. Assumenda, explicabo ut. Facilis, tempore labore. Ab maxime eius dicta perferendis!",
    },
    {
      id: 10,
      userQuery: "How do I reset my password?",
      assistantResponse: "You can reset your password by...",
    },
    {
      id: 11,
      userQuery: "What are the supported payment methods?",
      assistantResponse: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi error voluptatum odit est doloribus consequuntur, non dolorum quidem. Consectetur at maxime dolorem fugit, neque aspernatur perspiciatis veniam porro ducimus culpa animi totam quos! Maiores eligendi consequatur ratione eos voluptatem exercitationem similique debitis officia, et earum, adipisci aliquam doloribus quas architecto reprehenderit necessitatibus esse fugiat nemo quae? Mollitia illo repudiandae pariatur sit perspiciatis maxime hic ipsa, rem quisquam facilis. Laborum architecto optio pariatur aliquid ipsum explicabo, consequatur labore reiciendis illo est facilis repellendus. Magnam alias sint facere. Consequatur, laboriosam ipsam. Esse unde hic mollitia aliquam. Officia deserunt delectus explicabo dolores ducimus?",
    },

    // Add more entries as needed
  ];

  // State to manage User Queries, selected option (Accept or Reject), and selected User Queries
  const [userQueries, setUserQueries] = useState(initialUserQueries);

  const acceptHandler = (faq) => {
    if(faq){
      axios.post("http://localhost:3000/admin/faq/accepted", {
          faq   
      }).then(res=>{
        if(res.data.success){
          const updatedFaqs = faqs.filter(el => el._id !== faq._id);
          setFaqs([...updatedFaqs])
        }
      }).catch(e=>{
        alert("failed to accept faq, try again");
        console.log("failed to accept faq, try again:", e)
      })
    }
  };

  const rejectHandler = (faq) => {
    if(faq){
      axios.post("http://localhost:3000/admin/faq/rejected", {
          faq   
      }).then(res=>{
        if(res.data.success){
          const updatedFaqs = faqs.filter(el => el._id !== faq._id);
          setFaqs([...updatedFaqs])
        }
      }).catch(e=>{
        alert("failed to reject faq, try again");
        console.log("failed to reject faq, try again:", e)
      })
    }
  };
  const [open, setOpen] = useState(false);

  const editHandler = () => {
    setOpen(!open);
    console.log(open);
  };

  return (
    <div className="pageadmin">
      
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="navbar-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="two-column-layout">
        {/* Left column */}
        <div className="left-column">
          <div className="admin-profile-box">
            <div className="user-avatar">🧑‍💼</div>
            <div className="profile-details">
              <h2>{adminData.name}</h2>
              <p>
                <strong>Admin ID:</strong> {adminData.id}
              </p>
              <p>
                <strong>Admin Email:</strong> {adminData.email}
              </p>
              <button>Change Password</button>
            </div>
          </div>
        </div>

        {/* Right column */}

        <div className="right-column">
          <h2>User Queries</h2>
          <div className="user-queries-box">
            {faqs.length > 0 && faqs.map((query, index) => (
              <div key={query.id} className="faq-box">
                <div className="container">
                  <h3>Query:</h3>
                  <p>{query.FAQ}</p>
                  <h3>Assistant Response:</h3>
                  <p on>{query.Response}</p>
                </div>

                <div className="action-buttons">
                  <button className="editbtnn">Edit</button>
                  {/* { open &&
                    <CustomerSupportForm query={query}/>
                  } */}
                  <button className="acceptbtn" onClick={() => acceptHandler(query)}>
                    Accept
                  </button>
                  <button className="rejectbtn" onClick={() => rejectHandler(query)}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

