import { useState, useEffect } from 'react';
import axios from 'axios';

// This is the custom hook that manages fetching the accid
const useFetchAccid = () => {
  const [accid, setAccid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAccid(token);
    } else {
      setError(new Error("No token found in local storage"));
    }
  }, []);

  // This helper function fetches the accid using the token
  const fetchAccid = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/account', {
        headers: {
          Authorization: token,
        },
      });
      setAccid(response.data.data.accid);

      // DEBUG - delete later
      console.log("User profile:", response.data.data);

    } catch (error) {
      console.error("Error fetching user profile", error);
      setError(error);
    }
  };

  return { accid, error };
};

export default useFetchAccid;
