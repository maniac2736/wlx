import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../views/UserDashboard/api";

const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const loadProfile = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    const res = await fetchUserProfile();

    if (res.success) {
      setUser(res.data);
      setError("");
    } else {
      setUser(null);
      setError(res.message);
      setStatus(res.status);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProfile(true);
  }, []);

  return { user, loading, error, status, refreshProfile: loadProfile };
};

export default useUserProfile;
